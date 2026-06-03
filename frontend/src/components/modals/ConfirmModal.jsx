import { HiX, HiExclamationCircle } from 'react-icons/hi';

/**
 * ConfirmModal Component
 * Generic confirmation dialog for destructive actions
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const confirmStyles = {
    danger: 'btn-danger',
    warning: 'bg-yellow-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-yellow-600 transition-all',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-xl transition-all"
          >
            <HiX size={18} />
          </button>
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
            }`}>
              <HiExclamationCircle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1 pr-6">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={onConfirm} className={`${confirmStyles[type]} flex-1`}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
