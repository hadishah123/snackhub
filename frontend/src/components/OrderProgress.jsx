export default function OrderProgress({ status }) {
  if (status === "cancelled") {
    return (
      <div className="mt-3 text-red-500 font-semibold">❌ Order Cancelled</div>
    );
  }

  const ORDER_STEPS = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];

  const STEP_ICONS = {
    pending: "🧾",
    confirmed: "✅",
    preparing: "👨‍🍳",
    out_for_delivery: "🛵",
    delivered: "📦",
  };

  const currentIndex = ORDER_STEPS.indexOf(status);

  return (
    <div className="mt-4">
      {/* Step labels with icons */}
      <div className="flex items-center justify-between text-xs mb-2">
        {ORDER_STEPS.map((step, index) => (
          <span
            key={step}
            className={`capitalize flex items-center gap-1 ${
              index <= currentIndex
                ? "text-green-600 font-semibold"
                : "text-gray-400"
            }`}
          >
            {STEP_ICONS[step]} {step.replace(/_/g, " ")}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-green-600 h-2 transition-all duration-500"
          style={{
            width: `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* PRO-level UX: Status message */}
      <p className="text-sm mt-2 text-gray-600">
        {status === "pending" && "🧾 Waiting for confirmation"}
        {status === "confirmed" && "✅ Order confirmed"}
        {status === "preparing" && "👨‍🍳 Food is being prepared"}
        {status === "out_for_delivery" && "🛵 On the way"}
        {status === "delivered" && "📦 Delivered successfully"}
      </p>
    </div>
  );
}