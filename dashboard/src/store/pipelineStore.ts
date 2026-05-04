import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Video = Database['public']['Tables']['videos']['Row'];
type Trend = Database['public']['Tables']['trending_topics']['Row'];

interface PipelineState {
  videos: Video[];
  trends: Trend[];
  isLoading: boolean;
  error: string | null;
  fetchInitialData: () => Promise<void>;
  subscribeToChanges: () => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  videos: [],
  trends: [],
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Mock Data Fallback if no real keys
      const currentUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
      if (currentUrl.includes('placeholder')) {
        set({
          videos: [
            { id: '1', video_id: 'VM-8291', title: 'The Future of AI in 2026', topic: 'AI', status: 'scripting', sub_status: 'Genererer manus med Groq', progress: 15, platform: 'tiktok', aspect_ratio: '9:16', language: 'nb', target_audience: 'Tech', views: 0, video_url: null, metadata: null, created_at: new Date().toISOString(), user_id: 'sys' },
            { id: '2', video_id: 'VM-8290', title: 'Top 5 Crypto Trends', topic: 'Crypto', status: 'complete', sub_status: 'Publisert', progress: 100, platform: 'youtube', aspect_ratio: '16:9', language: 'en', target_audience: 'Finance', views: 12500, video_url: 'https://example.com/vid2', metadata: null, created_at: new Date(Date.now() - 3600000).toISOString(), user_id: 'sys' }
          ],
          trends: [
            { id: '1', title: 'GPT-6 Release Leaks', description: 'Rumors about next generation AI models', category: 'tech', viral_score: 95, heat_level: 'fire', growth_stat: '+400% this hour', tags: ['ai', 'openai', 'leak'], platform: 'youtube', target_audience: 'Tech', active: true, status: 'pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '2', title: 'SpaceX Mars Landing Date', description: 'Elon Musk confirms new target date', category: 'science', viral_score: 88, heat_level: 'hot', growth_stat: '+150% today', tags: ['spacex', 'mars', 'elon'], platform: 'tiktok', target_audience: 'Space Enthusiasts', active: true, status: 'processing', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          ],
          isLoading: false
        });
        return;
      }

      const [videosResp, trendsResp] = await Promise.all([
        supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('trending_topics').select('*').eq('active', true).order('viral_score', { ascending: false }).limit(20)
      ]);

      if (videosResp.error) throw videosResp.error;
      if (trendsResp.error) throw trendsResp.error;

      set({
        videos: videosResp.data || [],
        trends: trendsResp.data || [],
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  subscribeToChanges: () => {
    const currentUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
    if (currentUrl.includes('placeholder')) return; // Skip subscription if using mock data

    try {
      // Subscribe to videos
      supabase
        .channel('public:videos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, (payload) => {
          const currentVideos = get().videos;
          if (payload.eventType === 'INSERT') {
            set({ videos: [payload.new as Video, ...currentVideos] });
          } else if (payload.eventType === 'UPDATE') {
            set({ videos: currentVideos.map(v => v.id === payload.new.id ? payload.new as Video : v) });
          } else if (payload.eventType === 'DELETE') {
            set({ videos: currentVideos.filter(v => v.id !== payload.old.id) });
          }
        })
        .subscribe();

      // Subscribe to trends
      supabase
        .channel('public:trending_topics')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trending_topics' }, (payload) => {
          const currentTrends = get().trends;
          if (payload.eventType === 'INSERT') {
            set({ trends: [...currentTrends, payload.new as Trend].sort((a,b) => b.viral_score - a.viral_score) });
          } else if (payload.eventType === 'UPDATE') {
            set({ trends: currentTrends.map(t => t.id === payload.new.id ? payload.new as Trend : t).filter(t => t.active) });
          } else if (payload.eventType === 'DELETE') {
            set({ trends: currentTrends.filter(t => t.id !== payload.old.id) });
          }
        })
        .subscribe();
    } catch (e) {
      console.error('Subscription error:', e);
    }
  }
}));
