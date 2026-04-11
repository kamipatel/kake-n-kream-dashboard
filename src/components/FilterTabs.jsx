import { C } from "./theme";

const tabs = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

export default function FilterTabs({ filter, onFilterChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter orders"
      style={{
        display: "inline-flex",
        gap: 4,
        marginTop: 16,
        padding: 4,
        borderRadius: 12,
        background: C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={filter === key}
          aria-pressed={filter === key}
          onClick={() => onFilterChange(key)}
          className="filter-btn"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            padding: "8px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: filter === key ? C.primary : "transparent",
            color: filter === key ? "#FFFFFF" : C.fg,
            boxShadow: filter === key ? "0 2px 8px rgba(255, 105, 180, 0.25)" : "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
