"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="p-4 bg-black text-white flex gap-6 items-center">

      <Link href="/" className="font-semibold">
        NutriScan
      </Link>

      <Link href="/capture">Capture</Link>
      <Link href="/nutrition">Nutrition</Link>
      <Link href="/history">History</Link>

      <button
        onClick={logout}
        className="ml-auto text-sm hover:opacity-70"
      >
        Logout
      </button>

    </nav>
  );
}
