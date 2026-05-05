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
  videos: any[]; 
  isLoading: boolean;
  error: string | null;

  fetchInitialData: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchProductions: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  fetchTrends: (country?: string) => Promise<void>;
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
  videos: [],
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      await Promise.allSettled([
        get().fetchOrders(),
        get().fetchProductions(),
        get().fetchTrends(),
        get().fetchAnalytics()
      ]);
    } catch (err: any) {
      console.error('❌ critical_fetch_failure:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ orders: data || [] });
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  },

  fetchProductions: async () => {
    try {
      const { data, error } = await supabase
        .from('productions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ productions: data || [], videos: data || [] });
    } catch (err) {
      console.error('Error fetching productions:', err);
    }
  },

  fetchVideos: async () => {
    return get().fetchProductions();
  },

  fetchTrends: async (country?: string) => {
    try {
      let query = supabase
        .from('trending_topics')
        .select('*')
        .order('viral_score', { ascending: false });
      
      if (country && country !== 'GLOBAL' && country !== 'ALL') {
        query = query.eq('country', country);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ trends: data || [] });
    } catch (err) {
      console.error('Error fetching trends:', err);
    }
  },

  fetchAnalytics: async () => {
    try {
      const { data, error } = await supabase
        .from('performance_snapshots')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ analytics: data || [] });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  },

  fetchSeries: async () => {
    try {
      const { data, error } = await supabase.from('series').select('*');
      if (error) throw error;
      set({ series: data || [] });
    } catch (err) {
      console.error('Error fetching series:', err);
    }
  },

  fetchEpisodes: async () => {
    try {
      const { data, error } = await supabase.from('episodes').select('*, series:series_id(title)');
      if (error) throw error;
      set({ episodes: data || [] });
    } catch (err) {
      console.error('Error fetching episodes:', err);
    }
  },

  fetchAgentLogs: async () => {
    try {
      const { data, error } = await supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      set({ agentLogs: data || [] });
    } catch (err) {
      console.error('Error fetching agent logs:', err);
    }
  },

  fetchSocialAccounts: async () => {
    try {
      const { data, error } = await supabase.from('user_social_accounts').select('*');
      if (error) throw error;
      set({ socialAccounts: data || [] });
    } catch (err) {
      console.error('Error fetching social accounts:', err);
    }
  },

  subscribeToChanges: () => {
    try {
      const channelId = `pipeline-changes-${Math.random().toString(36).slice(2, 9)}`;
      const channel = supabase
        .channel(channelId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => get().fetchOrders())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'productions' }, () => get().fetchProductions())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trending_topics' }, () => get().fetchTrends())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_logs' }, () => get().fetchAgentLogs())
        .subscribe();

      return () => {
        supabase.removeChannel(channel).catch(console.error);
      };
    } catch (err) {
      console.error('Failed to subscribe to changes:', err);
      return () => {};
    }
  },
}));
