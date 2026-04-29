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
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <div
        role="tablist"
        aria-label="Filter orders"
        style={{
          display: "inline-flex",
          gap: 0,
          padding: 4,
          borderRadius: 14,
          background: "#FFF5F0",
          border: `1px solid ${C.border}`,
          minWidth: "fit-content",
        }}
      >
        {tabs.map(({ key, label }) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(key)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                borderBottom: isActive ? "2px solid #FF69B4" : "2px solid transparent",
                cursor: "pointer",
                background: "transparent",
                color: isActive ? "#FF69B4" : "#9B7340",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {label}{key === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
