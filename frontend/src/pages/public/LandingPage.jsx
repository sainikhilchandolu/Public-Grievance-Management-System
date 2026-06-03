import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPhone, FiMail, FiCheckCircle, FiClock, FiFileText, FiShield, FiSliders, FiUsers, FiTrendingUp } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] font-sans text-[#1F2937]">
      {/* 1. Government Top Stripe & Header */}
      <div className="bg-[#0B2E59] text-slate-300 text-[10px] sm:text-xs py-1.5 px-4 flex justify-between items-center font-medium border-b border-white/5 select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🇮🇳</span>
          <span>भारत सरकार | GOVERNMENT OF INDIA</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-slate-300 font-semibold">{currentDate}</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <div className="flex gap-2.5">
            <span className="text-white font-bold hover:underline cursor-pointer">English</span>
            <span className="hover:text-white cursor-pointer transition-colors">हिन्दी</span>
          </div>
        </div>
      </div>

      {/* Tricolor Accent Stripe */}
      <div className="w-full h-1 flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#128807]" />
      </div>

      {/* Top Banner Branding Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shadow-inner select-none">
              🏛️
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0B2E59] tracking-tight leading-none flex flex-col sm:flex-row sm:items-center gap-1">
                <span>CPGRAMS PORTAL</span>
                <span className="text-xs font-bold bg-blue-150 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200 w-max sm:inline-block">OFFICIAL</span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                Centralized Public Grievance Redress and Monitoring System • लोक शिकायत मंच
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <FiPhone className="text-[#163E72] text-base" />
              <div>
                <p className="text-[10px] text-slate-400 leading-none">HELPDESK TOLL FREE</p>
                <p className="text-slate-800 font-bold">1800-11-0707</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="text-[#163E72] text-base" />
              <div>
                <p className="text-[10px] text-slate-400 leading-none">SUPPORT EMAIL</p>
                <p className="text-slate-800 font-bold">pgportal@nic.in</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-br from-[#0B2E59] via-[#0D2440] to-[#163E72] text-white relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-b-4 border-[#163E72]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold tracking-wide text-blue-200">
              🇮🇳 Digital India Initiative
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Direct Channel for Public Grievance Redressal
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              An online platform for citizens of India to lodge grievances with Central Ministries, State Governments, and Departments. Submit issues, track real-time resolution progress, and access public assistance services.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/dashboard/citizen/complaints/new" className="bg-[#163E72] hover:bg-[#0B2E59] text-white px-6 py-3 rounded-xl font-bold transition-all border border-[#2b67ad] shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm">
                ✍️ Lodge a Grievance
              </Link>
              <Link to="/track" className="bg-white/15 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm">
                🔍 Track Grievance Status
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <span>🏛️</span> Entry Portal • प्रवेश द्वार
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 hover:bg-white/15 p-5 rounded-2xl border border-white/5 transition-all text-center">
                <div className="text-3xl mb-2">👤</div>
                <h4 className="font-bold text-sm text-white">Citizen Corner</h4>
                <p className="text-[10px] text-slate-300 mt-1">Submit & view your personal complaints</p>
                <button onClick={() => navigate('/login')} className="w-full bg-[#163E72] hover:bg-[#0b2e59] border border-blue-500 text-white font-bold text-xs py-2 rounded-lg mt-4 transition-colors">
                  Citizen Access
                </button>
              </div>
              <div className="bg-white/10 hover:bg-white/15 p-5 rounded-2xl border border-white/5 transition-all text-center">
                <div className="text-3xl mb-2">👮</div>
                <h4 className="font-bold text-sm text-white">Officer Corner</h4>
                <p className="text-[10px] text-slate-300 mt-1">Access administration & review panel</p>
                <button onClick={() => navigate('/login')} className="w-full bg-[#0B2E59] hover:bg-[#072347] border border-blue-700 text-white font-bold text-xs py-2 rounded-lg mt-4 transition-colors">
                  Officer Access
                </button>
              </div>
            </div>
            <div className="text-center pt-2">
              <p className="text-xs text-slate-300 font-semibold">
                New user? <Link to="/register" className="text-blue-300 hover:underline">Register on the portal</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="py-12 bg-white px-4 sm:px-6 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-[#0B2E59]">Portal Resolution Metrics</h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">Real-time redressal outcomes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="bg-[#f8fafc] border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <FiFileText className="text-[#0B2E59] text-2xl mx-auto mb-3" />
              <p className="text-2xl font-black text-slate-800">4,87,321</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Grievances Filed</p>
            </div>
            <div className="bg-[#f0fdf4] border border-green-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <FiCheckCircle className="text-green-600 text-2xl mx-auto mb-3" />
              <p className="text-2xl font-black text-green-700">4,62,190</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Resolved Successfully</p>
            </div>
            <div className="bg-[#fffbeb] border border-amber-250 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <FiClock className="text-amber-600 text-2xl mx-auto mb-3" />
              <p className="text-2xl font-black text-amber-700">25,131</p>
              <p className="text-xs text-amber-600 font-semibold mt-1">Under Redressal</p>
            </div>
            <div className="bg-[#eff6ff] border border-blue-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <FiShield className="text-blue-600 text-2xl mx-auto mb-3" />
              <p className="text-2xl font-black text-blue-700">18</p>
              <p className="text-xs text-blue-500 font-semibold mt-1">Covered Departments</p>
            </div>
            <div className="bg-[#faf5ff] border border-purple-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all col-span-2 md:col-span-1">
              <FiUsers className="text-purple-600 text-2xl mx-auto mb-3" />
              <p className="text-2xl font-black text-purple-700">1.2 Lakh+</p>
              <p className="text-xs text-purple-500 font-semibold mt-1">Active Citizens</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <section className="py-16 px-4 sm:px-6 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-[#0B2E59]">Core Services Offered</h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">Citizen tools & utilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#163E72] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl mb-4 border border-blue-100">
                  📝
                </div>
                <h4 className="text-lg font-bold text-slate-800">Lodge Complaint</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  File complaints related to public utilities including water, sanitation, road maintenance, and electricity grid outages.
                </p>
              </div>
              <Link to="/login" className="text-xs font-bold text-[#163E72] hover:text-[#0B2E59] flex items-center gap-1 mt-6">
                Access Form →
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#163E72] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl mb-4 border border-blue-100">
                  🔎
                </div>
                <h4 className="text-lg font-bold text-slate-800">Track Complaint</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Verify complaint processing using your unique `GRV-YYYYMMDD-XXXX` ID. Instant lookup is fully accessible without logins.
                </p>
              </div>
              <Link to="/track" className="text-xs font-bold text-[#163E72] hover:text-[#0B2E59] flex items-center gap-1 mt-6">
                Track Status →
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#163E72] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl mb-4 border border-blue-100">
                  📊
                </div>
                <h4 className="text-lg font-bold text-slate-800">Citizen Dashboard</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Register to view interactive statistics grids, track history records, and manage profiles directly.
                </p>
              </div>
              <Link to="/login" className="text-xs font-bold text-[#163E72] hover:text-[#0B2E59] flex items-center gap-1 mt-6">
                Open Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="py-16 bg-[#eef5fc] px-4 sm:px-6 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-black text-[#0B2E59] leading-tight">
              Pillars of Citizen-Centric Governance
            </h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest leading-relaxed">
              Enabling modern accountability inside public administration
            </p>
            <div className="h-1.5 w-16 bg-[#0B2E59] rounded-full" />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <FiShield className="text-[#0B2E59] text-xl mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Transparency</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Complete visual history tracks active officer assignments & responses.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <FiCheckCircle className="text-[#0B2E59] text-xl mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Accountability</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">System logs track administrative approvals, remarks, and action updates.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <FiClock className="text-[#0B2E59] text-xl mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Fast Resolution</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Urgent/High priority filters highlight outstanding items for quick review.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <FiSliders className="text-[#0B2E59] text-xl mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Citizen-Centric</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Clean workflows verify records are accessible anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#0b1320] text-slate-400 py-12 px-4 sm:px-6 md:px-8 mt-auto border-t-4 border-[#163E72]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-4">
            <h5 className="font-bold text-white uppercase text-sm tracking-wider">CPGRAMS Redesign</h5>
            <p className="leading-relaxed">
              Designed as a professional digital portal for administrative oversight, public service accountability, and grievance redressal tracking.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase text-sm tracking-wider mb-4">Contact Info</h5>
            <p className="leading-relaxed">
              Department of Administrative Reforms and Public Grievances (DARPG)<br />
              Sardar Patel Bhawan, Sansad Marg,<br />
              New Delhi - 110001
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase text-sm tracking-wider mb-4">Helpdesk Assistance</h5>
            <p className="leading-relaxed">
              National Helpline: 1800-11-0707<br />
              Technical Support: cgsupport@nic.in<br />
              Service Hours: 9:00 AM - 5:30 PM (Mon-Fri)
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase text-sm tracking-wider mb-4">Legal Details</h5>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center text-[10px] sm:text-xs">
          <p>© 2026 Centralized Public Grievance Redressal Portal · Government of India · NIC Grievance Redressal Division</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
