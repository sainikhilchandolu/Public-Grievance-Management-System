import { useState, useEffect } from 'react';
import { getStats } from '../../services/complaintService';
import AdminLayout from '../../layouts/AdminLayout';
import Charts from '../../components/dashboard/Charts';
import toast from 'react-hot-toast';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiDownload, FiRefreshCw, FiCheckCircle, FiClock, FiXCircle, FiFileText } from 'react-icons/fi';

const MetricCard = ({ label, value, sub, icon, color }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
    <div className={`p-2.5 rounded-lg border ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-2xl font-black text-[#0B2E59] mt-0.5">{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await getStats();
      setStats(res.data.stats);
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  // Derived metrics
  const total = stats?.total ?? 0;
  const resolved = stats?.byStatus?.Resolved ?? 0;
  const rejected = stats?.byStatus?.Rejected ?? 0;
  const pending = (stats?.byStatus?.Submitted ?? 0) + (stats?.byStatus?.Pending ?? 0);
  const inProgress = (stats?.byStatus?.['In Progress'] ?? 0) + (stats?.byStatus?.['Under Review'] ?? 0) + (stats?.byStatus?.Assigned ?? 0);
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0.0';
  const pendingRate = total > 0 ? ((pending / total) * 100).toFixed(1) : '0.0';

  return (
    <AdminLayout pageTitle="Analytics & Reports">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#0B2E59] flex items-center gap-2">
            <FiBarChart2 className="w-5 h-5 text-[#163E72]" />
            Analytics & Reporting Dashboard
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Complaint performance metrics, trends, and department-wise analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0B2E59] bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-all"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#163E72] hover:bg-[#0B2E59] rounded-lg transition-all border border-[#2b67ad]">
            <FiDownload className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Resolution Rate"
            value={`${resolutionRate}%`}
            sub={`${resolved} of ${total} resolved`}
            icon={<FiCheckCircle className="w-5 h-5 text-green-600" />}
            color="bg-green-50 border-green-100"
          />
          <MetricCard
            label="Pending Rate"
            value={`${pendingRate}%`}
            sub={`${pending} awaiting action`}
            icon={<FiClock className="w-5 h-5 text-amber-600" />}
            color="bg-amber-50 border-amber-100"
          />
          <MetricCard
            label="Rejection Rate"
            value={total > 0 ? `${((rejected / total) * 100).toFixed(1)}%` : '0.0%'}
            sub={`${rejected} rejected`}
            icon={<FiXCircle className="w-5 h-5 text-red-500" />}
            color="bg-red-50 border-red-100"
          />
          <MetricCard
            label="Complaints Today"
            value={stats?.todayCount ?? 0}
            sub="New registrations today"
            icon={<FiFileText className="w-5 h-5 text-[#163E72]" />}
            color="bg-blue-50 border-blue-100"
          />
        </div>
      )}

      {/* Status Distribution & Department Charts */}
      {!loading && stats && (
        <>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <FiPieChart className="w-4 h-4 text-[#163E72]" />
              <h3 className="text-xs font-bold text-[#0B2E59] uppercase tracking-wider">
                Complaint Distribution by Status & Department
              </h3>
            </div>
            <div className="p-6">
              <Charts stats={stats} />
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-[#163E72]" />
              <h3 className="text-xs font-bold text-[#0B2E59] uppercase tracking-wider">
                Department-wise Complaint Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-[#0B2E59] uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-[#0B2E59] uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-[#0B2E59] uppercase tracking-wider">Share %</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-[#0B2E59] uppercase tracking-wider">Progress Bar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {(stats.byDepartment || []).filter(d => d.value > 0).map((dept, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-semibold text-slate-800">{dept.name}</td>
                      <td className="px-6 py-3 font-black text-[#0B2E59]">{dept.value}</td>
                      <td className="px-6 py-3 text-slate-600 font-semibold">
                        {total > 0 ? `${((dept.value / total) * 100).toFixed(1)}%` : '0%'}
                      </td>
                      <td className="px-6 py-3 w-48">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#163E72] rounded-full"
                            style={{ width: total > 0 ? `${(dept.value / total) * 100}%` : '0%' }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(stats.byDepartment || []).filter(d => d.value > 0).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-xs">No department data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4 text-[#163E72]" />
              <h3 className="text-xs font-bold text-[#0B2E59] uppercase tracking-wider">
                Status-wise Performance Metrics
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-[#0B2E59] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-[#0B2E59] uppercase tracking-wider">Count</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-[#0B2E59] uppercase tracking-wider">% of Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {stats.byStatus && Object.entries(stats.byStatus).map(([status, count]) => (
                    <tr key={status} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-semibold text-slate-800">{status}</td>
                      <td className="px-6 py-3 font-black text-[#0B2E59]">{count}</td>
                      <td className="px-6 py-3 text-slate-600 font-semibold">
                        {total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm">
          <span className="spinner spinner-navy w-6 h-6 inline-block" />
          <p className="text-xs text-slate-400 mt-2">Loading analytics data...</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
