import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, OrderStatus } from '../types';

interface PipelineState {
  orders: any[];
  trends: any[];
  videos: any[];
  isInitialLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
  addOrder: (order: Partial<Order>) => void;
  updateOrder: (videoId: string, updates: Partial<Order>) => void;
  retryOrder: (order: Order) => Promise<void>;
  subscribeToChanges: () => () => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  orders: [],
  trends: [],
  videos: [],
  isInitialLoaded: false,
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().fetchOrders(),
        get().fetchTrends(),
        get().fetchVideos()
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
      // Hent fra både orders og productions
      const [ordersRes, productionsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('productions').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      const allData = [...(ordersRes.data || []), ...(productionsRes.data || [])];
      // Fjern duplikater og filtrer bort de som er ferdige (de går til videos)
      const uniqueOrders = Array.from(new Map(allData.map(item => [item.id || item.video_id, item])).values())
        .filter((o: any) => o.status !== 'completed' && o.status !== 'published');

      set({ orders: uniqueOrders });
    } catch (err) {
      console.error('Feil ved henting av ordrer:', err);
    }
  },

  fetchVideos: async () => {
    try {
      // Prøv å hente fra 'videos' tabellen først (brukt i n8n), deretter 'productions' som fallback
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        // Fallback til productions hvis videos ikke eksisterer
        const { data: prodData } = await supabase
          .from('productions')
          .select('*')
          .eq('status', 'completed')
          .order('created_at', { ascending: false });
        
        set({ videos: prodData || [] });
      } else {
        set({ videos: data || [] });
      }
    } catch (err) {
      console.error('Feil ved henting av videoer:', err);
    }
  },

  fetchTrends: async () => {
    try {
      const { data, error } = await supabase
        .from('trending_topics')
        .select('*')
        .limit(50);

      if (error) throw error;
      
      const uniqueData = Array.from(new Map(data?.map(item => [item.title, item])).values());
      const sortedData = (uniqueData || []).sort((a: any, b: any) => {
        const dateA = new Date(a.updated_at || 0).getTime();
        const dateB = new Date(b.updated_at || 0).getTime();
        return dateB - dateA;
      });

      set({ trends: sortedData });
    } catch (err) {
      console.error('Feil ved henting av trender:', err);
      set({ trends: get().trends || [] });
    }
  },

  addOrder: (order) => {
    get().fetchOrders();
  },

  updateOrder: (videoId, updates) => {
    set((state) => ({
      orders: (state.orders || []).map((o) => 
        (o.video_id === videoId || o.id === videoId) ? { ...o, ...updates } : o
      ),
    }));
  },

  retryOrder: async (order) => {
    try {
      const { triggerProduction } = await import('../lib/api');
      await triggerProduction({
        action: 'RETRY',
        video_id: order.video_id || order.id,
        title: order.title,
        topic: order.topic,
        language: order.language || 'Norsk'
      });
      get().updateOrder(order.video_id || order.id, { status: 'queued' });
    } catch (err) {
      console.error('Retry feilet:', err);
    }
  },

  subscribeToChanges: () => {
    const channelId = `db-changes-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        get().fetchOrders();
        get().fetchVideos();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productions' }, () => {
        get().fetchOrders();
        get().fetchVideos();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, () => {
        get().fetchVideos();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trending_topics' }, () => get().fetchTrends())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
