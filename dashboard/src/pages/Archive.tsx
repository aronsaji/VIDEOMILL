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

export default function Archive() {
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
      {/* Cinematic Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            PERMANENT_MEDIA_STORAGE_v4.2
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            Video_<span className="text-primary-container">Archive</span>
          </h1>
        </div>
        
        <div className="flex gap-6">
           <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl flex flex-col min-w-[180px] shadow-2xl relative overflow-hidden group">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-2">TOTAL_ASSETS</span>
              <span className="text-5xl font-black text-white font-headline-md italic tracking-tighter leading-none">{videos.length}</span>
           </div>
           <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl flex flex-col min-w-[180px] shadow-2xl relative overflow-hidden group">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-2">STORAGE_NODES</span>
              <span className="text-5xl font-black text-primary-container font-headline-md italic tracking-tighter leading-none">1.2<span className="text-zinc-800 text-3xl">TB</span></span>
           </div>
        </div>
      </header>

      {/* Social Hub */}
      <section className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
         <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
            <div className="p-3 bg-black rounded-xl border border-white/5 text-[#6bff83]">
              <LinkIcon size={20} />
            </div>
            <h2 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Bridge_Matrix</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map(platform => {
              const account = socialAccounts.find(a => a.platform?.toLowerCase() === platform.id);
              return (
                <div key={platform.id} className={`p-8 rounded-[2rem] border transition-all flex flex-col gap-6 group/node ${account ? 'border-[#6bff83]/30 bg-[#6bff83]/5' : 'border-white/5 bg-white/[0.02]'}`}>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-white font-headline-md uppercase italic tracking-tighter leading-none">{platform.name}</span>
                      {account ? <CheckCircle2 size={18} className="text-[#6bff83]" /> : <AlertCircle size={18} className="text-zinc-800" />}
                   </div>
                   <div className="space-y-2">
                      <span className="font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest">STATUS</span>
                      <p className={`font-mono text-[10px] font-black uppercase italic ${account ? 'text-[#6bff83]' : 'text-zinc-800'}`}>
                         {account ? 'CONNECTED' : 'OFFLINE'}
                      </p>
                   </div>
                   <button className={`w-full py-4 text-[10px] font-black uppercase italic border rounded-xl transition-all tracking-[0.2em] ${
                     account ? 'border-[#6bff83]/40 text-[#6bff83] hover:bg-[#6bff83] hover:text-black' : 'border-white/10 text-zinc-800 hover:border-white/30 hover:text-white'
                   }`}>
                      {account ? 'Manage' : 'Link Node'}
                   </button>
                </div>
              );
            })}
         </div>
      </section>

      {/* Search & Filtering Terminal */}
      <section className="flex flex-col md:flex-row gap-6">
         <div className="relative flex-1 group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-primary-container transition-colors">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="Search_Historical_Clusters..."
              className="w-full bg-surface-container-low border border-white/5 py-6 pl-16 pr-10 rounded-2xl text-sm text-white focus:outline-none focus:border-primary-container/50 transition-all font-mono uppercase font-black tracking-widest placeholder:text-zinc-900 shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex bg-surface-container-low border border-white/5 p-2 rounded-2xl gap-2 shadow-2xl">
            {['ALL', 'TIKTOK', 'REELS', 'SHORTS'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-10 py-4 font-black uppercase italic text-[11px] rounded-xl transition-all tracking-[0.2em] ${
                  selectedPlatform === p ? 'bg-primary-container text-black' : 'text-zinc-700 hover:text-white hover:bg-white/5'
                }`}
              >
                {p}
              </button>
            ))}
         </div>
      </section>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <AnimatePresence>
          {filteredVideos.map((video, i) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-container-low border border-white/5 rounded-[2.5rem] group overflow-hidden relative shadow-2xl hover:border-primary-container/30 transition-all duration-500"
            >
               <div className="aspect-[9/16] bg-black relative overflow-hidden group/media">
                  {video.video_url ? (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.22, 1, 0.36, 1]"
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      muted
                      loop
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-[#050505]">
                      {video.status === 'failed' ? (
                        <div className="space-y-4">
                          <AlertCircle className="text-red-500 mx-auto" size={48} />
                          <p className="font-mono text-[10px] text-red-500/50 uppercase tracking-[0.3em] italic font-black">Node_Failure</p>
                        </div>
                      ) : (
                        <div className="space-y-8 w-full">
                          <Box size={48} className="text-primary-container mx-auto animate-pulse" />
                          <div className="space-y-3">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${video.progress || 0}%` }}
                                className="h-full bg-primary-container shadow-[0_0_15px_#22d3ee]"
                              />
                            </div>
                            <p className="font-mono text-[9px] text-primary-container animate-pulse uppercase tracking-[0.3em] italic font-black">
                               {video.sub_status || 'Synthesizing...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Overlay Labels */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                     <span className="px-4 py-1 bg-primary-container text-black font-black text-[10px] uppercase italic rounded-lg shadow-2xl">
                        {video.platform || 'ASSET'}
                     </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-20 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-[0.22, 1, 0.36, 1]">
                     <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-[9px] text-[#6bff83] uppercase font-black italic tracking-widest">{video.status || 'PUBLISHED'}</span>
                        <span className="font-mono text-[9px] text-zinc-700 uppercase font-black">{new Date(video.created_at).toLocaleDateString()}</span>
                     </div>
                     <h3 className="text-2xl font-black text-white font-headline-md uppercase italic truncate mb-8 group-hover:text-primary-container transition-colors duration-500 leading-none">
                        {video.title || video.topic || 'NEURAL_RENDER'}
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const success = await retryProduction(video.id);
                            if (success) alert('🔄 RETRY_INITIATED');
                          }}
                          className="py-4 bg-white/[0.05] border border-white/5 text-zinc-400 font-black uppercase italic text-[11px] hover:bg-white/[0.1] hover:text-white transition-all rounded-xl flex items-center justify-center gap-3 tracking-widest"
                        >
                           <RefreshCcw size={16} /> Retry
                        </button>
                        <button className="py-4 bg-primary-container text-black font-black uppercase italic text-[11px] hover:shadow-[0_0_20px_#22d3ee44] transition-all rounded-xl flex items-center justify-center gap-3 tracking-widest">
                           <Share2 size={16} /> Repost
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
