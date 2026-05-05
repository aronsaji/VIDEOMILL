import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface PipelineState {
  orders: any[];
  productions: any[];
  trends: any[];
  analytics: any[];
  series: any[];
  episodes: any[];
  agentLogs: any[];
  socialAccounts: any[];
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  fetchProductions: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchSeries: () => Promise<void>;
  fetchEpisodes: () => Promise<void>;
  fetchAgentLogs: () => Promise<void>;
  fetchSocialAccounts: () => Promise<void>;
  subscribeToChanges: () => () => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  orders: [],
  productions: [],
  trends: [],
  analytics: [],
  series: [],
  episodes: [],
  agentLogs: [],
  socialAccounts: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    set({ orders: data || [] });
  },

  fetchProductions: async () => {
    const { data } = await supabase
      .from('productions')
      .select('*')
      .order('created_at', { ascending: false });
    set({ productions: data || [] });
  },

  fetchTrends: async () => {
    const { data } = await supabase
      .from('trending_topics')
      .select('*')
      .order('viral_score', { ascending: false });
    set({ trends: data || [] });
  },

  fetchAnalytics: async () => {
    const { data } = await supabase
      .from('performance_snapshots')
      .select('*')
      .order('timestamp', { ascending: false });
    set({ analytics: data || [] });
  },

  fetchSeries: async () => {
    const { data } = await supabase.from('series').select('*');
    set({ series: data || [] });
  },

  fetchEpisodes: async () => {
    const { data } = await supabase.from('episodes').select('*, series:series_id(title)');
    set({ episodes: data || [] });
  },

  fetchAgentLogs: async () => {
    const { data } = await supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(50);
    set({ agentLogs: data || [] });
  },

  fetchSocialAccounts: async () => {
    const { data } = await supabase.from('user_social_accounts').select('*');
    set({ socialAccounts: data || [] });
  },

  subscribeToChanges: () => {
    const channel = supabase
      .channel('pipeline-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => get().fetchOrders())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productions' }, () => get().fetchProductions())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trending_topics' }, () => get().fetchTrends())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_logs' }, () => get().fetchAgentLogs())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
