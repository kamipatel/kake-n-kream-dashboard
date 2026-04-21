import { useState } from "react";
import { C } from "./theme";
import {
  CalendarIcon,
  AlertTriangleIcon,
  NoteIcon,
  PhoneIcon,
  MailIcon,
  CopyIcon,
  CheckIcon,
  BoxIcon
} from "./icons";

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

function getStatus(pickup, today) {
  if (!pickup || pickup < today) return "completed";
  if (pickup === today) return "confirmed";
  return "new";
}

export default function OrderCard({ order, today, index = 0 }) {
  const [copied, setCopied] = useState(null);

  const name =
    [order.firstName, order.lastName].filter(Boolean).join(" ") ||
    order.name ||
    "\u2014";
  const pickup = order.pickupDate || order.date || "";
  const status = getStatus(pickup, today);
  const s = C.status[status];
  const items = order.order || order.items || "";

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      className="order-card"
      role="article"
      aria-label={`Order from ${name}, pickup ${formatDate(pickup)}`}
      style={{
        background: C.card,
        borderRadius: 20,
        padding: "24px",
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${s.accent}`,
        boxShadow: C.shadowSm,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
      }}>
        <div style={{ display: "flex", gap: 16, minWidth: 0 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: s.softBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: `1px solid ${s.accent}33`,
          }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: s.softFg }}>
              {name[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: C.brown,
              margin: 0,
              lineHeight: 1.2,
            }}>
              {name}
            </h3>
            <div style={{
              display: "flex",
              gap: 8,
              marginTop: 6,
              flexWrap: "wrap"
            }}>
              <button
                onClick={order.phone ? () => copyToClipboard(order.phone, "phone") : undefined}
                disabled={!order.phone}
                className="btn-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: order.phone ? C.sub : C.mutedFg,
                  background: C.muted,
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: 6,
                  cursor: order.phone ? "pointer" : "default",
                  opacity: order.phone ? 1 : 0.6,
                }}
              >
                <PhoneIcon size={12} color={C.mutedFg} />
                {order.phone || "\u2014"}
                {order.phone && (copied === "phone" ? <CheckIcon size={10} color={C.status.completed.softFg} /> : <CopyIcon size={10} color={C.mutedFg} />)}
              </button>
              <button
                onClick={order.email ? () => copyToClipboard(order.email, "email") : undefined}
                disabled={!order.email}
                className="btn-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: order.email ? C.sub : C.mutedFg,
                  background: C.muted,
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: 6,
                  cursor: order.email ? "pointer" : "default",
                  opacity: order.email ? 1 : 0.6,
                }}
              >
                <MailIcon size={12} color={C.mutedFg} />
                {order.email ? "Email" : "\u2014"}
                {order.email && (copied === "email" ? <CheckIcon size={10} color={C.status.completed.softFg} /> : <CopyIcon size={10} color={C.mutedFg} />)}
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            background: s.bg,
            color: s.fg,
            border: `1px solid ${s.border}`,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.fg, opacity: 0.6 }} />
            {status}
          </span>
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            color: C.sub,
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
          }}>
            <CalendarIcon size={14} color={C.secondary} />
            {formatDate(pickup)}
          </div>
        </div>
      </div>

      {/* Main Order Content */}
      <div style={{
        padding: "16px 20px",
        borderRadius: 16,
        background: C.bgAlt,
        border: `1px solid ${C.border}`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: -10,
          right: -10,
          opacity: 0.05,
          transform: "rotate(15deg)",
        }}>
          <BoxIcon size={80} color={C.brown} />
        </div>

        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: C.mutedFg,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          Items to Prepare
        </div>
        <pre style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          fontWeight: 400,
          color: C.fg,
          whiteSpace: "pre-wrap",
          lineHeight: 1.6,
          margin: 0,
          position: "relative",
          zIndex: 1,
        }}>
          {items || "No items listed"}
        </pre>
      </div>

      {/* Callouts (Allergies / Notes) */}
      {(order.allergies || order.notes) && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {order.allergies && (
            <div style={{
              flex: 1,
              minWidth: 200,
              padding: "12px 16px",
              borderRadius: 12,
              background: C.allergy.bg,
              border: `1px solid ${C.allergy.border}`,
              display: "flex",
              gap: 12,
            }}>
              <AlertTriangleIcon size={18} color={C.allergy.icon} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: C.allergy.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                  Allergen Alert
                </div>
                <div style={{ fontSize: 13, fontWeight: 400, color: C.allergy.text, lineHeight: 1.4 }}>{order.allergies}</div>
              </div>
            </div>
          )}
          {order.notes && (
            <div style={{
              flex: 1,
              minWidth: 200,
              padding: "12px 16px",
              borderRadius: 12,
              background: C.notes.bg,
              border: `1px solid ${C.notes.border}`,
              display: "flex",
              gap: 12,
            }}>
              <NoteIcon size={18} color={C.notes.icon} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: C.notes.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                  Special Notes
                </div>
                <div style={{ fontSize: 13, fontWeight: 400, color: C.notes.text, lineHeight: 1.4 }}>{order.notes}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer / Meta */}
      {order._date && (
        <div style={{
          fontSize: 12,
          color: C.mutedFg,
          paddingTop: 4,
          borderTop: `1px dashed ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>Requested on {new Date(order._date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          {order.id && <span style={{ fontFamily: "monospace" }}>#{order.id.slice(-6)}</span>}
        </div>
      )}
    </div>
  );
}
