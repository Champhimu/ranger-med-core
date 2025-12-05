export const generateDoses = (capsule) => {
  const doses = [];
  const start = new Date(capsule.startDate);
  const end = new Date(capsule.endDate);

  while (start <= end) {
    const dateStr = start.toISOString().split("T")[0];

    capsule.timeSlots.forEach((time) => {
      doses.push({
        capsuleId: capsule._id,
        userId: capsule.userId,
        date: dateStr,
        time: time,
        uniqueKey: `${capsule._id}_${dateStr}_${time}`
      });
    });

    start.setDate(start.getDate() + 1);
  }

  return doses;
};
