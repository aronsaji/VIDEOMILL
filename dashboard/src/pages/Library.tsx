import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Library as LibraryIcon, Play, Search, Filter, 
  Download, Share2, MoreVertical, X, Calendar,
  Monitor, Smartphone, Globe, Info, Film
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
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
            <Film className="text-neon-pink" size={40} />
            Media <span className="text-neon-pink">Vault</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Your archive of forged viral content and master exports.</p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Scan database..."
              className="bg-surface/30 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:border-neon-pink/40 outline-none w-72 backdrop-blur-xl transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {publishedVideos.length === 0 ? (
        <div className="glass-ultra rounded-[40px] p-24 text-center border-dashed border-white/5">
          <div className="p-8 bg-white/5 rounded-full w-fit mx-auto mb-8 text-gray-700">
            <LibraryIcon size={48} />
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase mb-3">Archive Empty</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Start the engine to generate your first viral masterwork.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {publishedVideos.map((video, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={video.id}
              className="group relative"
            >
              <div className="glass-ultra rounded-[32px] overflow-hidden border border-white/5 hover:border-neon-pink/30 transition-all duration-500 cursor-pointer"
                   onClick={() => setSelectedVideo(video)}>
                {/* Thumbnail Preview (Mock) */}
                <div className="aspect-[9/16] bg-black relative overflow-hidden">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt="thumbnail" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface to-black flex items-center justify-center">
                      <Film className="text-white/10" size={64} />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-neon-pink/20 backdrop-blur-md rounded-full flex items-center justify-center border border-neon-pink/50 shadow-[0_0_30px_rgba(255,0,255,0.4)]">
                      <Play className="text-white fill-white ml-1" size={24} />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                      {video.platform_destinations?.[0] || 'Viral'}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-6 space-y-4">
                  <h4 className="font-bold text-white leading-tight group-hover:text-neon-pink transition-colors line-clamp-2">
                    {video.title || video.topic}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe size={12} className="text-gray-600" />
                      <span className="text-[10px] font-mono text-gray-600 uppercase">{video.language || 'Multi'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-700">{new Date(video.created_at).toLocaleDateString()}</span>
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
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setSelectedVideo(null)} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-ultra rounded-[48px] w-full max-w-6xl h-full max-h-[85vh] overflow-hidden border border-white/10 relative z-10 flex flex-col md:flex-row"
            >
              {/* Player Section */}
              <div className="flex-1 bg-black relative flex items-center justify-center">
                {selectedVideo.video_url ? (
                  <video 
                    src={selectedVideo.video_url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Info className="text-gray-600" size={32} />
                    </div>
                    <p className="text-gray-500 font-mono text-sm">Media Source Not Found</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-8 left-8 p-4 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all border border-white/10 md:hidden"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Sidebar Info Section */}
              <div className="w-full md:w-[400px] p-10 border-l border-white/5 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black font-mono text-neon-pink uppercase tracking-[0.3em]">Master Export</span>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">
                        {selectedVideo.title || selectedVideo.topic}
                      </h2>
                   </div>
                   <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-2xl transition-all border border-white/10 hidden md:block"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 rounded-xl border border-neon-green/30">
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_8px_#39FF14]" />
                      <span className="text-[10px] font-black text-neon-green uppercase tracking-widest">Master Ready</span>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedVideo.platform_destinations?.[0] || 'Generic'}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">Language</p>
                        <p className="text-xs font-bold text-white">{selectedVideo.language || 'Norsk'}</p>
                      </div>
                      <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">Created At</p>
                        <p className="text-xs font-bold text-white">{new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black font-mono text-gray-600 uppercase tracking-widest">Production Logic</h5>
                      <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-xs text-gray-400 leading-relaxed italic">
                         "{selectedVideo.script_summary || 'No script summary available for this module.'}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8 mt-auto grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-neon-pink hover:text-white transition-all">
                    <Download size={14} />
                    Download
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <Share2 size={14} />
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
