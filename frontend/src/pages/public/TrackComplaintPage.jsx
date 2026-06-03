import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useSearchParams } from 'react-router-dom';
import { trackComplaint } from '../../services/complaintService';
import StatusBadge from '../../components/complaints/StatusBadge';
import StatusTimeline from '../../components/complaints/StatusTimeline';
import { formatDateTime, formatDate } from '../../utils/formatters';
import { API_BASE } from '../../utils/constants';

// Validate Tracking ID format: GRV-YYYYMMDD-XXXX and calendar correctness
const validateTrackingId = (id) => {
  const regex = /^GRV-(\d{4})(\d{2})(\d{2})-\d{4}$/;
  const match = id.match(regex);
  if (!match) {
    return 'Invalid Tracking ID format. It must follow the pattern GRV-YYYYMMDD-XXXX (e.g., GRV-20260530-0001).';
  }
  const [_, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    return 'Invalid Tracking ID: Month must be between 01 and 12.';
  }
  if (day < 1 || day > 31) {
    return 'Invalid Tracking ID: Day must be between 01 and 31.';
  }

  // Check if calendar date is valid (e.g., Feb 30th)
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return 'Invalid Tracking ID: Date component does not exist in the calendar.';
  }
  return null;
};

const TrackComplaintPage = () => {
  const navigate = useNavigate();
  const { trackingId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  const activeId = trackingId || queryId;

  const [query, setQuery]       = useState(activeId || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Read auth state directly from localStorage so this page works
  // without depending on an async context load completing first.
  // This also ensures state persists correctly after page refresh.
  const token = localStorage.getItem('token');
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();
  const isAuthenticated = !!(token && storedUser);
  const userRole = storedUser?.role || null;

  // Derive role-based dashboard path
  const dashboardPath =
    userRole === 'admin'   ? '/dashboard/admin'   :
    userRole === 'officer' ? '/dashboard/officer' :
    '/dashboard/citizen';

  const fetchComplaint = async (id) => {
    setLoading(true);
    setError('');
    setComplaint(null);
    try {
      const res = await trackComplaint(id);
      setComplaint(res.data.complaint);
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found. Please check the Tracking ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run on mount or when URL params change
  useEffect(() => {
    if (activeId) {
      const upperId = activeId.trim().toUpperCase();
      setQuery(upperId);
      const validationError = validateTrackingId(upperId);
      if (validationError) {
        setError(validationError);
        setComplaint(null);
      } else {
        fetchComplaint(upperId);
      }
    }
  }, [activeId]);

  const handleSearch = (e) => {
    e.preventDefault();
    const id = query.trim().toUpperCase();
    if (!id) return;

    const validationError = validateTrackingId(id);
    if (validationError) {
      setError(validationError);
      setComplaint(null);
      return;
    }

    // Navigate to path parameter route to trigger useEffect and allow refresh mapping
    navigate(`/track/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      {/* Gov Header */}
      <div className="saffron-bar h-1.5 w-full" />
      <header className="gov-header py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: logo + title */}
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏛️</span>
            <div>
              <h1 className="text-white font-bold text-base sm:text-lg leading-tight">Public Grievance Management System</h1>
              <p className="text-navy-200 text-xs hidden sm:block">Government of India · Citizen Services Portal</p>
            </div>
          </div>

          {/* Right: auth-aware nav */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            {isAuthenticated ? (
              <>
                {/* Back to Dashboard button */}
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
                >
                  ← Dashboard
                </button>
                {/* My Complaints — only for citizen role */}
                {userRole === 'citizen' && (
                  <Link
                    to="/dashboard/citizen/complaints"
                    className="text-white/70 hover:text-white transition-colors hidden sm:inline"
                  >
                    My Complaints
                  </Link>
                )}
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="btn-saffron text-xs px-3 py-1.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/70 hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="btn-saffron text-xs px-3 py-1.5">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Search box */}
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-800 mb-2">Track Your Complaint</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Enter your Tracking ID to get real-time status updates on your grievance.
          </p>
        </div>

        <form onSubmit={handleSearch} className="gov-card gov-card-body mb-8 animate-fade-in delay-1">
          <label className="gov-label">Complaint Tracking ID</label>
          <div className="flex gap-3 mt-1">
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. GRV-20260530-0001"
              className="gov-input font-mono text-sm flex-1"
              style={{ letterSpacing: '0.04em' }}
            />
            <button type="submit" disabled={loading} className="btn-primary px-6 flex-shrink-0">
              {loading ? <span className="spinner w-4 h-4" /> : 'Track'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Format: GRV-YYYYMMDD-XXXX (e.g. GRV-20260530-0001)
          </p>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-gov p-4 text-red-700 text-sm mb-6 animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {complaint && (
          <div className="animate-fade-in space-y-6">
            {/* Tracking ID header */}
            <div className="gov-card overflow-hidden">
              <div style={{ background: 'var(--navy-800)' }} className="px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-navy-200 text-xs font-semibold uppercase tracking-widest mb-2">Tracking ID</p>
                    <div className="tracking-badge-large">{complaint.trackingId}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="gov-card-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Detail label="Complaint Title" value={complaint.title} />
                  <Detail label="Category" value={complaint.category || complaint.department} />
                  <Detail label="Submission Date & Time" value={formatDateTime(complaint.createdAt)} />
                  <Detail label="Last Updated" value={formatDateTime(complaint.updatedAt)} />
                  <Detail label="Location" value={complaint.location} />
                  <Detail label="Priority" value={complaint.priority} />
                  <Detail label="Assigned Officer" value={complaint.assignedTo ? `👤 ${complaint.assignedTo}` : 'Not Assigned Yet'} />
                  {complaint.resolvedAt ? (
                    <Detail label="Resolution Date" value={formatDate(complaint.resolvedAt)} />
                  ) : (
                    ['Resolved', 'Closed'].includes(complaint.status) ? (
                      <Detail label="Resolution Date" value={formatDate(complaint.updatedAt)} />
                    ) : null
                  )}
                </div>

                {/* Resolution Details Section */}
                {['Resolved', 'Closed', 'Rejected'].includes(complaint.status) && (
                  <div className="mt-5 bg-green-50 border border-green-100 rounded-gov p-4">
                    <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">✅ Resolution Details</p>
                    <p className="text-sm text-gray-700">
                      {complaint.remarks || 'The grievance has been processed. No additional remarks were provided by the officer.'}
                    </p>
                  </div>
                )}

                {/* Official Remarks (if status is not resolved/closed/rejected but remarks exist) */}
                {!['Resolved', 'Closed', 'Rejected'].includes(complaint.status) && complaint.remarks && (
                  <div className="mt-5 bg-navy-50 border border-navy-100 rounded-gov p-4">
                    <p className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">Official Remarks</p>
                    <p className="text-sm text-gray-700">{complaint.remarks}</p>
                  </div>
                )}

                {/* Images */}
                {complaint.images?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Attached Images</p>
                    <div className="flex flex-wrap gap-3">
                      {complaint.images.map((img, i) => (
                        <a key={i} href={`${API_BASE}${img}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={`${API_BASE}${img}`} alt={`Attachment ${i+1}`}
                            className="w-24 h-24 object-cover rounded-gov border border-gray-200 hover:opacity-80 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="gov-card">
              <div className="gov-card-header">
                <h3 className="font-bold text-navy-800">📍 Status Timeline</h3>
              </div>
              <div className="gov-card-body">
                <StatusTimeline currentStatus={complaint.status} activityLog={complaint.activityLog} />
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              {isAuthenticated ? (
                <>
                  <button onClick={() => navigate(dashboardPath)} className="text-navy-600 font-semibold hover:underline">← Go to Dashboard</button>
                  {' '}to view all your complaints.
                </>
              ) : (
                <>
                  Need help?{' '}
                  <Link to="/login" className="text-navy-600 font-semibold hover:underline">Sign in</Link>
                  {' '}to view your full complaint details.
                </>
              )}
            </p>
          </div>
        )}

        {/* Empty search hint */}
        {!complaint && !error && !loading && (
          <div className="text-center text-gray-400 py-8 animate-fade-in delay-2">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">Enter your Tracking ID above to get started.</p>
            {isAuthenticated ? (
              <button
                onClick={() => navigate(dashboardPath)}
                className="text-navy-600 text-sm hover:underline mt-2 inline-block"
              >
                ← Back to Dashboard
              </button>
            ) : (
              <Link to="/login" className="text-navy-600 text-sm hover:underline mt-2 inline-block">
                Or sign in to view all your complaints →
              </Link>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © 2026 Public Grievance Management System · Government of India
      </footer>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
  </div>
);

export default TrackComplaintPage;
