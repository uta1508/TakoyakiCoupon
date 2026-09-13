import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Takoyaki Coupon",
  description: "文化祭クーポンシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <header className="w-full bg-white border-b border-slate-200 py-4 px-4 flex justify-center items-center shadow-sm sticky top-0 z-50">
          <div className="relative w-full max-w-md h-24 sm:max-w-lg sm:h-32">
            <Image src="/logo.png" alt="Store Logo" fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 512px" />
          </div>
        </header>
        <main className="flex-1 w-full p-4 flex flex-col relative">
          {children}
        </main>
      </body>
    </html>
  );
}
