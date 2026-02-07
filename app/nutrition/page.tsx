"use client";

import { useState } from "react";
import axios from "axios";
import { useScanStore } from "../../store/useScanStore";

import * as XLSX from "xlsx";
import { saveToHistory } from "@/lib/history";

export default function NutritionPage() {
    const { addToHistory } = useScanStore();
  
  const { count } = useScanStore();

  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");

  const [score, setScore] = useState<number | null>(null);
  const [nutriSummary, setNutriSummary] = useState<any[]>([]);

  const [nutritionTable, setNutritionTable] = useState<any[]>([]);
  const [componentTable, setComponentTable] = useState<any[]>([]);

  // -------- FETCH FROM GOOGLE / OFF --------
  const fetchInfo = async () => {

    try {
      const res = await axios.get(
        `https://world.openfoodfacts.net/api/v2/product/${barcode}`
      );

      const p = res.data.product;

      // ✔ NAME FROM API ONLY
const realName =
  p.product_name || 
  p.brands || 
  "Unknown Product";

setProductName(realName);

const pos = p?.nutriscore_data?.positive_points || 0;
const neg = p?.nutriscore_data?.negative_points || 0;
const finalScore = pos - neg;

setScore(finalScore);

// USE THE FRESH VALUE DIRECTLY
addToHistory({
  name: realName,
  count: count || 1,
  score: finalScore,
  time: new Date().toISOString(),
});

setNutriSummary([
  { metric: "Positive Points", value: pos },
  { metric: "Negative Points", value: neg },
  { metric: "Final Score", value: finalScore },
]);


      // ---- NUTRITION TABLE ----
      const rows: any[] = [];

      Object.keys(p.nutriments || {}).forEach(key => {
        if (key.endsWith("_100g")) {
          const base = key.replace("_100g", "");
          const raw = p.nutriments[key];
const rounded =
  typeof raw === "number"
    ? Number(raw.toFixed(2))
    : raw;
          rows.push({
            nutrient: base,
            value: rounded,
            unit: p.nutriments[base + "_unit"] || "",
          });
        }
      });

      setNutritionTable(rows);

      // ---- COMPONENTS ----
      const comps = p?.nutriscore_data?.components || {};
      type ComponentRow = {
  component: string;
  value: number;
  unit: string;
  points: number;
  type: "Positive" | "Negative";
};
      const compRows: ComponentRow[] = [];

// NEGATIVE COMPONENTS
(comps.negative || []).forEach((c: any) => {
  compRows.push({
    component: c.id,
    value: Number(c.value?.toFixed?.(2) ?? c.value),
    unit: c.unit || "",
    points: c.points,
    type: "Negative",
  });
});

// POSITIVE COMPONENTS
(comps.positive || []).forEach((c: any) => {
  compRows.push({
    component: c.id,
    value: Number(c.value?.toFixed?.(2) ?? c.value),
    unit: c.unit || "",
    points: c.points,
    type: "Positive",
  });
});

setComponentTable(compRows);


    } catch (err) {
      alert("Invalid barcode");
    }
  };
  
  // -------- EXPORT ONLY 3 --------
  const exportExcel = () => {
   


saveToHistory({
  name: productName || "Unknown",
  count: count || 1,
  score: score ?? 0,
});


    const sheetData = [
      {
        name: productName,
        count: count || 1,
        score: score ?? "NA",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Data");

    XLSX.writeFile(wb, "nutrition.xlsx");
  };

  return (
  <div className="min-h-screen bg-[#f2f2f2] text-black">

    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Nutrition Analyzer
        </h1>
        <p className="text-black/60 mt-1">
          Powered by OpenFoodFacts
        </p>
      </div>

      {/* ===== INPUT CARD ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 border">

        <div>
          <label className="text-sm text-black/60 block mb-1">
            Barcode Number
          </label>

          <input
            className="
              w-full rounded-xl border
              px-3 py-2 bg-white
              focus:border-black/30 outline-none transition
            "
            placeholder="Enter Barcode"
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
          />
        </div>

        <button
          className="
            w-full p-3 rounded-xl
            bg-black text-white
            hover:bg-black/90 transition
            font-medium
          "
          onClick={fetchInfo}
        >
          Fetch Nutrition Data
        </button>

        {/* COUNT DISPLAY */}
        <div className="bg-gray-100 rounded-xl p-3 flex justify-between">
          <span className="text-black/60">Detected Count</span>
          <span className="font-semibold">{count}</span>
        </div>

        {/* PRODUCT NAME */}
        {productName && (
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="text-black/60 text-sm mb-1">Product</div>
            <div className="font-medium">{productName}</div>
          </div>
        )}
      </div>

      {/* ===== NUTRITION FACTS ===== */}
      {nutritionTable.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5 border">

          <h3 className="text-lg font-semibold mb-3">
            Nutrition Facts (per 100g)
          </h3>

          <div className="divide-y">
            {nutritionTable.map((r, i) => (
              <div
                key={i}
                className="flex justify-between py-2"
              >
                <span className="capitalize text-black/80">
                  {r.nutrient.replace(/_/g, " ")}
                </span>

                <span className="font-medium">
                  {r.value} {r.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== COMPONENT TABLE ===== */}
      {componentTable.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5 border">

          <h3 className="text-lg font-semibold mb-4">
            Nutri-Score Components
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="text-black/60 border-b">
                <tr>
                  <th className="p-2 text-left">Component</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Unit</th>
                  <th className="p-2 text-left">Points</th>
                  <th className="p-2 text-left">Type</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {componentTable.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">

                    <td className="p-2 capitalize">
                      {String(c.component).replace(/_/g, " ")}
                    </td>

                    <td className="p-2">{c.value}</td>

                    <td className="p-2 text-black/60">
                      {c.unit}
                    </td>

                    <td className="p-2 font-semibold">
                      {c.points}
                    </td>

                    <td className={`p-2 font-medium ${
                      c.type === "Positive"
                        ? "text-green-700"
                        : "text-red-600"
                    }`}>
                      {c.type}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* ===== SUMMARY ===== */}
      {nutriSummary.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5 border">

          <h3 className="text-lg font-semibold mb-3">
            Nutri-Score Summary
          </h3>

          <table className="w-full text-sm">
            <tbody className="divide-y">

              {nutriSummary.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">

                  <td className="p-2 text-black/70">
                    {r.metric}
                  </td>

                  <td className="p-2 font-semibold text-right">
                    {r.value}
                  </td>

                </tr>
              ))}

            </tbody>
          </table>

        </div>
      )}

      {/* ===== EXPORT ===== */}
      {score !== null && (
        <button
          className="
            w-full p-3 rounded-xl
            bg-gray-200 hover:bg-gray-300
            transition text-sm
          "
          onClick={exportExcel}
        >
          Download Excel Report
        </button>
      )}

    </div>
  </div>
);


}