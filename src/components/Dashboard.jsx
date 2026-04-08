"use client";
import { useState, useEffect } from "react";

const C = {
  bg: "#FAFAFA", white: "#FFFFFF", pink: "#F2A0B5", coral: "#F4978E",
  peach: "#F8C4A4", yellow: "#F7D794", mint: "#A8DFC8", sky: "#A0C4E8",
  lavender: "#C4B5E0", ink: "#2A2230", sub: "#847889", muted: "#B5AABB",
  border: "#EDEBF0", red: "#E57373", green: "#81C784",
};

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | upcoming | past

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
    setLoading(true);
    try {
      const res = await fetch(
        "https://docs.google.com/spreadsheets/d/1zBPMxSQg8zKKVXbCKNbIjU30-YFPDExGuop_MCklhyg/gviz/tq?tqx=out:csv"
      );
      if (!res.ok) throw new Error("Failed to load");
      const text = await res.text();
      const rows = parseCSV(text);
      // Skip header row, map columns to order fields
      const mapped = rows.slice(1).map((r) => ({
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
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filtered = orders.filter(o => {
    if (filter === "all") return true;
    const d = o.pickupDate || o.date || "";
    if (filter === "upcoming") return d >= today;
    if (filter === "past") return d < today;
    return true;
  });

  const sortedOrders = [...filtered].sort((a, b) => {
    const da = a._date || a.pickupDate || a.date || "";
    const db = b._date || b.pickupDate || b.date || "";
    return db.localeCompare(da);
  });

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    } catch { return d; }
  };

  const getStatusColor = (d) => {
    if (!d) return C.muted;
    return d >= today ? C.mint : C.muted;
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "0 16px" }}>
      {/* Header */}
      <header style={{ maxWidth: 800, margin: "0 auto", padding: "32px 0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>
              🧁 Kake N Kream
            </h1>
            <p style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>Order Dashboard</p>
          </div>
          <button onClick={fetchOrders} style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700,
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
            background: C.white, color: C.sub, cursor: "pointer",
          }}>
            ↻ Refresh
          </button>
        </div>

        {/* Stats bar */}
        {!loading && !error && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { label: "Total Orders", value: orders.length, color: C.pink },
              { label: "Upcoming", value: orders.filter(o => (o.pickupDate || o.date || "") >= today).length, color: C.mint },
              { label: "Past", value: orders.filter(o => (o.pickupDate || o.date || "") < today).length, color: C.muted },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, minWidth: 100, padding: "14px 16px", borderRadius: 12, background: C.white, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {[["all", "All"], ["upcoming", "Upcoming"], ["past", "Past"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              background: filter === k ? C.ink : C.white,
              color: filter === k ? C.white : C.sub,
              transition: "all 0.15s",
            }}>{l}</button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 48 }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
            <p style={{ fontSize: 14 }}>Loading orders...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <p style={{ fontSize: 14, color: C.red, fontWeight: 600 }}>{error}</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Could not load orders from Google Sheets.</p>
          </div>
        )}

        {!loading && !error && sortedOrders.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            <p style={{ fontSize: 14 }}>No orders {filter !== "all" ? `(${filter})` : "yet"}</p>
          </div>
        )}

        {!loading && !error && sortedOrders.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedOrders.map((order, i) => {
              const name = [order.firstName, order.lastName].filter(Boolean).join(" ") || order.name || "—";
              const pickup = order.pickupDate || order.date || "";
              const isUpcoming = pickup >= today;
              const items = order.order || order.items || "";

              return (
                <div key={i} style={{
                  background: C.white, borderRadius: 14, padding: "18px 20px",
                  border: `1px solid ${C.border}`, transition: "box-shadow 0.15s",
                }}>
                  {/* Top row: name + pickup */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink }}>{name}</div>
                      <div style={{ fontSize: 12, color: C.sub }}>{order.email || ""}{order.phone ? ` · ${order.phone}` : ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: isUpcoming ? C.mint + "22" : C.muted + "18",
                        color: isUpcoming ? "#2E7D32" : C.sub,
                      }}>
                        {isUpcoming ? "Upcoming" : "Past"}
                      </span>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 4 }}>
                        📅 {formatDate(pickup)}
                      </div>
                    </div>
                  </div>

                  {/* Order items */}
                  {items && (
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: C.bg, marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Order</div>
                      <pre style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: C.ink, whiteSpace: "pre-wrap", lineHeight: 1.5, margin: 0 }}>{items}</pre>
                    </div>
                  )}

                  {/* Allergies + Notes */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {order.allergies && (
                      <div style={{ flex: 1, minWidth: 140, padding: "8px 12px", borderRadius: 8, background: C.red + "10", border: `1px solid ${C.red}22` }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.red, marginBottom: 2 }}>⚠️ ALLERGIES</div>
                        <div style={{ fontSize: 12, color: C.ink }}>{order.allergies}</div>
                      </div>
                    )}
                    {order.notes && (
                      <div style={{ flex: 1, minWidth: 140, padding: "8px 12px", borderRadius: 8, background: C.sky + "12", border: `1px solid ${C.sky}22` }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.sky, marginBottom: 2 }}>📝 NOTES</div>
                        <div style={{ fontSize: 12, color: C.ink }}>{order.notes}</div>
                      </div>
                    )}
                  </div>

                  {/* Submitted time */}
                  {order._date && (
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
                      Submitted {new Date(order._date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "16px 0 24px" }}>
        <p style={{ fontSize: 10, color: C.muted }}>Kake N Kream Dashboard · Built by <a href="https://foundry-red.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: C.pink, textDecoration: "none" }}>Foundry</a></p>
      </footer>
    </div>
  );
}
