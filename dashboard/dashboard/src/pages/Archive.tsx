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
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#b1cdb7] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={18} className="animate-pulse" />
            PERMANENT_MEDIA_STORAGE_v4.2
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            Video_<span className="text-[#b1cdb7]">Archive</span>
          </h1>
        </div>
        
        <div className="flex gap-8">
           <div className="bg-[#1b1c1a] border border-[#424843] p-8 rounded-soft-xl flex flex-col min-w-[220px] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#b1cdb7]/10" />
              <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-[0.2em] mb-3 italic opacity-40">TOTAL_ASSETS</span>
              <span className="text-5xl font-bold text-[#e4e2e0] font-headline-md italic tracking-tighter leading-none">{videos.length.toString().padStart(2, '0')}</span>
           </div>
           <div className="bg-[#1b1c1a] border border-[#424843] p-8 rounded-soft-xl flex flex-col min-w-[220px] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#b1cdb7]/10" />
              <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-[0.2em] mb-3 italic opacity-40">STORAGE_NODES</span>
              <span className="text-5xl font-bold text-[#b1cdb7] font-headline-md italic tracking-tighter leading-none">1.2<span className="text-[#8c928c]/20 text-3xl ml-1">TB</span></span>
           </div>
        </div>
      </header>

      <section className="bg-[#1b1c1a] border border-[#424843] p-12 rounded-soft-xl shadow-sm relative overflow-hidden group">
         <div className="flex items-center justify-between mb-10 border-b border-[#424843] pb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#b1cdb7]/5 rounded-soft border border-[#b1cdb7]/10 text-[#b1cdb7]">
                <LinkIcon size={24} />
              </div>
              <h2 className="font-label-sm text-[13px] font-bold text-[#e4e2e0] uppercase italic tracking-[0.3em]">Bridge_Matrix</h2>
            </div>
            <span className="font-label-sm text-[10px] text-[#8c928c] uppercase tracking-widest font-bold italic opacity-40">AUTONOMOUS_LINK_NODES</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platforms.map(platform => {
              const account = socialAccounts.find(a => a.platform?.toLowerCase() === platform.id);
              return (
                <div key={platform.id} className={`p-10 rounded-soft-xl border transition-all flex flex-col gap-8 group/node ${account ? 'border-[#b1cdb7]/30 bg-[#2d4535]/10 shadow-xl' : 'border-[#424843] bg-[#131412]/50'}`}>
                   <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-[#e4e2e0] font-headline-md uppercase italic tracking-tighter leading-none group-hover/node:text-[#b1cdb7] transition-colors">{platform.name}</span>
                      {account ? <CheckCircle2 size={24} className="text-[#b1cdb7]" /> : <AlertCircle size={24} className="text-[#8c928c]/20" />}
                   </div>
                   <div className="space-y-3">
                      <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest italic opacity-40">SECTOR_STATUS</span>
                      <p className={`font-label-sm text-[11px] font-bold uppercase italic tracking-widest ${account ? 'text-[#b1cdb7]' : 'text-[#8c928c]/40'}`}>
                         {account ? 'ONLINE_ACTIVE' : 'SECTOR_IDLE'}
                      </p>
                   </div>
                   <button className={`w-full py-5 text-[11px] font-bold uppercase italic border rounded-soft-lg transition-all tracking-[0.3em] font-label-sm ${
                     account ? 'border-[#b1cdb7]/30 text-[#b1cdb7] hover:bg-[#b1cdb7] hover:text-[#1d3526]' : 'border-[#424843] text-[#8c928c]/40 hover:border-[#b1cdb7] hover:text-[#b1cdb7]'
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
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#8c928c]/30 group-focus-within:text-[#b1cdb7] transition-colors">
              <Search size={28} />
            </div>
            <input 
              type="text" 
              placeholder="Search_Historical_Clusters..."
              className="w-full bg-[#1b1c1a] border border-[#424843] py-8 pl-20 pr-10 rounded-soft-xl text-[14px] text-[#e4e2e0] focus:outline-none focus:border-[#b1cdb7]/50 transition-all font-label-sm uppercase font-bold tracking-widest placeholder:text-[#e4e2e0]/5 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex bg-[#1b1c1a] border border-[#424843] p-3 rounded-soft-xl gap-3 shadow-sm">
            {['ALL', 'TIKTOK', 'REELS', 'SHORTS'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-12 py-5 font-bold uppercase italic text-[11px] rounded-soft-lg transition-all tracking-[0.3em] font-label-sm ${
                  selectedPlatform === p ? 'bg-[#b1cdb7] text-[#1d3526] shadow-xl shadow-[#b1cdb7]/10' : 'text-[#8c928c] hover:text-[#b1cdb7] hover:bg-[#1f201e]'
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
              className="bg-[#1b1c1a] border border-[#424843] rounded-soft-xl group overflow-hidden relative shadow-sm hover:border-[#b1cdb7]/30 transition-all duration-500 hover:shadow-2xl"
            >
               <div className="aspect-[9/16] bg-[#0d0e0d] relative overflow-hidden group/media">
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
                    <div className="w-full h-full flex flex-col items-center justify-center p-14 text-center bg-[#0d0e0d]">
                      {video.status === 'failed' ? (
                        <div className="space-y-6">
                          <AlertCircle className="text-[#ffb4ab] mx-auto shadow-[0_0_20px_rgba(255,180,171,0.2)]" size={64} />
                          <p className="font-label-sm text-[11px] text-[#ffb4ab]/60 uppercase tracking-[0.5em] italic font-bold">Node_Failure</p>
                        </div>
                      ) : (
                        <div className="space-y-10 w-full">
                          <div className="relative">
                             <Box size={64} className="text-[#b1cdb7] mx-auto animate-mist opacity-20" />
                             <Activity size={32} className="absolute inset-0 m-auto text-[#b1cdb7] animate-spin-slow" />
                          </div>
                          <div className="space-y-4">
                            <div className="h-1.5 w-full bg-[#1b1c1a] border border-[#424843] rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${video.progress || 0}%` }}
                                className="h-full bg-[#b1cdb7] shadow-[0_0_15px_#b1cdb7]"
                              />
                            </div>
                            <p className="font-label-sm text-[10px] text-[#b1cdb7] animate-pulse uppercase tracking-[0.4em] italic font-bold">
                                {video.sub_status || 'Synthesizing...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
                     <span className="px-5 py-2 bg-[#2d4535] border border-[#b1cdb7]/20 text-[#b1cdb7] font-bold text-[11px] uppercase italic rounded-soft-lg shadow-2xl tracking-widest font-label-sm">
                        {video.platform || 'ASSET'}
                     </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#0d0e0d] via-[#0d0e0d]/90 to-transparent z-20 transform translate-y-20 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]">
                     <div className="flex justify-between items-center mb-4">
                        <span className="font-label-sm text-[10px] text-[#b1cdb7] uppercase font-bold italic tracking-[0.3em]">{video.status || 'PUBLISHED'}</span>
                        <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold italic opacity-40">{new Date(video.created_at).toLocaleDateString()}</span>
                     </div>
                     <h3 className="text-2xl font-bold text-[#e4e2e0] font-headline-md uppercase italic truncate mb-10 group-hover:text-[#b1cdb7] transition-colors duration-500 leading-none tracking-tighter">
                        {video.title || video.topic || 'NEURAL_RENDER'}
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const success = await retryProduction(video.id);
                            if (success) alert('🔄 RETRY_INITIATED');
                          }}
                          className="py-5 bg-[#131412]/60 border border-[#424843] text-[#8c928c] font-bold uppercase italic text-[11px] hover:bg-[#1b1c1a] hover:text-[#b1cdb7] transition-all rounded-soft-lg flex items-center justify-center gap-4 tracking-[0.2em] font-label-sm"
                        >
                           <RefreshCcw size={18} /> Retry
                        </button>
                        <button className="py-5 bg-[#b1cdb7] text-[#1d3526] font-bold uppercase italic text-[11px] hover:brightness-110 transition-all rounded-soft-lg flex items-center justify-center gap-4 tracking-[0.2em] shadow-xl shadow-[#b1cdb7]/10 font-label-sm">
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
