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
      setProductName(
        p.product_name || 
        p.brands || 
        "Unknown Product"
      );

      // SCORE
      const pos = p?.nutriscore_data?.positive_points || 0;
      const neg = p?.nutriscore_data?.negative_points || 0;
      const finalScore = pos - neg;


      setScore(pos - neg);
      addToHistory({
  name: productName || "Unknown",
  count: count || 1,
  score: finalScore,
});


      // ---- NUTRITION TABLE ----
      const rows: any[] = [];

      Object.keys(p.nutriments || {}).forEach(key => {
        if (key.endsWith("_100g")) {
          const base = key.replace("_100g", "");

          rows.push({
            nutrient: base,
            value: p.nutriments[key],
            unit: p.nutriments[base + "_unit"] || "",
          });
        }
      });

      setNutritionTable(rows);

      // ---- COMPONENTS ----
      const comps = p?.nutriscore_data?.components || {};

      const compRows = [
        ...(comps.negative || []),
        ...(comps.positive || []),
      ];

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
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl mb-4">Nutrition Analyzer</h1>

      <input
        className="border p-2 w-full"
        placeholder="Enter Barcode"
        value={barcode}
        onChange={e => setBarcode(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 mt-2"
        onClick={fetchInfo}
      >
        Fetch
      </button>
      {/* COUNT FROM TAB 1 */}
<div className="mt-4 p-3 border bg-gray-900 text-white">
  <span className="text-gray-400">Detected Count:</span>{" "}
  <span className="font-bold text-lg">{count}</span>
</div>

    {productName && (
  <div className="mt-4 p-3 border bg-gray-900 text-white">
    <span className="text-gray-400">Product:</span>{" "}
    <span className="font-semibold">{productName}</span>
  </div>
)}

      {/* ===== TABLE 1 ===== */}
    
      {nutritionTable.length > 0 && (
        <>
          <h3 className="mt-6 text-xl">
            Nutrition Facts (per 100g)
          </h3>

          <table className="w-full mt-2 border">

            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Value</th>
                <th>Unit</th>
              </tr>
            </thead>

            <tbody>
              {nutritionTable.map((r, i) => (
                <tr key={i}>
                  <td>{r.nutrient}</td>
                  <td>{r.value}</td>
                  <td>{r.unit}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </>
      )}

      {/* ===== TABLE 2 ===== */}

      {componentTable.length > 0 && (
        <>
          <h3 className="mt-6 text-xl">
            Nutri-Score Components
          </h3>

          <table className="w-full mt-2 border">

            <thead>
              <tr>
                <th>ID</th>
                <th>Value</th>
                <th>Points</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {componentTable.map((c, i) => (
                <tr key={i}>
                  <td>{c.id}</td>
                  <td>{c.value}</td>
                  <td>{c.points}</td>
                  <td>{c.type}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </>
      )}

      {/* ===== EXPORT ===== */}

      {score !== null && (
        <button
          className="bg-green-600 text-white px-4 py-2 mt-6"
          onClick={exportExcel}
        >
          Download the excel file
        </button>
      )}

    </div>
  );
}
