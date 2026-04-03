import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ThemeInitializer from "@/components/shared/ThemeInitializer";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "Ledger",
  description: "A secure, data-dense personal finance dashboard.",
};

export default function RootLayout({ children }) {
  // suppressHydrationWarning added to handle Zustand persist SSR mismatch
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased min-h-screen bg-off-white`}>
        <ThemeInitializer />
        <div className="flex flex-col lg:flex-row min-h-screen">
          <Header />
          <Sidebar />
          <main className="flex-1 w-full lg:ml-56 pt-14 lg:pt-0">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
