import { formatRelativeTime } from '../../utils/formatters';

/**
 * ActivityTimeline Component
 * Displays a vertical timeline of all activity log entries for a complaint
 */
const ActivityTimeline = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-4xl mb-2">📋</div>
        <p className="text-sm">No activity recorded yet.</p>
      </div>
    );
  }

  // Get icon for activity type
  const getActivityIcon = (action) => {
    if (action.toLowerCase().includes('submitted')) return { icon: '📝', bg: 'bg-blue-100', text: 'text-blue-600' };
    if (action.toLowerCase().includes('resolved')) return { icon: '✅', bg: 'bg-green-100', text: 'text-green-600' };
    if (action.toLowerCase().includes('rejected')) return { icon: '❌', bg: 'bg-red-100', text: 'text-red-600' };
    if (action.toLowerCase().includes('progress')) return { icon: '⚙️', bg: 'bg-purple-100', text: 'text-purple-600' };
    if (action.toLowerCase().includes('review')) return { icon: '🔍', bg: 'bg-indigo-100', text: 'text-indigo-600' };
    if (action.toLowerCase().includes('updated')) return { icon: '✏️', bg: 'bg-yellow-100', text: 'text-yellow-600' };
    return { icon: '📌', bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  return (
    <div className="space-y-0">
      {[...activities].reverse().map((activity, index) => {
        const { icon, bg, text } = getActivityIcon(activity.action);
        const isLast = index === activities.length - 1;

        return (
          <div key={index} className="flex gap-4 relative">
            {/* Vertical Line */}
            {!isLast && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-100 z-0"></div>
            )}

            {/* Icon */}
            <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${bg} flex items-center justify-center text-lg mt-1`}>
              {icon}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-gray-800 text-sm">{activity.action}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  By <span className="font-medium text-gray-700">{activity.performedByName}</span>
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${bg} ${text}`}>
                    {activity.performedByRole}
                  </span>
                </p>
                {activity.note && (
                  <p className="text-sm text-gray-600 leading-relaxed">{activity.note}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
