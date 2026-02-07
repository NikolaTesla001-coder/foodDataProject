"use client";

import { useState, useRef } from "react";
import { exportCapture } from "../../lib/excel";
import Webcam from "react-webcam";
import { useScanStore } from "../../store/useScanStore";

export default function CapturePage() {
    const { addToHistory } = useScanStore();
    const [showConfirm, setShowConfirm] = useState(false);
const [detectedTemp, setDetectedTemp] = useState<number | null>(null);
const [toast, setToast] = useState("");

  const { setCount, setProductName, count } = useScanStore();
  const [facing, setFacing] = useState<"user" | "environment">("environment");

  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const webcamRef = useRef<Webcam>(null);

  const captureFromCamera = () => {
    const imgSrc = webcamRef.current?.getScreenshot();
    if (!imgSrc) return;

    setPreview(imgSrc);

    fetch(imgSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
        setImage(file);
      });
  };

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

const handleCount = async () => {

  if (!image) {
    setCount(1);
    setDetectedTemp(1);
    setShowConfirm(true);
    return;
  }

  setLoading(true);

  try {
    const form = new FormData();
    form.append("file", image);

    const res = await fetch("/api/count", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    setCount(data.count);

    // Instead of direct save → open confirmation
    setDetectedTemp(data.count);
    setShowConfirm(true);

  } catch (err) {
    console.log(err);
    setCount(1);

    setDetectedTemp(1);
    setShowConfirm(true);
  }

  setLoading(false);
};

const saveToHistoryConfirmed = () => {
  addToHistory({
    name: name || "Unknown",
    count: detectedTemp || 1,
    score: 0,
    time: new Date().toLocaleString(),
  });

  setShowConfirm(false);

  setToast("Saved to history ✓");

  setTimeout(() => setToast(""), 2000);
};



 

return (
  <div className="min-h-screen bg-[#f5f5f7] text-black">
    
    {/* Content Container */}
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">

      {/* Title */}
      <h1 className="text-2xl font-semibold tracking-tight">
        Scan Items
      </h1>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 space-y-4">

        {/* Product Name */}
        <div>
          <label className="text-sm text-black/60 mb-1 block">
            Product name
          </label>

          <input
            className="
              w-full rounded-xl border border-black/10
              px-3 py-2 outline-none
              focus:border-black/30 transition
            "
            placeholder="e.g. Apple Juice Bottle"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Mode Switch */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("upload")}
            className={`
              p-3 rounded-xl border transition text-sm
              ${mode === "upload"
                ? "bg-black text-white"
                : "border-black/10 hover:bg-black/5"
              }
            `}
          >
            Upload Photo
          </button>

          <button
            onClick={() => setMode("camera")}
            className={`
              p-3 rounded-xl border transition text-sm
              ${mode === "camera"
                ? "bg-black text-white"
                : "border-black/10 hover:bg-black/5"
              }
            `}
          >
            Use Camera
          </button>
        </div>

        {/* Upload */}
        {mode === "upload" && (
          <input
            type="file"
            onChange={handleUpload}
            className="
              w-full text-sm
              file:mr-3 file:px-3 file:py-2
              file:rounded-xl file:border-0
              file:bg-black/5 file:text-black
            "
          />
        )}

        {/* Camera */}
{mode === "camera" && (
  <>
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="w-full rounded-xl"
      videoConstraints={{
        facingMode: facing
      }}
    />

   <div className="grid grid-cols-2 gap-3 mt-3">

  <button
    onClick={captureFromCamera}
    className="
      w-full py-2.5 rounded-xl
      bg-black text-white
      hover:bg-black/90 active:scale-[0.98]
      transition font-medium
      border border-black
    "
  >
    Capture
  </button>

  <button
    onClick={() =>
      setFacing(facing === "environment" ? "user" : "environment")
    }
    className="
      w-full py-2.5 rounded-xl
      bg-white text-black
      border border-black/20
      hover:bg-gray-100 active:scale-[0.98]
      transition font-medium
    "
  >
    Switch Camera
  </button>

</div>

  </>
)}


        {/* Preview */}
        {preview && (
          <img
            src={preview}
            className="w-full rounded-xl border border-black/10"
          />
        )}

        {/* Primary Action */}
        <button
          onClick={handleCount}
          className="
            w-full p-3 rounded-xl
            bg-black text-white
            hover:bg-black/90 transition
            font-medium
          "
        >
          {loading ? "Calculating…" : "Calculate Items"}
        </button>

        {/* Result */}
        <div className="text-center pt-2">
          <div className="text-sm text-black/60">
            Detected count
          </div>

          <div className="text-4xl font-semibold tracking-tight">
            {count}
          </div>
        </div>

        {/* Export */}
        <button
          className="
            w-full p-3 rounded-xl
            border border-black/10
            hover:bg-black/5 transition text-sm
          "
          onClick={() => exportCapture(name, count)}
        >
          Export to Excel
        </button>

      </div>
    </div>
    {/* CONFIRM MODAL */}
{showConfirm && (
  <div className="
    fixed inset-0 bg-black/40
    flex items-center justify-center z-50
  ">
    <div className="
      bg-white rounded-2xl p-5
      w-[90%] max-w-sm shadow-lg
    ">

      <h3 className="text-lg font-semibold mb-2">
        Save Result?
      </h3>

      <p className="text-black/70 mb-4">
        Detected count = {detectedTemp}
      </p>
      {/* TOAST */}
{toast && (
  <div className="
    fixed bottom-4 right-4
    bg-black text-white
    px-4 py-2 rounded-xl shadow
  ">
    {toast}
  </div>
)}

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={() => setShowConfirm(false)}
          className="
            py-2 rounded-xl border
            hover:bg-black/5
          "
        >
          Cancel
        </button>

        <button
          onClick={saveToHistoryConfirmed}
          className="
            py-2 rounded-xl
            bg-black text-white
            hover:bg-black/90
          "
        >
          Save
        </button>

      </div>
    </div>
  </div>
)}

  </div>
);

}
