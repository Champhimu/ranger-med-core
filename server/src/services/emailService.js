import nodemailer from "nodemailer";

/**
 * Email Service for Ranger Med-Core
 * Sends dose reminders and missed dose alerts via Gmail SMTP
 */

// ======================== TRANSPORTER ========================

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const email = process.env.SMTP_EMAIL;
  const password = process.env.SMTP_PASSWORD;

  if (!email || !password) {
    console.warn("[EmailService] SMTP_EMAIL or SMTP_PASSWORD not set. Email notifications disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });

  return transporter;
}

// ======================== BASE SEND ========================

async function sendEmail(to, subject, html) {
  const t = getTransporter();
  if (!t) return false;

  try {
    await t.sendMail({
      from: `"Ranger Med-Core" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`[EmailService] Email sent to ${to}: ${subject}`);
    return true;
  } catch (err) {
    console.error(`[EmailService] Failed to send email to ${to}:`, err.message);
    return false;
  }
}

// ======================== HTML TEMPLATES ========================

function wrapTemplate(content, accentColor = "#00CED1") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e1a;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#111827;border:1px solid #1e293b;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1b2a 0%,#1b2a4a 100%);padding:28px 32px;border-bottom:3px solid ${accentColor};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:800;color:${accentColor};letter-spacing:2px;text-transform:uppercase;">Ranger Med-Core</span>
                    <br/>
                    <span style="font-size:11px;color:#8899aa;letter-spacing:1.5px;text-transform:uppercase;">Operation Overdrive -- Medical Bay</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#0d1117;border-top:1px solid #1e293b;">
              <p style="margin:0;font-size:11px;color:#4a5568;line-height:1.6;text-align:center;">
                This is an automated notification from Ranger Med-Core.<br/>
                Do not reply to this email. For assistance, contact your assigned medical officer.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ======================== REMINDER EMAIL ========================

export async function sendDoseReminderEmail(to, userName, medication, doseTime, dosage) {
  const subject = `Dose Reminder: ${medication} at ${doseTime}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:16px 20px;background:#0d2818;border:1px solid #166534;border-radius:8px;margin-bottom:20px;">
          <span style="font-size:12px;font-weight:700;color:#22c55e;letter-spacing:1px;text-transform:uppercase;">Upcoming Dose Reminder</span>
        </td>
      </tr>
    </table>

    <p style="font-size:15px;color:#e2e8f0;margin:20px 0 8px;">
      Hello <strong style="color:#00ced1;">${userName || "Ranger"}</strong>,
    </p>

    <p style="font-size:14px;color:#94a3b8;line-height:1.7;margin:0 0 24px;">
      You have a dose coming up. Please take your medication on time for optimal health.
    </p>

    <!-- Dose Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #1e3a5f;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;border-left:4px solid #00ced1;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:12px;">
                <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Medication</span><br/>
                <span style="font-size:18px;font-weight:700;color:#f1f5f9;">${medication}</span>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%">
                      <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Scheduled Time</span><br/>
                      <span style="font-size:16px;font-weight:700;color:#00ced1;">${doseTime}</span>
                    </td>
                    <td width="50%">
                      <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Dosage</span><br/>
                      <span style="font-size:16px;font-weight:600;color:#e2e8f0;">${dosage || "As prescribed"}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
      Stay consistent with your medication schedule to maintain peak operational readiness.
    </p>
  `;

  return sendEmail(to, subject, wrapTemplate(content, "#00CED1"));
}

// ======================== MISSED DOSE EMAIL ========================

export async function sendMissedDoseEmail(to, userName, medication, doseTime, dosage) {
  const subject = `Missed Dose Alert: ${medication} at ${doseTime}`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:16px 20px;background:#2d1215;border:1px solid #991b1b;border-radius:8px;margin-bottom:20px;">
          <span style="font-size:12px;font-weight:700;color:#ef4444;letter-spacing:1px;text-transform:uppercase;">Missed Dose Alert</span>
        </td>
      </tr>
    </table>

    <p style="font-size:15px;color:#e2e8f0;margin:20px 0 8px;">
      Hello <strong style="color:#ef4444;">${userName || "Ranger"}</strong>,
    </p>

    <p style="font-size:14px;color:#94a3b8;line-height:1.7;margin:0 0 24px;">
      It appears you missed a scheduled dose. Please take it as soon as possible or consult your medical officer.
    </p>

    <!-- Dose Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a0a0a;border:1px solid #7f1d1d;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;border-left:4px solid #ef4444;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:12px;">
                <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Medication</span><br/>
                <span style="font-size:18px;font-weight:700;color:#f1f5f9;">${medication}</span>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%">
                      <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Scheduled Time</span><br/>
                      <span style="font-size:16px;font-weight:700;color:#ef4444;">${doseTime}</span>
                    </td>
                    <td width="50%">
                      <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Dosage</span><br/>
                      <span style="font-size:16px;font-weight:600;color:#e2e8f0;">${dosage || "As prescribed"}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="padding:14px 18px;background:#1c1917;border:1px solid #854d0e;border-radius:8px;">
          <span style="font-size:13px;color:#fbbf24;line-height:1.6;">
            <strong>Note:</strong> If you have already taken this dose, you can mark it as taken in the Ranger Med-Core app. If unsure, consult your medical officer before taking a double dose.
          </span>
        </td>
      </tr>
    </table>

    <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
      Consistent medication adherence is critical for mission readiness. Stay on schedule, Ranger.
    </p>
  `;

  return sendEmail(to, subject, wrapTemplate(content, "#EF4444"));
}

// ======================== SNOOZED REMINDER EMAIL ========================

export async function sendSnoozedReminderEmail(to, userName, medication, snoozeTime, dosage) {
  const subject = `Snoozed Dose Reminder: ${medication} - Take Now`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:16px 20px;background:#1a1a0d;border:1px solid #a16207;border-radius:8px;margin-bottom:20px;">
          <span style="font-size:12px;font-weight:700;color:#f59e0b;letter-spacing:1px;text-transform:uppercase;">Snoozed Dose -- Time to Take</span>
        </td>
      </tr>
    </table>

    <p style="font-size:15px;color:#e2e8f0;margin:20px 0 8px;">
      Hello <strong style="color:#f59e0b;">${userName || "Ranger"}</strong>,
    </p>

    <p style="font-size:14px;color:#94a3b8;line-height:1.7;margin:0 0 24px;">
      Your snoozed dose is now due. Please take your medication immediately.
    </p>

    <!-- Dose Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #92400e;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;border-left:4px solid #f59e0b;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:12px;">
                <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Medication</span><br/>
                <span style="font-size:18px;font-weight:700;color:#f1f5f9;">${medication}</span>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%">
                      <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Reminder Time</span><br/>
                      <span style="font-size:16px;font-weight:700;color:#f59e0b;">${snoozeTime}</span>
                    </td>
                    <td width="50%">
                      <span style="font-size:10px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Dosage</span><br/>
                      <span style="font-size:16px;font-weight:600;color:#e2e8f0;">${dosage || "As prescribed"}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
      Do not delay further. Your health is the mission priority.
    </p>
  `;

  return sendEmail(to, subject, wrapTemplate(content, "#F59E0B"));
}
