import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SecurePass - Password Generator",
  description:
    "Generate strong and secure passwords instantly with SecurePass.",
  keywords: [
    "password generator",
    "secure password",
    "random password",
    "strong password",
    "cyber security",
  ],
  authors: [{ name: "SecurePass" }],
  creator: "SecurePass",
  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "SecurePass - Password Generator",
    description:
      "Modern secure password generator built with Next.js and Material UI.",
    url: "https://yourdomain.com",
    siteName: "SecurePass",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SecurePass - Password Generator",
    description: "Generate strong and secure passwords instantly.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className="
          min-h-screen
          bg-[#050816]
          text-white
          antialiased
          font-sans
          overflow-x-hidden
        "
      >
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_40%)]" />
        </div>

        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
