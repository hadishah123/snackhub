function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      
      {/* Icon */}
      <div className="text-6xl mb-4 animate-bounce">🥟</div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-500 mt-2 max-w-xs">
        {description}
      </p>

      {/* Optional CTA Button */}
      {actionText && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;