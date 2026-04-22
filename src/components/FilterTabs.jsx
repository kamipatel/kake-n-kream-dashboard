import { C } from "./theme";

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "inProgress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function FilterTabs({ filter, onFilterChange, pendingCount = 0 }) {
  const activeIndex = tabs.findIndex((t) => t.key === filter);

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginTop: 20 }}>
      <div
        role="tablist"
        aria-label="Filter orders"
        style={{
          display: "inline-flex",
          position: "relative",
          gap: 0,
          padding: 4,
          borderRadius: 14,
          background: "#F0EAE6",
          border: `1px solid ${C.border}`,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          minWidth: "fit-content",
        }}
      >
        {/* Sliding background indicator */}
        <div style={{
          position: "absolute",
          top: 4,
          left: 4,
          width: `calc((100% - 8px) / ${tabs.length})`,
          height: "calc(100% - 8px)",
          background: C.card,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transform: `translateX(${activeIndex * 100}%)`,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1,
        }} />

        {tabs.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            onClick={() => onFilterChange(key)}
            className="btn-hover"
            style={{
              zIndex: 2,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              padding: "10px 18px",
              minWidth: 80,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: filter === key ? C.primary : C.mutedFg,
              transition: "color 0.3s ease",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {label}
            {key === "pending" && pendingCount > 0 && (
              <span style={{
                background: C.primary,
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 10,
                padding: "1px 7px",
                minWidth: 20,
                textAlign: "center",
                lineHeight: "18px",
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
