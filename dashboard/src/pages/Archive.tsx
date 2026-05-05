import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';

const SOCIAL_PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: 'bolt', connected: true },
  { id: 'instagram', name: 'Instagram', icon: 'camera_indoor', connected: false },
  { id: 'facebook', name: 'Facebook', icon: 'video_library', connected: false },
  { id: 'youtube', name: 'YouTube', icon: 'play_circle', connected: true },
];

export default function Archive() {
  const { videos = [], fetchVideos, subscribeToChanges } = usePipelineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');

  useEffect(() => {
    fetchVideos();
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
  }, []);

  const filteredVideos = (Array.isArray(videos) ? videos : []).filter(v => {
    const matchesSearch = (v.title || v.topic || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'ALL' || v.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">
            VIDEO_ARCHIVE
          </h1>
          <p className="font-data-mono text-[14px] text-zinc-500 uppercase tracking-widest">
            Permanent Media Storage // Historical Asset Manager
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1c1b1c] border border-white/10 px-6 py-2 flex flex-col items-end">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">TOTAL_ASSETS</span>
            <span className="font-data-mono text-[#6bff83] text-lg">{videos.length}</span>
          </div>
        </div>
      </header>

      {/* Social Media Connections */}
      <section className="bg-[#0A0A0B] border border-white/10 p-6">
        <h3 className="font-label-caps text-xs font-bold text-zinc-500 uppercase mb-4 tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">link</span> SOCIAL_MEDIA_INTEGRATIONS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SOCIAL_PLATFORMS.map(platform => (
            <div key={platform.id} className={`p-4 border transition-all flex flex-col items-center gap-2 ${platform.connected ? 'border-[#6bff83]/30 bg-[#6bff83]/5' : 'border-white/5 bg-white/[0.02]'}`}>
              <span className={`material-symbols-outlined ${platform.connected ? 'text-[#6bff83]' : 'text-zinc-600'}`}>{platform.icon}</span>
              <span className="font-label-caps text-[10px] font-bold text-white uppercase">{platform.name}</span>
              <button className={`mt-2 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm border ${platform.connected ? 'border-[#6bff83] text-[#6bff83]' : 'border-zinc-700 text-zinc-500 hover:text-white hover:border-white'}`}>
                {platform.connected ? 'CONNECTED' : 'LINK_ACCOUNT'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Toolbar */}
      <div className="bg-[#0A0A0B] border border-white/10 p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search archive by title, ID, or metadata..."
            className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-[#e5e2e3] focus:outline-none focus:border-[#BD00FF] transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'TIKTOK', 'REELS', 'SHORTS'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`flex-1 md:flex-none px-4 py-3 font-label-caps text-[10px] uppercase tracking-widest border transition-all ${
                selectedPlatform === p ? 'border-[#BD00FF] text-[#BD00FF] bg-[#BD00FF]/5' : 'border-white/10 text-zinc-500 hover:border-white/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0A0B] border border-white/10 group overflow-hidden"
          >
            <div className="relative aspect-[9/16] bg-[#1c1b1c] overflow-hidden">
               {video.video_url ? (
                 <video 
                   src={video.video_url} 
                   className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all duration-700"
                   onMouseOver={e => e.currentTarget.play()}
                   onMouseOut={e => e.currentTarget.pause()}
                   muted
                   loop
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <span className="material-symbols-outlined text-6xl">movie</span>
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
               <div className="absolute top-4 right-4">
                 <span className={`px-2 py-1 text-[8px] font-black tracking-widest uppercase rounded-sm bg-[#00f5ff] text-black`}>
                   {video.platform || 'ASSET'}
                 </span>
               </div>
               <div className="absolute bottom-4 left-4 right-4">
                 <h3 className="font-headline text-lg font-bold text-white uppercase italic truncate">{video.title || video.topic || 'UNTITLED_GEN'}</h3>
                 <span className="font-data-mono text-[9px] text-zinc-500 uppercase">{new Date(video.created_at).toLocaleDateString()} // ID: {video.id.slice(0,8)}</span>
               </div>
            </div>
            
            <div className="p-4 bg-[#1c1b1c] border-t border-white/5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="font-label-caps text-[9px] text-zinc-500 uppercase mb-1">Views</span>
                  <span className="font-data-mono text-sm text-[#6bff83]">{video.views || '---'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-[9px] text-zinc-500 uppercase mb-1">Status</span>
                  <span className="font-data-mono text-[10px] text-[#00f5ff] uppercase">{video.status || 'PUBLISHED'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href={video.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all font-label-caps text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xs">open_in_new</span> VIEW
                </a>
                <button className="flex-1 py-2 bg-[#BD00FF]/10 border border-[#BD00FF]/30 text-[#BD00FF] hover:bg-[#BD00FF] hover:text-black transition-all font-label-caps text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xs">share</span> REPOST
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="py-20 text-center bg-[#0A0A0B] border border-white/5">
           <span className="material-symbols-outlined text-6xl text-zinc-800 mb-4">history</span>
           <p className="font-data-mono text-zinc-600 uppercase">No historical assets detected in neural storage.</p>
        </div>
      )}
    </div>
  );
}
