import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Layers, 
  Plus, 
  Play, 
  PlusSquare, 
  Calendar, 
  MoreVertical,
  ChevronRight,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Series {
  id: string;
  name: string;
  episodes: number;
  frequency: string;
  next_release: string;
  status: 'active' | 'paused';
  theme: string;
}

const SERIES_DATA: Series[] = [
  { id: '1', name: 'Daily AI Productivity', episodes: 42, frequency: 'Daily', next_release: '12:00 i dag', status: 'active', theme: 'Neon Tech' },
  { id: '2', name: 'Viral Tech News', episodes: 12, frequency: 'Weekly', next_release: 'Fredag kl 18:00', status: 'active', theme: 'Tech-Noir' },
  { id: '3', name: 'Minimalist Monday', episodes: 8, frequency: 'Weekly', next_release: 'Mandag kl 09:00', status: 'paused', theme: 'Clean White' },
];

export const AutoSeries = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{ id: string, message: string, type: 'success' | 'error' }[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleConfigure = () => {
    navigate('/create');
  };

  const handlePlay = async (series: Series) => {
    setSubmitting(series.id);
    try {
      const videoId = `v-ser-${series.id}-${Date.now()}`;
      const productionDataPayload = {
        id: videoId,
        title: `Episode: ${series.name}`,
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
          platform: 'tiktok', // Default for series
          format: '9:16',
          music_mood: 'Viral/Upbeat',
          caption_style: 'Animated/Viral',
          transition_style: 'Cinematic Zoom',
          series_id: series.id,
          retry: false
        }),
      });

      if (!response.ok) throw new Error('Kunne ikke kontakte produksjons-server');

      addNotification(`Produksjon startet for ${series.name}`);
    } catch (err: any) {
      console.error("Play failed:", err);
      addNotification(`Kunne ikke starte produksjon: ${err.message}`, 'error');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('series.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('series.subtitle')}</p>
        </div>
        <button 
          onClick={handleConfigure}
          className="bg-primary hover:neon-glow text-background font-bold px-8 py-3 rounded-lg font-display uppercase tracking-widest text-xs transition-all flex items-center gap-2 group"
        >
           <PlusSquare size={18} className="group-hover:rotate-90 transition-transform" />
           Konfigurer Ny Serie
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           {SERIES_DATA.map(series => (
             <motion.div 
               key={series.id}
               whileHover={{ x: 5 }}
               className="glass p-8 rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer"
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Layers size={140} />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between gap-8 relative">
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn(
                          "w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]",
                          series.status === 'active' ? "bg-emerald-400 text-emerald-400" : "bg-text-muted text-text-muted"
                        )} />
                        <h2 className="text-2xl font-display font-black tracking-tighter uppercase group-hover:text-primary transition-colors">{series.name}</h2>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                        <div className="space-y-1">
                          <p className="mono text-[8px] text-text-muted uppercase tracking-widest">Antall Episoder</p>
                          <p className="font-bold flex items-center gap-2">
                             <CheckCircle2 size={14} className="text-primary" /> {series.episodes} totalt
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="mono text-[8px] text-text-muted uppercase tracking-widest">Frekvens</p>
                          <p className="font-bold flex items-center gap-2">
                             <Radio size={14} className="text-secondary" /> {series.frequency}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="mono text-[8px] text-text-muted uppercase tracking-widest">Neste Slipp</p>
                          <p className="font-bold flex items-center gap-2">
                             <Clock size={14} className="text-accent" /> {series.next_release}
                          </p>
                        </div>
                      </div>
                   </div>

                    <div className="flex flex-row md:flex-col justify-end gap-3 self-center">
                      <button 
                        onClick={() => handlePlay(series)}
                        disabled={submitting === series.id}
                        className={cn(
                          "p-3 bg-surface border border-outline hover:border-primary text-primary rounded-xl transition-all active:scale-95 flex items-center justify-center",
                          submitting === series.id && "animate-pulse cursor-not-allowed"
                        )}
                      >
                        {submitting === series.id ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                      </button>
                      <button 
                        onClick={() => alert(`Planlegging for ${series.name} åpnes...`)}
                        className="p-3 bg-surface border border-outline hover:border-text-muted text-text-muted rounded-xl transition-all active:scale-95"
                      >
                        <Calendar size={20} />
                      </button>
                      <button 
                        onClick={() => alert(`Innstillinger for ${series.name} lastes inn...`)}
                        className="p-3 bg-surface border border-outline hover:border-text-muted text-text-muted rounded-xl transition-all active:scale-95"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-outline/30 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-8 h-8 rounded border border-background bg-surface overflow-hidden">
                             <img src={`https://picsum.photos/seed/ep${i + series.id}/100/100`} alt="Episode" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="mono text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Logg: {series.theme} Mal Brukes</span>
                   </div>
                   <button className="text-[10px] mono uppercase text-primary font-bold flex items-center gap-1 group/btn">
                      Se alle episoder <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
             </motion.div>
           ))}

            <div 
              onClick={handleConfigure}
              className="py-20 border-2 border-dashed border-outline rounded-3xl flex flex-col items-center justify-center opacity-40 hover:opacity-100 hover:border-primary/50 transition-all cursor-pointer group"
            >
              <Plus size={48} className="text-text-muted group-hover:text-primary transition-colors mb-4" />
              <p className="mono text-[10px] uppercase tracking-widest text-center font-black">
                Opprett ny automatisert serie
              </p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-xl border-l-4 border-primary">
              <h3 className="text-lg font-display uppercase tracking-widest mb-6 border-b border-outline pb-4">Nylige Slipp</h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4 items-center group cursor-pointer" onClick={() => navigate('/library')}>
                    <div className="w-12 h-12 bg-surface rounded-lg border border-outline overflow-hidden flex-shrink-0 group-hover:border-primary transition-colors">
                       <img src={`https://picsum.photos/seed/rec${i}/100/100`} alt="Recent" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">Ep. #41 - Optimizing your life</p>
                       <p className="text-[9px] mono text-text-muted mt-1 uppercase">Publisert for 3t siden</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/library')}
                className="mt-8 w-full py-3 border border-outline hover:border-primary text-text-muted hover:text-primary rounded-lg mono text-[10px] uppercase tracking-widest transition-all"
              >
                Se Markedsføringslogg
              </button>
           </div>

           <div className="glass p-8 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Radio size={80} />
              </div>
              <h3 className="text-lg font-display uppercase tracking-widest mb-6">Podcast Integrasjon</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-6 font-medium">
                Koble dine Auto Serier direkte til Spotify og Apple Podcasts. Agent Nova genererer automatisk titler og beskrivelser.
              </p>
              <button className="w-full py-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-background rounded-lg mono text-[10px] uppercase tracking-widest transition-all">
                Konfigurer RSS-feed
              </button>
           </div>
        </div>
      </div>

      {/* Notifications Overlay */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-4 min-w-[300px]",
                notif.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
              )}
            >
              {notif.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest">{notif.type === 'success' ? 'Suksess' : 'Feil'}</p>
                <p className="text-[10px] mono mt-1">{notif.message}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
