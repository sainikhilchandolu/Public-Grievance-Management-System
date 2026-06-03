import { formatDateTime } from '../../utils/formatters';

const WORKFLOW = [
  { key: 'Submitted',    label: 'Submitted',    icon: '📝', desc: 'Complaint received' },
  { key: 'Under Review', label: 'Under Review', icon: '🔍', desc: 'Being reviewed by officials' },
  { key: 'Assigned',     label: 'Assigned',     icon: '👤', desc: 'Assigned to an officer' },
  { key: 'In Progress',  label: 'In Progress',  icon: '⚙️', desc: 'Resolution underway' },
  { key: 'Resolved',     label: 'Resolved',     icon: '✅', desc: 'Issue resolved' },
  { key: 'Closed',       label: 'Closed',       icon: '🔒', desc: 'Complaint closed' },
];

/**
 * StatusTimeline
 * Shows a vertical step-by-step timeline of the complaint workflow
 */
const StatusTimeline = ({ currentStatus, activityLog = [] }) => {
  // Handle Rejected separately
  const isRejected = currentStatus === 'Rejected';

  const getStepState = (stepKey) => {
    const order = WORKFLOW.map(s => s.key);
    const currentIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(stepKey);

    if (isRejected) return 'rejected-pending';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'pending';
  };

  // Find the log entry for a given status
  const getLogEntry = (stepKey) =>
    activityLog
      .filter((e) => e.action.toLowerCase().includes(stepKey.toLowerCase()))
      .slice(-1)[0];

  const steps = isRejected
    ? [
        { key: 'Submitted', label: 'Submitted', icon: '📝', desc: 'Complaint received' },
        { key: 'Rejected',  label: 'Rejected',  icon: '❌', desc: 'Complaint was rejected' },
      ]
    : WORKFLOW;

  return (
    <div className="timeline">
      {steps.map((step, idx) => {
        const state = isRejected && step.key === 'Rejected' ? 'current'
          : isRejected ? 'completed'
          : getStepState(step.key);

        const logEntry = getLogEntry(step.key);

        return (
          <div key={step.key} className="timeline-item">
            {/* Connector line */}
            {idx < steps.length - 1 && <div className="timeline-connector" />}

            {/* Dot */}
            <div className={`timeline-dot ${state === 'completed' ? 'completed' : state === 'current' ? 'current' : 'pending'}`}>
              {state === 'completed' ? '✓' : step.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-semibold text-sm ${state === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                  {step.label}
                </p>
                {state === 'current' && (
                  <span className="text-xs bg-saffron-100 text-saffron-700 border border-saffron-300 px-2 py-0.5 rounded-full font-semibold">
                    Current
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${state === 'pending' ? 'text-gray-300' : 'text-gray-500'}`}>
                {logEntry ? logEntry.note || step.desc : step.desc}
              </p>
              {logEntry?.timestamp && (
                <p className="text-xs text-navy-500 mt-1 font-medium">
                  {formatDateTime(logEntry.timestamp)}
                  {logEntry.performedByName && ` · by ${logEntry.performedByName}`}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
