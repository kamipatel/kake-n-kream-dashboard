import { C } from "./theme";
import { CalendarIcon, AlertTriangleIcon, NoteIcon } from "./icons";

function formatDate(d) {
  if (!d) return "\u2014";
  try {
    return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

export default function OrderCard({ order, today }) {
  const name =
    [order.firstName, order.lastName].filter(Boolean).join(" ") ||
    order.name ||
    "\u2014";
  const pickup = order.pickupDate || order.date || "";
  const isUpcoming = pickup >= today;
  const items = order.order || order.items || "";

  return (
    <div
      className="order-card"
      role="article"
      aria-label={`Order from ${name}, pickup ${formatDate(pickup)}`}
      style={{
        background: C.card,
        borderRadius: 14,
        padding: "18px 20px",
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${isUpcoming ? C.accent : C.accentPast}`,
      }}
    >
      {/* Top row: name + pickup */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
        gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 17,
            fontWeight: 700,
            color: C.fg,
          }}>
            {name}
          </div>
          <div style={{ fontSize: 13, color: C.sub }}>
            {order.email || ""}
            {order.phone ? ` \u00B7 ${order.phone}` : ""}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            background: isUpcoming ? C.upcomingBg : C.pastBg,
            color: isUpcoming ? C.upcoming : C.past,
            border: `1px solid ${isUpcoming ? C.border : "#E5E7EB"}`,
          }}>
            {isUpcoming ? "Upcoming" : "Past"}
          </span>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: C.fg,
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 4,
          }}>
            <CalendarIcon size={14} color={C.secondary} />
            {formatDate(pickup)}
          </div>
        </div>
      </div>

      {/* Order items */}
      {items && (
        <div style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: C.bg,
          border: `1px solid ${C.border}`,
          marginBottom: 8,
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.sub,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}>
            Order
          </div>
          <pre style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14,
            color: C.fg,
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            margin: 0,
          }}>
            {items}
          </pre>
        </div>
      )}

      {/* Allergies + Notes */}
      {(order.allergies || order.notes) && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {order.allergies && (
            <div style={{
              flex: 1,
              minWidth: 140,
              padding: "8px 12px",
              borderRadius: 8,
              background: C.allergyBg,
              border: `1px solid ${C.allergyBorder}`,
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.allergyText,
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <AlertTriangleIcon size={12} color={C.allergyText} />
                ALLERGIES
              </div>
              <div style={{ fontSize: 13, color: C.fg }}>{order.allergies}</div>
            </div>
          )}
          {order.notes && (
            <div style={{
              flex: 1,
              minWidth: 140,
              padding: "8px 12px",
              borderRadius: 8,
              background: C.notesBg,
              border: `1px solid ${C.notesBorder}`,
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.notesText,
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <NoteIcon size={12} color={C.notesText} />
                NOTES
              </div>
              <div style={{ fontSize: 13, color: C.fg }}>{order.notes}</div>
            </div>
          )}
        </div>
      )}

      {/* Submitted time */}
      {order._date && (
        <div style={{ fontSize: 12, color: C.sub, marginTop: 8 }}>
          Submitted{" "}
          {new Date(order._date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      )}
    </div>
  );
}
