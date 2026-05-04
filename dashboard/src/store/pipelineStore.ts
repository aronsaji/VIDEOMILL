import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, TrendingTopic } from '../types';
import { triggerProduction } from '../lib/api';

const IS_MOCK = !import.meta.env.VITE_SUPABASE_URL || 
                 import.meta.env.VITE_SUPABASE_URL.includes('placeholder') ||
                 !import.meta.env.VITE_SUPABASE_ANON_KEY ||
                 import.meta.env.VITE_SUPABASE_ANON_KEY.includes('ANON_KEY_HER');

const MOCK_TRENDS: TrendingTopic[] = [
  { id: 't1', title: 'OpenAI GPT-5 announced', description: 'GPT-5 is reportedly 10x smarter than GPT-4.', tags: ['ai', 'tech'], platform: 'youtube', viral_score: 98, active: true, created_at: new Date().toISOString(), language: 'English', country: 'USA' },
];

interface StoreState {
  orders: Order[];
  trends: TrendingTopic[];
  isLoading: boolean;
  fetchInitialData: () => Promise<void>;
  subscribeToChanges: () => void;
  addOrder: (orderData: Partial<Order>) => Promise<void>;
  retryOrder: (order: Order) => Promise<boolean>;
}

export const usePipelineStore = create<StoreState>((set, get) => ({
  orders: [],
  trends: [],
  isLoading: false,

  addOrder: async (orderData) => {
    // Just trigger production - n8n will handle DB insert
    // Or if you want dashboard to insert, we can add it here.
    // For now, we trust the pipeline to update the DB and our poll to pick it up.
    console.log('Starting production for:', orderData.title);
  },

  retryOrder: async (order: Order) => {
    try {
      const success = await triggerProduction({
        action: 'retry',
        retry_video_id: order.video_id,
        video_id: order.video_id,
        topic: order.topic || order.title,
        language: order.language || 'Norsk',
        platform: Array.isArray(order.platform_destinations) ? order.platform_destinations[0] : 'tiktok'
      });

      if (success) {
        console.log('Retry triggered successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Retry failed:', err);
      return false;
    }
  },

  fetchInitialData: async () => {
    set({ isLoading: true });
    if (IS_MOCK) {
      set({ orders: [], trends: MOCK_TRENDS, isLoading: false });
      return;
    }
    try {
      const [ordersRes, trendsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('trending_topics').select('*').eq('active', true).order('viral_score', { ascending: false }).limit(20),
      ]);
      
      const orders = ordersRes.data || [];
      let trends: TrendingTopic[] = trendsRes.data || [];
      
      if (trends.length === 0) {
        trends = MOCK_TRENDS;
      }

      set({ 
        orders: orders as Order[], 
        trends: trends as TrendingTopic[], 
        isLoading: false 
      });
    } catch (e) {
      console.error('Fetch error:', e);
      set({ orders: [], trends: MOCK_TRENDS, isLoading: false });
    }
  },

  subscribeToChanges: () => {
    if (IS_MOCK) return;
    try {
      supabase.channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          const { orders } = get();
          const currentOrders = orders || [];
          if (payload.eventType === 'INSERT') {
            set({ orders: [payload.new as Order, ...currentOrders] });
          } else if (payload.eventType === 'UPDATE') {
            set({ orders: currentOrders.map(o => o.id === payload.new.id ? payload.new as Order : o) });
          } else if (payload.eventType === 'DELETE') {
            set({ orders: currentOrders.filter(o => o.id !== (payload.old as Order).id) });
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trending_topics' }, (payload) => {
          const { trends } = get();
          const currentTrends = trends || [];
          if (payload.eventType === 'INSERT') {
            set({ trends: [...currentTrends, payload.new as TrendingTopic].sort((a, b) => b.viral_score - a.viral_score) });
          } else if (payload.eventType === 'UPDATE') {
            set({ trends: currentTrends.map(t => t.id === payload.new.id ? payload.new as TrendingTopic : t) });
          } else if (payload.eventType === 'DELETE') {
            set({ trends: currentTrends.filter(t => t.id !== (payload.old as TrendingTopic).id) });
          }
        })
        .subscribe();
    } catch (e) {
      console.error('Subscription error:', e);
    }
  },
}));
