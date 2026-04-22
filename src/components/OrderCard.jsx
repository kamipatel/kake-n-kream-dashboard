import { useState, useRef, useEffect } from "react";
import { C } from "./theme";
import {
  CalendarIcon,
  AlertTriangleIcon,
  NoteIcon,
  PhoneIcon,
  MailIcon,
  CopyIcon,
  CheckIcon,
  BoxIcon,
  ChevronDownIcon,
} from "./icons";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  inProgress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const ALL_STATUSES = ["pending", "confirmed", "inProgress", "completed", "cancelled"];

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

function formatTimestamp(ts) {
  if (!ts) return "\u2014";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isDueSoon(pickupDate, today) {
  if (!pickupDate || pickupDate < today) return false;
  const pickup = new Date(pickupDate + "T12:00:00");
  const now = new Date(today + "T12:00:00");
  const diffDays = (pickup - now) / (1000 * 60 * 60 * 24);
  return diffDays <= 3;
}

export default function OrderCard({ order, today, status, timestamps, onStatusChange, onConfirmAction }) {
  const [copied, setCopied] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const name =
    [order.firstName, order.lastName].filter(Boolean).join(" ") ||
    order.name ||
    "\u2014";
  const pickup = order.pickupDate || order.date || "";
  const s = C.status[status] || C.status.pending;
  const items = order.order || order.items || "";
  const dueSoon = isDueSoon(pickup, today);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDropdownSelect = (newStatus) => {
    setDropdownOpen(false);
    if (newStatus === status) return;
    if (newStatus === "cancelled") {
      onConfirmAction(order, newStatus);
    } else {
      onStatusChange(order, newStatus);
    }
  };

  const handleActionButton = () => {
    if (status === "pending") onStatusChange(order, "confirmed");
    else if (status === "confirmed") onStatusChange(order, "inProgress");
    else if (status === "inProgress") onStatusChange(order, "completed");
    else if (status === "completed" || status === "cancelled") onStatusChange(order, "pending");
  };

  const actionButton = (() => {
    if (status === "pending") return { label: "Confirm Order", color: C.status.confirmed.bg, textColor: C.status.confirmed.fg };
    if (status === "confirmed") return { label: "Start Baking", color: C.status.inProgress.bg, textColor: "#FFFFFF" };
    if (status === "inProgress") return { label: "Mark Complete", color: C.status.completed.bg, textColor: "#FFFFFF" };
    if (status === "completed") return { label: "Reopen Order", color: C.status.pending.bg, textColor: "#FFFFFF" };
    if (status === "cancelled") return { label: "Reopen Order", color: C.status.pending.bg, textColor: "#FFFFFF" };
    return null;
  })();

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
              fontWeight: 600,
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
              flexWrap: "wrap",
            }}>
              {order.phone ? (
                <a
                  href={`tel:${order.phone}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    color: C.sub,
                    background: C.muted,
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  <PhoneIcon size={12} color={C.mutedFg} />
                  {order.phone}
                </a>
              ) : (
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: C.mutedFg,
                  background: C.muted,
                  padding: "4px 8px",
                  borderRadius: 6,
                  opacity: 0.6,
                }}>
                  <PhoneIcon size={12} color={C.mutedFg} />
                  {"\u2014"}
                </span>
              )}
              {order.email ? (
                <a
                  href={`mailto:${order.email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    color: C.sub,
                    background: C.muted,
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  <MailIcon size={12} color={C.mutedFg} />
                  Email
                </a>
              ) : (
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: C.mutedFg,
                  background: C.muted,
                  padding: "4px 8px",
                  borderRadius: 6,
                  opacity: 0.6,
                }}>
                  <MailIcon size={12} color={C.mutedFg} />
                  {"\u2014"}
                </span>
              )}
              {order.phone && (
                <button
                  onClick={() => copyToClipboard(order.phone, "phone")}
                  className="btn-hover"
                  title="Copy phone"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    fontSize: 11,
                    color: C.mutedFg,
                    background: C.muted,
                    border: "none",
                    padding: "4px 6px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {copied === "phone" ? <CheckIcon size={10} color={C.status.completed.softFg} /> : <CopyIcon size={10} color={C.mutedFg} />}
                </button>
              )}
              {order.email && (
                <button
                  onClick={() => copyToClipboard(order.email, "email")}
                  className="btn-hover"
                  title="Copy email"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    fontSize: 11,
                    color: C.mutedFg,
                    background: C.muted,
                    border: "none",
                    padding: "4px 6px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {copied === "email" ? <CheckIcon size={10} color={C.status.completed.softFg} /> : <CopyIcon size={10} color={C.mutedFg} />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {/* Status badge with dropdown */}
          <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                background: s.bg,
                color: s.fg,
                border: `1px solid ${s.border}`,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.fg, opacity: 0.6 }} />
              {STATUS_LABELS[status]}
              <ChevronDownIcon size={12} color={s.fg} />
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                background: C.card,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                boxShadow: C.shadowLg,
                zIndex: 50,
                minWidth: 160,
                padding: 4,
                animation: "fadeIn 0.15s ease",
              }}>
                {ALL_STATUSES.map((st) => {
                  const stColor = C.status[st];
                  return (
                    <button
                      key={st}
                      onClick={() => handleDropdownSelect(st)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 8,
                        background: st === status ? C.muted : "transparent",
                        cursor: st === status ? "default" : "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: st === status ? 600 : 400,
                        color: C.fg,
                        textAlign: "left",
                      }}
                    >
                      <div style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: stColor.bg,
                        border: `1px solid ${stColor.border}`,
                        flexShrink: 0,
                      }} />
                      {STATUS_LABELS[st]}
                      {st === status && <CheckIcon size={12} color={C.mutedFg} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{
            fontSize: 14,
            fontWeight: 500,
            color: dueSoon ? "#E65100" : C.sub,
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            ...(dueSoon ? {
              background: "#FFF3E0",
              padding: "4px 10px",
              borderRadius: 8,
              border: "1px solid #FFE0B2",
            } : {}),
          }}>
            <CalendarIcon size={14} color={dueSoon ? "#E65100" : C.secondary} />
            {formatDate(pickup)}
            {dueSoon && <span style={{ fontSize: 11, fontWeight: 600 }}>DUE SOON</span>}
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

      {/* Action Button */}
      {actionButton && (
        <button
          onClick={handleActionButton}
          className="btn-hover"
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 14,
            border: "none",
            background: actionButton.color,
            color: actionButton.textColor,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: `0 4px 12px ${actionButton.color}40`,
            transition: "all 0.2s ease",
          }}
        >
          {actionButton.label}
        </button>
      )}

      {/* Timestamp Log + Footer */}
      <div style={{
        fontSize: 12,
        color: C.mutedFg,
        paddingTop: 4,
        borderTop: `1px dashed ${C.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span>Received: {formatTimestamp(timestamps?.pending || order._date)}</span>
          <span style={{ color: C.border }}>{"\u00B7"}</span>
          <span>Confirmed: {timestamps?.confirmed ? formatTimestamp(timestamps.confirmed) : "\u2014"}</span>
          <span style={{ color: C.border }}>{"\u00B7"}</span>
          <span>Completed: {timestamps?.completed ? formatTimestamp(timestamps.completed) : "\u2014"}</span>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>Requested on {order._date ? new Date(order._date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}</span>
          {order.id && <span style={{ fontFamily: "monospace" }}>#{order.id.slice(-6)}</span>}
        </div>
      </div>
    </div>
  );
}
