import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { 
  Zap, Activity, Clock, BarChart3, Settings2, 
  ChevronRight, Play, Terminal, Layers, 
  Calendar, RotateCcw, AlertCircle
} from 'lucide-react';

export default function AutoSeries() {
  const { orders = [], subscribeToChanges } = usePipelineStore();
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSeriesData();
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
  }, []);

  const fetchSeriesData = async () => {
    setIsLoading(true);
    try {
      const [seriesRes, episodesRes] = await Promise.all([
        supabase.from('series').select('*').order('created_at', { ascending: false }),
        supabase.from('episodes').select('*, series:series_id(title)').order('scheduled_at', { ascending: true }).limit(10)
      ]);

      setSeriesList(seriesRes.data || []);
      setUpcomingEpisodes(episodesRes.data || []);
    } catch (err) {
      console.error('Error fetching series data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#00f5ff] font-data-mono text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
            <Layers size={14} className="animate-pulse" />
            AUTONOMOUS_PIPELINE_ORCHESTRATOR
          </div>
          <h1 className="font-headline text-[56px] font-[900] tracking-[-0.04em] leading-[0.9] text-white uppercase italic">
            AUTO_SERIES
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-[#BD00FF] hover:bg-[#BD00FF]/80 text-black px-10 py-5 font-headline font-black uppercase italic transition-all shadow-[0_0_20px_rgba(189,0,255,0.3)] flex items-center gap-3">
             <Zap size={20} fill="currentColor" />
             NEW_PIPELINE
          </button>
        </div>
      </header>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'ACTIVE_PIPELINES', value: seriesList.filter(s => s.status === 'active').length || '03', icon: RotateCcw, color: 'text-[#BD00FF]' },
           { label: 'SCHEDULED_UPLOADS', value: upcomingEpisodes.length || '12', icon: Clock, color: 'text-[#00f5ff]' },
           { label: 'ENGINE_VELOCITY', value: '98.4%', icon: Activity, color: 'text-[#6bff83]' },
           { label: 'TOTAL_REACH', value: '1.2M', icon: BarChart3, color: 'text-[#ffaa00]' },
         ].map((stat, i) => (
           <div key={i} className="bg-[#0A0A0B] border border-white/10 p-6 group hover:border-white/20 transition-all relative overflow-hidden">
              <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                 <stat.icon size={18} className={stat.color} />
                 <span className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="font-headline text-4xl font-black text-white italic">{stat.value}</div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Pipeline Timeline */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-[#0A0A0B] border border-white/10 p-8 space-y-8 relative overflow-hidden">
              <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
              <div className="flex items-center gap-3">
                 <Calendar size={18} className="text-[#00f5ff]" />
                 <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">UPLOAD_CHRONOLOGY</h2>
              </div>

              <div className="space-y-6 relative">
                 <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-white/5" />
                 
                 {upcomingEpisodes.length > 0 ? upcomingEpisodes.map((ep, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={ep.id} 
                     className="relative pl-10 group"
                   >
                      <div className="absolute left-0 top-1 w-[24px] h-[24px] bg-black border border-white/10 rounded-full flex items-center justify-center z-10 group-hover:border-[#00f5ff] transition-colors">
                         <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#00f5ff] animate-pulse' : 'bg-zinc-800'}`} />
                      </div>
                      
                      <div className="space-y-1">
                         <div className="flex justify-between items-center">
                            <span className="font-data-mono text-[10px] text-[#00f5ff] uppercase font-black">
                               {new Date(ep.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="font-data-mono text-[9px] text-zinc-600 uppercase italic">
                               {new Date(ep.scheduled_at).toLocaleDateString()}
                            </span>
                         </div>
                         <h4 className="font-headline text-lg font-bold text-white uppercase italic truncate">
                            {ep.title || 'NEURAL_EPISODE'}
                         </h4>
                         <p className="font-data-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                            Series: <span className="text-zinc-300">{ep.series?.title || 'GLOBAL_SOURCE'}</span>
                         </p>
                      </div>
                   </motion.div>
                 )) : (
                   <div className="pl-10 text-zinc-800 font-data-mono text-[11px] uppercase py-10">
                      No neural broadcasts scheduled.
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* Center Column: Pipeline Management */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seriesList.length > 0 ? seriesList.map((series, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={series.id}
                  className="bg-[#0A0A0B] border border-white/10 p-8 group hover:border-[#BD00FF]/30 transition-all relative"
                >
                   <div className="flex justify-between items-start mb-10">
                      <div className="p-4 bg-black border border-white/5 text-[#BD00FF] group-hover:shadow-[0_0_15px_#BD00FF]/20 transition-all">
                         <RotateCcw size={24} />
                      </div>
                      <div className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] italic border ${
                        series.status === 'active' ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                         {series.status || 'OFFLINE'}
                      </div>
                   </div>

                   <h3 className="font-headline text-2xl font-[900] text-white uppercase italic mb-2 tracking-tighter leading-none group-hover:text-[#BD00FF] transition-colors">
                      {series.title || 'UNNAMED_PIPELINE'}
                   </h3>
                   <p className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-8 h-8 line-clamp-2">
                      {series.description || 'AUTONOMOUS_GEN_PROTOCOL_ACTIVE'}
                   </p>

                   <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                      <div>
                         <span className="font-label-caps text-[9px] text-zinc-600 uppercase block mb-1">Success Rate</span>
                         <span className="font-data-mono text-sm text-white font-bold">98.2%</span>
                      </div>
                      <div>
                         <span className="font-label-caps text-[9px] text-zinc-600 uppercase block mb-1">Renders/24h</span>
                         <span className="font-data-mono text-sm text-white font-bold">42</span>
                      </div>
                   </div>

                   <div className="mt-8 flex gap-2">
                      <button className="flex-1 py-3 bg-white/5 border border-white/10 text-zinc-400 font-headline font-bold uppercase italic text-[11px] hover:bg-[#BD00FF] hover:text-black hover:border-[#BD00FF] transition-all">
                         EDIT_NODES
                      </button>
                      <button className="p-3 bg-white/5 border border-white/10 text-zinc-400 hover:text-[#6bff83] hover:border-[#6bff83] transition-all">
                         <Play size={16} fill="currentColor" />
                      </button>
                   </div>
                </motion.div>
              )) : (
                [1,2,3,4].map(i => (
                  <div key={i} className="bg-[#0A0A0B] border border-white/10 p-20 flex items-center justify-center opacity-20">
                     <AlertCircle size={48} className="text-zinc-800" />
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
