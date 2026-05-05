import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Play, Search, Download, Share2, X, Globe, Film, 
  Activity, Zap, Info, Maximize2, Trash2
} from 'lucide-react';

export default function Library() {
  const { videos = [], fetchVideos, subscribeToChanges } = usePipelineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    fetchVideos();
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
  }, []);

  const safeVideos = Array.isArray(videos) ? videos : [];
  const filteredVideos = safeVideos.filter(v => 
    (v.title || v.topic || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">
            MEDIA_VAULT
          </h1>
          <p className="font-data-mono text-[14px] text-zinc-500 uppercase tracking-widest">
            Permanent Media Storage // Historical Asset Manager
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-[#BD00FF] transition-colors" size={18} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="SEARCH ASSETS..."
              className="w-full bg-[#0A0A0B] border border-white/10 pl-14 pr-8 py-4 text-[12px] focus:border-[#BD00FF]/50 outline-none transition-all font-data-mono uppercase text-white placeholder:text-zinc-800"
            />
          </div>
        </div>
      </header>

      {/* Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-[#0A0A0B] border border-white/10 p-32 text-center relative overflow-hidden group">
          <div className="scanline-overlay absolute inset-0 opacity-10 pointer-events-none" />
          <div className="p-10 bg-white/5 rounded-full w-fit mx-auto mb-10 text-zinc-800 group-hover:scale-110 transition-transform duration-700">
            <Film size={64} />
          </div>
          <h3 className="font-headline text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Vault Empty</h3>
          <p className="font-data-mono text-[11px] text-zinc-600 uppercase tracking-widest max-w-sm mx-auto">No neural production cycles recorded in primary cluster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={video.id}
              className="group"
            >
              <div className="bg-[#0A0A0B] border border-white/10 overflow-hidden flex flex-col h-full hover:border-[#BD00FF]/30 transition-all duration-500 cursor-pointer"
                   onClick={() => setSelectedVideo(video)}>
                {/* Thumbnail Preview */}
                <div className="aspect-[9/16] bg-[#1c1b1c] relative overflow-hidden">
                  {video.video_url ? (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => e.currentTarget.pause()}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="text-zinc-800 group-hover:scale-110 transition-transform duration-1000" size={64} />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="w-16 h-16 bg-[#BD00FF]/20 backdrop-blur-md rounded-full flex items-center justify-center border border-[#BD00FF]/50">
                      <Play className="text-[#BD00FF] fill-[#BD00FF] ml-1" size={24} />
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white italic">
                      {video.platform || 'ASSET'}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <h4 className="font-headline text-lg font-bold text-white uppercase italic leading-tight group-hover:text-[#BD00FF] transition-colors truncate">
                    {video.title || video.topic || 'UNTITLED_NODE'}
                  </h4>
                  
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe size={12} className="text-[#00f5ff]" />
                      <span className="font-data-mono text-[9px] text-zinc-500 uppercase">{video.language || 'Global'}</span>
                    </div>
                    <span className="font-data-mono text-[9px] text-zinc-700 uppercase">{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedVideo(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              className="bg-[#0A0A0B] border border-white/10 w-full max-w-6xl h-full max-h-[85vh] overflow-hidden relative z-10 flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              {/* Player Section */}
              <div className="flex-1 bg-black relative flex items-center justify-center border-r border-white/5">
                {selectedVideo.video_url ? (
                  <video 
                    src={selectedVideo.video_url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center space-y-4">
                    <Info className="text-zinc-800 mx-auto" size={48} />
                    <p className="font-data-mono text-[11px] text-zinc-500 uppercase tracking-widest">Media Signal Missing</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-6 right-6 p-4 bg-black/60 hover:bg-[#BD00FF] text-white hover:text-black rounded-full transition-all border border-white/10 lg:hidden shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Info Section */}
              <div className="w-full lg:w-[400px] p-8 flex flex-col bg-[#0A0A0B]">
                <div className="flex justify-between items-start mb-8">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#BD00FF] font-data-mono text-[10px] font-black uppercase tracking-[0.4em] italic">
                         <Activity size={14} className="animate-pulse" />
                         MASTER_SYNTHESIS_COMPLETE
                      </div>
                      <h2 className="font-headline text-3xl font-bold text-white italic uppercase tracking-tighter leading-none">
                        {selectedVideo.title || selectedVideo.topic}
                      </h2>
                   </div>
                   <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-3 bg-white/5 hover:bg-[#BD00FF] hover:text-black text-zinc-500 rounded-sm transition-all border border-white/5 hidden lg:block group"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-3 px-4 py-2 bg-[#BD00FF]/5 rounded-sm border border-[#BD00FF]/20">
                      <div className="w-1.5 h-1.5 bg-[#BD00FF] rounded-full animate-pulse shadow-[0_0_8px_#BD00FF]" />
                      <span className="text-[9px] font-black text-[#BD00FF] uppercase tracking-widest italic">Global_Master</span>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-sm border border-white/10">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">{selectedVideo.platform || 'Viral_Node'}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] border border-white/5 p-4">
                        <p className="font-label-caps text-[9px] text-zinc-600 uppercase mb-1 tracking-widest">Language</p>
                        <p className="font-data-mono text-sm text-white italic uppercase">{selectedVideo.language || 'Global'}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-4">
                        <p className="font-label-caps text-[9px] text-zinc-600 uppercase mb-1 tracking-widest">Created At</p>
                        <p className="font-data-mono text-sm text-white italic uppercase">{new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="h-[1px] w-8 bg-white/10" />
                         <p className="font-data-mono text-[9px] text-zinc-700 uppercase tracking-[0.4em]">Neural Log</p>
                         <div className="h-[1px] flex-1 bg-white/10" />
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 font-data-mono text-[12px] text-zinc-400 leading-relaxed italic uppercase">
                         "{selectedVideo.script_summary || 'Protocol synthesis successful. Asset is ready for multi-channel distribution across all authorized network nodes.'}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8 mt-auto grid grid-cols-2 gap-4">
                  <a 
                    href={selectedVideo.video_url} 
                    download
                    className="flex items-center justify-center gap-2 py-4 bg-white text-black font-headline font-bold uppercase italic text-[11px] transition-all hover:bg-zinc-200"
                  >
                    <Download size={16} />
                    Download
                  </a>
                  <button className="flex items-center justify-center gap-2 py-4 bg-[#BD00FF] text-black font-headline font-bold uppercase italic text-[11px] transition-all hover:shadow-[0_0_15px_#BD00FF]">
                    <Share2 size={16} />
                    Distribute
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
