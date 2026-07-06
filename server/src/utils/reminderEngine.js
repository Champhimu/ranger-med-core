import Dose from "../models/Dose.js";
import Capsule from "../models/Capsule.js";
import User from "../models/User.js";
import {
  sendDoseReminderEmail,
  sendMissedDoseEmail,
  sendSnoozedReminderEmail,
} from "../services/emailService.js";

// Conditionally import FCM -- it may fail if firebase config is missing
let FCM = null;
try {
  const fcmModule = await import("../config/fcm.js");
  FCM = fcmModule.FCM;
} catch (err) {
  console.warn("[ReminderEngine] FCM not configured, push notifications disabled:", err.message);
}

/**
 * Send FCM push notification (if available)
 */
const sendPushNotification = async (token, title, body) => {
  if (!FCM || !token) return;
  try {
    await FCM.send({
      token,
      notification: { title, body },
      android: { priority: "high" },
    });
    console.log(`[ReminderEngine] FCM sent: ${title}`);
  } catch (err) {
    console.warn("[ReminderEngine] FCM error:", err.message);
  }
};

/**
 * Get dosage string from capsule
 */
const getDosageString = (capsule) => {
  if (capsule.doseAmount && capsule.doseUnit) {
    return `${capsule.doseAmount} ${capsule.doseUnit}`;
  }
  return capsule.dosage || "As prescribed";
};

/**
 * Main reminder engine - runs every minute via cron
 *
 * Actions:
 * 1. Upcoming dose alerts (within 5 min before) -- sends FCM + email
 * 2. Missed dose alerts (5+ min after) -- marks as missed, sends FCM + email
 * 3. Snoozed dose reminders (snooze time reached) -- sends FCM + email
 */
export const processDoseReminders = async () => {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    // Fetch today's scheduled/snoozed doses
    const doses = await Dose.find({
      date: currentDate,
      status: { $in: ["scheduled", "snoozed"] },
    });

    if (doses.length === 0) return;

    for (const dose of doses) {
      try {
        // Fetch user
        const user = await User.findById(dose.userId);
        if (!user) continue;

        // Fetch capsule for medication details
        const capsule = await Capsule.findById(dose.capsuleId);
        const medName = capsule?.name || "Your medication";
        const dosage = capsule ? getDosageString(capsule) : "As prescribed";

        const doseTime = new Date(`${currentDate}T${dose.time}:00`);
        const diffMinutes = (now - doseTime) / 1000 / 60;

        // ---- UPCOMING REMINDER (within 5 min before dose time) ----
        if (diffMinutes >= -5 && diffMinutes <= 0 && dose.status === "scheduled") {
          // Check deduplication: only send once
          if (!dose.reminderSentAt) {
            // FCM push
            sendPushNotification(
              user.fcmToken,
              "Upcoming Dose Alert",
              `You have a dose of ${medName} scheduled at ${dose.time}`
            );

            // Email
            if (user.email) {
              await sendDoseReminderEmail(
                user.email,
                user.name,
                medName,
                dose.time,
                dosage
              );
            }

            // Mark reminder as sent
            dose.reminderSentAt = new Date();
            await dose.save();
          }
        }

        // ---- AT DOSE TIME (within 0-5 min after) ----
        if (diffMinutes > 0 && diffMinutes <= 5 && dose.status === "scheduled") {
          if (!dose.reminderSentAt) {
            sendPushNotification(
              user.fcmToken,
              "Dose Due Now",
              `Time to take your dose of ${medName} (${dosage})`
            );

            if (user.email) {
              await sendDoseReminderEmail(
                user.email,
                user.name,
                medName,
                dose.time,
                dosage
              );
            }

            dose.reminderSentAt = new Date();
            await dose.save();
          }
        }

        // ---- MISSED DOSE (more than 5 min overdue) ----
        if (diffMinutes > 5 && dose.status === "scheduled") {
          // Mark as missed
          dose.status = "missed";

          // Check deduplication for missed alert
          if (!dose.missedAlertSentAt) {
            sendPushNotification(
              user.fcmToken,
              "Missed Dose",
              `You missed your dose of ${medName} scheduled at ${dose.time}`
            );

            if (user.email) {
              await sendMissedDoseEmail(
                user.email,
                user.name,
                medName,
                dose.time,
                dosage
              );
            }

            dose.missedAlertSentAt = new Date();
          }

          await dose.save();
        }

        // ---- SNOOZED REMINDER (snooze time reached) ----
        if (dose.status === "snoozed" && dose.snoozeTime) {
          const [snoozeH, snoozeM] = dose.snoozeTime.split(":").map(Number);
          const snoozeDate = new Date(now);
          snoozeDate.setHours(snoozeH, snoozeM, 0, 0);

          const snoozeDiff = (now - snoozeDate) / 1000 / 60;

          // Fire within a 2-minute window of snooze time
          if (snoozeDiff >= 0 && snoozeDiff <= 2) {
            if (!dose.reminderSentAt) {
              sendPushNotification(
                user.fcmToken,
                "Snoozed Dose Reminder",
                `Reminder: Take your dose of ${medName} now!`
              );

              if (user.email) {
                await sendSnoozedReminderEmail(
                  user.email,
                  user.name,
                  medName,
                  dose.snoozeTime,
                  dosage
                );
              }

              dose.reminderSentAt = new Date();
              await dose.save();
            }
          }
        }
      } catch (userErr) {
        // Per-dose error handling so one failure does not block others
        console.error(`[ReminderEngine] Error processing dose ${dose._id}:`, userErr.message);
      }
    }
  } catch (err) {
    console.error("[ReminderEngine] Fatal error:", err.message);
  }
};
