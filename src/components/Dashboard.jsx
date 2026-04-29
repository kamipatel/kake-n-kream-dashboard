"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { C } from "./theme";
import { RefreshIcon, SearchIcon, AlertTriangleIcon, XIcon } from "./icons";
import StatsBar from "./StatsBar";
import FilterTabs from "./FilterTabs";
import OrderCard from "./OrderCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import Footer from "./Footer";

const STORAGE_KEY = "knk-order-statuses";

function getOrderKey(order) {
  return `${order._date}|${order.firstName}|${order.lastName}|${order.pickupDate}`;
}

function loadStatuses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStatuses(statuses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  } catch {
    // localStorage full or unavailable
  }
}

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [undoToast, setUndoToast] = useState(null);
  const undoTimeoutRef = useRef(null);

  useEffect(() => {
    setOrderStatuses(loadStatuses());
  }, []);

  useEffect(() => { fetchOrders(); }, []);

  const parseCSV = (text) => {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { field += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ",") { row.push(field); field = ""; }
        else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
          row.push(field); field = "";
          if (row.length > 1 || row[0] !== "") rows.push(row);
          row = [];
          if (ch === "\r") i++;
        } else { field += ch; }
      }
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
  };

  const parsePickupDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d)) return val;
    return d.toISOString().split("T")[0];
  };

  const fetchOrders = async () => {
    setIsRefreshing(true);
    setLoading(orders.length === 0);
    setError(null);
    try {
      const res = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSL74L9ZchvRz6MdlQt4s-Ktb6Z40WPftyuhT_TI19H8jCXoqbxf2tUpQLEZ480ir0UDFOoj-GjSxAn/pub?output=csv"
      );
      if (!res.ok) throw new Error("Failed to load");
      const text = await res.text();
      const rows = parseCSV(text);
      const mapped = rows.slice(1).map((r, i) => ({
        id: `order-${i}`,
        _date: r[0] || "",
        firstName: r[1] || "",
        lastName: r[2] || "",
        email: r[3] || "",
        phone: r[4] || "",
        pickupDate: parsePickupDate(r[5]),
        order: r[6] || "",
        allergies: r[7] || "",
        notes: r[8] || "",
      }));
      setOrders(mapped);
      setLastUpdated(new Date());

      // Initialize statuses for new orders
      setOrderStatuses((prev) => {
        const updated = { ...prev };
        let changed = false;
        mapped.forEach((order) => {
          const key = getOrderKey(order);
          if (!updated[key]) {
            updated[key] = {
              status: "pending",
              timestamps: { pending: order._date || new Date().toISOString() },
            };
            changed = true;
          }
        });
        if (changed) saveStatuses(updated);
        return changed ? updated : prev;
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const STATUS_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const showUndoToast = useCallback((order, previousStatus, newStatus) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    const name = [order.firstName, order.lastName].filter(Boolean).join(" ") || "Order";
    setUndoToast({ order, previousStatus, newStatus, name });
    undoTimeoutRef.current = setTimeout(() => {
      setUndoToast(null);
      undoTimeoutRef.current = null;
    }, 5000);
  }, []);

  const applyStatus = useCallback((order, newStatus) => {
    const key = getOrderKey(order);
    setOrderStatuses((prev) => {
      const entry = prev[key] || { status: "pending", timestamps: {} };
      const updated = {
        ...prev,
        [key]: {
          status: newStatus,
          timestamps: {
            ...entry.timestamps,
            [newStatus]: new Date().toISOString(),
          },
        },
      };
      saveStatuses(updated);
      return updated;
    });
  }, []);

  const handleStatusChange = useCallback((order, newStatus) => {
    const key = getOrderKey(order);
    const previousStatus = orderStatuses[key]?.status || "pending";
    applyStatus(order, newStatus);
    showUndoToast(order, previousStatus, newStatus);
  }, [applyStatus, showUndoToast, orderStatuses]);

  const handleUndo = useCallback(() => {
    if (!undoToast) return;
    applyStatus(undoToast.order, undoToast.previousStatus);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoToast(null);
    undoTimeoutRef.current = null;
  }, [undoToast, applyStatus]);

  const handleConfirmAction = useCallback((order, targetStatus) => {
    setConfirmDialog({ order, targetStatus });
  }, []);

  const executeConfirm = () => {
    if (confirmDialog) {
      handleStatusChange(confirmDialog.order, confirmDialog.targetStatus);
      setConfirmDialog(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const getOrderStatus = useCallback((order) => {
    const key = getOrderKey(order);
    return orderStatuses[key]?.status || "pending";
  }, [orderStatuses]);

  const getOrderTimestamps = useCallback((order) => {
    const key = getOrderKey(order);
    return orderStatuses[key]?.timestamps || {};
  }, [orderStatuses]);

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, inProgress: 0, completed: 0, cancelled: 0 };
    orders.forEach((o) => {
      const st = getOrderStatus(o);
      if (counts[st] !== undefined) counts[st]++;
    });
    return counts;
  }, [orders, getOrderStatus]);

  const urgentOrders = useMemo(() => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const cutoff = threeDaysFromNow.toISOString().split("T")[0];
    return orders.filter((o) => {
      const st = getOrderStatus(o);
      const pickup = o.pickupDate || "";
      return (st === "pending" || st === "confirmed" || st === "inProgress") &&
        pickup >= today && pickup <= cutoff;
    });
  }, [orders, getOrderStatus, today]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const st = getOrderStatus(o);
      if (filter !== "all" && st !== filter) return false;

      if (searchQuery.trim() === "") return true;
      const q = searchQuery.toLowerCase();
      const fullName = `${o.firstName} ${o.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }).sort((a, b) => {
      const da = a._date || a.pickupDate || "";
      const db = b._date || b.pickupDate || "";
      return db.localeCompare(da);
    });
  }, [orders, filter, searchQuery, getOrderStatus]);

  return (
    <div style={{ minHeight: "100dvh", background: C.bg }}>
      {/* Sticky Premium Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: C.brown,
        padding: "16px 0",
        boxShadow: C.shadowMd,
      }} className="glass-header">
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <img
                src="/images/logo.png"
                alt="Kake N Kream"
                style={{ width: 130, height: "auto", display: "block" }}
              />
              <p style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                margin: "4px 0 0",
                fontWeight: 500,
              }}>
                Order Management Dashboard
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {lastUpdated && (
              <span style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
              }}>
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={fetchOrders}
              className="refresh-btn btn-hover"
              disabled={isRefreshing}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: C.primary,
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(255, 105, 180, 0.4)",
              }}
            >
              <RefreshIcon size={18} style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 48px" }}>
        {/* Stats Section */}
        {!loading && !error && (
          <>
            <StatsBar statusCounts={statusCounts} />

            {/* Summary line */}
            {statusCounts.pending > 0 && (
              <div style={{
                marginTop: 12,
                padding: "12px 20px",
                borderRadius: "0 12px 12px 0",
                background: "#FFF5F0",
                borderLeft: "3px solid #FF69B4",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: C.brown,
              }}>
                You have <strong style={{ color: C.primary }}>{statusCounts.pending} pending order{statusCounts.pending !== 1 ? "s" : ""}</strong> that need{statusCounts.pending === 1 ? "s" : ""} attention
              </div>
            )}

            {/* Urgent orders warning */}
            {urgentOrders.length > 0 && (
              <div style={{
                marginTop: 8,
                padding: "12px 20px",
                borderRadius: 12,
                background: "#FFF3E0",
                border: "1px solid #FFE0B2",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "#E65100",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <AlertTriangleIcon size={18} color="#E65100" />
                {urgentOrders.length} order{urgentOrders.length !== 1 ? "s" : ""} due within 3 days
              </div>
            )}
          </>
        )}

        {/* Filter & Search Bar */}
        <div style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.mutedFg, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              Filter by Status
            </div>
            <FilterTabs
              filter={filter}
              onFilterChange={setFilter}
              pendingCount={statusCounts.pending}
            />
          </div>

          <div style={{ position: "relative", flex: 1, maxWidth: 350 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.mutedFg, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              Search Orders
            </div>
            <div style={{ position: "relative" }}>
              <SearchIcon
                size={18}
                color={C.mutedFg}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: 14,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: C.fg,
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: C.shadowSm,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = C.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${C.primarySoft}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = C.border;
                  e.target.style.boxShadow = C.shadowSm;
                }}
              />
            </div>
          </div>
        </div>

        {/* Order List */}
        <section>
          {loading && <LoadingSkeleton />}

          {error && (
            <EmptyState type="error" message={error} onRetry={fetchOrders} />
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className="animate-fade-in" style={{ textAlign: "center", padding: "60px 20px" }}>
              <EmptyState
                type="empty"
                filter={filter}
                completedCount={statusCounts.completed}
              />
              {searchQuery && (
                <p style={{ marginTop: 12, color: C.sub, fontSize: 14 }}>
                  No results matching "<strong>{searchQuery}</strong>"
                </p>
              )}
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 12,
            }}>
              {filteredOrders.map((order, i) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  today={today}
                  status={getOrderStatus(order)}
                  timestamps={getOrderTimestamps(order)}
                  onStatusChange={handleStatusChange}
                  onConfirmAction={handleConfirmAction}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Confirmation Dialog — only for Cancelled */}
      {confirmDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            padding: 20,
            animation: "fadeIn 0.15s ease",
          }}
          onClick={() => setConfirmDialog(null)}
        >
          <div
            style={{
              background: C.card,
              borderRadius: 20,
              padding: "32px",
              maxWidth: 400,
              width: "100%",
              boxShadow: C.shadowLg,
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: "1px solid #FEE2E2",
            }}>
              <span style={{ fontSize: 28 }}>{"\u2716"}</span>
            </div>

            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: C.brown,
              marginBottom: 8,
            }}>
              Move this order to Cancelled?
            </h3>
            <p style={{
              fontSize: 14,
              color: C.sub,
              lineHeight: 1.5,
              marginBottom: 28,
            }}>
              You can change it back anytime.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setConfirmDialog(null)}
                className="btn-hover"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "12px 28px",
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  color: C.sub,
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
              <button
                onClick={executeConfirm}
                className="btn-hover"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 28px",
                  borderRadius: 12,
                  border: "none",
                  background: C.destructive,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: `0 4px 12px ${C.destructive}40`,
                }}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Toast */}
      {undoToast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1001,
          background: C.brown,
          color: "#FFFFFF",
          borderRadius: 14,
          padding: "14px 20px",
          boxShadow: C.shadowLg,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          maxWidth: 420,
          width: "calc(100% - 40px)",
          animation: "fadeIn 0.2s ease",
        }}>
          <span style={{ flex: 1 }}>
            {undoToast.name} moved to <strong>{STATUS_LABELS[undoToast.newStatus]}</strong>
          </span>
          <button
            onClick={handleUndo}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Undo
          </button>
          <button
            onClick={() => {
              if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
              setUndoToast(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              padding: 2,
              display: "flex",
            }}
          >
            <XIcon size={14} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
      )}
    </div>
  );
}
