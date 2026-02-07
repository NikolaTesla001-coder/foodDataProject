"use client";
type HistoryItem = {
  name: string;
  count: number;
  score: number | string;
  time?: string;
};


import { useEffect, useState } from "react";
import { useScanStore } from "../../store/useScanStore";
import * as XLSX from "xlsx";

export default function HistoryPage() {
    const storeHistory = useScanStore(s => s.history);
  const [History, setHistory] = useState<HistoryItem[]>([]);


  // prevent SSR mismatch
  useEffect(() => {
    setHistory(storeHistory);
  }, [storeHistory]);
  const { history, clearHistory } = useScanStore();

  const exportAll = () => {
    const ws = XLSX.utils.json_to_sheet(history);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "History");

    XLSX.writeFile(wb, "full_history.xlsx");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">History</h1>

        <div className="flex gap-3">
          <button
            onClick={exportAll}
            className="bg-green-600 px-4 py-2"
          >
            Export Excel
          </button>

          <button
            onClick={clearHistory}
            className="bg-red-600 px-4 py-2"
          >
            Clear
          </button>
        </div>
      </div>

      <table className="w-full border mt-2">
        <thead>
          <tr>
            <th>Name</th>
            <th>Count</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>

       <tbody>
  {Array.isArray(history) &&
    history.map((h, i) => (
      <tr key={i}>
        <td>{h.name}</td>
        <td>{h.count}</td>
        <td>{h.score}</td>
        <td>{h.time}</td>
      </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
