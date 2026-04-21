import { C } from "./theme";
import { BoxIcon, ClockIcon, TrendUpIcon } from "./icons";

const stats = [
  { 
    key: "total", 
    label: "Total Orders", 
    color: C.primary, 
    bg: C.primarySoft,
    icon: (size, color) => <BoxIcon size={size} color={color} />
  },
  { 
    key: "upcoming", 
    label: "Upcoming", 
    color: C.secondary, 
    bg: C.secondarySoft,
    icon: (size, color) => <ClockIcon size={size} color={color} />
  },
  { 
    key: "past", 
    label: "Past Orders", 
    color: C.brown, 
    bg: C.muted,
    icon: (size, color) => <TrendUpIcon size={size} color={color} />
  },
];

export default function StatsBar({ orders, today }) {
  const counts = {
    total: orders.length,
    upcoming: orders.filter((o) => (o.pickupDate || "") >= today).length,
    past: orders.filter((o) => (o.pickupDate || "") < today).length,
  };

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
      {stats.map((s) => (
        <div
          key={s.key}
          role="status"
          aria-label={`${s.label}: ${counts[s.key]}`}
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
              {counts[s.key]}
            </div>
            <div style={{
              fontSize: 13,
              color: C.mutedFg,
              fontWeight: 400,
              marginTop: 4,
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}>
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
