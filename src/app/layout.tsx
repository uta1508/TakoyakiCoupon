import type { Metadata } from "next";
import { Montserrat, Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const notoSerifJP = Noto_Serif_JP({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-noto-serif-jp", display: "swap" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-noto-sans-jp", display: "swap" });

export const metadata: Metadata = {
  title: "グランメゾン細谷 | GRAND MAISON HOSOYA",
  description: "至高の粉もん、ここに開店。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${montserrat.variable} ${notoSerifJP.variable} ${notoSansJP.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
