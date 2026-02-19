"use client";

interface SummaryStatsProps {
  summary: {
    total_accounts: number;
    flagged_accounts: number;
    rings_detected: number;
    processing_time_ms: number;
  };
}

export default function SummaryStats({ summary }: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm">Total Accounts</p>
        <p className="text-3xl font-bold text-gray-800">{summary.total_accounts}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm">Flagged Accounts</p>
        <p className="text-3xl font-bold text-red-600">{summary.flagged_accounts}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm">Rings Detected</p>
        <p className="text-3xl font-bold text-orange-600">{summary.rings_detected}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm">Processing Time</p>
        <p className="text-3xl font-bold text-blue-600">{summary.processing_time_ms}ms</p>
      </div>
    </div>
  );
}
