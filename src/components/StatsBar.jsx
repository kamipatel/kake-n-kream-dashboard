import { C } from "./theme";

const stats = [
  { key: "pending", label: "Pending", color: C.status.pending.bg },
  { key: "confirmed", label: "Confirmed", color: C.status.confirmed.bg },
  { key: "inProgress", label: "In Progress", color: C.status.inProgress.bg },
  { key: "completed", label: "Completed", color: C.status.completed.bg },
  { key: "cancelled", label: "Cancelled", color: C.status.cancelled.accent },
];

export default function StatsBar({ statusCounts }) {
  return (
    <div
      role="status"
      aria-label="Order status summary"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
        marginTop: 16,
        padding: "14px 20px",
        borderRadius: 14,
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: C.shadowSm,
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: s.color,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: C.brown,
          }}>
            {statusCounts[s.key] || 0}
          </span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: C.sub,
          }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
