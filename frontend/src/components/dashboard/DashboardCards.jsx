/**
 * DashboardCards Component
 * Displays summary stat cards for the admin dashboard with a formal government portal style.
 */
import { FiClipboard, FiClock, FiPlay, FiCheckCircle, FiXCircle, FiUsers } from 'react-icons/fi';

const DashboardCards = ({ stats, loading, activeFilter, onCardClick }) => {
  const cards = [
    {
      id: 'All',
      label: 'Total Complaints',
      value: stats?.total ?? 0,
      colorTheme: 'blue',
      desc: 'All time records',
      icon: FiClipboard,
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: (stats?.byStatus?.Submitted ?? 0) + (stats?.byStatus?.Pending ?? 0),
      colorTheme: 'yellow',
      desc: 'Awaiting review',
      icon: FiClock,
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value:
        (stats?.byStatus?.['In Progress'] ?? 0) +
        (stats?.byStatus?.['Under Review'] ?? 0) +
        (stats?.byStatus?.Assigned ?? 0),
      colorTheme: 'purple',
      desc: 'Being worked on',
      icon: FiPlay,
    },
    {
      id: 'Resolved',
      label: 'Resolved',
      value: stats?.byStatus?.Resolved ?? 0,
      colorTheme: 'green',
      desc: 'Successfully closed',
      icon: FiCheckCircle,
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      value: stats?.byStatus?.Rejected ?? 0,
      colorTheme: 'red',
      desc: 'Not accepted',
      icon: FiXCircle,
    },
    {
      id: 'Citizens',
      label: 'Citizens',
      value: stats?.totalUsers ?? 0,
      colorTheme: 'indigo',
      desc: 'Registered users',
      icon: FiUsers,
      isNonFilterable: true,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  // Helper to generate dynamic tailwind classes based on color theme and active state
  const getThemeClasses = (theme, isActive) => {
    const themes = {
      blue: isActive ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500 shadow-md' : 'hover:border-blue-200 hover:bg-blue-50/50',
      yellow: isActive ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-500 shadow-md' : 'hover:border-amber-200 hover:bg-amber-50/50',
      purple: isActive ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-500 shadow-md' : 'hover:border-purple-200 hover:bg-purple-50/50',
      green: isActive ? 'bg-green-50 border-green-200 ring-1 ring-green-500 shadow-md' : 'hover:border-green-200 hover:bg-green-50/50',
      red: isActive ? 'bg-red-50 border-red-200 ring-1 ring-red-500 shadow-md' : 'hover:border-red-200 hover:bg-red-50/50',
      indigo: 'hover:border-indigo-200 hover:bg-indigo-50/50 cursor-default', // non-interactive
    };
    return themes[theme] || '';
  };

  const getIconClasses = (theme, isActive) => {
    const themes = {
      blue: isActive ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' : 'bg-blue-100 text-blue-600',
      yellow: isActive ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' : 'bg-amber-100 text-amber-600',
      purple: isActive ? 'bg-purple-50 text-purple-600 ring-1 ring-purple-200' : 'bg-purple-100 text-purple-600',
      green: isActive ? 'bg-green-50 text-emerald-600 ring-1 ring-green-200' : 'bg-green-100 text-emerald-600',
      red: isActive ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-red-100 text-red-600',
      indigo: isActive ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : 'bg-indigo-100 text-indigo-600',
    };
    return themes[theme] || '';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
      {cards.map((card) => {
        const isActive = activeFilter === card.id;
        const isClickable = !card.isNonFilterable;
        return (
          <div
            key={card.label}
            onClick={() => isClickable && onCardClick(card.id)}
            className={`
              relative bg-white rounded-2xl border border-slate-200 p-5
              transition-all duration-300 group
              ${isClickable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''}
              ${getThemeClasses(card.colorTheme, isActive)}
            `}
          >
              <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">{card.label}</p>
            </div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-3xl font-black text-slate-900">{card.value}</p>
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-full shadow-sm border border-slate-100 ${getIconClasses(card.colorTheme, isActive)}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-tight">{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
