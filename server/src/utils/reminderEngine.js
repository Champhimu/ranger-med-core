import Dose from "../models/Dose.js";
import User from "../models/User.js";
import { FCM } from "../config/fcm.js";

/**
 * Send FCM Notification
 */
const sendNotification = async (token, title, body) => {
  try {
    await FCM.send({
      token,
      notification: { title, body },
      android: { priority: "high" }
    });
    console.log("SEND");
  } catch (err) {
    console.log("FCM Error:", err);
  }
};

/**
 * Runs every 1 minute using node-cron in server.js
 * Sends:
 * 1. Upcoming dose alerts (5 min before)
 * 2. Missed dose alerts (5 min after)
 */
export const processDoseReminders = async () => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];

  const minute = now.getMinutes().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const currentTime = `${hour}:${minute}`;

  // fetch doses for today
  const doses = await Dose.find({ date: currentDate });

  for (const dose of doses) {
    const user = await User.findById(dose.userId);
    if (!user?.fcmToken) continue;

    const doseTime = new Date(`${currentDate}T${dose.time}:00`);
    const diff = (now - doseTime) / 1000 / 60; // minutes difference

    // Upcoming reminder (5 min before) and dose Time
    if (((diff <= 5 && diff > 0) || (doseTime === currentTime) )&& dose.status === "scheduled") {
      sendNotification(
        user.fcmToken,
        "Upcoming Dose Alert",
        `You have a dose scheduled at ${dose.time}`
      );
    }

    // Missed alert (5 min AFTER)
    if (diff > 5 && dose.status === "scheduled") {
      dose.status = "missed";
      await dose.save();

      sendNotification(
        user.fcmToken,
        "Missed Dose",
        `You missed your dose scheduled at ${dose.time}`
      );
    }

    // Snoozed reminder
    if (dose.status === "snoozed" && dose.snoozeTime === currentTime) {
      sendNotification(
        user.fcmToken,
        "Snoozed Dose Reminder",
        `Reminder: Take your dose now!`
      );
    }
  }
};
