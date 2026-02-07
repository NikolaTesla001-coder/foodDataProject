"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-black text-white flex gap-6 items-center">

      <Link href="/" className="font-semibold">
        NutriScan
      </Link>

      <Link href="/capture">Capture</Link>
      <Link href="/nutrition">Nutrition</Link>
      <Link href="/history">History</Link>

    </nav>
  );
}
