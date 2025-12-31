import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import ToastProvider from "../components/ToastProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nasow.com"),
  title: "Nasow UNILAG",
  description:
    "Nasow UNILAG is a platform dedicated to connecting students and alumni of the University of Lagos (UNILAG) for networking, collaboration, and career development opportunities.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Nasow UNILAG",
    description:
      "Nasow UNILAG is a platform dedicated to connecting students and alumni of the University of Lagos (UNILAG) for networking, collaboration, and career development opportunities.",
    url: "https://www.nasow.com/",
    siteName: "Nasow UNILAG",
    images: [
      {
        url: "/assets/logo.svg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nasow UNILAG",
    description:
      "Nasow UNILAG is a platform dedicated to connecting students and alumni of the University of Lagos (UNILAG) for networking, collaboration, and career development opportunities.",
    images: ["/assets/logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ToastProvider />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
