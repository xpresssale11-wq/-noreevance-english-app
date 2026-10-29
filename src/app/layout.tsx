import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noree Vance — Gentle Framework English Studio",
  description:
    "An indie-folk AI English companion for warm conversation, voice shadowing, gentle corrections, and daily micro-lessons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF6F0] text-[#2C2523] antialiased selection:bg-[#C86D51]/20">
        {children}
      </body>
    </html>
  );
}
