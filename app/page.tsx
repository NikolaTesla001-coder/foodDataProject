"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
    }
  }, [router]); // ✅ important

  const userLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-black flex items-center justify-center">

      <SpeedInsights />

      <div className="max-w-2xl mx-auto px-6 py-12 text-center space-y-6">

        <div className="text-4xl font-semibold tracking-tight">
          NutriScan
        </div>

        <p className="text-black/60 text-lg">
          Scan • Count • Analyze Nutrition in Seconds
        </p>

        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={userLogin}
            className="px-4 py-2 rounded-xl border hover:bg-black/5 transition"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}