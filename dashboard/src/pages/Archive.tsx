import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { 
  Search, Filter, Download, Share2, 
  ExternalLink, Play, Clock, BarChart3, 
  History, Link as LinkIcon, CheckCircle2,
  AlertCircle, LayoutGrid, List, RefreshCcw
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
    return () => unsubscribe();
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
    { id: 'tiktok', name: 'TikTok', icon: 'zap' },
    { id: 'instagram', name: 'Instagram', icon: 'camera' },
    { id: 'facebook', name: 'Facebook', icon: 'facebook' },
    { id: 'youtube', name: 'YouTube', icon: 'youtube' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 text-zinc-500 font-data-mono text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
            <History size={14} />
            PERMANENT_MEDIA_STORAGE
          </div>
          <h1 className="font-headline text-[56px] font-[900] tracking-[-0.04em] leading-[0.9] text-white uppercase italic">
            VIDEO_ARCHIVE
          </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[200px]">
              <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Total Assets</span>
              <span className="font-headline text-4xl font-black text-white italic">{videos.length}</span>
           </div>
           <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[200px]">
              <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Storage Usage</span>
              <span className="font-headline text-4xl font-black text-[#00f5ff] italic">1.2 TB</span>
           </div>
        </div>
      </header>

      {/* Social Integrations Hub */}
      <section className="bg-[#0A0A0B] border border-white/10 p-8 relative overflow-hidden">
         <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
         <div className="flex items-center gap-3 mb-8">
            <LinkIcon size={18} className="text-[#6bff83]" />
            <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">SOCIAL_INTEGRATION_HUB</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map(platform => {
              const account = socialAccounts.find(a => a.platform?.toLowerCase() === platform.id);
              return (
                <div key={platform.id} className={`p-6 border transition-all flex flex-col gap-4 ${account ? 'border-[#6bff83]/30 bg-[#6bff83]/5' : 'border-white/5 bg-white/[0.02]'}`}>
                   <div className="flex justify-between items-center">
                      <span className="font-headline text-lg font-black text-white uppercase italic">{platform.name}</span>
                      {account ? <CheckCircle2 size={16} className="text-[#6bff83]" /> : <AlertCircle size={16} className="text-zinc-700" />}
                   </div>
                   <div className="space-y-1">
                      <span className="font-data-mono text-[9px] text-zinc-500 uppercase tracking-widest">Status</span>
                      <p className={`font-data-mono text-[10px] font-black uppercase ${account ? 'text-[#6bff83]' : 'text-zinc-700'}`}>
                         {account ? 'CONNECTED_&_STABLE' : 'LINK_PENDING'}
                      </p>
                   </div>
                   <button className={`w-full py-2 text-[10px] font-headline font-bold uppercase italic border transition-all ${
                     account ? 'border-[#6bff83]/40 text-[#6bff83] hover:bg-[#6bff83] hover:text-black' : 'border-white/10 text-zinc-500 hover:border-white hover:text-white'
                   }`}>
                      {account ? 'MANAGE_ACCOUNT' : 'AUTHORIZE_NODE'}
                   </button>
                </div>
              );
            })}
         </div>
      </section>

      {/* Search & Filtering Terminal */}
      <section className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col md:flex-row gap-6">
         <div className="relative flex-1">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="SEARCH_HISTORICAL_ASSET_MANAGER..."
              className="w-full bg-white/[0.03] border border-white/10 py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-[#BD00FF] transition-all font-data-mono uppercase placeholder:text-zinc-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
            {['ALL', 'TIKTOK', 'REELS', 'SHORTS'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-8 py-5 font-headline font-black uppercase italic text-[11px] border transition-all ${
                  selectedPlatform === p ? 'bg-[#BD00FF] text-black border-[#BD00FF]' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white'
                }`}
              >
                {p}
              </button>
            ))}
         </div>
      </section>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredVideos.map((video, i) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0A0A0B] border border-white/10 group overflow-hidden relative"
            >
               <div className="aspect-[9/16] bg-black relative overflow-hidden">
                  <div className="scanline-overlay absolute inset-0 opacity-20 z-10 pointer-events-none" />
                  {video.video_url ? (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      muted
                      loop
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0b]">
                      {video.status === 'failed' ? (
                        <div className="space-y-4">
                          <AlertCircle className="text-red-500 mx-auto" size={48} />
                          <p className="font-data-mono text-[10px] text-red-400 uppercase tracking-widest italic">Node_Failure</p>
                        </div>
                      ) : (
                        <div className="space-y-6 w-full">
                          <Activity className="text-[#BD00FF] mx-auto animate-pulse" size={40} />
                          <div className="space-y-2">
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${video.progress || 0}%` }}
                                className="h-full bg-gradient-to-r from-[#BD00FF] to-[#00f5ff]"
                              />
                            </div>
                            <p className="font-data-mono text-[8px] text-[#BD00FF] animate-pulse uppercase tracking-[0.2em] italic">
                              {video.sub_status || 'Initializing_Synthesis...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Overlay Labels */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                     <span className="px-3 py-1 bg-[#00f5ff] text-black font-headline font-black text-[9px] uppercase italic skew-x-[-12deg]">
                        {video.platform || 'ASSET'}
                     </span>
                     <div className="flex gap-1">
                        {[1,2,3].map(j => <div key={j} className="w-1 h-3 bg-[#BD00FF]" />)}
                     </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                     <div className="flex justify-between items-center mb-2">
                        <span className="font-data-mono text-[9px] text-[#6bff83] uppercase font-black">{video.status || 'PUBLISHED'}</span>
                        <span className="font-data-mono text-[9px] text-zinc-500 uppercase">{new Date(video.created_at).toLocaleDateString()}</span>
                     </div>
                     <h3 className="font-headline text-xl font-[900] text-white uppercase italic truncate mb-6 group-hover:text-[#00f5ff] transition-colors">
                        {video.title || video.topic || 'NEURAL_RENDER_UNNAMED'}
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const success = await retryProduction(video.id);
                            if (success) alert('🔄 RETRY_INITIATED');
                          }}
                          className="py-3 bg-zinc-900 border border-white/10 text-white font-headline font-bold uppercase italic text-[10px] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                           <RefreshCcw size={14} /> RETRY
                        </button>
                        <button className="py-3 bg-[#BD00FF] text-black font-headline font-bold uppercase italic text-[10px] hover:shadow-[0_0_15px_#BD00FF] transition-all flex items-center justify-center gap-2">
                           <Share2 size={14} /> REPOST
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredVideos.length === 0 && (
        <div className="py-40 text-center bg-[#0A0A0B] border border-white/5 relative overflow-hidden">
           <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
           <History size={64} className="mx-auto text-zinc-800 mb-6 opacity-20" />
           <p className="font-data-mono text-zinc-600 uppercase tracking-widest">Search results: Zero matches in historical clusters.</p>
        </div>
      )}
    </div>
  );
}
