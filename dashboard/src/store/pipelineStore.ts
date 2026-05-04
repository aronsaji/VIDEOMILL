import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, OrderStatus } from '../types';

interface PipelineState {
  orders: any[];
  trends: any[];
  isInitialLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
  addOrder: (order: Partial<Order>) => void;
  updateOrder: (videoId: string, updates: Partial<Order>) => void;
  retryOrder: (order: Order) => Promise<void>;
  subscribeToChanges: () => () => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  orders: [],
  trends: [],
  isInitialLoaded: false,
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().fetchOrders(),
        get().fetchTrends()
      ]);
      set({ isInitialLoaded: true });
    } catch (err) {
      set({ error: 'Kunne ikke hente initial data' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      set({ orders: data || [] });
    } catch (err) {
      console.error('Feil ved henting av ordrer:', err);
      set({ orders: [] });
    }
  },

  fetchTrends: async () => {
    try {
      // Hent uten sortering fra database for å unngå 400-feil
      const { data, error } = await supabase
        .from('trending_topics')
        .select('*')
        .limit(50);

      console.log('🔍 SUPABASE RAW RESPONSE (trends):', { data, error });

      if (error) throw error;
      
      // Fjern duplikater basert på tittel og sorter (nyeste først)
      const uniqueData = Array.from(new Map(data?.map(item => [item.title, item])).values());
      
      const sortedData = (uniqueData || []).sort((a: any, b: any) => {
        const dateA = new Date(a.updated_at || 0).getTime();
        const dateB = new Date(b.updated_at || 0).getTime();
        return dateB - dateA;
      });

      set({ trends: sortedData });
    } catch (err) {
      console.error('Feil ved henting av trender:', err);
      // Ved feil, prøv å beholde eksisterende data eller sett til tom liste
      set({ trends: get().trends || [] });
    }
  },

  addOrder: (order) => {
    get().fetchOrders();
  },

  updateOrder: (videoId, updates) => {
    set((state) => ({
      orders: (state.orders || []).map((o) => 
        o.video_id === videoId ? { ...o, ...updates } : o
      ),
    }));
  },

  retryOrder: async (order) => {
    try {
      const { triggerProduction } = await import('../lib/api');
      await triggerProduction({
        action: 'RETRY',
        video_id: order.video_id,
        title: order.title,
        topic: order.topic,
        language: order.language || 'Norsk'
      });
      get().updateOrder(order.video_id, { status: 'queued' });
    } catch (err) {
      console.error('Retry feilet:', err);
    }
  },

  subscribeToChanges: () => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => get().fetchOrders())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trending_topics' }, () => get().fetchTrends())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
