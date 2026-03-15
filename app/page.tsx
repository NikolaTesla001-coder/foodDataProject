"use client";

import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function HomePage() {

  const router = useRouter();
  
  const guestLogin = () => {
    localStorage.setItem("mode","guest");
    router.push("/capture");
  };

  const userLogin = () => {
    router.push("/login");
  };

  return (
    
    <div className="min-h-screen bg-[#f2f2f2] text-black flex items-center justify-center">

      <SpeedInsights/>

      <div className="max-w-2xl mx-auto px-6 py-12 text-center space-y-6">

        {/* LOGO */}
        <div className="text-4xl font-semibold tracking-tight">
          NutriScan
        </div>

        <p className="text-black/60 text-lg">
          Scan • Count • Analyze Nutrition in Seconds
        </p>

        {/* MAIN CTA */}
        

        {/* LOGIN OPTIONS */}
        <div className="flex gap-3 justify-center mt-4">

          <button
            onClick={userLogin}
            className="
              px-4 py-2 rounded-xl border
              hover:bg-black/5 transition
            "
          >
            Login
          </button>

        

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

          <div className="bg-white p-4 rounded-xl border">
            📸 Count Items via Camera
          </div>

          <div className="bg-white p-4 rounded-xl border">
            🧃 Barcode Nutrition
          </div>

          <div className="bg-white p-4 rounded-xl border">
            📊 Export Reports
          </div>

        </div>

      
      </div>
    </div>
  );
}