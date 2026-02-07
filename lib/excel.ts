import * as XLSX from "xlsx";

export function exportCapture(name: string, count: number) {

  const data = [
    { Name: name || "Unknown", Count: count }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Capture");

  XLSX.writeFile(wb, "capture_data.xlsx");
}
