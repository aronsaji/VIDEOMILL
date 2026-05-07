export type AgentStatus = 'ACTIVE' | 'IDLE' | 'SCANNING' | 'ERROR';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  function: string;
}

export interface Production {
  id: string;
  title: string;
  thumbnail?: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
  quality?: string;
  created_at: string;
  progress?: number;
  error?: string;
  caption_style?: string;
  transition_style?: string;
}

export interface TrendTopic {
  id: string;
  topic: string;
  viral_score: number;
  country: string;
  language: string;
  growth: number;
}
