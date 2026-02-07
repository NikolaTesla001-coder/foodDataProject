"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-slate-900 text-white flex gap-6">
      <Link href="/capture">Capture</Link>
      <Link href="/nutrition">Nutrition</Link>
      <Link href="/history">History</Link>
    </nav>
  );
}
