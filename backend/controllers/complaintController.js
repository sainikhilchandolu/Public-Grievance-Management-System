const Complaint = require('../models/Complaint');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiFeatures = require('../utils/apiFeatures');
const generateTrackingId = require('../utils/generateTrackingId');
const path = require('path');

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Private (Citizen)
 */
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, priority, location } = req.body;

  // Generate unique tracking ID
  const trackingId = await generateTrackingId();

  // Handle uploaded images
  const images = req.files
    ? req.files.map((f) => `/uploads/${f.filename}`)
    : [];

  const complaint = await Complaint.create({
    trackingId,
    title,
    description,
    category,
    department: category, // backward compat
    priority: priority || 'Medium',
    location,
    images,
    createdBy: req.user._id,
    status: 'Submitted',
    activityLog: [
      {
        action: 'Complaint Submitted',
        performedBy: req.user._id,
        performedByName: req.user.name,
        performedByRole: req.user.role,
        note: `Complaint has been successfully submitted and assigned tracking ID: ${trackingId}`,
        timestamp: new Date(),
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully!',
    trackingId,
    complaint,
  });
});

/**
 * @desc    Track a complaint by Tracking ID (PUBLIC)
 * @route   GET /api/complaints/track/:trackingId
 * @access  Public
 */
const trackComplaint = asyncHandler(async (req, res) => {
  const rawId = req.params.trackingId || '';
  const trackingId = rawId.trim().toUpperCase();

  // Validate format and date components
  const trackingIdRegex = /^GRV-(\d{4})(\d{2})(\d{2})-\d{4}$/;
  const match = trackingId.match(trackingIdRegex);
  if (!match) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Tracking ID format. It must follow the pattern GRV-YYYYMMDD-XXXX (e.g., GRV-20260531-0001).',
    });
  }

  const [_, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Tracking ID: Month must be between 01 and 12.',
    });
  }
  if (day < 1 || day > 31) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Tracking ID: Day must be between 01 and 31.',
    });
  }

  // Verify that the date actually exists (e.g. not Feb 30th)
  const parsedDate = new Date(year, month - 1, day);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Tracking ID: Date component does not exist in the calendar.',
    });
  }

  const complaint = await Complaint.findOne({ trackingId }).populate(
    'createdBy',
    'name email'
  );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `No complaint found with Tracking ID: ${trackingId}. Please verify the ID and try again.`,
    });
  }

  res.status(200).json({
    success: true,
    complaint,
  });
});

/**
 * @desc    Get all complaints
 * @route   GET /api/complaints
 * @access  Private
 */
const getComplaints = asyncHandler(async (req, res) => {
  let baseQuery;

  if (req.user.role === 'admin') {
    baseQuery = Complaint.find().populate('createdBy', 'name email');
  } else {
    baseQuery = Complaint.find({ createdBy: req.user._id });
  }

  const totalQuery = Complaint.find(
    req.user.role === 'admin' ? {} : { createdBy: req.user._id }
  );

  const countFeatures = new ApiFeatures(totalQuery, req.query).search().filter();
  const total = await countFeatures.query.countDocuments();

  const features = new ApiFeatures(baseQuery, req.query)
    .search()
    .filter()
    .sort()
    .paginate(10);

  const complaints = await features.query;

  res.status(200).json({
    success: true,
    count: complaints.length,
    total,
    page: Number(req.query.page) || 1,
    pages: Math.ceil(total / (Number(req.query.limit) || 10)),
    complaints,
  });
});

/**
 * @desc    Get single complaint by MongoDB ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
const getComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate(
    'createdBy',
    'name email role createdAt'
  );

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  if (
    req.user.role === 'citizen' &&
    complaint.createdBy._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own complaints.',
    });
  }

  res.status(200).json({ success: true, complaint });
});

/**
 * @desc    Update a complaint
 * @route   PUT /api/complaints/:id
 * @access  Private
 */
const updateComplaint = asyncHandler(async (req, res) => {
  let complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  if (req.user.role === 'citizen') {
    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit your own complaints.',
      });
    }
    if (complaint.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: 'You can only edit complaints that are still in Submitted status.',
      });
    }
  }

  const { title, description, category, priority, location } = req.body;

  const newImages = req.files
    ? req.files.map((f) => `/uploads/${f.filename}`)
    : [];
  const images = [...complaint.images, ...newImages];

  complaint.activityLog.push({
    action: 'Complaint Updated',
    performedBy: req.user._id,
    performedByName: req.user.name,
    performedByRole: req.user.role,
    note: 'Complaint details were updated by the citizen.',
    timestamp: new Date(),
  });

  complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { title, description, category, department: category, priority, location, images, activityLog: complaint.activityLog, updatedByAdmin: req.user.role === 'admin' ? req.user.name : complaint.updatedByAdmin },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, message: 'Complaint updated successfully.', complaint });
});

/**
 * @desc    Delete a complaint
 * @route   DELETE /api/complaints/:id
 * @access  Private
 */
const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  if (req.user.role === 'citizen') {
    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own complaints.',
      });
    }
    if (complaint.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: 'You can only delete complaints that are still in Submitted status.',
      });
    }
  }

  await Complaint.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Complaint deleted successfully.' });
});

/**
 * @desc    Update complaint status (Admin/Officer)
 * @route   PUT /api/complaints/:id/status
 * @access  Private (Admin)
 */
const updateStatus = asyncHandler(async (req, res) => {
  const { status, remarks, assignedTo, assignedDept } = req.body;

  let complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  const previousStatus = complaint.status;

  complaint.activityLog.push({
    action: `Status changed from "${previousStatus}" to "${status}"`,
    performedBy: req.user._id,
    performedByName: req.user.name,
    performedByRole: req.user.role,
    note: remarks || `Status updated to ${status} by ${req.user.name}`,
    timestamp: new Date(),
  });

  complaint.status = status;
  if (remarks) complaint.remarks = remarks;
  if (assignedTo) complaint.assignedTo = assignedTo;
  if (assignedDept) complaint.assignedDept = assignedDept;
  if (req.user.role === 'admin') {
    complaint.updatedByAdmin = req.user.name;
  }

  // Set resolvedAt when closing
  if (['Resolved', 'Closed'].includes(status) && !complaint.resolvedAt) {
    complaint.resolvedAt = new Date();
  }

  await complaint.save();

  res.status(200).json({
    success: true,
    message: `Complaint status updated to "${status}".`,
    complaint,
  });
});

/**
 * @desc    Get complaint statistics (Admin only)
 * @route   GET /api/complaints/stats
 * @access  Private (Admin)
 */
const getStats = asyncHandler(async (req, res) => {
  const [statusStats, categoryStats, priorityStats] = await Promise.all([
    Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Complaint.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
  ]);

  // Weekly trend (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyTrend = await Complaint.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayCount, totalComplaints, totalUsers] = await Promise.all([
    Complaint.countDocuments({ createdAt: { $gte: today } }),
    Complaint.countDocuments(),
    User.countDocuments({ role: 'citizen' }),
  ]);

  const statusMap = {};
  statusStats.forEach((s) => { statusMap[s._id] = s.count; });

  res.status(200).json({
    success: true,
    stats: {
      total: totalComplaints,
      totalUsers,
      todayCount,
      byStatus: {
        Submitted: statusMap['Submitted'] || 0,
        'Under Review': statusMap['Under Review'] || 0,
        Assigned: statusMap['Assigned'] || 0,
        'In Progress': statusMap['In Progress'] || 0,
        Resolved: statusMap['Resolved'] || 0,
        Closed: statusMap['Closed'] || 0,
        Rejected: statusMap['Rejected'] || 0,
        // Legacy
        Pending: statusMap['Pending'] || 0,
      },
      byDepartment: categoryStats.map((d) => ({ name: d._id, value: d.count })),
      byPriority: priorityStats.map((p) => ({ name: p._id, value: p.count })),
      weeklyTrend: weeklyTrend.map((w) => ({ date: w._id, count: w.count })),
    },
  });
});

module.exports = {
  createComplaint,
  trackComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  updateStatus,
  getStats,
};
