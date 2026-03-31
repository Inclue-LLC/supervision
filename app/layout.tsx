import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "監修管理システム",
  description: "監修依頼・コンテンツ・進捗を一元管理するシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </body>
    </html>
  );
}
