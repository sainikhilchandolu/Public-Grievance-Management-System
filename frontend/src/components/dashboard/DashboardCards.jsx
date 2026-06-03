import { HiClipboardList, HiClock, HiRefresh, HiCheckCircle, HiXCircle, HiUsers } from 'react-icons/hi';

/**
 * DashboardCards Component
 * Displays summary stat cards for the admin dashboard. Now fully interactive!
 */
const DashboardCards = ({ stats, loading, activeFilter, onCardClick }) => {
  const cards = [
    {
      id: 'All',
      label: 'Total Complaints',
      value: stats?.total ?? 0,
      icon: <HiClipboardList size={26} />,
      colorTheme: 'blue',
      desc: 'All time records',
    },
    {
      id: 'Pending',
      label: 'Pending',
      // New complaints use 'Submitted'; sum both for complete count
      value: (stats?.byStatus?.Submitted ?? 0) + (stats?.byStatus?.Pending ?? 0),
      icon: <HiClock size={26} />,
      colorTheme: 'yellow',
      desc: 'Awaiting review',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      // Combines Under Review + Assigned + In Progress for a meaningful aggregate
      value: (stats?.byStatus?.['In Progress'] ?? 0)
            + (stats?.byStatus?.['Under Review'] ?? 0)
            + (stats?.byStatus?.Assigned ?? 0),
      icon: <HiRefresh size={26} />,
      colorTheme: 'purple',
      desc: 'Being worked on',
    },
    {
      id: 'Resolved',
      label: 'Resolved',
      value: stats?.byStatus?.Resolved ?? 0,
      icon: <HiCheckCircle size={26} />,
      colorTheme: 'green',
      desc: 'Successfully closed',
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      value: stats?.byStatus?.Rejected ?? 0,
      icon: <HiXCircle size={26} />,
      colorTheme: 'red',
      desc: 'Not accepted',
    },
    {
      id: 'Citizens',
      label: 'Citizens',
      value: stats?.totalUsers ?? 0,
      icon: <HiUsers size={26} />,
      colorTheme: 'indigo',
      desc: 'Registered users',
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
      blue: isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      yellow: isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200',
      purple: isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      green: isActive ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-green-100 text-green-600 group-hover:bg-green-200',
      red: isActive ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-red-100 text-red-600 group-hover:bg-red-200',
      indigo: 'bg-indigo-100 text-indigo-600',
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
              relative bg-white rounded-xl border border-slate-200 p-5 
              transition-all duration-300 group
              ${isClickable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}
              ${getThemeClasses(card.colorTheme, isActive)}
            `}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${getIconClasses(card.colorTheme, isActive)}`}>
              {card.icon}
            </div>
            <p className="text-3xl font-black text-gray-800 mb-1">{card.value}</p>
            <p className="text-sm font-bold text-gray-700 leading-tight mb-1">{card.label}</p>
            <p className="text-xs text-gray-400">{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
