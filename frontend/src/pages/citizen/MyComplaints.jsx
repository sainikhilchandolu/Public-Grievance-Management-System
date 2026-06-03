import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComplaints, deleteComplaint } from '../../services/complaintService';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/complaints/StatusBadge';
import { formatDate, copyToClipboard } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const FILTER_STATUSES = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchComplaints(); }, [search, status, category, page]);

  async function fetchComplaints() {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.department = category;
      const res = await getComplaints(params);
      setComplaints(res.data.complaints || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch { toast.error('Failed to load complaints'); }
    finally { setLoading(false); }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint? This cannot be undone.')) return;
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted.');
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete this complaint.');
    }
  };

  return (
    <DashboardLayout pageTitle="My Complaints">
      {/* Filters */}
      <div className="gov-card gov-card-body mb-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, location or Tracking ID..."
            className="gov-input flex-1"
          />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="gov-select sm:w-48">
            <option value="">All Statuses</option>
            {FILTER_STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="gov-select sm:w-48">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="gov-card animate-fade-in delay-1">
        <div className="gov-card-header">
          <h3 className="font-bold text-navy-800">
            {total} Complaint{total !== 1 ? 's' : ''}
            {status ? ` · ${status}` : ''}
          </h3>
          <button onClick={() => navigate('/dashboard/citizen/complaints/new')} className="btn-saffron text-xs px-3 py-2">
            New Complaint
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center"><span className="spinner spinner-navy w-8 h-8 inline-block" /></div>
        ) : complaints.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No complaints found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Filed On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-navy-700 bg-navy-50 border border-navy-200 px-2 py-0.5 rounded whitespace-nowrap">
                          {c.trackingId || '—'}
                        </span>
                        {c.trackingId && (
                          <button
                            onClick={() => { copyToClipboard(c.trackingId); toast.success('Copied!'); }}
                              className="text-navy-700 hover:text-navy-900 text-xs font-semibold uppercase tracking-wide" title="Copy"
                            >Copy</button>
                        )}
                      </div>
                    </td>
                    <td className="max-w-[200px]">
                      <p className="font-semibold text-sm text-gray-800 truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 truncate">{c.location}</p>
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {c.category || c.department}
                    </td>
                    <td>
                      <span className={`status-badge priority-${c.priority?.toLowerCase() || 'medium'}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td className="text-sm text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/dashboard/citizen/complaints/${c._id}`)} className="btn-outline text-xs px-3 py-1.5">View</button>
                        {c.status === 'Submitted' && (
                          <button onClick={() => handleDelete(c._id)} className="btn-ghost text-xs text-red-500 hover:bg-red-50">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">Prev</button>
            <span className="text-sm text-gray-600 font-medium">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyComplaints;
