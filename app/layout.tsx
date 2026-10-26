import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Blog",
  description: "A clean and fast blog powered by Next.js, Prisma, and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="light"
      style={{ backgroundColor: "#ffffff", colorScheme: "light" }}
    >
      <head>
        <style>{`
          html, body, main {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #0f172a !important;
            color-scheme: light !important;
          }
        `}</style>
      </head>
      <body
        className="min-h-screen flex flex-col bg-white text-slate-900 antialiased"
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        <Suspense fallback={<div className="h-16 border-b border-slate-900 bg-white" />}>
          <Navbar />
        </Suspense>
        <main
          className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 bg-white"
          style={{ backgroundColor: "#ffffff" }}
        >
          <Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
