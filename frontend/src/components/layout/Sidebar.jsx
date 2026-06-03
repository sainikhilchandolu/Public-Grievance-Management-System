import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import { FiHome, FiFileText, FiEdit3, FiSearch, FiTrendingUp, FiBarChart2, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nav = user?.role === 'admin' ? [
    { to: '/dashboard/admin',              label: 'Dashboard',       icon: <FiTrendingUp className="w-4 h-4" /> },
    { to: '/dashboard/admin/complaints',   label: 'All Complaints',  icon: <FiFileText className="w-4 h-4" /> },
    { to: '/dashboard/admin/analytics',    label: 'Analytics',       icon: <FiBarChart2 className="w-4 h-4" /> },
    { to: '/track',                        label: 'Track Complaint', icon: <FiSearch className="w-4 h-4" /> },
  ] : [
    { to: '/dashboard/citizen',             label: 'Dashboard',       icon: <FiHome className="w-4 h-4" /> },
    { to: '/dashboard/citizen/complaints',  label: 'My Complaints',   icon: <FiFileText className="w-4 h-4" /> },
    { to: '/dashboard/citizen/complaints/new', label: 'File Complaint', icon: <FiEdit3 className="w-4 h-4" /> },
    { to: '/track',                         label: 'Track Complaint', icon: <FiSearch className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className="gov-sidebar fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-300 bg-[#0B2E59] border-r border-[#163E72]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0"
      >
        {/* Logo / Portal Name */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 select-none">
            <span className="text-white text-base font-bold">🏛️</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-tight">CPGRAMS Redesign</p>
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-wider">Government of India</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#163E72] border border-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate leading-none">{user?.name}</p>
              <p className="text-blue-200 text-[10px] uppercase font-semibold mt-1">{user?.role} Officer</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 space-y-1">
          <p className="px-6 pb-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">Navigation</p>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split('/').length <= 3}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-xs font-bold transition-all text-white/75 hover:bg-white/5 hover:text-white border-l-4 border-transparent ${isActive ? 'bg-[#163E72] text-white border-l-[#FF9933]' : ''}`
              }
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-6 py-2.5 rounded-lg text-xs font-bold text-red-200 hover:text-white hover:bg-red-900/25 transition-all"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out of Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
