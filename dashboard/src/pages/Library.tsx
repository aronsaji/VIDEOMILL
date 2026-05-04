import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Library as LibraryIcon, Play, Search, Filter, 
  Download, Share2, MoreVertical, X, Calendar,
  Monitor, Smartphone, Globe, Info, Film, Activity,
  Zap, ArrowUpRight
} from 'lucide-react';
import type { Order } from '../types';

export default function Library() {
  const { orders = [] } = usePipelineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Order | null>(null);

  const publishedVideos = orders.filter(o => 
    (o.status === 'published' || o.status === 'complete') &&
    (o.title || o.topic || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-24 px-4 lg:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-brand-1 font-mono text-[13px] font-black uppercase tracking-[0.4em]"
          >
            <Film size={14} className="animate-pulse" />
            Media Asset Management v2.0
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              Media <span className="text-brand-1">Vault</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-16 bg-brand-1/50" />
               <p className="text-gray-500 font-bold uppercase tracking-widest text-[13px] italic">Master Archive of Neural Production Cycles</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-brand-1 transition-colors" size={18} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-black/40 border border-white/5 rounded-[24px] pl-14 pr-8 py-5 text-[14px] focus:border-brand-1/40 outline-none backdrop-blur-xl transition-all font-black italic uppercase tracking-wider text-white placeholder:text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {publishedVideos.length === 0 ? (
        <div className="card-standard !p-32 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-1/[0.01] pointer-events-none" />
          <div className="p-10 bg-white/5 rounded-full w-fit mx-auto mb-10 text-gray-800 group-hover:scale-110 transition-transform duration-700">
            <LibraryIcon size={64} />
          </div>
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Vault Empty</h3>
          <p className="text-[13px] text-gray-600 font-bold uppercase tracking-widest italic max-w-sm mx-auto">Start the production engine to generate your first viral masterwork.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {publishedVideos.map((video, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={video.id}
              className="group h-full"
            >
              <div className="card-standard !p-0 overflow-hidden flex flex-col h-full group-hover:translate-y-[-8px] transition-all duration-500 cursor-pointer"
                   onClick={() => setSelectedVideo(video)}>
                {/* Thumbnail Preview */}
                <div className="aspect-[9/16] bg-black relative overflow-hidden">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt="thumbnail" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-black flex items-center justify-center">
                      <Film className="text-white/10 group-hover:scale-110 transition-transform duration-1000" size={64} />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="w-20 h-20 bg-brand-1/20 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-1/50 shadow-[0_0_50px_rgba(0,245,255,0.3)]">
                      <Play className="text-brand-1 fill-brand-1 ml-1" size={32} />
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white italic">
                      {video.platform_destinations?.[0] || 'Viral_Node'}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight group-hover:text-brand-1 transition-colors line-clamp-2">
                    {video.title || video.topic}
                  </h4>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={14} className="text-brand-1" />
                      <span className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-widest italic">{video.language || 'Global'}</span>
                    </div>
                    <span className="text-[11px] font-black font-mono text-gray-700 uppercase tracking-widest">{new Date(video.created_at).toLocaleDateString()}</span>
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
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl" onClick={() => setSelectedVideo(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              className="card-standard !p-0 w-full max-w-6xl h-full max-h-[85vh] overflow-hidden relative z-10 flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]"
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
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                      <Info className="text-gray-700" size={40} />
                    </div>
                    <p className="text-gray-500 font-black font-mono text-[13px] uppercase tracking-widest">Media Signal Missing</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-10 right-10 p-5 bg-black/60 hover:bg-brand-1 text-white hover:text-black rounded-full transition-all border border-white/10 lg:hidden shadow-xl"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Sidebar Info Section */}
              <div className="w-full lg:w-[450px] p-12 flex flex-col bg-black/40">
                <div className="flex justify-between items-start mb-12">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-brand-1 font-mono text-[11px] font-black uppercase tracking-[0.4em] italic">
                         <Activity size={14} />
                         Master Synthesis Ready
                      </div>
                      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                        {selectedVideo.title || selectedVideo.topic}
                      </h2>
                   </div>
                   <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-5 bg-white/5 hover:bg-brand-1 hover:text-black text-gray-600 rounded-[24px] transition-all border border-white/5 hidden lg:block group"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 space-y-10 custom-scrollbar">
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-brand-1/5 rounded-2xl border border-brand-1/20">
                      <div className="w-2 h-2 bg-brand-1 rounded-full animate-pulse shadow-[0_0_12px_rgba(0,245,255,0.5)]" />
                      <span className="text-[11px] font-black text-brand-1 uppercase tracking-widest italic">Global Master</span>
                    </div>
                    <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{selectedVideo.platform_destinations?.[0] || 'Viral_Node'}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="card-standard !p-6 !bg-white/[0.02]">
                        <p className="text-[10px] font-black font-mono text-gray-600 uppercase tracking-widest mb-2 italic">Language</p>
                        <p className="text-[15px] font-black text-white italic uppercase tracking-tight">{selectedVideo.language || 'Global'}</p>
                      </div>
                      <div className="card-standard !p-6 !bg-white/[0.02]">
                        <p className="text-[10px] font-black font-mono text-gray-600 uppercase tracking-widest mb-2 italic">Created At</p>
                        <p className="text-[15px] font-black text-white italic uppercase tracking-tight">{new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="h-[1px] w-12 bg-white/10" />
                         <p className="text-[10px] text-gray-600 font-black font-mono uppercase tracking-[0.4em] italic">Neural Log</p>
                         <div className="h-[1px] flex-1 bg-white/10" />
                      </div>
                      <div className="p-8 bg-white/[0.02] rounded-[32px] border border-white/5 text-[14px] text-gray-400 leading-relaxed italic font-bold uppercase tracking-tight">
                         "{selectedVideo.script_summary || 'Protocol synthesis successful. Asset is ready for multi-channel distribution across all authorized network nodes.'}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-10 mt-auto grid grid-cols-2 gap-6">
                  <button className="btn-standard !bg-white !text-black !shadow-white/20 py-6 text-[11px]">
                    <Download size={18} />
                    Download Master
                  </button>
                  <button className="btn-standard !bg-brand-1 !shadow-brand-1/30 py-6 text-[11px]">
                    <Share2 size={18} />
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
