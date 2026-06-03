import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDate, truncate } from '../../utils/formatters';
import { PRIORITY_COLORS } from '../../utils/constants';
import { HiLocationMarker, HiTrash, HiEye } from 'react-icons/hi';

/**
 * ComplaintCard Component
 * Modern card view for citizen's complaint list
 */
const ComplaintCard = ({ complaint, onDelete, role = 'citizen' }) => {
  const navigate = useNavigate();
  const priority = PRIORITY_COLORS[complaint.priority] || PRIORITY_COLORS.Medium;
  const basePath = role === 'admin' ? '/dashboard/admin' : '/dashboard/citizen';

  const handleView = () => navigate(`${basePath}/complaints/${complaint._id}`);

  const canDelete = role === 'citizen' && complaint.status === 'Pending';

  return (
    <div 
      onClick={handleView}
      className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 animate-slide-up group cursor-pointer flex flex-col"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
            {complaint.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-sm">
            <HiLocationMarker size={16} className="text-blue-500" />
            <span className="truncate">{complaint.location}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
        {truncate(complaint.description, 130)}
      </p>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl border border-gray-100">
          {complaint.department}
        </span>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${priority.bg} ${priority.text}`}>
          {complaint.priority} Priority
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs font-semibold text-gray-400">
          {formatDate(complaint.createdAt)}
        </span>
        <div className="flex items-center gap-3">
          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(complaint._id); }}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
            >
              <HiTrash size={16} />
              Delete
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleView(); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm group-hover:shadow"
          >
            <HiEye size={16} />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
