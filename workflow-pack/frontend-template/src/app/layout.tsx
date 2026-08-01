import type { Metadata } from "next";
import { Kanit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UniResearch",
    template: "%s | UniResearch",
  },
  description: "คลังจัดเก็บ ค้นหา และเผยแพร่ผลงานวิชาการของมหาวิทยาลัย",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} ${plusJakartaSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
