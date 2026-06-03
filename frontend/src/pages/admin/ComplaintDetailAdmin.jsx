import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaint, deleteComplaint } from '../../services/complaintService';
import AdminLayout from '../../layouts/AdminLayout';
import StatusBadge from '../../components/complaints/StatusBadge';
import ActivityTimeline from '../../components/ui/ActivityTimeline';
import StatusUpdateModal from '../../components/modals/StatusUpdateModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatters';
import { PRIORITY_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiLocationMarker, HiUser, HiMail, HiCalendar, HiTrash } from 'react-icons/hi';

const ComplaintDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchComplaint() {
    try {
      const res = await getComplaint(id);
      setComplaint(res.data.complaint);
    } catch {
      toast.error('Failed to load complaint details');
      navigate('/dashboard/admin/complaints');
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted successfully');
      navigate('/dashboard/admin/complaints');
    } catch {
      toast.error('Failed to delete complaint');
      setDeleteModalOpen(false);
    }
  };

  if (loading) return <AdminLayout><div className="pt-20"><Spinner size="lg" /></div></AdminLayout>;
  if (!complaint) return null;

  const priority = PRIORITY_COLORS[complaint.priority] || PRIORITY_COLORS.Medium;

  return (
    <AdminLayout pageTitle="Complaint Details">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('/dashboard/admin/complaints')}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          <HiArrowLeft size={16} />
          Back to Complaints
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => setDeleteModalOpen(true)}
            className="btn-danger flex items-center gap-2 py-2 px-4"
          >
            <HiTrash size={16} /> Delete
          </button>
          <button 
            onClick={() => setStatusModalOpen(true)}
            className="btn-primary py-2 px-6"
          >
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (Left Col) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
              <StatusBadge status={complaint.status} />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1 text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl">
                {complaint.department}
              </span>
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-xl ${priority.bg} ${priority.text}`}>
                {complaint.priority} Priority
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h3>
              <p className="flex items-center gap-2 text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <HiLocationMarker className="text-blue-500 flex-shrink-0" size={18} />
                {complaint.location}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                {complaint.description}
              </div>
            </div>
          </div>
          
          {/* Official Remarks */}
          {complaint.remarks && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>📝</span> Official Remarks
              </h3>
              <p className="text-blue-900 leading-relaxed text-sm">
                {complaint.remarks}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar (Right Col) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Citizen Info Card */}
          <div className="card">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Citizen Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <HiUser size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="font-semibold">{complaint.createdBy?.name || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <HiMail size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-semibold">{complaint.createdBy?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <HiCalendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Submitted On</p>
                  <p className="font-semibold">{formatDate(complaint.createdAt)}</p>
                </div>
              </div>
              
              {complaint.assignedTo && (
                <div className="pt-4 border-t border-gray-100 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Assigned Officer</p>
                  <p className="font-semibold text-sm text-gray-800">{complaint.assignedTo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
              Activity Timeline
            </h3>
            <ActivityTimeline activities={complaint.activityLog} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateModal 
        complaint={complaint}
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onUpdate={fetchComplaint}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Complaint"
        message="Are you sure you want to delete this complaint? This action cannot be undone and all data will be lost."
        confirmLabel="Yes, Delete"
      />
    </AdminLayout>
  );
};

export default ComplaintDetailAdmin;
