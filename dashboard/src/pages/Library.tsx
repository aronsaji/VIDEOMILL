import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Play, Search, Download, Share2, X, Globe, Film, 
  Activity, Zap, Info, Maximize2, Trash2, RefreshCcw,
  Box, Radio, Shield, Terminal
} from 'lucide-react';
import { retryProduction } from '../lib/api';

export default function Library() {
  const videos = usePipelineStore(state => state.videos);
  const fetchVideos = usePipelineStore(state => state.fetchVideos);
  const subscribeToChanges = usePipelineStore(state => state.subscribeToChanges);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    fetchVideos();
    const unsubscribe = subscribeToChanges();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchVideos, subscribeToChanges]);

  const safeVideos = Array.isArray(videos) ? videos : [];
  const filteredVideos = safeVideos.filter(v => 
    (v.title || v.topic || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            PERMANENT_MEDIA_STORAGE_v4.2
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            Media_<span className="text-primary-container">Vault</span>
          </h1>
        </div>

        <div className="relative group min-w-[320px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-hover:text-primary-container transition-colors" size={18} />
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Assets..."
            className="w-full bg-surface-container-low border border-white/5 pl-14 pr-8 py-5 text-[12px] rounded-2xl focus:border-primary-container/50 outline-none transition-all font-mono uppercase text-white placeholder:text-zinc-900 shadow-2xl"
          />
        </div>
      </header>

      {/* Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-surface-container-low border border-white/5 p-32 text-center relative overflow-hidden group rounded-[3rem] shadow-2xl">
          <div className="p-10 bg-white/5 rounded-full w-fit mx-auto mb-10 text-zinc-900 group-hover:scale-110 transition-transform duration-700">
            <Film size={64} />
          </div>
          <h3 className="text-3xl font-black text-white font-headline-md uppercase italic tracking-tighter mb-4">Vault Empty</h3>
          <p className="font-mono text-[11px] text-zinc-700 uppercase tracking-widest max-w-sm mx-auto">Awaiting first production cycle recording.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredVideos.map((video, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={video.id}
              className="group"
            >
              <div className="bg-surface-container-low border border-white/5 overflow-hidden flex flex-col h-full rounded-[2.5rem] hover:border-primary-container/30 transition-all duration-500 cursor-pointer shadow-2xl"
                   onClick={() => setSelectedVideo(video)}>
                {/* Thumbnail Preview */}
                <div className="aspect-[9/16] bg-black relative overflow-hidden">
                  {video.video_url ? (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505]">
                      {video.status === 'failed' ? (
                        <div className="space-y-4">
                          <X className="text-red-500 mx-auto" size={48} />
                          <p className="font-mono text-[10px] text-red-500/50 uppercase tracking-widest italic font-black">Node_Failure</p>
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
                            <p className="font-mono text-[9px] text-primary-container animate-pulse uppercase tracking-[0.2em] italic font-black">
                              {video.sub_status || 'Synthesizing...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className={`px-4 py-1 bg-primary-container text-black font-black uppercase text-[9px] italic rounded-lg shadow-2xl`}>
                      {video.platform || 'ASSET'}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-black text-white font-headline-md uppercase italic leading-tight group-hover:text-primary-container transition-colors truncate">
                      {video.title || video.topic || 'NEURAL_RENDER'}
                    </h4>
                    <div className="flex items-center gap-2 mt-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${video.status === 'completed' ? 'bg-[#6bff83]' : 'bg-primary-container'}`} />
                      <span className="font-mono text-[9px] text-zinc-600 uppercase font-black">{video.status || 'PENDING'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-primary-container" />
                      <span className="font-mono text-[9px] text-zinc-500 uppercase font-black">{video.language || 'EN'}</span>
                    </div>
                    <span className="font-mono text-[9px] text-zinc-800 uppercase font-black">{new Date(video.created_at).toLocaleDateString()}</span>
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
              className="bg-surface-container-low border border-white/10 w-full max-w-6xl h-full max-h-[85vh] overflow-hidden relative z-10 flex flex-col lg:flex-row shadow-2xl rounded-[3rem]"
            >
              {/* Player Section */}
              <div className="flex-1 bg-black relative flex items-center justify-center lg:border-r border-white/5">
                {selectedVideo.video_url ? (
                  <video 
                    src={selectedVideo.video_url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center space-y-6">
                    <Box size={64} className="text-zinc-900 mx-auto" />
                    <p className="font-mono text-[11px] text-zinc-700 uppercase tracking-widest font-black">Media_Signal_Offline</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-8 right-8 p-4 bg-black/60 hover:bg-primary-container text-white hover:text-black rounded-full transition-all border border-white/10 lg:hidden shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Info Section */}
              <div className="w-full lg:w-[450px] p-10 flex flex-col bg-surface-container-low">
                <div className="flex justify-between items-start mb-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] italic">
                         <Activity size={14} className="animate-pulse" />
                         MASTER_SYNTH_COMPLETE
                      </div>
                      <h2 className="text-3xl font-black text-white font-headline-md italic uppercase tracking-tighter leading-none">
                        {selectedVideo.title || selectedVideo.topic}
                      </h2>
                   </div>
                   <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-4 bg-white/5 hover:bg-primary-container hover:text-black text-zinc-700 rounded-2xl transition-all border border-white/5 hidden lg:block group"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-10 custom-scrollbar">
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-3 px-5 py-2 bg-primary-container/10 rounded-full border border-primary-container/20">
                      <div className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
                      <span className="text-[9px] font-black text-primary-container uppercase tracking-widest italic">Neural_Cluster_Alpha</span>
                    </div>
                    <div className="px-5 py-2 bg-white/5 rounded-full border border-white/10">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">{selectedVideo.platform || 'Grid_Node'}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                        <p className="font-mono text-[9px] text-zinc-700 uppercase mb-2 font-black tracking-widest">Language</p>
                        <p className="font-headline-md text-lg text-white italic uppercase font-black">{selectedVideo.language || 'EN'}</p>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                        <p className="font-mono text-[9px] text-zinc-700 uppercase mb-2 font-black tracking-widest">Recorded</p>
                        <p className="font-headline-md text-lg text-white italic uppercase font-black">{new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="h-[1px] w-8 bg-white/5" />
                         <p className="font-mono text-[10px] text-zinc-800 uppercase tracking-[0.4em] font-black italic">Neural_Log</p>
                         <div className="h-[1px] flex-1 bg-white/5" />
                      </div>
                      <div className="p-8 bg-black/40 border border-white/5 rounded-3xl font-mono text-[12px] text-zinc-500 leading-relaxed italic uppercase font-black">
                         "{selectedVideo.script_summary || 'Protocol synthesis successful. Asset is ready for multi-channel distribution across all authorized network nodes.'}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-10 mt-auto grid grid-cols-2 gap-4">
                  <a 
                    href={selectedVideo.video_url} 
                    download
                    className="flex items-center justify-center gap-3 py-5 bg-white text-black font-black uppercase italic text-xs tracking-widest transition-all hover:bg-zinc-200 rounded-2xl"
                  >
                    <Download size={18} /> Download
                  </a>
                  <button 
                    onClick={async () => {
                      const success = await retryProduction(selectedVideo.id);
                      if (success) {
                        alert('🔄 RETRY_INITIATED');
                        setSelectedVideo(null);
                      }
                    }}
                    className="flex items-center justify-center gap-3 py-5 bg-black/40 text-white border border-white/10 font-black uppercase italic text-xs tracking-widest transition-all hover:border-primary-container/50 rounded-2xl"
                  >
                    <RefreshCw size={18} /> Retry
                  </button>
                  <button className="col-span-2 flex items-center justify-center gap-3 py-6 bg-primary-container text-black font-black uppercase italic text-xs tracking-[0.2em] transition-all hover:shadow-[0_0_30px_#22d3ee44] rounded-2xl shadow-xl mt-2">
                    <Share2 size={20} /> Distribute Asset
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
