function SortBar({ sort, setSort }) {
  return (
    <div className="mb-4 space-y-3">

      <div className="flex gap-2 flex-wrap">

        <button
          onClick={() => setSort("trending")}
          className={`px-3 py-1.5 text-sm rounded-lg border transition ${
            sort === "trending"
              ? "bg-yellow-400 text-black border-yellow-400"
              : "bg-[#111] text-white border-[#2a2a2a]"
          }`}
        >
          🔥 Trending
        </button>

        <button
          onClick={() => setSort("low-high")}
          className={`px-3 py-1.5 text-sm rounded-lg border transition ${
            sort === "low-high"
              ? "bg-yellow-400 text-black border-yellow-400"
              : "bg-[#111] text-white border-[#2a2a2a]"
          }`}
        >
          Low → High
        </button>

        <button
          onClick={() => setSort("high-low")}
          className={`px-3 py-1.5 text-sm rounded-lg border transition ${
            sort === "high-low"
              ? "bg-yellow-400 text-black border-yellow-400"
              : "bg-[#111] text-white border-[#2a2a2a]"
          }`}
        >
          High → Low
        </button>

      </div>
    </div>
  );
}

export default SortBar;