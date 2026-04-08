import { C } from "./theme";
import { WarningIcon, EmptyBoxIcon } from "./icons";

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
          <EmptyBoxIcon size={48} color={C.sub} />
        )}
      </div>
      <p style={{
        fontFamily: "'Fredoka', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: isError ? C.destructive : C.fg,
        marginBottom: 4,
      }}>
        {message || (isError ? "Something went wrong" : `No orders ${filter && filter !== "all" ? `(${filter})` : "yet"}`)}
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
            border: `1px solid ${C.border}`,
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
