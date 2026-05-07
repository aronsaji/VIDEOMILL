import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Zap, 
  ExternalLink, 
  BarChart3, 
  ArrowRight,
  Filter,
  Globe,
  PlusCircle,
  Flame,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { generateTrends } from '../lib/gemini';

interface Trend {
  id: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'X';
  growth_stat: string;
  viral_score: number;
  heat_level: 'Hot' | 'Rising' | 'Stable';
  title: string;
  category: string;
  country: string;
  language: string;
  target_audience: string;
  music_mood?: string;
  caption_style?: string;
  transition_style?: string;
}

const TRENDS_DATA: Trend[] = [
  { 
    id: '1', 
    platform: 'TikTok', 
    growth_stat: '+240%', 
    viral_score: 98, 
    heat_level: 'Hot', 
    title: 'Gen-Alpha Slang Explained', 
    category: 'Education', 
    country: 'Global', 
    language: 'English',
    target_audience: 'Millennials & Gen-Z Parents',
    music_mood: 'Viral/Upbeat',
    caption_style: 'Animated/Viral',
    transition_style: 'Fast Cut'
  },
  { 
    id: '2', 
    platform: 'Instagram', 
    growth_stat: '+120%', 
    viral_score: 85, 
    heat_level: 'Rising', 
    title: 'Hyper-Minimalist Setup', 
    category: 'Tech', 
    country: 'USA', 
    language: 'English',
    target_audience: 'Remote Workers & Minimalists',
    music_mood: 'Lo-Fi/Chill',
    caption_style: 'Minimalist',
    transition_style: 'Dissolve'
  },
  { 
    id: '3', 
    platform: 'YouTube', 
    growth_stat: '+85%', 
    viral_score: 72, 
    heat_level: 'Stable', 
    title: 'Lo-fi Coding Marathon', 
    category: 'Programming', 
    country: 'Global', 
    language: 'English',
    target_audience: 'Developers & Students',
    music_mood: 'Lo-Fi/Chill',
    caption_style: 'Minimalist',
    transition_style: 'None'
  },
  { 
    id: '4', 
    platform: 'TikTok', 
    growth_stat: '+450%', 
    viral_score: 99, 
    heat_level: 'Hot', 
    title: 'Quiet Luxury Lifestyle', 
    category: 'Fashion', 
    country: 'Europe', 
    language: 'Multilingual',
    target_audience: 'High-end Consumers',
    music_mood: 'Cinematic/Epic',
    caption_style: 'Bold/Shadow',
    transition_style: 'Cinematic Zoom'
  },
  { 
    id: '5', 
    platform: 'Instagram', 
    growth_stat: '+95%', 
    viral_score: 80, 
    heat_level: 'Rising', 
    title: 'Cinematic Office Vlog', 
    category: 'Lifestyle', 
    country: 'Japan', 
    language: 'Japanese',
    target_audience: 'Career Professionals',
    music_mood: 'Cinematic/Epic',
    caption_style: 'Minimalist',
    transition_style: 'Cinematic Zoom'
  },
  { 
    id: '6', 
    platform: 'Instagram', 
    growth_stat: '+320%', 
    viral_score: 91, 
    heat_level: 'Hot', 
    title: 'The Rise of AI Agents in Video', 
    category: 'Technology', 
    country: 'Global', 
    language: 'English',
    target_audience: 'Creators & Techies',
    music_mood: 'Techno/Hype',
    caption_style: 'Animated/Viral',
    transition_style: 'Fast Cut'
  },
  { 
    id: '7', 
    platform: 'TikTok', 
    growth_stat: '+180%', 
    viral_score: 88, 
    heat_level: 'Rising', 
    title: 'Skandinavisk Minimalisme #Shorts', 
    category: 'Design', 
    country: 'Norge', 
    language: 'Norsk',
    target_audience: 'Interiørfrelste',
    music_mood: 'Lo-Fi/Chill',
    caption_style: 'Minimalist',
    transition_style: 'Dissolve'
  },
];

export const TrendingTopics = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNotifications = () => {
    const btn = document.getElementById('notif-btn');
    if (btn) {
      btn.innerText = 'VARSLER AKTIVERT!';
      btn.classList.add('bg-emerald-500');
      setTimeout(() => {
        btn.innerText = 'Konfigurer Varsler';
        btn.classList.remove('bg-emerald-500');
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const data = await generateTrends();
        setTrends(data);
      } catch (error) {
        console.error('Error fetching trends:', error);
        // Fallback data if Gemini fails
        setTrends([
          { id: 'f1', platform: 'TikTok', growth_stat: '+512%', viral_score: 99, heat_level: 'Hot', title: 'Deepseek-V3 Capabilities Breakdown', category: 'Tech & AI', country: 'Global', language: 'English', target_audience: 'Developers', music_mood: 'Techno/Hype', caption_style: 'Animated/Viral', transition_style: 'Fast Cut' },
          { id: 'f2', platform: 'YouTube', growth_stat: '+210%', viral_score: 92, heat_level: 'Rising', title: 'AI-drevet videoautomatisering', category: 'Productivity', country: 'Norge', language: 'Norsk', target_audience: 'Creators', music_mood: 'Viral/Upbeat', caption_style: 'Minimalist', transition_style: 'Cinematic Zoom' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickOrder = async (trend: Trend) => {
    try {
      const videoId = crypto.randomUUID();
      const productionDataPayload = {
        id: videoId,
        title: trend.title || 'Generell Trend',
        status: 'processing',
        progress: 0,
        duration: 'Pending',
        created_at: new Date().toISOString()
      };

      // 1. Save to Supabase
      const { error: dbError } = await supabase
        .from('productions')
        .insert([productionDataPayload]);

      if (dbError) throw dbError;

      // 2. Trigger n8n
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productionDataPayload,
          video_id: videoId,
          platform: trend.platform.toLowerCase(),
          format: ['TikTok', 'Instagram'].includes(trend.platform) ? '9:16' : '16:9',
          music_mood: trend.music_mood || 'Viral/Upbeat',
          caption_style: trend.caption_style || 'Animated/Viral',
          transition_style: trend.transition_style || 'Cinematic Zoom',
          retry: false
        }),
      });

      if (!response.ok) throw new Error('N8N_COMMUNICATION_ERROR');

      alert(`Quick Order startet: ${trend.title}. Sjekk 'Ordrer' for status.`);
    } catch (err: any) {
      console.error("Quick order failed:", err);
      alert(`Quick Order feilet: ${err.message}`);
    }
  };

  const handleSendToOrder = (trend: Trend) => {
    // Pass advanced parameters from the trend to the order page
    navigate('/create', { 
      state: { 
        trendTitle: trend.title, 
        category: trend.category,
        platform: trend.platform,
        language: trend.language,
        country: trend.country,
        target_audience: trend.target_audience,
        music_mood: trend.music_mood,
        caption_style: trend.caption_style,
        transition_style: trend.transition_style
      } 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('trending.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('trending.subtitle')}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-2 rounded-lg flex items-center gap-4">
            <div className="flex flex-col items-end border-r border-primary/20 pr-4">
              <span className="mono text-[8px] text-text-muted uppercase tracking-widest">Scanning status</span>
              <span className="mono text-xs text-primary font-bold">142 NODER AKTIVE</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="mono text-[8px] text-text-muted uppercase tracking-widest">Siste Treff</span>
              <span className="mono text-xs text-accent font-bold">NÅ NETTOPP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Søk i trender, nøkkelord eller kategorier..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-primary/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-all font-mono text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-surface border border-primary/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-primary transition-all text-text-muted hover:text-primary">
          <Filter size={16} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mono text-[10px] uppercase tracking-widest text-text-muted">Skanner globale noder...</p>
          </div>
        ) : (
          trends.map((trend) => (
            <motion.div 
              key={trend.id}
              whileHover={{ x: 5 }}
            className="bg-surface border border-primary/10 p-6 rounded-2xl group hover:border-primary/40 transition-all shadow-lg overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp size={120} />
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase mono border",
                    trend.heat_level === 'Hot' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    trend.heat_level === 'Rising' ? "bg-accent/10 text-accent border-accent/20" :
                    "bg-primary/10 text-primary border-primary/20"
                  )}>
                    <div className="flex items-center gap-1">
                      <Flame size={10} className={trend.heat_level === 'Hot' ? "animate-pulse" : ""} />
                      {trend.heat_level}
                    </div>
                  </div>
                  <span className="text-text-muted/40 font-mono text-xs">// {trend.platform}</span>
                </div>
                
                <h2 className="text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors truncate">
                  {trend.title}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 p-4 bg-background/40 rounded-xl border border-primary/5">
                  <div className="space-y-1">
                    <p className="mono text-[8px] text-text-muted uppercase tracking-widest italic">{t('trending.relevance')}</p>
                    <p className="font-bold text-lg text-primary">{trend.viral_score}/100</p>
                  </div>
                  <div className="space-y-1">
                    <p className="mono text-[8px] text-text-muted uppercase tracking-widest italic">{t('trending.momentum')}</p>
                    <p className="font-bold text-lg text-emerald-400">{trend.growth_stat}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="mono text-[8px] text-text-muted uppercase tracking-widest italic">Plattform</p>
                    <p className="font-bold text-[10px] uppercase">{trend.platform}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="mono text-[8px] text-text-muted uppercase tracking-widest italic">Land/Språk</p>
                    <p className="font-bold text-[10px] uppercase truncate" title={`${trend.country} / ${trend.language}`}>{trend.country} / {trend.language}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="mono text-[8px] text-text-muted uppercase tracking-widest italic">Kategori</p>
                    <p className="font-bold text-[10px] uppercase">{trend.category}</p>
                  </div>
                  <div className="col-span-2 md:col-span-3 lg:col-span-5 pt-2 border-t border-primary/5">
                    <div className="flex items-center gap-2">
                       <span className="mono text-[8px] text-accent uppercase tracking-widest font-black">Målgruppe:</span>
                       <span className="text-[11px] font-medium text-text-muted">{trend.target_audience}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => handleQuickOrder(trend)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(246,186,136,0.3)] transition-all active:scale-95"
                >
                  <Zap size={14} fill="currentColor" />
                  Quick Order
                </button>
                <button 
                  onClick={() => handleSendToOrder(trend)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-primary/30 text-primary rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all active:scale-95"
                >
                  {t('trending.action.generate')}
                  <PlusCircle size={14} />
                </button>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>

      <div className="glass p-8 rounded-2xl border-l-4 border-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Globe size={100} />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold uppercase tracking-widest text-accent mb-2">Automatisert Overvåking</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Vår Nova_Scan node skanner nå TikTok, Instagram og YouTube Reels hvert 3. minutt for å identifisere mønstre før de går viralt. 
              Du kan sette opp varslinger for spesifikke nisjer.
            </p>
          </div>
          <button 
            id="notif-btn"
            onClick={handleNotifications}
            className="bg-accent text-background px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(246,186,136,0.3)] transition-all shrink-0"
          >
            Konfigurer Varsler
          </button>
        </div>
      </div>
    </div>
  );
};
