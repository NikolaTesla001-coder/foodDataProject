"use client";

import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-black text-white">

        {pathname !== "/login" && pathname !== "/" && <Navbar />}

        {children}

      </body>
    </html>
  );
}