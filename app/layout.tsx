import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Deadhead Zero",
  description: "AI Lane Intelligence Platform for Brokers & Carriers"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dzBg text-white">
        {children}
      </body>
    </html>
  );
}
