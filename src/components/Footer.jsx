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
      <p style={{ fontSize: 13, color: C.sub }}>
        Kake N Kream Dashboard &middot; Built by{" "}
        <a
          href="https://foundry-red.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: C.link, textDecoration: "none", fontWeight: 600 }}
        >
          Foundry
        </a>
      </p>
    </footer>
  );
}
