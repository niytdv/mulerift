export interface Account {
  account_id: string;
  fraud_score: number;
  ring_id: string | null;
  patterns: string[];
}

export interface FraudRing {
  ring_id: string;
  pattern: string;
  members: string[];
  avg_score: number;
}

export interface AnalysisResult {
  summary: {
    total_accounts: number;
    flagged_accounts: number;
    rings_detected: number;
    processing_time_ms: number;
  };
  accounts: Account[];
  rings: FraudRing[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}

export interface GraphNode {
  id: string;
  type: 'account' | 'shared_entity';
  label: string;
  fraud_score?: number;
  ring_id?: string | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
}
