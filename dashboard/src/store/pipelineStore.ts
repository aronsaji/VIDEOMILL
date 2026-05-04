import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, OrderStatus } from '../types';

interface PipelineState {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Partial<Order>) => void;
  updateOrder: (videoId: string, updates: Partial<Order>) => void;
  retryOrder: (order: Order) => Promise<void>;
  subscribeToChanges: () => () => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Henter de 50 siste for å være rask

      if (error) throw error;
      set({ orders: data || [] });
    } catch (err) {
      console.error('Feil ved henting av ordre:', err);
    } finally {
      set({ loading: false });
    }
  },

  addOrder: (order) => {
    // Vi henter fra DB i stedet for å stole på lokal state for å unngå "ghosts"
    get().fetchOrders();
  },

  updateOrder: (videoId, updates) => {
    set((state) => ({
      orders: state.orders.map((o) => 
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
      
      // Oppdater status lokalt med en gang for feedback
      get().updateOrder(order.video_id, { status: 'queued' });
    } catch (err) {
      console.error('Retry feilet:', err);
    }
  },

  subscribeToChanges: () => {
    console.log('📡 Starter real-time overvåking av ordrer...');
    
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('🔄 DB Endring oppdaget:', payload);
          get().fetchOrders(); // Hent alt på nytt for å være 100% sikker
        }
      )
      .subscribe((status) => {
        console.log('🔌 Supabase status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
