import { HiSearch, HiX } from 'react-icons/hi';

/**
 * SearchBar Component
 * Debounced search input with clear button
 */
const SearchBar = ({ value, onChange, placeholder = 'Search complaints...' }) => {
  return (
    <div className="relative">
      <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <HiX size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
