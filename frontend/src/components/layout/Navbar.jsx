import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ pageTitle, onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
      {/* Government of India Top Banner */}
      <div className="bg-[#0b1320] text-slate-300 text-[10px] sm:text-xs py-1 px-4 flex justify-between items-center font-medium">
        <div className="flex items-center gap-1.5">
          <span>भारत सरकार | GOVERNMENT OF INDIA</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] sm:text-xs">
          <div className="flex gap-2">
            <span className="text-saffron-400 font-bold hover:underline cursor-pointer">English</span>
          </div>
        </div>
      </div>

      {/* Tricolor Accent Bar */}
      <div className="w-full h-1 flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#128807]" />
      </div>

      {/* Main Navbar Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Menu toggle + Logo / Header info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden px-3 py-2 text-slate-600 hover:text-[#0B2E59] hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            Menu
          </button>
          
          <div className="flex items-center gap-3">
            {/* Shield/Emblem icon */}
            <div className="w-10 h-10 bg-slate-50 rounded-lg hidden sm:flex items-center justify-center border border-slate-200 text-[#0B2E59] font-bold text-sm">
              GOI
            </div>
            <div>
              <h1 className="text-[#0B2E59] font-extrabold text-base sm:text-lg tracking-tight leading-tight flex items-center gap-2">
                <span>{pageTitle}</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Public Grievance Portal
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Track action removed from navbar (available in sidebar) */}

          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#0B2E59] flex items-center justify-center text-white text-xs font-black ring-2 ring-blue-500/10">
                {getInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left pr-1">
                <p className="text-xs font-bold text-slate-800 leading-none">{user?.name}</p>
                <p className="text-[10px] font-bold text-[#163E72] uppercase tracking-wide mt-0.5">{user?.role} Officer</p>
              </div>
            </button>

            {dropOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1.5 animate-scale-in">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    {/* Track link intentionally omitted here */}
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out of Portal
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
