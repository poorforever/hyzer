export interface ListeningHistoryItem {
  track_id: string;
  play_count: number;
  duration_ms: number;
  is_hit: boolean;
}

export interface AgentRequest {
  user_id: string;
  history: ListeningHistoryItem[];
  limit: number;
}

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  duration_ms: number;
  play_count?: number;
}
