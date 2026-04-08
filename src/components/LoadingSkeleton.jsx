import { C } from "./theme";

function SkeletonCard() {
  return (
    <div style={{
      background: C.card,
      borderRadius: 14,
      padding: "18px 20px",
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${C.muted}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div className="skeleton" style={{ width: 140, height: 18, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 200, height: 14 }} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="skeleton" style={{ width: 70, height: 22, marginBottom: 8, marginLeft: "auto" }} />
          <div className="skeleton" style={{ width: 100, height: 14, marginLeft: "auto" }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: "100%", height: 60, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: 120, height: 12 }} />
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading orders" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        Loading orders...
      </span>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
