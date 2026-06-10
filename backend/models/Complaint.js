const mongoose = require('mongoose');

/**
 * Activity Log Sub-Schema
 * Tracks all actions performed on a complaint (visual timeline)
 */
const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  performedByName: { type: String, required: true },
  performedByRole: { type: String, enum: ['citizen', 'officer', 'admin'] },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

/**
 * Complaint Schema
 * Core data model for public grievances
 */
const complaintSchema = new mongoose.Schema(
  {
    // === TRACKING ===
    trackingId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    // === CORE DETAILS ===
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Roads',
          'Water Supply',
          'Electricity',
          'Sanitation',
          'Transport',
          'Public Safety',
          'Healthcare',
          'Education',
          'Other',
        ],
        message: 'Please select a valid category',
      },
    },
    // Keep department as alias for category (backward compat)
    department: {
      type: String,
      default: function () { return this.category; },
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },

    // === STATUS WORKFLOW ===
    status: {
      type: String,
      enum: ['Submitted', 'Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
      default: 'Submitted',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },

    // === LOCATION ===
    location: {
      type: String,
      required: [true, 'Please provide the location of the issue'],
      trim: true,
    },

    // === MEDIA ===
    images: {
      type: [String], // Array of file paths/URLs
      default: [],
    },

    // === NOTES & ASSIGNMENT ===
    remarks: { type: String, default: '', trim: true },
    assignedTo: { type: String, default: '' },      // Officer name
    updatedByAdmin: { type: String, default: '', trim: true }, // Admin name who last updated the complaint
    assignedDept: { type: String, default: '' },    // Officer department

    // === REFERENCES ===
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // === AUDIT TRAIL ===
    activityLog: [activityLogSchema],
  },
  { timestamps: true }
);

// Full-text search index
complaintSchema.index({ title: 'text', description: 'text', location: 'text', trackingId: 'text' });
complaintSchema.index({ status: 1, category: 1, priority: 1 });
complaintSchema.index({ createdBy: 1, createdAt: -1 });

// Auto-set resolvedAt when status changes to Resolved or Closed
complaintSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (['Resolved', 'Closed'].includes(this.status) && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    // Sync department with category for backward compat
    if (this.isModified('category')) {
      this.department = this.category;
    }
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
