"use client";
import { useState, useEffect } from "react";
import { C } from "./theme";
import { CupcakeIcon, RefreshIcon } from "./icons";
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
    setError(null);
    try {
      const res = await fetch(
        "https://docs.google.com/spreadsheets/d/1zBPMxSQg8zKKVXbCKNbIjU30-YFPDExGuop_MCklhyg/gviz/tq?tqx=out:csv"
      );
      if (!res.ok) throw new Error("Failed to load");
      const text = await res.text();
      const rows = parseCSV(text);
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

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    const d = o.pickupDate || "";
    if (filter === "upcoming") return d >= today;
    if (filter === "past") return d < today;
    return true;
  });

  const sortedOrders = [...filtered].sort((a, b) => {
    const da = a._date || a.pickupDate || "";
    const db = b._date || b.pickupDate || "";
    return db.localeCompare(da);
  });

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, padding: "0 16px" }}>
      <header style={{ maxWidth: 800, margin: "0 auto", padding: "32px 0 24px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: C.fg,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <CupcakeIcon size={28} color={C.primary} />
              Kake N Kream
            </h1>
            <p style={{ fontSize: 14, color: C.sub, marginTop: 2 }}>Order Dashboard</p>
          </div>
          <button
            onClick={fetchOrders}
            className="refresh-btn"
            aria-label="Refresh orders"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.primary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <RefreshIcon size={16} />
            Refresh
          </button>
        </div>

        {!loading && !error && <StatsBar orders={orders} today={today} />}
        <FilterTabs filter={filter} onFilterChange={setFilter} />
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 48 }}>
        {loading && <LoadingSkeleton />}

        {error && (
          <EmptyState type="error" message={error} onRetry={fetchOrders} />
        )}

        {!loading && !error && sortedOrders.length === 0 && (
          <EmptyState type="empty" filter={filter} />
        )}

        {!loading && !error && sortedOrders.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedOrders.map((order, i) => (
              <OrderCard key={i} order={order} today={today} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
