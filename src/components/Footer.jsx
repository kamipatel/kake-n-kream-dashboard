import { C } from "./theme";

export default function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "24px 0 32px",
      maxWidth: 800,
      margin: "0 auto",
      borderTop: `1px solid ${C.border}`,
    }}>
      <p style={{ fontSize: 13, color: "#9B7340" }}>
        Kake N Kream &middot; St. Charles, MO
      </p>
    </footer>
  );
}
