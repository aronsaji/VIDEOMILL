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
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [subscribeToChanges]);

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
    <div className="max-w-[1600px] mx-auto space-y-10">
      {/* Cinematic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-[#e90053] font-data-mono text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic animate-pulse-led">
            <Layers size={14} />
            AUTONOMOUS_PIPELINE_ORCHESTRATOR_v2.0
          </div>
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            AUTO_SERIES
          </h1>
        </div>
        
        <div className="flex gap-6 relative z-10">
          <button className="btn-kinetic btn-kinetic-primary py-8 px-12 group">
             <span className="text-2xl font-headline font-black italic tracking-wider">NEW_PIPELINE_NODE</span>
             <Zap size={28} className="fill-current" />
             <div className="absolute bottom-0 left-0 h-1 bg-[#BD00FF] w-0 group-hover:w-full transition-all duration-1000" />
          </button>
        </div>
      </header>

      {/* Stats Cluster - Industrial Panel Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'ACTIVE_PIPELINES', value: seriesList.filter(s => s.status === 'active').length || '03', icon: RotateCcw, color: 'text-[#BD00FF]' },
           { label: 'SCHEDULED_UPLOADS', value: upcomingEpisodes.length || '12', icon: Clock, color: 'text-[#00f5ff]' },
           { label: 'ENGINE_VELOCITY', value: '98.4%', icon: Activity, color: 'text-[#6bff83]' },
           { label: 'TOTAL_REACH', value: '1.2M', icon: BarChart3, color: 'text-[#ffaa00]' },
         ].map((stat, i) => (
           <div key={i} className="panel-kinetic p-8 flex flex-col group border-white/5 bg-white/[0.01] clipped-corner">
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-3 bg-black/60 border border-white/5 clipped-corner-sm ${stat.color}`}>
                    <stat.icon size={20} />
                 </div>
                 <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">{stat.label}</span>
              </div>
              <div className="font-headline text-5xl font-black text-white italic tracking-tighter group-hover:text-white transition-colors">{stat.value}</div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Pipeline Timeline */}
        <section className="col-span-12 lg:col-span-4 space-y-8">
           <div className="panel-kinetic p-8 space-y-10 clipped-corner border-white/5 min-h-[600px] flex flex-col">
              <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                 <Calendar size={18} className="text-[#00f5ff]" />
                 <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">UPLOAD_CHRONOLOGY_MATRIX</h2>
              </div>

              <div className="flex-1 space-y-8 relative">
                 <div className="absolute left-[13px] top-0 bottom-0 w-[1px] bg-white/5" />
                 
                 {upcomingEpisodes.length > 0 ? upcomingEpisodes.map((ep, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={ep.id} 
                     className="relative pl-12 group cursor-crosshair"
                   >
                      <div className="absolute left-0 top-1 w-[28px] h-[28px] bg-black border border-white/10 clipped-corner-sm flex items-center justify-center z-10 group-hover:border-[#00f5ff] transition-colors">
                         <div className={`w-1.5 h-1.5 clipped-corner-sm ${i === 0 ? 'bg-[#00f5ff] animate-pulse-led shadow-[0_0_10px_#00f5ff]' : 'bg-zinc-800'}`} />
                      </div>
                      
                      <div className="space-y-2 group-hover:translate-x-1 transition-transform duration-300">
                         <div className="flex justify-between items-center">
                            <span className="font-data-mono text-[10px] text-[#00f5ff] uppercase font-black italic tracking-widest">
                               {new Date(ep.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="font-data-mono text-[9px] text-zinc-700 uppercase font-black">
                               {new Date(ep.scheduled_at).toLocaleDateString()}
                            </span>
                         </div>
                         <h4 className="font-headline text-xl font-black text-white uppercase italic tracking-tight group-hover:text-[#00f5ff] transition-colors">
                            {ep.title || 'NEURAL_EPISODE'}
                         </h4>
                         <p className="font-data-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                            PROTOCOL_SOURCE: <span className="text-zinc-400">{ep.series?.title || 'GLOBAL_SEED'}</span>
                         </p>
                      </div>
                   </motion.div>
                 )) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-20">
                      <Terminal size={48} className="text-zinc-800 mb-4" />
                      <p className="text-zinc-600 font-data-mono uppercase tracking-[0.3em] text-[10px]">No active broadcast schedules detected.</p>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* Right Column: Pipeline Grid */}
        <section className="col-span-12 lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {seriesList.length > 0 ? seriesList.map((series, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={series.id}
                  className="panel-kinetic p-8 group border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-[#BD00FF]/30 transition-all relative clipped-corner flex flex-col min-h-[440px]"
                >
                   <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
                   <div className="flex justify-between items-start mb-12">
                      <div className="p-5 bg-black/60 border border-white/5 text-[#BD00FF] clipped-corner-sm group-hover:shadow-[0_0_20px_#BD00FF]/30 group-hover:border-[#BD00FF]/50 transition-all">
                         <RotateCcw size={28} className={series.status === 'active' ? 'animate-spin-slow' : ''} />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-1 text-[9px] font-black uppercase tracking-[0.3em] italic border clipped-corner-sm ${
                          series.status === 'active' ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20 shadow-[0_0_10px_rgba(107,255,131,0.1)]' : 'bg-[#e90053]/10 text-[#e90053] border-[#e90053]/20'
                        }`}>
                           {series.status?.toUpperCase() || 'OFFLINE'}
                        </div>
                        {series.status === 'active' && <div className="w-1.5 h-1.5 bg-[#6bff83] rounded-full animate-pulse-led" />}
                      </div>
                   </div>

                   <div className="flex-1">
                      <h3 className="font-headline text-3xl font-black text-white uppercase italic mb-3 tracking-tighter leading-none group-hover:text-[#BD00FF] transition-colors">
                         {series.title || 'UNNAMED_PIPELINE'}
                      </h3>
                      <p className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold leading-relaxed mb-10 line-clamp-3">
                         {series.description || 'AUTONOMOUS_GEN_PROTOCOL_ACTIVE_IN_SECTOR_04. RECURRING_UPLOADS_ENABLED.'}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8 mb-8">
                      <div>
                         <span className="font-label-caps text-[9px] text-zinc-600 uppercase block mb-2 font-bold tracking-widest">SUCCESS_RATE</span>
                         <span className="font-headline text-2xl text-white font-black italic tracking-tighter">98.2%</span>
                      </div>
                      <div>
                         <span className="font-label-caps text-[9px] text-zinc-600 uppercase block mb-2 font-bold tracking-widest">RENDERS_24H</span>
                         <span className="font-headline text-2xl text-white font-black italic tracking-tighter">42</span>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-white/[0.02] border border-white/10 text-zinc-500 font-headline font-black uppercase italic text-[11px] tracking-widest hover:bg-[#BD00FF] hover:text-black hover:border-[#BD00FF] transition-all clipped-corner-sm">
                         EDIT_NODES
                      </button>
                      <button className="p-4 bg-white/[0.02] border border-white/10 text-zinc-600 hover:text-[#6bff83] hover:border-[#6bff83] transition-all clipped-corner-sm">
                         <Play size={20} className="fill-current" />
                      </button>
                   </div>
                </motion.div>
              )) : (
                [1,2,3,4].map(i => (
                  <div key={i} className="panel-kinetic p-20 flex items-center justify-center opacity-20 clipped-corner border-white/5 border-dashed">
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
