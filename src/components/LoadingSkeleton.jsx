import { C } from "./theme";

function SkeletonCard() {
  return (
    <div style={{
      background: C.card,
      borderRadius: 20,
      padding: "24px",
      border: `1px solid ${C.border}`,
      boxShadow: C.shadowSm,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14 }} />
          <div>
            <div className="skeleton" style={{ width: 140, height: 20, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 180, height: 14 }} />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 10, marginBottom: 10, marginLeft: "auto" }} />
          <div className="skeleton" style={{ width: 100, height: 16, marginLeft: "auto" }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: "100%", height: 80, borderRadius: 16, marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 12 }}>
        <div className="skeleton" style={{ flex: 1, height: 44, borderRadius: 12 }} />
        <div className="skeleton" style={{ flex: 1, height: 44, borderRadius: 12 }} />
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading orders" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        Loading orders...
      </span>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
