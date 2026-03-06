import "../styles/globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ProfitPilot Ads",
  description: "Stop burning ad budget in the dark."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <Navbar />
          <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
