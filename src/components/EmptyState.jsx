import { C } from "./theme";
import { WarningIcon } from "./icons";

export default function EmptyState({ type = "empty", message, detail, filter, onRetry }) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className="animate-fade-in"
      style={{
        textAlign: "center",
        padding: "80px 20px",
        background: C.muted,
        borderRadius: 24,
        border: `2px dashed ${C.border}`,
        marginTop: 20,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        {isError ? (
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#FEF2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            border: `1px solid ${C.destructive}33`
          }}>
            <WarningIcon size={40} color={C.destructive} />
          </div>
        ) : (
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto" }}>
            <img
              src="/images/logo-icon.png"
              alt=""
              style={{ width: "100%", height: "100%", opacity: 0.3 }}
            />
          </div>
        )}
      </div>
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 18,
        fontWeight: 500,
        color: isError ? C.destructive : C.mutedFg,
        marginBottom: 8,
      }}>
        {message || (isError ? "Something went wrong" : "No orders yet")}
      </h3>
      <p style={{
        fontSize: 15,
        color: C.mutedFg,
        maxWidth: 300,
        margin: "0 auto",
        lineHeight: 1.5,
        marginBottom: isError ? 24 : 0
      }}>
        {detail || (isError
          ? "We're having trouble connecting to the order database. Please check your connection."
          : "Try adjusting your filters or search terms to find what you're looking for.")
        }
      </p>

      {isError && onRetry && (
        <button
          onClick={onRetry}
          className="btn-hover"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            padding: "12px 28px",
            borderRadius: 12,
            border: "none",
            background: C.primary,
            color: "#FFFFFF",
            cursor: "pointer",
            boxShadow: `0 4px 12px ${C.primarySoft}`,
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
