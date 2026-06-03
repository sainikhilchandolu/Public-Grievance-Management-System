import { useState, useEffect } from 'react';
import { FiCopy } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getComplaints } from '../../services/complaintService';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/complaints/StatusBadge';
import { formatDate, copyToClipboard } from '../../utils/formatters';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, active, onClick }) => (
  <button
    onClick={onClick}
    className={`stat-card text-left w-full ${active ? 'ring-1 ring-[#163E72] shadow-lg' : 'hover:shadow-md'} bg-white border border-slate-200 p-5 rounded-xl transition-all`}
  >
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-[#0B2E59]">{value}</p>
    </div>
  </button>
);

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => { fetchData(); }, [activeFilter]);

  async function fetchData() {
    setLoading(true);
    try {
      const params = { limit: 8, sort: 'latest' };
      if (activeFilter !== 'All') params.status = activeFilter;
      const res = await getComplaints(params);
      setComplaints(res.data.complaints || []);

      if (activeFilter === 'All') {
        const allRes = await getComplaints({ limit: 200 });
        const all = allRes.data.complaints || [];
        setStats({
          total: allRes.data.total || all.length,
          pending: all.filter(c => ['Submitted', 'Pending', 'Under Review'].includes(c.status)).length,
          inProgress: all.filter(c => ['Assigned', 'In Progress'].includes(c.status)).length,
          resolved: all.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
        });
      }
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }

  const handleCopy = async (id) => {
    await copyToClipboard(id);
    toast.success('Tracking ID copied!');
  };

  return (
    <DashboardLayout pageTitle="Citizen Dashboard">
      {/* Welcome banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#0B2E59]">Welcome back, {user?.name}</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            CPGRAMS Portal: Lodge and track grievances with government services.
          </p>
        </div>
        <Link to="/dashboard/citizen/complaints/new" className="bg-[#163E72] hover:bg-[#0B2E59] text-white px-4 py-2 rounded-lg font-bold transition-all border border-[#2b67ad] text-xs w-max">
          File New Grievance
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Grievances" value={stats.total} active={activeFilter==='All'} onClick={() => setActiveFilter('All')} />
        <StatCard label="Pending Review" value={stats.pending} active={activeFilter==='Submitted'} onClick={() => setActiveFilter('Submitted')} />
        <StatCard label="In Progress" value={stats.inProgress} active={activeFilter==='In Progress'} onClick={() => setActiveFilter('In Progress')} />
        <StatCard label="Resolved" value={stats.resolved} active={activeFilter==='Resolved'} onClick={() => setActiveFilter('Resolved')} />
      </div>

      {/* Complaints section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-sm text-[#0B2E59] uppercase tracking-wider">
            {activeFilter === 'All' ? 'Recent Records' : `${activeFilter} Records`}
          </h3>
          <Link to="/dashboard/citizen/complaints" className="text-xs text-[#163E72] hover:text-[#0B2E59] font-bold">
            View All History →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white">
            <span className="spinner spinner-navy w-6 h-6 inline-block" />
            <p className="text-xs text-slate-400 mt-2">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-10 text-center bg-white">
            <p className="text-slate-500 text-xs font-bold">No active grievances found.</p>
            <Link to="/dashboard/citizen/complaints/new" className="bg-[#163E72] hover:bg-[#0B2E59] text-white px-4 py-2 rounded-lg font-bold text-xs inline-flex mt-4 transition-all">
              File Your First Grievance
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-55 text-[#0B2E59] font-bold text-[10px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left">Tracking ID</th>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Filed On</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-150 text-xs">
                {complaints.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#0B2E59] bg-slate-50 border border-slate-250 px-2 py-0.5 rounded">
                          {c.trackingId || '—'}
                        </span>
                        {c.trackingId && (
                          <button onClick={() => handleCopy(c.trackingId)} className="text-slate-400 hover:text-[#0B2E59] p-0.5" title="Copy">
                            <FiCopy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <p className="font-bold text-slate-800 truncate max-w-[200px]">{c.title}</p>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-slate-600 font-semibold">
                      {c.category || c.department}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-slate-500 font-medium">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <button onClick={() => navigate(`/dashboard/citizen/complaints/${c._id}`)} className="text-[#163E72] hover:text-[#0B2E59] font-bold text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded transition-all">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick track box */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h4 className="font-bold text-sm text-[#0B2E59] uppercase tracking-wider mb-1">
          Quick Status Lookup
        </h4>
        <p className="text-xs text-slate-500 mb-4">Input a tracking registration code to view progress directly.</p>
        <div className="flex gap-3">
          <input id="quickTrack" placeholder="GRV-YYYYMMDD-XXXX" className="w-full px-4 py-2 border border-slate-250 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 bg-white transition-all duration-200 focus:border-[#0B2E59] focus:outline-none" style={{ letterSpacing: '0.04em' }} />
          <button
            onClick={() => {
              const val = document.getElementById('quickTrack').value.trim();
              if (val) navigate(`/track?id=${val.toUpperCase()}`);
            }}
            className="bg-[#163E72] hover:bg-[#0B2E59] text-white px-5 py-2 rounded-lg font-bold text-xs transition-all flex-shrink-0"
          >Track</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
