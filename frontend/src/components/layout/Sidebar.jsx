import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nav = user?.role === 'admin' ? [
    { to: '/dashboard/admin',              label: 'Dashboard' },
    { to: '/dashboard/admin/complaints',   label: 'All Complaints' },
    { to: '/dashboard/admin/analytics',    label: 'Analytics' },
    { to: '/track',                        label: 'Track Complaint' },
  ] : [
    { to: '/dashboard/citizen',             label: 'Dashboard' },
    { to: '/dashboard/citizen/complaints',  label: 'My Complaints' },
    { to: '/dashboard/citizen/complaints/new', label: 'File Complaint' },
    { to: '/track',                         label: 'Track Complaint' },
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
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-tight">CPGRAMS Redesign</p>
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-wider">Government of India</p>
          </div>
        </div>


        {/* Navigation Links */}
        <nav className="flex-1 py-4 space-y-1">
          <p className="px-6 pb-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">Navigation</p>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-xs font-bold transition-all text-white/75 hover:bg-white/5 hover:text-white border-l-4 border-transparent ${isActive ? 'bg-[#163E72] text-white border-l-[#FF9933]' : ''}`
              }
              onClick={onClose}
            >
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
            <span>Sign Out of Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
