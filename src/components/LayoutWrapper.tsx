"use client";

import { usePathname } from "next/navigation";
import Navbar from "../features/landing/Navbar";
import Footer from "../features/landing/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHide =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup";

  return (
    <>
      {!shouldHide && <Navbar />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
}
