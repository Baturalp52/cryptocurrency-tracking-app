import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Bootstrap from "./bootstrap";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { getCurrentUser } from "@/services/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {}

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* This script runs immediately during HTML parsing, before any other JavaScript */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Try to get the saved theme from localStorage
                  var savedTheme = localStorage.getItem('theme');
                  
                  // If no saved theme, check system preference
                  if (!savedTheme || savedTheme === 'system') {
                    savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
                      ? 'dark' 
                      : 'light';
                  }
                  
                  // Apply theme to document immediately
                  document.documentElement.setAttribute('data-bs-theme', savedTheme);
                  
                  // Add a class to indicate theme is set
                  document.documentElement.classList.add('theme-initialized');
                } catch (e) {
                  // Fallback to light theme if there's any error
                  document.documentElement.setAttribute('data-bs-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} d-flex flex-column min-vh-100`}
      >
        <AuthProvider initialUser={user?.user ?? null}>
          <ThemeProvider>
            <Navbar />
            <main className="py-4 flex-grow-1">{children}</main>
            <Footer />
            <Bootstrap />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
