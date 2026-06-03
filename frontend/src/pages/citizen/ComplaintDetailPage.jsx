import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaint, deleteComplaint } from '../../services/complaintService';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/complaints/StatusBadge';
import StatusTimeline from '../../components/complaints/StatusTimeline';
import { formatDateTime, formatDate, copyToClipboard } from '../../utils/formatters';
import { DEPT_ICONS, PRIORITY_CLASS, API_BASE } from '../../utils/constants';
import toast from 'react-hot-toast';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => { fetchComplaint(); }, [id]);

  async function fetchComplaint() {
    setLoading(true);
    try {
      const res = await getComplaint(id);
      setComplaint(res.data.complaint);
    } catch {
      toast.error('Complaint not found');
      navigate('/dashboard/citizen/complaints');
    } finally { setLoading(false); }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint? This cannot be undone.')) return;
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted.');
      navigate('/dashboard/citizen/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete this complaint.');
    }
  };

  if (loading) return (
    <DashboardLayout pageTitle="Complaint Details">
      <div className="p-16 text-center"><span className="spinner spinner-navy w-10 h-10 inline-block" /></div>
    </DashboardLayout>
  );

  if (!complaint) return null;

  return (
    <DashboardLayout pageTitle="Complaint Details">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="gov-card overflow-hidden animate-fade-in">
          <div style={{ background: 'var(--navy-800)' }} className="px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-navy-300 text-xs font-semibold uppercase tracking-widest mb-2">Tracking ID</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="tracking-badge-large">{complaint.trackingId || 'N/A'}</span>
                  {complaint.trackingId && (
                    <button onClick={() => { copyToClipboard(complaint.trackingId); toast.success('Copied!'); }}
                      className="text-white/50 hover:text-white text-sm">📋</button>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={complaint.status} />
                <span className={`status-badge ${PRIORITY_CLASS[complaint.priority] || 'priority-medium'} text-xs`}>
                  {complaint.priority} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-white">
            {['details', 'timeline', 'images'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-saffron-500 text-saffron-600'
                    : 'text-gray-500 hover:text-navy-700'
                }`}
              >{tab}</button>
            ))}
          </div>

          <div className="gov-card-body">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-navy-800">{complaint.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {DEPT_ICONS[complaint.category || complaint.department] || '📋'}{' '}
                    {complaint.category || complaint.department} · 📍 {complaint.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Filed On</p>
                    <p className="text-gray-700 font-medium">{formatDateTime(complaint.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Last Updated</p>
                    <p className="text-gray-700 font-medium">{formatDateTime(complaint.updatedAt)}</p>
                  </div>
                  {complaint.resolvedAt && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Resolved On</p>
                      <p className="text-green-700 font-medium">{formatDate(complaint.resolvedAt)}</p>
                    </div>
                  )}
                  {complaint.assignedTo && (
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Assigned Officer</p>
                      <p className="text-gray-700 font-medium">👤 {complaint.assignedTo}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-gov p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
                </div>

                {complaint.remarks && (
                  <div className="bg-navy-50 rounded-gov p-4 border border-navy-100">
                    <p className="text-xs font-bold text-navy-600 uppercase mb-2">🏛️ Official Remarks</p>
                    <p className="text-sm text-gray-700">{complaint.remarks}</p>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="animate-fade-in">
                <StatusTimeline currentStatus={complaint.status} activityLog={complaint.activityLog} />
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="animate-fade-in">
                {complaint.images?.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {complaint.images.map((img, i) => (
                      <a key={i} href={`${API_BASE}${img}`} target="_blank" rel="noopener noreferrer"
                        className="block rounded-gov overflow-hidden border border-gray-200 hover:shadow-gov-md transition-shadow">
                        <img src={`${API_BASE}${img}`} alt={`Attachment ${i+1}`} className="w-40 h-40 object-cover" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p>No images attached to this complaint.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3 animate-fade-in delay-2">
          <button onClick={() => navigate('/dashboard/citizen/complaints')} className="btn-outline">
            ← Back to Complaints
          </button>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/track?id=${complaint.trackingId}`)} className="btn-ghost">
              🔍 Track Status
            </button>
            {complaint.status === 'Submitted' && (
              <button onClick={handleDelete} className="btn-danger text-sm">
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetailPage;
