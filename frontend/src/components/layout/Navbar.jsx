import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiShield } from 'react-icons/fi';

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
          <span className="text-xs">🇮🇳</span>
          <span>भारत सरकार | GOVERNMENT OF INDIA</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] sm:text-xs">
          <span className="hover:text-white cursor-pointer transition-colors hidden md:inline">मुख्य सामग्री पर जाएं | Skip to main content</span>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="flex gap-2">
            <span className="text-saffron-400 font-bold hover:underline cursor-pointer">English</span>
            <span className="hover:text-white cursor-pointer">हिन्दी</span>
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
            className="lg:hidden p-2 text-slate-600 hover:text-[#0B2E59] hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Shield/Emblem icon */}
            <div className="w-10 h-10 bg-slate-50 rounded-lg hidden sm:flex items-center justify-center border border-slate-200 text-[#0B2E59]">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[#0B2E59] font-extrabold text-base sm:text-lg tracking-tight leading-tight flex items-center gap-2">
                <span>{pageTitle}</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Public Grievance Portal • लोक शिकायत मंच
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/track"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0B2E59] bg-slate-50 border border-slate-200 hover:bg-white rounded-lg transition-all"
          >
            <FiSearch className="w-3.5 h-3.5" /> Track Grievance
          </Link>

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
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
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
                    <Link
                      to="/track"
                      className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      onClick={() => setDropOpen(false)}
                    >
                      <FiSearch className="w-3.5 h-3.5" /> Track Grievance
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                    >
                      🚪 Sign Out of Portal
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
