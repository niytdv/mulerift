"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadDropzone from "@/components/UploadDropzone";

export default function HomePage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      
      // Generate edges from analysis result
      const { generateGraphEdges } = await import("@/lib/graphUtils");
      const edges = generateGraphEdges(result);
      
      // Store both result and edges
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      sessionStorage.setItem("graphEdges", JSON.stringify(edges));
      
      console.log("✅ CSV analyzed:", {
        accounts: result.suspicious_accounts?.length,
        rings: result.fraud_rings?.length,
        edges: edges.length
      });
      
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunSample = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/sample", { method: "POST" });
      if (!response.ok) throw new Error("Sample analysis failed");

      const result = await response.json();
      
      // Generate edges from analysis result since we're using sample data
      const { generateGraphEdges } = await import("@/lib/graphUtils");
      const edges = generateGraphEdges(result);
      
      // Store both result and edges
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      sessionStorage.setItem("graphEdges", JSON.stringify(edges));
      
      console.log("✅ Sample data loaded:", {
        accounts: result.suspicious_accounts?.length,
        rings: result.fraud_rings?.length,
        edges: edges.length
      });
      
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      {/* Full Screen Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src="/vid/landing-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      {/* UI Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2 drop-shadow-[0_0_50px_rgba(0,255,255,0.5)] tracking-tighter">
            MuleRift
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-cyan-300/90 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)] font-light tracking-wide">
            AI-Powered Fraud Detection
          </p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-[0_0_60px_rgba(0,255,255,0.15)] max-w-2xl w-full">
            <UploadDropzone onFileSelect={handleFileUpload} isLoading={isAnalyzing} />

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-white text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={handleRunSample}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md text-cyan-300 rounded-xl text-sm sm:text-base font-medium hover:from-cyan-500/30 hover:to-blue-500/30 disabled:opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] disabled:hover:scale-100 border border-cyan-500/30"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Run Sample Data"
                )}
              </button>
            </div>
          </div>
      </div>
    </main>
  );
}
