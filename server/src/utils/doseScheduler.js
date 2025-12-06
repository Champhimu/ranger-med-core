export const generateDoses = (capsule) => {
  const doses = [];
  const start = new Date(capsule.startDate);
  const end = new Date(capsule.endDate);

  // Determine number of doses per day
  const dosesPerDay = capsule.timeSlots.length;
  const pillPerDose = capsule.doseAmount || 1; // default 1 if undefined

  // Track remaining stock for refill calculation
  let remainingStock = capsule.stock;

  // Iterate each day
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

    capsule.timeSlots.forEach((time) => {
      if (remainingStock <= 0) return; // stop scheduling if stock is 0

      doses.push({
        capsuleId: capsule._id,
        userId: capsule.userId,
        date: new Date(`${dateStr}T${time}:00`),
        time: time,
        dosage: capsule.doseAmount && capsule.doseUnit ? `${capsule.doseAmount} ${capsule.doseUnit}` : capsule.dosage,
        status: "pending",
        uniqueKey: `${capsule._id}_${dateStr}_${time}`,
      });

      // Reduce stock
      remainingStock -= pillPerDose;
    });
  }

  // Calculate refillDate
  let refillDate = null;
  if (remainingStock <= 0) {
    // Stock runs out on the last dose scheduled
    const lastDose = doses[doses.length - 1];
    refillDate = lastDose ? lastDose.date : null;
  } else {
    // Stock lasts through endDate
    refillDate = new Date(end);
  }

  return { doses, refillDate, remainingStock };
};
