import { useNavigate } from 'react-router-dom';
import StatusBadge from '../complaints/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { PRIORITY_COLORS } from '../../utils/constants';
import { HiEye } from 'react-icons/hi';
import { TableRowSkeleton } from '../ui/SkeletonLoader';
import EmptyState from '../ui/EmptyState';

/**
 * ComplaintTable Component
 * Admin table view of all complaints with actions. Updated for better UI.
 */
const ComplaintTable = ({ complaints = [], loading, role = 'admin', minimal = false }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    const path = role === 'admin'
      ? `/dashboard/admin/complaints/${id}`
      : `/dashboard/citizen/complaints/${id}`;
    navigate(path);
  };

  return (
    <div className="w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Complaint Details</th>
            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            {!minimal && <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>}
            {role === 'admin' && !minimal && <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Citizen</th>}
            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
          ) : complaints.length === 0 ? (
            <tr>
              <td colSpan={role === 'admin' && !minimal ? 6 : 4} className="py-12">
                <EmptyState
                  icon="📭"
                  title="No complaints found"
                  description="Try adjusting your search or filter criteria."
                />
              </td>
            </tr>
          ) : (
            complaints.map((complaint, index) => {
              const priority = PRIORITY_COLORS[complaint.priority] || PRIORITY_COLORS.Medium;
              return (
                <tr
                  key={complaint._id}
                  className="hover:bg-blue-50/30 transition-colors duration-200 group cursor-pointer"
                  onClick={() => handleView(complaint._id)}
                >
                  <td className="py-4 px-6 text-sm text-gray-400 font-semibold">{index + 1}</td>
                  
                  <td className="py-4 px-6 max-w-[280px]">
                    <p className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{complaint.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {complaint.trackingId && (
                        <span className="text-xs font-mono font-bold text-navy-700 bg-navy-50 border border-navy-200 px-1.5 py-0.5 rounded-md">
                          {complaint.trackingId}
                        </span>
                      )}
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {complaint.department}
                      </span>
                      <span className="text-xs text-gray-400 truncate">{complaint.location}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <StatusBadge status={complaint.status} />
                  </td>

                  {!minimal && (
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg ${priority.bg} ${priority.text}`}>
                        {complaint.priority}
                      </span>
                    </td>
                  )}

                  {role === 'admin' && !minimal && (
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-800">{complaint.createdBy?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{formatDate(complaint.createdAt)}</p>
                    </td>
                  )}
                  
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleView(complaint._id); }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 active:scale-95 transition-all shadow-sm group-hover:shadow"
                    >
                      <HiEye size={16} />
                      <span className="hidden sm:inline">View</span>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
