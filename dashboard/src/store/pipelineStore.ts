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
  uniqueCountries: string[];
  uniqueLanguages: string[];
  analyticsData: {
    totalViews: number;
    totalWatchTime: number;
    avgRetention: number;
    engagement: number;
    topPerformers: any[];
  };
  series: any[];
  episodes: any[];
  isLoading: boolean;
  error: string | null;

  fetchInitialData: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchProductions: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  fetchTrends: (country?: string, language?: string) => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
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
  uniqueCountries: [],
  uniqueLanguages: [],
  analyticsData: {
    totalViews: 0,
    totalWatchTime: 0,
    avgRetention: 0,
    engagement: 0,
    topPerformers: [],
  },
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
        get().fetchAnalytics(),
        get().fetchFilterOptions(),
        get().fetchSeries(),
        get().fetchEpisodes()
      ]);
    } catch (err: any) {
      console.error('❌ critical_fetch_failure:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSeries: async () => {
    try {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ series: data || [] });
    } catch (err) {
      console.error('Error fetching series:', err);
    }
  },

  fetchEpisodes: async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, series:series_id(title)')
        .order('scheduled_at', { ascending: true })
        .limit(10);
      if (error) throw error;
      set({ episodes: data || [] });
    } catch (err) {
      console.error('Error fetching episodes:', err);
    }
  },

  fetchAnalytics: async () => {
    try {
      const { data: snapshots, error: snapError } = await supabase
        .from('performance_snapshots')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (snapError) throw snapError;

      const totalViews = snapshots?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;
      const totalWatchTime = snapshots?.reduce((acc, curr) => acc + (curr.watch_time || 0), 0) || 0;
      
      const { data: topProds, error: prodError } = await supabase
        .from('productions')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;

      set({ 
        analytics: snapshots || [],
        analyticsData: {
          totalViews,
          totalWatchTime,
          avgRetention: 62, 
          engagement: Math.floor(totalViews * 0.08),
          topPerformers: topProds || []
        }
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  },

  fetchFilterOptions: async () => {
    try {
      // Vi henter unike land og språk direkte fra databasen
      const { data, error } = await supabase
        .from('trending_topics')
        .select('country, language');
      
      if (error) throw error;

      const countries = Array.from(new Set(data.map(i => i.country).filter(Boolean))) as string[];
      const languages = Array.from(new Set(data.map(i => i.language).filter(Boolean))) as string[];
      
      set({ 
        uniqueCountries: countries.sort(), 
        uniqueLanguages: languages.sort() 
      });
    } catch (err) {
      console.error('Error fetching filter options:', err);
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

  fetchTrends: async (country?: string, language?: string) => {
    set({ trends: [], isLoading: true }); // Clear trends and show loading immediately
    try {
      let query = supabase
        .from('trending_topics')
        .select('*')
        .order('viral_score', { ascending: false });
      
      if (country && country !== 'GLOBAL' && country !== 'ALL') {
        query = query.eq('country', country);
      }

      if (language && language !== 'ALL') {
        query = query.eq('language', language.toLowerCase());
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Sikre at vi alltid sorterer etter viral_score (høyest først)
      const sortedTrends = (data || []).sort((a, b) => (b.viral_score || 0) - (a.viral_score || 0));
      
      set({ trends: sortedTrends });
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      set({ isLoading: false });
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'performance_snapshots' }, () => get().fetchAnalytics())
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
