"use client";
import { useState, useEffect, useMemo } from "react";
import { C } from "./theme";
import { RefreshIcon, SearchIcon } from "./icons";
import StatsBar from "./StatsBar";
import FilterTabs from "./FilterTabs";
import OrderCard from "./OrderCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import Footer from "./Footer";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status Filter
      const d = o.pickupDate || "";
      let matchesFilter = true;
      if (filter === "upcoming") matchesFilter = d >= today;
      else if (filter === "past") matchesFilter = d < today;

      if (!matchesFilter) return false;

      // Search Filter
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
  }, [orders, filter, searchQuery, today]);

  return (
    <div style={{ minHeight: "100dvh", background: C.bg }}>
      {/* Sticky Premium Header */}
      <header style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        background: C.brown,
        padding: "16px 0",
        boxShadow: C.shadowMd
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
                display: "none", // Hidden on small screens via CSS if needed
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
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Stats Section */}
        {!loading && !error && <StatsBar orders={orders} today={today} />}

        {/* Filter & Search Bar */}
        <div style={{ 
          marginTop: 40, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 24,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.mutedFg, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Filter by Status
            </div>
            <FilterTabs filter={filter} onFilterChange={setFilter} />
          </div>

          <div style={{ position: "relative", flex: 1, maxWidth: 350 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.mutedFg, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
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
              <EmptyState type="empty" filter={filter} />
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
              gap: 16 
            }}>
              {filteredOrders.map((order, i) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  today={today} 
                  index={i}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
