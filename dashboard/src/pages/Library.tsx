import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Play, Search, Download, Share2, X, Globe, Film, 
  Activity, Zap, Info, Maximize2, Trash2, RefreshCw,
  Box, Radio, Shield, Terminal, ArrowUpRight
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
      {/* Header - The Naturalist Studio */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#b1cdb7] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={18} className="animate-pulse" />
            PERMANENT_MEDIA_STORAGE_v4.2
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            Media_<span className="text-[#b1cdb7]">Vault</span>
          </h1>
        </div>

        <div className="relative group min-w-[360px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8c928c]/40 group-hover:text-[#b1cdb7] transition-all duration-300" size={24} />
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Assets..."
            className="w-full bg-[#1b1c1a] border border-[#424843] pl-18 pr-8 py-6 text-[13px] rounded-soft-lg focus:border-[#b1cdb7]/40 outline-none transition-all font-label-sm uppercase text-[#e4e2e0] placeholder-[#8c928c]/20 shadow-sm font-bold tracking-widest italic"
          />
        </div>
      </header>

      {/* Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-[#1b1c1a] border border-[#424843] p-40 text-center relative overflow-hidden group rounded-soft-xl shadow-sm">
          <div className="p-16 bg-[#131412] rounded-full w-fit mx-auto mb-12 text-[#8c928c]/10 group-hover:scale-110 group-hover:text-[#b1cdb7]/20 transition-all duration-1000 border border-[#424843]">
            <Film size={80} />
          </div>
          <h3 className="text-4xl font-bold text-[#e4e2e0] font-headline-md uppercase italic tracking-tighter mb-6">Vault Empty</h3>
          <p className="font-label-sm text-[12px] text-[#8c928c] uppercase tracking-[0.4em] max-w-sm mx-auto font-bold italic opacity-40">Awaiting first production cycle recording.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredVideos.map((video, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={video.id}
              className="group"
            >
              <div className="bg-[#1b1c1a] border border-[#424843] overflow-hidden flex flex-col h-full rounded-soft-xl hover:border-[#b1cdb7]/40 hover:shadow-2xl transition-all duration-700 cursor-pointer shadow-sm relative group/card"
                   onClick={() => setSelectedVideo(video)}>
                {/* Thumbnail Preview */}
                <div className="aspect-[9/16] bg-[#131412] relative overflow-hidden">
                   <div className="absolute inset-0 scanline-overlay opacity-5 pointer-events-none z-10" />
                  {video.video_url ? (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-cover opacity-40 group-hover/card:opacity-90 group-hover/card:scale-105 transition-all duration-1000" 
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-[#131412]">
                      {video.status === 'failed' ? (
                        <div className="space-y-6">
                          <X className="text-[#ffb4ab] mx-auto opacity-40" size={56} />
                          <p className="font-label-sm text-[11px] text-[#ffb4ab] uppercase tracking-widest italic font-bold opacity-60">Node_Failure</p>
                        </div>
                      ) : (
                        <div className="space-y-10 w-full">
                          <Box size={56} className="text-[#b1cdb7] mx-auto animate-pulse opacity-40" />
                          <div className="space-y-6">
                            <div className="h-1.5 w-full bg-[#1b1c1a] rounded-full overflow-hidden border border-[#424843]">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${video.progress || 0}%` }}
                                className="h-full bg-[#b1cdb7] shadow-[0_0_15px_#b1cdb7]"
                              />
                            </div>
                            <p className="font-label-sm text-[11px] text-[#b1cdb7] animate-pulse uppercase tracking-[0.3em] italic font-bold">
                              {video.sub_status || 'Synthesizing...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Top Badge */}
                  <div className="absolute top-8 left-8 z-20">
                    <span className={`px-6 py-2 bg-[#2d4535] text-[#b1cdb7] border border-[#b1cdb7]/20 font-bold uppercase text-[11px] italic rounded-soft-sm shadow-2xl tracking-[0.2em] font-label-sm`}>
                      {video.platform || 'ASSET'}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-10 space-y-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-[#e4e2e0] font-headline-md uppercase italic leading-tight group-hover/card:text-[#b1cdb7] transition-colors truncate tracking-tighter">
                      {video.title || video.topic || 'NEURAL_RENDER'}
                    </h4>
                    <div className="flex items-center gap-4 mt-6">
                      <div className={`w-2.5 h-2.5 rounded-full ${video.status === 'completed' ? 'bg-[#b1cdb7] shadow-[0_0_10px_#b1cdb7]' : 'bg-[#bec9bf] animate-pulse opacity-40'}`} />
                      <span className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-widest italic opacity-40 group-hover/card:opacity-100 transition-opacity">{video.status || 'PENDING'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-[#424843] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Globe size={18} className="text-[#b1cdb7] opacity-60" />
                      <span className="font-label-sm text-[11px] text-[#8c928c] font-bold uppercase italic tracking-widest">{video.language || 'EN'}</span>
                    </div>
                    <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold italic tracking-widest opacity-20">{new Date(video.created_at).toLocaleDateString()}</span>
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16"
          >
            <div className="absolute inset-0 bg-[#0d0e0d]/95 backdrop-blur-xl" onClick={() => setSelectedVideo(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 50, opacity: 0 }}
              className="bg-[#1b1c1a] border border-[#424843] w-full max-w-7xl h-full max-h-[90vh] overflow-hidden relative z-10 flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-soft-xl"
            >
              {/* Player Section */}
              <div className="flex-1 bg-[#131412] relative flex items-center justify-center lg:border-r border-[#424843]">
                 <div className="absolute inset-0 scanline-overlay opacity-5 pointer-events-none z-10" />
                {selectedVideo.video_url ? (
                  <video 
                    src={selectedVideo.video_url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center space-y-10">
                    <Box size={100} className="text-[#8c928c]/10 mx-auto" />
                    <p className="font-label-sm text-[14px] text-[#8c928c]/30 uppercase tracking-[0.5em] font-bold italic">Media_Signal_Offline</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-10 right-10 p-6 bg-[#1b1c1a] hover:bg-[#b1cdb7] text-[#8c928c] hover:text-[#1d3526] rounded-full transition-all border border-[#424843] lg:hidden shadow-2xl z-20"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Sidebar Info Section */}
              <div className="w-full lg:w-[540px] p-16 flex flex-col bg-[#1b1c1a] relative">
                <div className="flex justify-between items-start mb-16 relative z-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-5 text-[#b1cdb7] font-label-sm text-[12px] font-bold uppercase tracking-[0.5em] italic">
                         <Activity size={20} className="animate-pulse" />
                         MASTER_SYNTH_COMPLETE
                      </div>
                      <h2 className="text-4xl font-bold text-[#e4e2e0] font-headline-md italic uppercase tracking-tighter leading-tight">
                        {selectedVideo.title || selectedVideo.topic}
                      </h2>
                   </div>
                   <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-6 bg-[#131412] hover:bg-[#2d4535] hover:text-[#b1cdb7] text-[#8c928c] rounded-soft-lg transition-all border border-[#424843] hidden lg:block group shadow-xl"
                  >
                    <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-6 space-y-16 custom-scrollbar relative z-10">
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-5">
                    <div className="flex items-center gap-4 px-8 py-3.5 bg-[#2d4535] rounded-full border border-[#b1cdb7]/20 shadow-xl shadow-[#b1cdb7]/5">
                      <div className="w-2.5 h-2.5 bg-[#b1cdb7] rounded-full animate-pulse shadow-[0_0_12px_#b1cdb7]" />
                      <span className="text-[11px] font-bold text-[#b1cdb7] uppercase tracking-widest italic font-label-sm">Neural_Cluster_Alpha</span>
                    </div>
                    <div className="px-8 py-3.5 bg-[#131412] rounded-full border border-[#424843] shadow-sm">
                      <span className="text-[11px] font-bold text-[#8c928c] uppercase tracking-widest italic font-label-sm opacity-60">{selectedVideo.platform || 'Grid_Node'}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-12">
                    <div className="grid grid-cols-2 gap-10">
                      <div className="bg-[#131412] border border-[#424843] p-10 rounded-soft-xl shadow-inner">
                        <p className="font-label-sm text-[10px] text-[#8c928c] uppercase mb-4 font-bold tracking-widest italic opacity-20">Language</p>
                        <p className="font-headline-md text-3xl text-[#e4e2e0] italic uppercase font-bold tracking-tight">{selectedVideo.language || 'EN'}</p>
                      </div>
                      <div className="bg-[#131412] border border-[#424843] p-10 rounded-soft-xl shadow-inner">
                        <p className="font-label-sm text-[10px] text-[#8c928c] uppercase mb-4 font-bold tracking-widest italic opacity-20">Recorded</p>
                        <p className="font-headline-md text-3xl text-[#e4e2e0] italic uppercase font-bold tracking-tight">{new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                         <div className="h-[1px] w-12 bg-[#424843] opacity-40" />
                         <p className="font-label-sm text-[12px] text-[#8c928c] uppercase tracking-[0.5em] font-bold italic opacity-30">Neural_Log</p>
                         <div className="h-[1px] flex-1 bg-[#424843] opacity-40" />
                      </div>
                      <div className="p-12 bg-[#131412] border border-[#424843] rounded-soft-xl font-label-sm text-[15px] text-[#8c928c] leading-relaxed italic uppercase font-bold shadow-inner opacity-80">
                         "{selectedVideo.script_summary || 'Protocol synthesis successful. Asset is ready for multi-channel distribution across all authorized network nodes.'}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-16 mt-auto grid grid-cols-2 gap-8 relative z-10">
                  <a 
                    href={selectedVideo.video_url} 
                    download
                    className="flex items-center justify-center gap-5 py-8 bg-[#e4e2e0] text-[#131412] font-bold uppercase italic text-[13px] tracking-[0.3em] transition-all hover:brightness-110 rounded-soft-lg shadow-2xl font-label-sm"
                  >
                    <Download size={24} /> Download
                  </a>
                  <button 
                    onClick={async () => {
                      const success = await retryProduction(selectedVideo.id);
                      if (success) {
                        alert('🔄 RETRY_INITIATED');
                        setSelectedVideo(null);
                      }
                    }}
                    className="flex items-center justify-center gap-5 py-8 bg-[#131412] text-[#e4e2e0] border border-[#424843] font-bold uppercase italic text-[13px] tracking-[0.3em] transition-all hover:bg-[#1b1c1a] rounded-soft-lg shadow-sm font-label-sm"
                  >
                    <RefreshCw size={24} /> Retry
                  </button>
                  <button className="col-span-2 flex items-center justify-center gap-6 py-10 bg-[#b1cdb7] text-[#1d3526] font-bold uppercase italic text-[15px] tracking-[0.4em] transition-all hover:brightness-110 rounded-soft-xl shadow-2xl shadow-[#b1cdb7]/10 mt-6 font-label-sm">
                    <Share2 size={28} /> Distribute Asset
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
