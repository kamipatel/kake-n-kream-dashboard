import { C } from "./theme";

const stats = [
  { key: "total", label: "Total Orders", color: C.statTotal, tint: "#FF69B414" },
  { key: "upcoming", label: "Upcoming", color: C.statUpcoming, tint: "#FFD54F20" },
  { key: "past", label: "Past", color: C.statPast, tint: "#5C3A2810" },
];

export default function StatsBar({ orders, today }) {
  const counts = {
    total: orders.length,
    upcoming: orders.filter((o) => (o.pickupDate || "") >= today).length,
    past: orders.filter((o) => (o.pickupDate || "") < today).length,
  };

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
      {stats.map((s) => (
        <div
          key={s.key}
          role="status"
          aria-label={`${s.label}: ${counts[s.key]}`}
          style={{
            flex: 1,
            minWidth: 100,
            padding: "16px 18px",
            borderRadius: 12,
            background: s.tint,
            border: `1px solid ${C.border}`,
            borderLeft: `4px solid ${s.color}`,
          }}
        >
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "'Fredoka', sans-serif",
            color: s.color,
            lineHeight: 1.2,
          }}>
            {counts[s.key]}
          </div>
          <div style={{ fontSize: 14, color: C.fg, fontWeight: 600, marginTop: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
