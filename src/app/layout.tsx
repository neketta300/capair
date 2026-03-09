import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider";
import { I18nProvider } from "@/components/I18nProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Capair — Vocabulary Learning",
  description: "A focused, warm, minimal vocabulary learning application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Capair",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2C3E50",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Capair" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2C3E50" />
        <meta name="background-color" content="#FAF8F5" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <I18nProvider>
          <KeyboardShortcutsProvider>{children}</KeyboardShortcutsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
