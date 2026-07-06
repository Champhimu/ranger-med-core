import PDFDocument from "pdfkit";
import User from "../models/User.js";
import Capsule from "../models/Capsule.js";
import Dose from "../models/Dose.js";
import Symptom from "../models/Symptom.js";
import SymptomAnalysis from "../models/SymptomAnalysis.js";
import Appointment from "../models/Appointment.js";
import WeeklyInsight from "../models/WeeklyInsight.js";

// Color constants for the PDF
const COLORS = {
  primary: "#0A1628",
  accent: "#00CED1",
  accentDark: "#008B8B",
  headerBg: "#0D2137",
  sectionBg: "#F0FDFD",
  text: "#1A1A2E",
  textLight: "#4A5568",
  white: "#FFFFFF",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  border: "#CBD5E0",
  tableBorder: "#B0BEC5",
  tableHeader: "#0D2137",
  tableStripe: "#F7FAFA",
};

/**
 * Draw a rounded rectangle (used for section boxes)
 */
function roundedRect(doc, x, y, w, h, r, fillColor) {
  doc.save();
  doc.roundedRect(x, y, w, h, r).fill(fillColor);
  doc.restore();
}

/**
 * Draw section header with colored bar
 */
function drawSectionHeader(doc, title, yPos, pageWidth) {
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Accent bar
  doc.save();
  doc.rect(margin, yPos, 5, 24).fill(COLORS.accent);
  doc.restore();

  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .fillColor(COLORS.headerBg)
    .text(title.toUpperCase(), margin + 14, yPos + 5, { width: contentWidth });

  // Underline
  doc
    .moveTo(margin, yPos + 30)
    .lineTo(margin + contentWidth, yPos + 30)
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .stroke();

  return yPos + 40;
}

/**
 * Draw a table with headers and rows
 */
function drawTable(doc, headers, rows, startY, pageWidth, options = {}) {
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const colCount = headers.length;
  const colWidths = options.colWidths ||
    headers.map(() => contentWidth / colCount);
  const rowHeight = options.rowHeight || 22;
  const headerHeight = 26;

  let y = startY;

  // Check if table header fits on current page
  if (y + headerHeight + rowHeight > doc.page.height - 60) {
    doc.addPage();
    y = 50;
  }

  // Header row background
  doc.save();
  doc.rect(margin, y, contentWidth, headerHeight).fill(COLORS.tableHeader);
  doc.restore();

  // Header text
  let xOffset = margin;
  headers.forEach((header, i) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.white)
      .text(header, xOffset + 6, y + 7, {
        width: colWidths[i] - 12,
        ellipsis: true,
      });
    xOffset += colWidths[i];
  });

  y += headerHeight;

  // Data rows
  rows.forEach((row, rowIndex) => {
    // Page break check
    if (y + rowHeight > doc.page.height - 60) {
      doc.addPage();
      y = 50;
    }

    // Alternate row color
    if (rowIndex % 2 === 0) {
      doc.save();
      doc.rect(margin, y, contentWidth, rowHeight).fill(COLORS.tableStripe);
      doc.restore();
    }

    xOffset = margin;
    row.forEach((cell, i) => {
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(COLORS.text)
        .text(String(cell || "—"), xOffset + 6, y + 6, {
          width: colWidths[i] - 12,
          ellipsis: true,
          lineBreak: false,
        });
      xOffset += colWidths[i];
    });

    // Row border
    doc
      .moveTo(margin, y + rowHeight)
      .lineTo(margin + contentWidth, y + rowHeight)
      .strokeColor("#E2E8F0")
      .lineWidth(0.3)
      .stroke();

    y += rowHeight;
  });

  // Table outer border
  const tableHeight = headerHeight + rows.length * rowHeight;
  doc
    .rect(margin, startY, contentWidth, tableHeight)
    .strokeColor(COLORS.tableBorder)
    .lineWidth(0.5)
    .stroke();

  return y + 10;
}

/**
 * Draw a stat card (inline metric)
 */
function drawStatCard(doc, label, value, unit, x, y, width) {
  roundedRect(doc, x, y, width, 52, 6, COLORS.sectionBg);

  doc
    .rect(x, y, width, 52)
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.textLight)
    .text(label.toUpperCase(), x + 10, y + 8, { width: width - 20 });

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor(COLORS.accentDark)
    .text(String(value), x + 10, y + 22, { width: width - 20, lineBreak: false });

  if (unit) {
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.textLight)
      .text(unit, x + 10, y + 40, { width: width - 20 });
  }

  return y + 62;
}

/**
 * Generate the full Medical Report PDF
 */
export const generateReport = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all data in parallel
    const [user, capsules, doses, symptoms, analyses, appointments, latestInsight] =
      await Promise.all([
        User.findById(userId).select("-password -refreshToken"),
        Capsule.find({ userId }).sort({ createdAt: -1 }),
        Dose.find({ userId }).sort({ date: -1 }),
        Symptom.find({ userId }).sort({ createdAt: -1 }),
        SymptomAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(5),
        Appointment.find({ user: userId }).populate("doctor", "name specialization").sort({ date: -1 }),
        WeeklyInsight.findOne({ userId }).sort({ weekStartDate: -1 }),
      ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compute dose statistics
    const totalDoses = doses.length;
    const takenDoses = doses.filter((d) => d.status === "taken").length;
    const missedDoses = doses.filter((d) => d.status === "missed").length;
    const adherenceRate = totalDoses > 0 ? ((takenDoses / totalDoses) * 100).toFixed(1) : "N/A";

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      info: {
        Title: `Medical Report - ${user.name || "Ranger"}`,
        Author: "Ranger Med-Core",
        Subject: "Comprehensive Medical Report",
        CreationDate: new Date(),
      },
    });

    // Set response headers
    const fileName = `Medical_Report_${(user.name || "Ranger").replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    const generatedAt = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // ===================== PAGE 1: COVER / HEADER =====================

    // Top accent bar
    doc.rect(0, 0, pageWidth, 6).fill(COLORS.accent);

    // Header block
    roundedRect(doc, margin, 20, contentWidth, 100, 8, COLORS.primary);

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor(COLORS.accent)
      .text("RANGER MED-CORE", margin + 20, 38, { width: contentWidth - 40 });

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(COLORS.white)
      .text("COMPREHENSIVE MEDICAL REPORT", margin + 20, 64, { width: contentWidth - 40 });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#8899AA")
      .text(`Generated: ${generatedAt}`, margin + 20, 84, { width: contentWidth - 40 });

    // Report ID on the right
    const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#8899AA")
      .text(`Report ID: ${reportId}`, pageWidth - 200, 84, { width: 160, align: "right" });

    let y = 135;

    // ===================== PATIENT PROFILE =====================

    y = drawSectionHeader(doc, "Patient Profile", y, pageWidth);

    roundedRect(doc, margin, y, contentWidth, 60, 6, COLORS.sectionBg);

    const profileFields = [
      { label: "Full Name", value: user.name || "N/A" },
      { label: "Email", value: user.email || "N/A" },
      { label: "Role", value: (user.role || "ranger").toUpperCase() },
      { label: "User ID", value: user._id.toString().slice(-8).toUpperCase() },
    ];

    const colW = contentWidth / 4;
    profileFields.forEach((field, i) => {
      const x = margin + i * colW;
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(COLORS.textLight)
        .text(field.label.toUpperCase(), x + 12, y + 10, { width: colW - 24 });
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(COLORS.text)
        .text(field.value, x + 12, y + 24, { width: colW - 24, ellipsis: true });
    });

    y += 75;

    // ===================== DOSE ADHERENCE SUMMARY =====================

    y = drawSectionHeader(doc, "Dose Adherence Summary", y, pageWidth);

    const statWidth = (contentWidth - 30) / 4;
    drawStatCard(doc, "Total Doses", totalDoses, "recorded", margin, y, statWidth);
    drawStatCard(doc, "Doses Taken", takenDoses, "on time", margin + statWidth + 10, y, statWidth);
    drawStatCard(doc, "Doses Missed", missedDoses, "skipped", margin + (statWidth + 10) * 2, y, statWidth);
    drawStatCard(doc, "Adherence Rate", adherenceRate === "N/A" ? adherenceRate : `${adherenceRate}%`, totalDoses > 0 ? "compliance" : "no data", margin + (statWidth + 10) * 3, y, statWidth);

    y += 72;

    // ===================== CURRENT MEDICATIONS =====================

    if (capsules.length > 0) {
      y = drawSectionHeader(doc, `Current Medications (${capsules.length})`, y, pageWidth);

      const medHeaders = ["Medication", "Dosage", "Frequency", "Time Slots", "Condition", "Start Date"];
      const medColWidths = [
        contentWidth * 0.20,
        contentWidth * 0.13,
        contentWidth * 0.15,
        contentWidth * 0.17,
        contentWidth * 0.17,
        contentWidth * 0.18,
      ];

      const medRows = capsules.map((c) => [
        c.name || "—",
        c.doseAmount && c.doseUnit ? `${c.doseAmount} ${c.doseUnit}` : c.dosage || "—",
        c.frequency || "—",
        c.timeSlots?.join(", ") || "—",
        c.condition || "—",
        c.startDate ? new Date(c.startDate).toLocaleDateString() : "—",
      ]);

      y = drawTable(doc, medHeaders, medRows, y, pageWidth, { colWidths: medColWidths });
    } else {
      y = drawSectionHeader(doc, "Current Medications", y, pageWidth);
      doc.font("Helvetica").fontSize(10).fillColor(COLORS.textLight).text("No medications recorded.", margin, y);
      y += 25;
    }

    // ===================== SYMPTOM LOG =====================

    // Check page space
    if (y > doc.page.height - 150) {
      doc.addPage();
      y = 50;
    }

    if (symptoms.length > 0) {
      y = drawSectionHeader(doc, `Symptom Log (${symptoms.length})`, y, pageWidth);

      const symHeaders = ["Symptom", "Severity", "Body Part", "Duration", "Date", "Status"];
      const symColWidths = [
        contentWidth * 0.20,
        contentWidth * 0.12,
        contentWidth * 0.15,
        contentWidth * 0.15,
        contentWidth * 0.20,
        contentWidth * 0.18,
      ];

      const symRows = symptoms.map((s) => [
        s.symptomName || "—",
        (s.severity || "—").toUpperCase(),
        s.bodyPart || "—",
        s.duration || "—",
        s.date ? `${s.date} ${s.time || ""}`.trim() : "—",
        (s.status || "active").toUpperCase(),
      ]);

      y = drawTable(doc, symHeaders, symRows, y, pageWidth, { colWidths: symColWidths });
    } else {
      y = drawSectionHeader(doc, "Symptom Log", y, pageWidth);
      doc.font("Helvetica").fontSize(10).fillColor(COLORS.textLight).text("No symptoms recorded.", margin, y);
      y += 25;
    }

    // ===================== SYMPTOM ANALYSIS (AI) =====================

    if (analyses.length > 0) {
      if (y > doc.page.height - 150) {
        doc.addPage();
        y = 50;
      }

      y = drawSectionHeader(doc, `AI Symptom Analyses (${analyses.length})`, y, pageWidth);

      analyses.forEach((analysis) => {
        if (y > doc.page.height - 120) {
          doc.addPage();
          y = 50;
        }

        const urgencyColors = {
          routine: COLORS.success,
          soon: COLORS.warning,
          urgent: COLORS.danger,
          emergency: COLORS.danger,
        };
        const urgency = analysis.analysis?.urgencyLevel || "routine";

        // Analysis card background
        roundedRect(doc, margin, y, contentWidth, 16, 3, urgencyColors[urgency] || COLORS.success);
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(COLORS.white)
          .text(
            `URGENCY: ${urgency.toUpperCase()}  |  Date: ${new Date(analysis.createdAt).toLocaleDateString()}  |  Confidence: ${analysis.aiModel?.confidence || "N/A"}%`,
            margin + 8,
            y + 4,
            { width: contentWidth - 16 }
          );
        y += 22;

        // Conditions
        if (analysis.analysis?.possibleConditions?.length > 0) {
          analysis.analysis.possibleConditions.slice(0, 3).forEach((cond) => {
            if (y > doc.page.height - 40) {
              doc.addPage();
              y = 50;
            }
            doc
              .font("Helvetica-Bold")
              .fontSize(9)
              .fillColor(COLORS.text)
              .text(`- ${cond.name || "Unknown"} (${cond.probability || 0}%)`, margin + 10, y, { width: contentWidth - 20 });
            y += 14;
          });
        }

        // Recommendations
        if (analysis.analysis?.recommendations?.length > 0) {
          doc.font("Helvetica").fontSize(8).fillColor(COLORS.textLight).text("Recommendations: " + analysis.analysis.recommendations.slice(0, 3).join("; "), margin + 10, y, { width: contentWidth - 20 });
          y += 18;
        }

        y += 8;
      });
    }

    // ===================== APPOINTMENTS =====================

    if (y > doc.page.height - 150) {
      doc.addPage();
      y = 50;
    }

    if (appointments.length > 0) {
      y = drawSectionHeader(doc, `Appointments (${appointments.length})`, y, pageWidth);

      const apptHeaders = ["Type", "Doctor", "Date", "Time", "Reason", "Status"];
      const apptColWidths = [
        contentWidth * 0.15,
        contentWidth * 0.18,
        contentWidth * 0.15,
        contentWidth * 0.10,
        contentWidth * 0.25,
        contentWidth * 0.17,
      ];

      const apptRows = appointments.map((a) => [
        a.type || "—",
        a.doctor?.name || "—",
        a.date ? new Date(a.date).toLocaleDateString() : "—",
        a.time || "—",
        a.reason || "—",
        (a.status || "pending").toUpperCase(),
      ]);

      y = drawTable(doc, apptHeaders, apptRows, y, pageWidth, { colWidths: apptColWidths });
    } else {
      y = drawSectionHeader(doc, "Appointments", y, pageWidth);
      doc.font("Helvetica").fontSize(10).fillColor(COLORS.textLight).text("No appointments recorded.", margin, y);
      y += 25;
    }

    // ===================== WEEKLY HEALTH SUMMARY =====================

    if (latestInsight) {
      if (y > doc.page.height - 180) {
        doc.addPage();
        y = 50;
      }

      y = drawSectionHeader(doc, "Latest Weekly Health Summary", y, pageWidth);

      const insightStatWidth = (contentWidth - 20) / 3;
      drawStatCard(doc, "Overall Health Score", latestInsight.healthScore?.overall || "—", "out of 100", margin, y, insightStatWidth);
      drawStatCard(doc, "Medication Score", latestInsight.healthScore?.medication || "—", "out of 100", margin + insightStatWidth + 10, y, insightStatWidth);
      drawStatCard(doc, "Symptom Score", latestInsight.healthScore?.symptoms || "—", "out of 100", margin + (insightStatWidth + 10) * 2, y, insightStatWidth);

      y += 68;

      // Week period
      if (latestInsight.weekStartDate && latestInsight.weekEndDate) {
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(COLORS.textLight)
          .text(
            `Week: ${new Date(latestInsight.weekStartDate).toLocaleDateString()} - ${new Date(latestInsight.weekEndDate).toLocaleDateString()}`,
            margin,
            y
          );
        y += 16;
      }

      // Adherence metrics
      if (latestInsight.medicationAdherence) {
        const ma = latestInsight.medicationAdherence;
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(COLORS.text)
          .text(
            `Adherence: ${ma.adherenceRate || 0}%  |  Taken: ${ma.takenDoses || 0}/${ma.totalDoses || 0}  |  Streak: ${ma.streak || 0} days`,
            margin,
            y,
            { width: contentWidth }
          );
        y += 16;
      }

      // Summary text
      if (latestInsight.summary) {
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(COLORS.text)
          .text(latestInsight.summary, margin, y, { width: contentWidth });
        y += doc.heightOfString(latestInsight.summary, { width: contentWidth }) + 10;
      }
    }

    // ===================== FOOTER =====================

    // Footer on the last page
    const footerY = doc.page.height - 50;

    doc
      .moveTo(margin, footerY - 10)
      .lineTo(margin + contentWidth, footerY - 10)
      .strokeColor(COLORS.border)
      .lineWidth(0.5)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(COLORS.textLight)
      .text(
        "This report is auto-generated by Ranger Med-Core and is intended for informational purposes only. It does not constitute medical advice.",
        margin,
        footerY - 4,
        { width: contentWidth, align: "center" }
      );

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(COLORS.textLight)
      .text(
        `Report ID: ${reportId}  |  Generated: ${generatedAt}`,
        margin,
        footerY + 10,
        { width: contentWidth, align: "center" }
      );

    // Bottom accent bar
    doc.rect(0, doc.page.height - 6, pageWidth, 6).fill(COLORS.accent);

    // Finalize
    doc.end();
  } catch (err) {
    console.error("Report generation error:", err);
    // Only send error if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate report", error: err.message });
    }
  }
};
