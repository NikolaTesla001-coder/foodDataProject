"use client";

import { useState, useRef } from "react";
import { exportCapture } from "../../lib/excel";
import Webcam from "react-webcam";
import { useScanStore } from "../../store/useScanStore";

export default function CapturePage() {
    const { addToHistory } = useScanStore();
  const { setCount, setProductName, count } = useScanStore();

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
  addToHistory({
  name: name || "Unknown",
  count: count ,
  score: 0,         
  time: new Date().toLocaleString(),
});
  if (!image) {
    setCount(1);
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

  } catch (err) {
    console.log(err);
    setCount(1);
  }

  setLoading(false);
};


 

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-4">
        Object Counter
      </h1>

      <input
        className="w-full border p-2 mb-4 bg-black"
        placeholder="Product name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <button onClick={() => setMode("upload")}>
          Upload
        </button>

        <button onClick={() => setMode("camera")}>
          Camera
        </button>
      </div>

      {mode === "upload" && (
        <input type="file" onChange={handleUpload} />
      )}

      {mode === "camera" && (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full"
          />

          <button onClick={captureFromCamera}>
            Capture
          </button>
        </>
      )}

      {preview && (
        <img src={preview} className="mt-4 w-64" />
      )}

      <button
        onClick={handleCount}
        className="mt-4 bg-blue-600 px-4 py-2"
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>

      <p className="mt-2">
        Current count: {count}
      </p>

      <button
  className="mt-4 bg-green-600 text-white px-4 py-2"
  onClick={() => exportCapture(name, count)}
>
  Export to Excel
</button>

    </div>
  );
}
