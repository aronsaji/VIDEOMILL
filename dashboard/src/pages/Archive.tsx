import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { 
  Search, Filter, Download, Share2, 
  ExternalLink, Play, Clock, BarChart3, 
  History, Link as LinkIcon, CheckCircle2,
  AlertCircle, LayoutGrid, List, RefreshCcw,
  Radio, Maximize2, Activity, Box, Film
} from 'lucide-react';
import { retryProduction } from '../lib/api';
import { useI18nStore } from '../store/i18nStore';

export default function Archive() {
  const { t } = useI18nStore();
  const { videos = [], fetchVideos, subscribeToChanges } = usePipelineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    fetchSocialAccounts();
    const unsubscribe = subscribeToChanges();
    return () => {
       if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const fetchSocialAccounts = async () => {
    const { data } = await supabase.from('user_social_accounts').select('*');
    setSocialAccounts(data || []);
  };

  const filteredVideos = (Array.isArray(videos) ? videos : []).filter(v => {
    const matchesSearch = (v.title || v.topic || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'ALL' || v.platform?.toUpperCase() === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const platforms = [
    { id: 'tiktok', name: 'TikTok' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'x', name: 'X' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <div className="flex items-center gap-3 text-[#4169E1] font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            PERMANENT_MEDIA_STORAGE_v4.2
          </div>
          <h1 className="text-6xl font-black text-[#1E3A8A] font-headline-md tracking-tighter italic uppercase leading-none">
            Video_<span className="text-[#4169E1]">Archive</span>
          </h1>
        </div>
        
        <div className="flex gap-8">
           <div className="bg-surface border border-outline p-8 rounded-[2.5rem] flex flex-col min-w-[220px] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#4169E1]/20" />
              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] mb-3 italic opacity-40">TOTAL_ASSETS</span>
              <span className="text-5xl font-black text-[#1E3A8A] font-headline-md italic tracking-tighter leading-none">{videos.length.toString().padStart(2, '0')}</span>
           </div>
           <div className="bg-surface border border-outline p-8 rounded-[2.5rem] flex flex-col min-w-[220px] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#4169E1]/20" />
              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] mb-3 italic opacity-40">STORAGE_NODES</span>
              <span className="text-5xl font-black text-[#4169E1] font-headline-md italic tracking-tighter leading-none">1.2<span className="text-[#1E3A8A]/20 text-3xl">TB</span></span>
           </div>
        </div>
      </header>

      <section className="bg-surface border border-outline p-12 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
         <div className="flex items-center justify-between mb-10 border-b border-outline pb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#4169E1]/5 rounded-2xl border border-[#4169E1]/10 text-[#4169E1]">
                <LinkIcon size={24} />
              </div>
              <h2 className="text-sm font-black text-[#1E3A8A] uppercase italic tracking-[0.3em]">Bridge_Matrix</h2>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-black italic opacity-40">AUTONOMOUS_LINK_NODES</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platforms.map(platform => {
              const account = socialAccounts.find(a => a.platform?.toLowerCase() === platform.id);
              return (
                <div key={platform.id} className={`p-10 rounded-[3rem] border transition-all flex flex-col gap-8 group/node ${account ? 'border-success/30 bg-success/5 shadow-xl shadow-success/5' : 'border-outline bg-surface-container/50'}`}>
                   <div className="flex justify-between items-center">
                      <span className="text-3xl font-black text-[#1E3A8A] font-headline-md uppercase italic tracking-tighter leading-none group-hover/node:text-[#4169E1] transition-colors">{platform.name}</span>
                      {account ? <CheckCircle2 size={24} className="text-success" /> : <AlertCircle size={24} className="text-on-surface-variant/20" />}
                   </div>
                   <div className="space-y-3">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest italic opacity-40">SECTOR_STATUS</span>
                      <p className={`font-mono text-[11px] font-black uppercase italic tracking-widest ${account ? 'text-success' : 'text-on-surface-variant/40'}`}>
                         {account ? 'ONLINE_ACTIVE' : 'SECTOR_IDLE'}
                      </p>
                   </div>
                   <button className={`w-full py-5 text-[11px] font-black uppercase italic border rounded-2xl transition-all tracking-[0.3em] ${
                     account ? 'border-success/30 text-success hover:bg-success hover:text-white' : 'border-outline text-on-surface-variant/40 hover:border-[#4169E1] hover:text-[#4169E1]'
                   }`}>
                      {account ? 'Manage' : 'Link Node'}
                   </button>
                </div>
              );
            })}
         </div>
      </section>

      <section className="flex flex-col md:flex-row gap-8">
         <div className="relative flex-1 group">
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-[#4169E1] transition-colors">
              <Search size={28} />
            </div>
            <input 
              type="text" 
              placeholder="Search_Historical_Clusters..."
              className="w-full bg-surface border border-outline py-8 pl-20 pr-10 rounded-[2rem] text-sm text-[#1E3A8A] focus:outline-none focus:border-[#4169E1]/50 transition-all font-mono uppercase font-black tracking-widest placeholder:text-[#1E3A8A]/10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex bg-surface border border-outline p-3 rounded-[2rem] gap-3 shadow-sm">
            {['ALL', 'TIKTOK', 'REELS', 'SHORTS'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-12 py-5 font-black uppercase italic text-[11px] rounded-2xl transition-all tracking-[0.3em] ${
                  selectedPlatform === p ? 'bg-[#4169E1] text-white shadow-xl shadow-[#4169E1]/30' : 'text-on-surface-variant hover:text-[#4169E1] hover:bg-surface-container'
                }`}
              >
                {p}
              </button>
            ))}
         </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, i) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-outline rounded-[3.5rem] group overflow-hidden relative shadow-sm hover:border-[#4169E1]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#4169E1]/5"
            >
               <div className="aspect-[9/16] bg-[#0F172A] relative overflow-hidden group/media">
                  {video.video_url ? (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.22, 1, 0.36, 1]"
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      muted
                      loop
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-14 text-center bg-[#0F172A]">
                      {video.status === 'failed' ? (
                        <div className="space-y-6">
                          <AlertCircle className="text-error mx-auto shadow-[0_0_20px_rgba(239,68,68,0.3)]" size={64} />
                          <p className="font-mono text-[11px] text-error/60 uppercase tracking-[0.5em] italic font-black">Node_Failure</p>
                        </div>
                      ) : (
                        <div className="space-y-10 w-full">
                          <div className="relative">
                             <Box size={64} className="text-[#4169E1] mx-auto animate-pulse opacity-20" />
                             <Activity size={32} className="absolute inset-0 m-auto text-[#4169E1] animate-spin-slow" />
                          </div>
                          <div className="space-y-4">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${video.progress || 0}%` }}
                                className="h-full bg-[#4169E1] shadow-[0_0_20px_#4169E1]"
                              />
                            </div>
                            <p className="font-mono text-[10px] text-[#4169E1] animate-pulse uppercase tracking-[0.4em] italic font-black">
                                {video.sub_status || 'Synthesizing...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
                     <span className="px-5 py-2 bg-[#4169E1] text-white font-black text-[11px] uppercase italic rounded-xl shadow-2xl shadow-[#4169E1]/30 tracking-widest">
                        {video.platform || 'ASSET'}
                     </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/90 to-transparent z-20 transform translate-y-20 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]">
                     <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-[10px] text-success uppercase font-black italic tracking-[0.3em]">{video.status || 'PUBLISHED'}</span>
                        <span className="font-mono text-[10px] text-white/20 uppercase font-black italic">{new Date(video.created_at).toLocaleDateString()}</span>
                     </div>
                     <h3 className="text-3xl font-black text-white font-headline-md uppercase italic truncate mb-10 group-hover:text-[#4169E1] transition-colors duration-500 leading-none tracking-tighter">
                        {video.title || video.topic || 'NEURAL_RENDER'}
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const success = await retryProduction(video.id);
                            if (success) alert('🔄 RETRY_INITIATED');
                          }}
                          className="py-5 bg-white/5 border border-white/10 text-white/60 font-black uppercase italic text-[11px] hover:bg-white/10 hover:text-white transition-all rounded-2xl flex items-center justify-center gap-4 tracking-[0.2em]"
                        >
                           <RefreshCcw size={18} /> Retry
                        </button>
                        <button className="py-5 bg-[#4169E1] text-white font-black uppercase italic text-[11px] hover:brightness-110 transition-all rounded-2xl flex items-center justify-center gap-4 tracking-[0.2em] shadow-xl shadow-[#4169E1]/20">
                           <Share2 size={18} /> Repost
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
