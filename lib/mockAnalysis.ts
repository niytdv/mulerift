/**
 * Mock analysis for Vercel deployment
 * Since Vercel doesn't support Python, we provide sample data
 * In production, you would call an external Python API
 */

import { AnalysisResult } from './types';

export function getMockAnalysisResult(): AnalysisResult {
  return {
    suspicious_accounts: [
      {
        account_id: "ACC002",
        suspicion_score: 100.0,
        detected_patterns: ["cycle_length_3", "high_velocity", "shell_hop_3"],
        ring_id: "RING_001"
      },
      {
        account_id: "ACC003",
        suspicion_score: 100.0,
        detected_patterns: ["cycle_length_3", "high_velocity", "shell_hop_3"],
        ring_id: "RING_001"
      },
      {
        account_id: "ACC004",
        suspicion_score: 100.0,
        detected_patterns: ["cycle_length_3", "high_velocity", "shell_hop_3"],
        ring_id: "RING_001"
      },
      {
        account_id: "ACC006",
        suspicion_score: 70.0,
        detected_patterns: ["fan_in_aggregation", "high_velocity"],
        ring_id: "RING_002"
      },
      {
        account_id: "ACC010",
        suspicion_score: 70.0,
        detected_patterns: ["fan_out_distribution", "high_velocity"],
        ring_id: "RING_003"
      }
    ],
    fraud_rings: [
      {
        ring_id: "RING_001",
        member_accounts: ["ACC002", "ACC003", "ACC004"],
        pattern_type: "cycle",
        risk_score: 100.0
      },
      {
        ring_id: "RING_002",
        member_accounts: ["ACC001", "ACC006", "ACC007", "ACC008", "ACC009"],
        pattern_type: "smurfing",
        risk_score: 70.0
      },
      {
        ring_id: "RING_003",
        member_accounts: ["ACC005", "ACC010", "ACC011"],
        pattern_type: "smurfing",
        risk_score: 70.0
      }
    ],
    summary: {
      total_accounts_analyzed: 11,
      suspicious_accounts_flagged: 5,
      fraud_rings_detected: 3,
      processing_time_seconds: 0.1
    }
  };
}
