/**
 * Spinner Component
 * Animated loading spinner with configurable size and color
 */
const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const colors = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-400',
    green: 'border-green-500',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} ${colors[color]} rounded-full border-t-transparent animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;
