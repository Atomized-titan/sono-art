"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/ui/footer";

const routesWithoutNavbarFooter = ["/terms", "/privacy", "/frame"];

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldRenderNavbarFooter =
    routesWithoutNavbarFooter.some((route) => pathname.includes(route)) ===
    false;

  return (
    <>
      {shouldRenderNavbarFooter && <Navbar />}
      {children}
      {shouldRenderNavbarFooter && <Footer />}
    </>
  );
}
