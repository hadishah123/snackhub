function MenuSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-24">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between gap-4 py-4 border-b animate-pulse"
        >
          {/* LEFT TEXT */}
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mt-2"></div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-28 h-28 bg-gray-300 rounded-lg shrink-0"></div>
        </div>
      ))}
    </div>
  );
}

export default MenuSkeleton;