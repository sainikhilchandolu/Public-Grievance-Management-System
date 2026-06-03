import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

/**
 * Pagination Component
 * Shows page numbers with prev/next navigation
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const showAround = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - showAround && i <= currentPage + showAround)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - showAround - 1 ||
        i === currentPage + showAround + 1
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronLeft size={16} />
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
        <HiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
