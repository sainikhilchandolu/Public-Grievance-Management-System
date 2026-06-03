import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, getComplaints } from '../../services/complaintService';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardCards from '../../components/dashboard/DashboardCards';
import ComplaintTable from '../../components/dashboard/ComplaintTable';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import {
  HiArrowRight, HiOutlineFilter, HiOutlineDocumentAdd,
  HiOutlineClipboardList, HiOutlineChartBar
} from 'react-icons/hi';

const QuickAction = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#0B2E59] border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#163E72] rounded-xl transition-all shadow-sm"
  >
    {icon}
    {label}
  </button>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [tableLoading, setTableLoading] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        getStats(),
        getComplaints({ limit: 8, sort: 'latest' })
      ]);
      setStats(statsRes.data.stats);
      setRecentComplaints(complaintsRes.data.complaints);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredComplaints = async () => {
    setTableLoading(true);
    try {
      const params = { limit: 8, sort: 'latest' };
      if (activeFilter !== 'All') {
        params.status = activeFilter === 'Pending' ? 'Submitted' : activeFilter;
      }
      const res = await getComplaints(params);
      setRecentComplaints(res.data.complaints);
    } catch {
      toast.error('Failed to update table data');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    if (stats) fetchFilteredComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  return (
    <AdminLayout pageTitle="Admin Dashboard">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#0B2E59]">System Overview</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Monitor incoming grievances, track their progress, and take quick actions.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Complaints Today</p>
          <p className="text-xl font-black text-[#0B2E59] mt-0.5">
            {loading ? '—' : stats?.todayCount ?? 0}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6">
        <DashboardCards
          stats={stats}
          loading={loading}
          activeFilter={activeFilter}
          onCardClick={setActiveFilter}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <h3 className="text-xs font-bold text-[#0B2E59] uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <QuickAction
            icon={<HiOutlineClipboardList className="w-4 h-4" />}
            label="View All Complaints"
            onClick={() => navigate('/dashboard/admin/complaints')}
          />
          <QuickAction
            icon={<HiOutlineChartBar className="w-4 h-4" />}
            label="Open Analytics"
            onClick={() => navigate('/dashboard/admin/analytics')}
          />
          <QuickAction
            icon={<HiOutlineDocumentAdd className="w-4 h-4" />}
            label="Manage Users"
            onClick={() => navigate('/dashboard/admin/users')}
          />
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HiOutlineFilter className="w-4 h-4 text-[#163E72]" />
            <h3 className="text-sm font-bold text-[#0B2E59]">
              {activeFilter === 'All' ? 'Recent Complaints' : `${activeFilter} Complaints`}
            </h3>
          </div>
          <button
            onClick={() =>
              navigate('/dashboard/admin/complaints', {
                state: { filterStatus: activeFilter === 'All' ? '' : activeFilter }
              })
            }
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            View All <HiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative min-h-[260px]">
          {recentComplaints.length === 0 && !tableLoading && !loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <EmptyState
                icon="📋"
                title="No records found"
                description={`No complaints matching "${activeFilter}" status.`}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ComplaintTable
                complaints={recentComplaints}
                loading={loading || tableLoading}
                role="admin"
                minimal={true}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
