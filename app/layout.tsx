export const metadata = {
  title: "₹1 UPI Demo Store",
  description: "UPI deep-link demo (no gateway)."
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="brand">₹1 UPI Demo Store</div>
            <code className="input">Default UPI: niteshjeee@axl</code>
          </header>
          {children}
          <footer className="center small">
            Demo only — no payment verification. Use a PSP for production.
          </footer>
        </div>
      </body>
    </html>
  );
}
