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
      className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all ${
        isDragging 
          ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]" 
          : "border-white/20 bg-black/20 hover:border-white/30 hover:bg-black/30"
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
        <svg 
          className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-cyan-400/70" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        <p className="text-base sm:text-lg font-medium text-white/90 mb-2">
          {isLoading ? "Analyzing..." : "Drop CSV file here"}
        </p>
        <p className="text-white/50 text-xs sm:text-sm">or click to browse</p>
      </label>
    </div>
  );
}
