import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      toast.success('If this email is registered, password reset instructions have been sent.');
      setEmail('');
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F7FA' }}>
      <div className="flex-shrink-0 flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '580px' }}>
          <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #07172c 0%, #0B2E59 55%, #163E72 100%)' }}>
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #578fd4, transparent)' }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #578fd4, transparent)' }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Citizen Services Portal</span>
              </div>
              <h1 className="text-white font-black text-3xl leading-snug mb-3">
                Public Grievance<br />Management System
              </h1>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                A reliable government portal for grievance submission, tracking, and resolution with complete transparency.
              </p>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FiMail size={15} className="text-white" />
                </div>
                <span className="text-white/85 text-xs font-semibold">Enter your registered email</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✔</span>
                </div>
                <span className="text-white/85 text-xs font-semibold">Receive reset instructions instantly</span>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/10">
                🏛️
              </div>
              <div>
                <p className="text-white font-bold text-sm">PGMS India</p>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Government of India</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 py-10">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-[#0B2E59] font-bold text-sm">Public Grievance Portal</p>
                <p className="text-gray-400 text-xs">Government of India</p>
              </div>
            </div>

            <div className="bg-[#F0F5FA] border border-[#dce7f5] rounded-xl p-4 mb-6">
              <p className="text-xs font-bold text-[#0B2E59]">Password Help</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Enter the email address associated with your account and we will send you instructions to reset your password.
              </p>
            </div>

            <h2 className="text-3xl font-black text-[#0B2E59] tracking-tight mb-1">Forgot Password</h2>
            <p className="text-sm text-gray-400 font-medium mb-6">
              Enter your registered email to recover your access.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#9CA3AF]">
                  <FiMail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  className={`w-full h-11 pl-10 pr-4 bg-white border rounded-lg text-sm font-medium text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 ${
                    error
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-[#D1D5DB] focus:border-[#163E72] focus:ring-2 focus:ring-[#163E72]/10'
                  }`}
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl text-sm font-bold text-white bg-[#163E72] hover:bg-[#0B2E59] transition-all disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Send reset email'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Remembered your password?{' '}
                <Link to="/login" className="text-[#163E72] font-bold hover:underline">
                  Return to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <footer className="bg-white border-t border-gray-200 text-center py-3 text-[11px] text-gray-400 font-semibold">
        © 2026 Public Grievance Management System · Government of India · All Rights Reserved
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
