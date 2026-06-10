import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../services/complaintService';
import DashboardLayout from '../../layouts/DashboardLayout';
import ImageUpload from '../../components/complaints/ImageUpload';
import SuccessModal from '../../components/modals/SuccessModal';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'Medium', location: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null); // { trackingId, createdAt }

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 20) e.description = 'Minimum 20 characters';
    if (!form.category) e.category = 'Please select a category';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!images || images.length === 0) e.images = 'Please upload at least one supporting image';
    return e;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await createComplaint({ ...form, images });
      const { trackingId, complaint } = res.data;
      setSuccess({ trackingId, createdAt: complaint.createdAt });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <SuccessModal
        trackingId={success.trackingId}
        submittedAt={success.createdAt}
        onClose={() => navigate('/dashboard/citizen')}
        onTrack={() => navigate(`/track?id=${success.trackingId}`)}
      />
    );
  }

  return (
    <DashboardLayout pageTitle="File New Complaint">
      <div className="max-w-2xl mx-auto">
        {/* Header card */}
        <div className="gov-card mb-6 overflow-hidden animate-fade-in">
          <div className="saffron-bar h-1 w-full" />
          <div className="gov-card-body">
            <h2 className="text-lg font-bold text-navy-800 mb-1">📝 Submit a New Grievance</h2>
            <p className="text-sm text-gray-500">
              Fill in all the required details. A unique Tracking ID will be generated upon submission.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in delay-1">
          {/* Complaint Title */}
          <div className="gov-card gov-card-body">
            <label className="gov-label">Complaint Title *</label>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="Brief, descriptive title of the issue"
              className={`gov-input mt-1 ${errors.title ? 'error' : ''}`}
              maxLength={100}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/100</p>
          </div>

          {/* Category + Priority */}
          <div className="gov-card gov-card-body grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="gov-label">Category / Department *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className={`gov-select mt-1 ${errors.category ? 'error border-red-400' : ''}`}>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="gov-label">Priority Level</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="gov-select mt-1">
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.value}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="gov-card gov-card-body">
            <label className="gov-label">Location of Issue *</label>
            <input
              name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Ward 12, MG Road, New Delhi"
              className={`gov-input mt-1 ${errors.location ? 'error' : ''}`}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div className="gov-card gov-card-body">
            <label className="gov-label">Detailed Description *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the problem in detail (minimum 20 characters)..."
              className={`gov-input mt-1 min-h-[140px] resize-y ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length} chars</p>
          </div>

          {/* Image Upload */}
          <div className="gov-card gov-card-body">
            <label className="gov-label">Supporting Images <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-400 mb-3">Upload up to 3 photos as evidence (max 5MB each)</p>
            <ImageUpload onChange={setImages} maxFiles={3} />
            {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4 animate-fade-in delay-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">
              ← Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8 py-3 text-base">
              {loading ? (
                <><span className="spinner w-4 h-4 mr-2" />Submitting...</>
              ) : '📩 Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewComplaint;
