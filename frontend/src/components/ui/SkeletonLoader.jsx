/**
 * SkeletonLoader Component
 * Animated loading placeholder for content
 */

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="flex gap-2">
      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="h-4 bg-gray-200 rounded w-12"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-24"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    {[1,2,3,4,5,6,7].map(i => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

const SkeletonLoader = ({ variant = 'card', count = 3 }) => {
  const variants = {
    card: CardSkeleton,
    stat: StatCardSkeleton,
    'table-row': TableRowSkeleton,
  };
  const Component = variants[variant] || CardSkeleton;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
};

export default SkeletonLoader;
