import { STATUS_CLASS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const cls = STATUS_CLASS[status] || 'status-submitted';
  return (
    <span className={`status-badge ${cls}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
