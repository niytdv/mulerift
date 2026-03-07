"use client";

import { useState } from "react";
import { Search, Download, MessageSquare, X } from "lucide-react";
import { AnalysisResult, SuspiciousAccount } from "@/lib/types";
import GraphDisplayCard from "./GraphDisplayCard";
import ExplainableRiskPanel from "./ExplainableRiskPanel";
import FraudRingTableCard from "./FraudRingTableCard";
import TimeVelocityCard from "./TimeVelocityCard";
import AIChatbotPanel from "./AIChatbotPanel";

interface Dashboard3DProps {
  data: AnalysisResult;
  edges: Array<{
    source: string;
    target: string;
    total_amount: number;
    earliest_timestamp: string;
    latest_timestamp: string;
  }>;
}

export default function Dashboard3D({ data, edges }: Dashboard3DProps) {
  console.log("🎯 Dashboard3D received:", {
    accounts: data.suspicious_accounts?.length,
    rings: data.fraud_rings?.length,
    edges: edges.length,
    sampleEdge: edges[0]
  });
  
  const [selectedAccount, setSelectedAccount] = useState<SuspiciousAccount | null>(null);
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideWhitelisted, setHideWhitelisted] = useState(false);
  const [timeVelocityFilter, setTimeVelocityFilter] = useState(72);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mulerift-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white relative">
      {/* Blurred Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/backgroundImage.png"
          alt="Background"
          className="w-full h-full object-cover blur-sm scale-105"
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/50 z-0" />

      {/* Grid Layout Container - Responsive */}
      <div className="relative z-10 h-full flex flex-col lg:grid lg:grid-cols-[1fr_350px]">
        {/* Left Content Area (Main Dashboard) */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">
                    <span className="text-cyan-400">MULE RIFT</span>
                    <span className="text-white/60 text-xs sm:text-sm ml-2 sm:ml-3 hidden sm:inline">
                      - REAL-TIME FINANCIAL ANOMALY DETECTION
                    </span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Chatbot Toggle */}
                  <button
                    onClick={() => setShowChatbot(!showChatbot)}
                    className="lg:hidden flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg sm:rounded-xl transition-colors backdrop-blur-sm text-xs sm:text-sm"
                  >
                    {showChatbot ? <X size={14} className="sm:w-4 sm:h-4" /> : <MessageSquare size={14} className="sm:w-4 sm:h-4" />}
                    <span>{showChatbot ? 'Close' : 'AI Chat'}</span>
                  </button>
                  
                  <button
                    onClick={handleDownloadJSON}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg sm:rounded-xl transition-colors backdrop-blur-sm text-xs sm:text-sm"
                  >
                    <Download size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">DOWNLOAD JSON EXPORT</span>
                    <span className="sm:hidden">EXPORT</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search Account ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              {/* Whitelist Toggle */}
              <label className="flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hideWhitelisted}
                    onChange={(e) => setHideWhitelisted(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </div>
                <span className="text-xs sm:text-sm text-white/80 whitespace-nowrap">
                  Hide Known Business
                </span>
              </label>
            </div>

            {/* 3D Graph Container with Glassmorphism */}
            <GraphDisplayCard
              accounts={data.suspicious_accounts}
              rings={data.fraud_rings}
              edges={edges}
              onNodeClick={setSelectedAccount}
              selectedRingId={selectedRingId}
              searchQuery={searchQuery}
              hideWhitelisted={hideWhitelisted}
              timeVelocityFilter={timeVelocityFilter}
            />

            {/* Time Velocity Slider with Glassmorphism */}
            <TimeVelocityCard
              value={timeVelocityFilter}
              onChange={setTimeVelocityFilter}
            />

            {/* Fraud Ring Table with Glassmorphism */}
            <FraudRingTableCard
              rings={data.fraud_rings}
              selectedRingId={selectedRingId}
              onRingSelect={setSelectedRingId}
            />
          </div>
        </div>

        {/* Right Sidebar (AI Chatbot) - Desktop always visible, Mobile toggleable */}
        <div className={`${showChatbot ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:block'} h-full overflow-hidden`}>
          <AIChatbotPanel analysisContext={data} />
          {showChatbot && (
            <button
              onClick={() => setShowChatbot(false)}
              className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-black/80 hover:bg-black/90 border border-cyan-500/30 rounded-lg transition-colors"
            >
              <X size={20} className="text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Explainable Risk Panel */}
      {selectedAccount && (
        <ExplainableRiskPanel
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
}
