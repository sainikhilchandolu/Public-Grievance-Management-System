import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiUserPlus, FiArrowRight, FiShield, FiCheckCircle, FiFileText
} from 'react-icons/fi';

/* ─── Reusable Field (defined outside to prevent focus loss) ─── */
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
        autoComplete={type === 'password' ? 'new-password' : 'off'}
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

/* ─── Left panel feature pill ─── */
const Feature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
      <Icon size={15} className="text-white" />
    </div>
    <span className="text-white/85 text-xs font-semibold">{text}</span>
  </div>
);

/* ─── Step indicator ─── */
const StepDot = ({ n, active, done }) => (
  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all
    ${done ? 'bg-[#16A34A] border-[#16A34A] text-white'
      : active ? 'bg-[#0B2E59] border-[#0B2E59] text-white'
      : 'bg-white border-[#D1D5DB] text-gray-400'}`}>
    {done ? <FiCheckCircle size={13} /> : n}
  </div>
);

/* ════════════════════════════════════════════════════════════ */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', role: 'citizen', password: '', confirmPassword: ''
  });
  const [showPw, setShowPw]     = useState(false);
  const [showCPw, setShowCPw]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!form.name.trim()) {
      e.name = 'Full name is required';
    }
    if (!form.email) {
      e.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email';
    }
    if (!form.password) {
      e.password = 'Password is required';
    } else if (!passwordPattern.test(form.password)) {
      e.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol';
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
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
      await authService.register(form);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
          style={{ minHeight: '620px' }}
        >
          {/* ── LEFT PANEL ── */}
          <div
            className="hidden lg:flex lg:w-[42%] flex-col justify-between p-10 relative overflow-hidden"
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
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                  Citizen Services Portal
                </span>
              </div>
              <h1 className="text-white font-black text-3xl leading-snug mb-3">
                Join PGMS<br />India Today
              </h1>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Create your account to submit complaints, track grievances, and communicate directly with government departments.
              </p>
            </div>

            {/* Registration Steps */}
            <div className="relative z-10 space-y-3">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                Registration Process
              </p>
              {[
                { icon: FiUser,        text: 'Enter personal details' },
                { icon: FiMail,        text: 'Verify email address'   },
                { icon: FiFileText,    text: 'Submit complaints online'},
                { icon: FiCheckCircle, text: 'Track resolution status' },
              ].map((f, i) => (
                <Feature key={i} icon={f.icon} text={f.text} />
              ))}
            </div>

            {/* Bottom badge */}
            <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/10">
                🏛️
              </div>
              <div>
                <p className="text-white font-bold text-sm">PGMS India</p>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">
                  Government of India
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (form) ── */}
          <div className="flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 py-10 overflow-y-auto">
            {/* Mobile branding */}
            <div className="flex items-center gap-2 lg:hidden mb-5">
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-[#0B2E59] font-bold text-sm">Public Grievance Portal</p>
                <p className="text-gray-400 text-xs">Government of India</p>
              </div>
            </div>

            {/* Security badge */}
            <div className="flex items-start gap-3 bg-[#F0F5FA] border border-[#dce7f5] rounded-xl p-4 mb-5">
              <FiShield className="w-5 h-5 text-[#163E72] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#0B2E59]">Secure Citizen Registration</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Your information is encrypted and protected under the Government of India data security guidelines.
                </p>
              </div>
            </div>

            {/* Header */}
            <h2 className="text-3xl font-black text-[#0B2E59] tracking-tight mb-1">Create Account</h2>
            <p className="text-sm text-gray-400 font-medium mb-5">
              Register to access the{' '}
              <span className="text-[#163E72] font-bold">grievance portal</span>
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-0.5">

              {/* Name */}
              <Field
                label="Full Name"
                name="name"
                placeholder="e.g. Rajesh Kumar"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                icon={FiUser}
              />

              {/* Email */}
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                icon={FiMail}
              />

              {/* Role Select */}
              <div className="w-full">
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Register As
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-white border border-[#D1D5DB] rounded-lg text-sm font-medium text-gray-800 outline-none transition-all duration-200 focus:border-[#163E72] focus:ring-2 focus:ring-[#163E72]/10 cursor-pointer"
                >
                  <option value="citizen">Citizen</option>
                  <option value="admin">Admin Officer</option>
                </select>
                <div className="min-h-[18px] mt-1" />
              </div>

              {/* Password */}
              <Field
                label="Password"
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                icon={FiLock}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-gray-400 hover:text-[#163E72] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />

              {/* Confirm Password */}
              <Field
                label="Confirm Password"
                name="confirmPassword"
                type={showCPw ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={FiLock}
                right={
                  <button
                    type="button"
                    onClick={() => setShowCPw(!showCPw)}
                    className="text-gray-400 hover:text-[#163E72] transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showCPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  id="register-submit-btn"
                  disabled={loading}
                  className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0B2E59, #163E72)' }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FiUserPlus size={15} />
                      Create Account <FiArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Link to login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-[#163E72] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer stripe */}
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

export default RegisterPage;
