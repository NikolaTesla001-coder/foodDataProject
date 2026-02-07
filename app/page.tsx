"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-black flex items-center justify-center">

      <div className="max-w-2xl mx-auto px-6 py-12 text-center space-y-6">

        {/* LOGO AREA */}
        <div className="text-4xl font-semibold tracking-tight">
          NutriScan
        </div>

        <p className="text-black/60 text-lg">
          Scan • Count • Analyze Nutrition in Seconds
        </p>

        {/* MAIN CTA */}
        <Link href="/capture">
          <button className="
            mt-4 px-6 py-3 rounded-xl
            bg-black text-white
            hover:bg-black/90 transition
            text-lg font-medium
          ">
            Click Here to Scan
          </button>
        </Link>

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

        <p className="text-sm text-black/50 mt-6">
          Designed for NGO field workers & nutrition audits
        </p>

      </div>
    </div>
  );
}
