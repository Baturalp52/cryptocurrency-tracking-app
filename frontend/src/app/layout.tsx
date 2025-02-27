import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Bootstrap from "./bootstrap";
import { AuthProvider } from "@/contexts/auth-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptocurrency Tracking App",
  description: "Track your favorite cryptocurrencies in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} d-flex flex-column min-vh-100`}
      >
        <AuthProvider>
          <Navbar />
          <main className="py-4 flex-grow-1">{children}</main>
          <Footer />
          <Bootstrap />
        </AuthProvider>
      </body>
    </html>
  );
}
