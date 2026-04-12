import { C } from "./theme";
import { WarningIcon } from "./icons";

export default function EmptyState({ type = "empty", message, detail, filter, onRetry }) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      style={{
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        {isError ? (
          <WarningIcon size={48} color={C.destructive} />
        ) : (
          <img
            src="/images/logo-icon.png"
            alt=""
            style={{ width: 64, height: 64, opacity: 0.3 }}
          />
        )}
      </div>
      <p style={{
        fontFamily: "'Fredoka', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: isError ? C.destructive : C.sub,
        marginBottom: 4,
      }}>
        {message || (isError ? "Something went wrong" : "No orders yet")}
      </p>
      {(detail || isError) && (
        <p style={{ fontSize: 14, color: C.sub, marginBottom: isError ? 16 : 0 }}>
          {detail || (isError ? "Could not load orders from Google Sheets." : "")}
        </p>
      )}
      {isError && onRetry && (
        <button
          onClick={onRetry}
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            padding: "10px 24px",
            borderRadius: 10,
            border: "none",
            background: C.primary,
            color: "#FFFFFF",
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
