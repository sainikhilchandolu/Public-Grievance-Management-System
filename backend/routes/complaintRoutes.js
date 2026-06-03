const express = require('express');
const router = express.Router();

const {
  createComplaint,
  trackComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  updateStatus,
  getStats,
} = require('../controllers/complaintController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateComplaint, validateStatusUpdate } = require('../validators/complaintValidator');
const upload = require('../middleware/uploadMiddleware');

/**
 * Complaint Routes
 * Base path: /api/complaints
 */

// @route  GET /api/complaints/track/:trackingId
// @desc   Public tracking by Tracking ID (no auth required)
// @access Public
router.get('/track/:trackingId', trackComplaint);

// @route  GET /api/complaints/stats
// @desc   Get complaint analytics/statistics
// @access Private (Admin only)
router.get('/stats', protect, authorize('admin'), getStats);

// @route  POST /api/complaints
// @desc   Create a new complaint (with optional image upload)
// @access Private (Citizen)
router.post('/', protect, upload.array('images', 3), validateComplaint, createComplaint);

// @route  GET /api/complaints
// @desc   Get all complaints (admin) or user's complaints (citizen)
// @access Private
router.get('/', protect, getComplaints);

// @route  GET /api/complaints/:id
// @desc   Get single complaint by MongoDB ID
// @access Private
router.get('/:id', protect, getComplaint);

// @route  PUT /api/complaints/:id
// @desc   Update complaint details (with optional new images)
// @access Private
router.put('/:id', protect, upload.array('images', 3), updateComplaint);

// @route  DELETE /api/complaints/:id
// @desc   Delete a complaint
// @access Private
router.delete('/:id', protect, deleteComplaint);

// @route  PUT /api/complaints/:id/status
// @desc   Update complaint status (Admin only)
// @access Private (Admin)
router.put('/:id/status', protect, authorize('admin'), validateStatusUpdate, updateStatus);

module.exports = router;
