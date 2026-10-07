import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Recruitment AI", description: "גיוס חכם, אנושי ופשוט" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="he" dir="rtl"><body>{children}</body></html>;
}