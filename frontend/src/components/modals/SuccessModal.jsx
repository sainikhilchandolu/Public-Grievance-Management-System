import { useState } from 'react';
import { formatDate, copyToClipboard } from '../../utils/formatters';
import toast from 'react-hot-toast';

/**
 * SuccessModal — shown after successful complaint submission
 * Prominently displays the Tracking ID
 */
const SuccessModal = ({ trackingId, submittedAt, onClose, onTrack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(trackingId);
    if (ok) {
      setCopied(true);
      toast.success('Tracking ID copied!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box animate-scale-in" style={{ maxWidth: 480 }}>
        {/* Header */}
        <div className="success-modal-header rounded-t-gov-xl">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-white">Complaint Submitted!</h2>
          <p className="text-navy-200 text-sm mt-1">
            Your grievance has been registered successfully.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500 mb-3 uppercase font-semibold tracking-widest">
            Your Tracking ID
          </p>
          <div className="tracking-badge-large justify-center mb-4 block mx-auto w-fit">
            {trackingId}
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Submitted on {formatDate(submittedAt)} · Save this ID to track your complaint.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleCopy} className="btn-outline flex items-center gap-2">
              {copied ? '✅ Copied!' : '📋 Copy ID'}
            </button>
            <button onClick={onTrack} className="btn-primary">
              🔍 Track Complaint
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline block mx-auto"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
