import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, OrderStatus } from '../types';

interface PipelineState {
  orders: Order[];
  trends: any[];
  loading: boolean;
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
  loading: false,

  fetchInitialData: async () => {
    set({ loading: true });
    await Promise.all([
      get().fetchOrders(),
      get().fetchTrends()
    ]);
    set({ loading: false });
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
      // Vi bruker updated_at for sortering for å unngå 'viral_score' feilen i Supabase
      const { data, error } = await supabase
        .from('trends')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('Kunne ikke sortere på updated_at, prøver uten sortering...');
        const { data: fallbackData } = await supabase.from('trends').select('*').limit(50);
        set({ trends: fallbackData || [] });
        return;
      }
      
      set({ trends: data || [] });
    } catch (err) {
      console.error('Feil ved henting av trender:', err);
      set({ trends: [] });
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trends' }, () => get().fetchTrends())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
