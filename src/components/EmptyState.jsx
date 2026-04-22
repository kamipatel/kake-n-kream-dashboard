import { C } from "./theme";
import { WarningIcon, PartyIcon } from "./icons";

const filterMessages = {
  pending: {
    title: "No pending orders",
    detail: "You're all caught up! New orders will appear here automatically.",
  },
  confirmed: {
    title: "No confirmed orders",
    detail: "Orders you've confirmed will appear here.",
  },
  inProgress: {
    title: "Nothing in progress",
    detail: "Orders you're currently baking will appear here.",
  },
  completed: {
    title: "No completed orders yet",
    detail: "Completed orders will be shown here.",
  },
};

export default function EmptyState({ type = "empty", message, detail, filter, onRetry, completedCount }) {
  const isError = type === "error";
  const isCompleted = filter === "completed" && completedCount > 0;
  const filterMsg = filterMessages[filter];

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
            border: `1px solid ${C.destructive}33`,
          }}>
            <WarningIcon size={40} color={C.destructive} />
          </div>
        ) : isCompleted ? (
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#E8F5E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            border: "1px solid #4CAF5033",
          }}>
            <PartyIcon size={40} color="#4CAF50" />
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
        color: isError ? C.destructive : isCompleted ? "#2E7D32" : C.mutedFg,
        marginBottom: 8,
      }}>
        {message || (isError ? "Something went wrong" : (isCompleted ? `${completedCount} orders completed` : (filterMsg?.title || "No orders yet")))}
      </h3>
      <p style={{
        fontSize: 15,
        color: C.mutedFg,
        maxWidth: 300,
        margin: "0 auto",
        lineHeight: 1.5,
        marginBottom: isError ? 24 : 0,
      }}>
        {detail || (isError
          ? "We're having trouble connecting to the order database. Please check your connection."
          : (filterMsg?.detail || "Try adjusting your filters or search terms to find what you're looking for."))
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
