import { C } from "./theme";
import { BoxIcon, ClockIcon, CheckIcon } from "./icons";

const stats = [
  {
    key: "pending",
    label: "Pending",
    color: C.primary,
    bg: C.primarySoft,
    icon: (size, color) => <BoxIcon size={size} color={color} />,
  },
  {
    key: "inProgress",
    label: "In Progress",
    color: "#4FC3F7",
    bg: "#E1F5FE",
    icon: (size, color) => <ClockIcon size={size} color={color} />,
  },
  {
    key: "completed",
    label: "Completed",
    color: "#4CAF50",
    bg: "#E8F5E9",
    icon: (size, color) => <CheckIcon size={size} color={color} />,
  },
];

export default function StatsBar({ statusCounts }) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
      {stats.map((s) => (
        <div
          key={s.key}
          role="status"
          aria-label={`${s.label}: ${statusCounts[s.key] || 0}`}
          style={{
            flex: 1,
            minWidth: 140,
            padding: "20px 24px",
            borderRadius: 16,
            background: C.card,
            border: `1px solid ${C.border}`,
            boxShadow: C.shadowSm,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: s.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            {s.icon(22, s.color)}
          </div>
          <div>
            <div style={{
              fontSize: 26,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              color: C.brown,
              lineHeight: 1,
            }}>
              {statusCounts[s.key] || 0}
            </div>
            <div style={{
              fontSize: 13,
              color: C.mutedFg,
              fontWeight: 400,
              marginTop: 4,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}>
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
