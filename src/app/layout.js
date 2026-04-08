import "./globals.css";

export const metadata = {
  title: "Kake N Kream — Order Dashboard",
  description: "Order management dashboard for Kake N Kream",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
