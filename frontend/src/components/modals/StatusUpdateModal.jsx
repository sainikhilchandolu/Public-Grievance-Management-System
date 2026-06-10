import { useState } from 'react';
import { STATUSES } from '../../utils/constants';
import { updateStatus } from '../../services/complaintService';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';
import { HiX } from 'react-icons/hi';

/**
 * StatusUpdateModal Component
 * Admin modal to update a complaint's status and add remarks
 */
const StatusUpdateModal = ({ complaint, isOpen, onClose, onUpdate }) => {
  const [status, setStatus] = useState(complaint?.status || 'Submitted');
  const [remarks, setRemarks] = useState(complaint?.remarks || '');
  const [assignedTo, setAssignedTo] = useState(complaint?.assignedTo || '');
  const [assignedDept, setAssignedDept] = useState(complaint?.assignedDept || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: remarks required for rejection
    if (status === 'Rejected' && remarks.trim().length < 10) {
      setError('Please provide remarks of at least 10 characters when rejecting a complaint.');
      return;
    }

    setLoading(true);
    try {
      await updateStatus(complaint._id, { status, remarks, assignedTo, assignedDept });
      toast.success(`Status updated to "${status}" successfully!`);
      onUpdate();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Submitted:      'bg-navy-100 text-navy-800',
    Pending:        'bg-yellow-100 text-yellow-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    Assigned:       'bg-sky-100 text-sky-800',
    'In Progress':  'bg-purple-100 text-purple-800',
    Resolved:       'bg-green-100 text-green-800',
    Closed:         'bg-gray-100 text-gray-700',
    Rejected:       'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Update Complaint Status</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[300px]">{complaint.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Status */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Current status:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status]}`}>
              {complaint.status}
            </span>
          </div>

          {/* New Status Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field"
              required
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign To Officer
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. Officer Ravi Kumar"
              className="input-field"
            />
          </div>

            {/* Assigned Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assign Department
              </label>
              <input
                type="text"
                value={assignedDept}
                onChange={(e) => setAssignedDept(e.target.value)}
                placeholder="e.g. Public Works Department"
                className="input-field"
              />
            </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks
              {status === 'Rejected' && <span className="text-red-500 ml-1">* Required for rejection</span>}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add official remarks or notes about this status update..."
              rows={4}
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{remarks.length} characters</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" color="white" /> Updating...</> : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
