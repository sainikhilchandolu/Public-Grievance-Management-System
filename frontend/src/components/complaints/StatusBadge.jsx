import { STATUS_CLASS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const cls = STATUS_CLASS[status] || 'status-submitted';
  const icons = {
    'Submitted':    '📝',
    'Under Review': '🔍',
    'Assigned':     '👤',
    'In Progress':  '⚙️',
    'Resolved':     '✅',
    'Closed':       '🔒',
    'Rejected':     '❌',
    'Pending':      '⏳',
  };
  return (
    <span className={`status-badge ${cls}`}>
      <span>{icons[status] || '📋'}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
