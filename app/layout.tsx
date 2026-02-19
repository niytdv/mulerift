import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Mule Detector",
  description: "Detect fraud rings in transaction data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
