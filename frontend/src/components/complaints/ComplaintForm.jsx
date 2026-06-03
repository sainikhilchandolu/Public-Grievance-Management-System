import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS, PRIORITIES } from '../../utils/constants';
import { createComplaint, updateComplaint } from '../../services/complaintService';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';

/**
 * ComplaintForm Component
 * Reusable form for creating and editing complaints
 */
const ComplaintForm = ({ initialData = null, complaintId = null, onSuccess }) => {
  const navigate = useNavigate();
  const isEditing = !!complaintId;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    department: initialData?.department || '',
    priority: initialData?.priority || 'Medium',
    location: initialData?.location || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) errs.description = 'Description is required';
    else if (formData.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    if (!formData.department) errs.department = 'Please select a department';
    if (!formData.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (isEditing) {
        await updateComplaint(complaintId, formData);
        toast.success('Complaint updated successfully!');
      } else {
        await createComplaint(formData);
        toast.success('Complaint submitted successfully! We will review it shortly.');
      }
      if (onSuccess) onSuccess();
      else navigate('/dashboard/citizen/complaints');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Complaint Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief title describing the issue (e.g., Broken water pipe on MG Road)"
          maxLength={100}
          className={`input-field ${errors.title ? 'input-error' : ''}`}
        />
        <div className="flex justify-between mt-1">
          {errors.title ? <p className="text-red-500 text-xs">{errors.title}</p> : <span />}
          <p className="text-gray-400 text-xs">{formData.title.length}/100</p>
        </div>
      </div>

      {/* Department + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`input-field ${errors.department ? 'input-error' : ''}`}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-field"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Location / Area <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Sector 5, Near Main Market, Gandhi Nagar"
          className={`input-field ${errors.location ? 'input-error' : ''}`}
        />
        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail. Include when it started, how it affects you, and any other relevant information... (minimum 20 characters)"
          rows={5}
          className={`input-field resize-none ${errors.description ? 'input-error' : ''}`}
        />
        <div className="flex justify-between mt-1">
          {errors.description
            ? <p className="text-red-500 text-xs">{errors.description}</p>
            : <p className="text-gray-400 text-xs">Minimum 20 characters</p>
          }
          <p className={`text-xs ${formData.description.length < 20 ? 'text-red-400' : 'text-green-500'}`}>
            {formData.description.length} chars
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading
            ? <><Spinner size="sm" color="white" /> {isEditing ? 'Updating...' : 'Submitting...'}</>
            : isEditing ? '💾 Update Complaint' : '📨 Submit Complaint'
          }
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;
