const Complaint = require('../models/Complaint');

/**
 * Generates a unique Tracking ID in the format: GRV-YYYYMMDD-XXXX
 * Counter is padded to 4 digits and resets daily.
 * Example: GRV-20260530-0001
 */
const generateTrackingId = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Count complaints already created today to determine the sequence number
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const countToday = await Complaint.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  let sequenceNum = countToday + 1;
  let trackingId = `GRV-${dateStr}-${String(sequenceNum).padStart(4, '0')}`;

  // Loop to guarantee absolute uniqueness and prevent duplicate key errors
  let exists = await Complaint.exists({ trackingId });
  while (exists) {
    sequenceNum++;
    trackingId = `GRV-${dateStr}-${String(sequenceNum).padStart(4, '0')}`;
    exists = await Complaint.exists({ trackingId });
  }

  return trackingId;
};

module.exports = generateTrackingId;
