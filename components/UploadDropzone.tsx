"use client";

import { useState, useCallback } from "react";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function UploadDropzone({ onFileSelect, isLoading }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-4 border-dashed rounded-xl p-12 text-center transition-colors ${
        isDragging ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white"
      }`}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        disabled={isLoading}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-xl font-semibold text-gray-700 mb-2">
          {isLoading ? "Analyzing..." : "Drop CSV file here"}
        </p>
        <p className="text-gray-500">or click to browse</p>
      </label>
    </div>
  );
}
