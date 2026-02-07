"use client";

import { useEffect, useState } from "react";
import { useScanStore } from "../../store/useScanStore";
import * as XLSX from "xlsx";

type HistoryItem = {
  name: string;
  count: number;
  score: number | string;
  time?: string;
};

export default function HistoryPage() {

  // ONLY READ STORE ON CLIENT
  const storeHistory = useScanStore(s => s.history);
  const clearHistory = useScanStore(s => s.clearHistory);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);
   useEffect(() => {
    useScanStore.getState().loadFromStorage();
  }, []);
  useEffect(() => {
    setHistory(storeHistory);
    setMounted(true);
  }, [storeHistory]);

  // CRITICAL – stop SSR mismatch
  if (!mounted) return null;

  const exportAll = () => {
    const ws = XLSX.utils.json_to_sheet(history);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "History");

    XLSX.writeFile(wb, "full_history.xlsx");}
  return (
  <div className="min-h-screen bg-[#f5f5f7] text-black">

    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          History
        </h1>

        <div className="flex gap-2">
          <button
            onClick={exportAll}
            className="
              px-3 py-2 rounded-xl
              border border-black/10
              hover:bg-black/5 transition
              text-sm
            "
          >
            Export Excel
          </button>

          <button
            onClick={clearHistory}
            className="
              px-3 py-2 rounded-xl
              border border-red-200 text-red-600
              hover:bg-red-50 transition
              text-sm
            "
          >
            Clear
          </button>
        </div>
      </div>

      {/* Empty State */}
      {(!Array.isArray(history) || history.length === 0) && (
        <div className="
          bg-white rounded-2xl p-6
          text-center text-black/60
          border border-black/5
        ">
          No scans yet
        </div>
      )}

      {/* Timeline Cards */}
      {Array.isArray(history) &&
        history.map((h, i) => (
          <div
            key={i}
            className="
              bg-white rounded-2xl p-4
              border border-black/5 shadow-sm
            "
          >
            <div className="flex justify-between items-start">

              {/* Left */}
              <div>
                <div className="font-medium">
                  {h.name}
                </div>

                {h.time && (
                  <div className="text-xs text-black/50 mt-1">
                    {h.time}
                  </div>
                )}
              </div>

              {/* Right */}
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {h.count}
                </div>

                <div className="text-xs text-black/60">
                  score {h.score}
                </div>
              </div>

            </div>
          </div>
      ))}

    </div>
  </div>
);

  }
