import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description = 'No items found.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-xl border border-slate-200 w-full">
      <div className="text-slate-350 mb-3 select-none">
        {icon || <FiInbox className="w-8 h-8 mx-auto" />}
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-xs mb-6 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#163E72] hover:bg-[#0B2E59] text-white rounded-lg font-bold text-xs transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
