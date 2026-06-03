import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiShield, FiCheckCircle, FiSearch
} from 'react-icons/fi';

/* ─── Reusable Field (defined outside component to avoid focus loss) ─── */
const Field = ({ label, name, type = 'text', placeholder, value, onChange, error, icon: Icon, right }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative flex items-center">
      {Icon && (
        <span className="absolute left-3.5 text-[#9CA3AF] pointer-events-none">
          <Icon size={16} />
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
        className={`
          w-full h-11 ${Icon ? 'pl-10' : 'pl-4'} ${right ? 'pr-11' : 'pr-4'}
          bg-white border rounded-lg text-sm font-medium text-gray-800
          placeholder-gray-400 outline-none transition-all duration-200
          ${error
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-[#D1D5DB] focus:border-[#163E72] focus:ring-2 focus:ring-[#163E72]/10'}
        `}
      />
      {right && (
        <span className="absolute right-3.5 flex items-center z-10">{right}</span>
      )}
    </div>
    <div className="min-h-[18px] mt-1">
      {error && (
        <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  </div>
);

/* ─── Left panel feature row ─── */
const Feature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
      <Icon size={15} className="text-white" />
    </div>
    <span className="text-white/85 text-xs font-semibold">{text}</span>
  </div>
);

/* ════════════════════════════════════════════════════════════ */
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { user } = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/citizen');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F7FA' }}>
      {/* India Flag stripe top */}
      <div className="flex-shrink-0 flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl"
          style={{ minHeight: '580px' }}
        >
          {/* ── LEFT PANEL ── */}
          <div
            className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #07172c 0%, #0B2E59 55%, #163E72 100%)',
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #578fd4, transparent)' }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #578fd4, transparent)' }} />

            {/* Branding */}
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

            {/* Features */}
            <div className="relative z-10 space-y-3">
              <Feature icon={FiShield} text="Secure Government Authentication" />
              <Feature icon={FiCheckCircle} text="Fast complaint tracking for citizens" />
              <Feature icon={FiSearch} text="Department driven resolution workflow" />
            </div>

            {/* Bottom badge */}
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

          {/* ── RIGHT PANEL (form) ── */}
          <div className="flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 py-10">
            {/* Mobile branding */}
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-[#0B2E59] font-bold text-sm">Public Grievance Portal</p>
                <p className="text-gray-400 text-xs">Government of India</p>
              </div>
            </div>

            {/* Security badge */}
            <div className="flex items-start gap-3 bg-[#F0F5FA] border border-[#dce7f5] rounded-xl p-4 mb-6">
              <FiShield className="w-5 h-5 text-[#163E72] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#0B2E59]">Secure Government Authentication</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Login securely to lodge complaints, track grievance status, receive updates and communicate with departments.
                </p>
              </div>
            </div>

            {/* Header */}
            <h2 className="text-3xl font-black text-[#0B2E59] tracking-tight mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-400 font-medium mb-6">
              Access your{' '}
              <span className="text-[#163E72] font-bold">grievance dashboard</span>
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-1">
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Email Address"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                icon={FiMail}
              />
              <Field
                label="Password"
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                icon={FiLock}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-gray-400 hover:text-[#163E72] transition-colors"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />

              <div className="flex justify-end -mt-1 pb-2">
                <button type="button" className="text-xs text-[#163E72] font-bold hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                disabled={loading}
                className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #0B2E59, #163E72)' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Login <FiArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] font-black text-[#0B2E59] uppercase tracking-widest mb-2">🔑 Demo Accounts</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white rounded-lg p-2 border border-slate-100">
                  <p className="font-bold text-[#0B2E59] text-[11px]">Admin</p>
                  <p className="font-mono text-gray-500 text-[10px]">admin@grievance.gov</p>
                  <p className="font-mono text-gray-500 text-[10px]">admin123</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-slate-100">
                  <p className="font-bold text-[#0B2E59] text-[11px]">Citizen</p>
                  <p className="font-mono text-gray-500 text-[10px]">john@example.com</p>
                  <p className="font-mono text-gray-500 text-[10px]">user123</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#163E72] font-bold hover:underline">
                  Register here
                </Link>
              </p>
              <Link
                to="/track"
                className="text-xs text-gray-400 hover:text-[#163E72] font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <FiSearch size={12} /> Track complaint without signing in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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

export default LoginPage;
