// Complaint categories
export const CATEGORIES = [
  { value: 'Roads',          label: 'Roads & Infrastructure' },
  { value: 'Water Supply',   label: 'Water Supply' },
  { value: 'Electricity',    label: 'Electricity' },
  { value: 'Sanitation',     label: 'Sanitation & Drainage' },
  { value: 'Transport',      label: 'Transport' },
  { value: 'Public Safety',  label: 'Public Safety' },
  { value: 'Healthcare',     label: 'Healthcare' },
  { value: 'Education',      label: 'Education' },
  { value: 'Other',          label: 'Other' },
];

// Alias for backward compat
export const DEPARTMENTS = CATEGORIES.map(c => c.value);

export const PRIORITIES = [
  { value: 'Low',    label: 'Low',    color: 'green'  },
  { value: 'Medium', label: 'Medium', color: 'blue'   },
  { value: 'High',   label: 'High',   color: 'orange' },
  { value: 'Urgent', label: 'Urgent', color: 'red'    },
];

// Full status workflow with labels and icons
export const STATUSES = [
  { value: 'Submitted',    label: 'Submitted',    icon: '📝', step: 0 },
  { value: 'Under Review', label: 'Under Review', icon: '🔍', step: 1 },
  { value: 'Assigned',     label: 'Assigned',     icon: '👤', step: 2 },
  { value: 'In Progress',  label: 'In Progress',  icon: '⚙️', step: 3 },
  { value: 'Resolved',     label: 'Resolved',     icon: '✅', step: 4 },
  { value: 'Closed',       label: 'Closed',       icon: '🔒', step: 5 },
  { value: 'Rejected',     label: 'Rejected',     icon: '❌', step: -1 },
  // Legacy
  { value: 'Pending',      label: 'Pending',      icon: '⏳', step: 0 },
];

// Status → CSS class name
export const STATUS_CLASS = {
  'Submitted':    'status-submitted',
  'Under Review': 'status-under-review',
  'Assigned':     'status-assigned',
  'In Progress':  'status-in-progress',
  'Resolved':     'status-resolved',
  'Closed':       'status-closed',
  'Rejected':     'status-rejected',
  'Pending':      'status-pending',
};

// Priority → CSS class
export const PRIORITY_CLASS = {
  Low:    'priority-low',
  Medium: 'priority-medium',
  High:   'priority-high',
  Urgent: 'priority-urgent',
};

export const PRIORITY_COLORS = {
  Low:    { text: 'text-green-700',  bg: 'bg-green-50'  },
  Medium: { text: 'text-blue-700',   bg: 'bg-blue-50'   },
  High:   { text: 'text-orange-700', bg: 'bg-orange-50' },
  Urgent: { text: 'text-red-700',    bg: 'bg-red-50'    },
};

export const CHART_COLORS = [
  '#1e4799','#f97316','#15803d','#b91c1c',
  '#6d28d9','#0ea5e9','#a16207','#0f766e',
];

export const API_BASE = 'http://localhost:5000';
