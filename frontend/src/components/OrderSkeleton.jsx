function OrderSkeleton() {
  return (
    <div className="animate-pulse py-4 border-b">
      <div className="h-4 bg-gray-300 w-1/3 mb-2 rounded"></div>
      <div className="h-3 bg-gray-300 w-1/4 mb-3 rounded"></div>

      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-300 w-2/3 rounded"></div>
        <div className="h-3 bg-gray-300 w-1/2 rounded"></div>
      </div>

      <div className="h-4 bg-gray-300 w-1/4 mb-2 rounded"></div>
      <div className="h-3 bg-gray-300 w-1/3 rounded"></div>
    </div>
  );
}

export default OrderSkeleton;