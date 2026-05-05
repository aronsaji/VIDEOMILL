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
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-outline pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary font-mono text-[11px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            PERMANENT_MEDIA_STORAGE_v4.2
          </div>
          <h1 className="text-6xl font-black text-on-surface font-headline-md tracking-tighter italic uppercase leading-none">
            Media_<span className="text-primary">Vault</span>
          </h1>
        </div>

        <div className="relative group min-w-[320px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-hover:text-primary transition-colors" size={20} />
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Assets..."
            className="w-full bg-surface border border-outline pl-16 pr-8 py-6 text-[12px] rounded-2xl focus:border-primary/50 outline-none transition-all font-mono uppercase text-on-surface placeholder:text-on-surface-variant/20 shadow-sm font-black tracking-widest"
          />
        </div>
      </header>

      {/* Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-surface border border-outline p-32 text-center relative overflow-hidden group rounded-[3rem] shadow-sm">
          <div className="p-12 bg-surface-container rounded-full w-fit mx-auto mb-10 text-on-surface-variant/20 group-hover:scale-110 transition-transform duration-700 border border-outline">
            <Film size={64} />
          </div>
          <h3 className="text-3xl font-black text-on-surface font-headline-md uppercase italic tracking-tighter mb-4">Vault Empty</h3>
          <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest max-w-sm mx-auto font-black italic">Awaiting first production cycle recording.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredVideos.map((video, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={video.id}
              className="group"
            >
              <div className="bg-surface border border-outline overflow-hidden flex flex-col h-full rounded-[2.5rem] hover:border-primary/40 hover:shadow-xl transition-all duration-500 cursor-pointer shadow-sm relative"
                   onClick={() => setSelectedVideo(video)}>
                {/* Thumbnail Preview */}
                <div className="aspect-[9/16] bg-on-surface relative overflow-hidden">
                  {video.video_url ? (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-on-surface">
                      {video.status === 'failed' ? (
                        <div className="space-y-4">
                          <X className="text-error mx-auto" size={48} />
                          <p className="font-mono text-[10px] text-error uppercase tracking-widest italic font-black">Node_Failure</p>
                        </div>
                      ) : (
                        <div className="space-y-8 w-full">
                          <Box size={48} className="text-primary mx-auto animate-pulse" />
                          <div className="space-y-4">
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${video.progress || 0}%` }}
                                className="h-full bg-primary shadow-[0_0_15px_rgba(8,145,178,0.5)]"
                              />
                            </div>
                            <p className="font-mono text-[10px] text-primary animate-pulse uppercase tracking-[0.2em] italic font-black">
                              {video.sub_status || 'Synthesizing...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className={`px-4 py-1.5 bg-primary text-white font-black uppercase text-[10px] italic rounded-lg shadow-xl tracking-widest`}>
                      {video.platform || 'ASSET'}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl font-black text-on-surface font-headline-md uppercase italic leading-tight group-hover:text-primary transition-colors truncate tracking-tighter">
                      {video.title || video.topic || 'NEURAL_RENDER'}
                    </h4>
                    <div className="flex items-center gap-3 mt-4">
                      <div className={`w-2 h-2 rounded-full ${video.status === 'completed' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-primary animate-pulse shadow-[0_0_8px_rgba(8,145,178,0.4)]'}`} />
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest italic opacity-60">{video.status || 'PENDING'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-outline flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-primary" />
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black italic">{video.language || 'EN'}</span>
                    </div>
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black italic opacity-40">{new Date(video.created_at).toLocaleDateString()}</span>
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
            <div className="absolute inset-0 bg-on-surface/95 backdrop-blur-md" onClick={() => setSelectedVideo(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              className="bg-surface border border-outline w-full max-w-7xl h-full max-h-[90vh] overflow-hidden relative z-10 flex flex-col lg:flex-row shadow-2xl rounded-[3rem]"
            >
              {/* Player Section */}
              <div className="flex-1 bg-on-surface relative flex items-center justify-center lg:border-r border-outline">
                {selectedVideo.video_url ? (
                  <video 
                    src={selectedVideo.video_url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center space-y-8">
                    <Box size={80} className="text-white/5 mx-auto" />
                    <p className="font-mono text-[12px] text-white/20 uppercase tracking-[0.4em] font-black italic">Media_Signal_Offline</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-primary text-white hover:text-white rounded-full transition-all border border-white/10 lg:hidden shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Info Section */}
              <div className="w-full lg:w-[500px] p-12 flex flex-col bg-surface">
                <div className="flex justify-between items-start mb-12">
                   <div className="space-y-5">
                      <div className="flex items-center gap-4 text-primary font-mono text-[11px] font-black uppercase tracking-[0.4em] italic">
                         <Activity size={16} className="animate-pulse" />
                         MASTER_SYNTH_COMPLETE
                      </div>
                      <h2 className="text-4xl font-black text-on-surface font-headline-md italic uppercase tracking-tighter leading-tight">
                        {selectedVideo.title || selectedVideo.topic}
                      </h2>
                   </div>
                   <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-5 bg-surface-container hover:bg-primary/10 hover:text-primary text-on-surface-variant rounded-2xl transition-all border border-outline hidden lg:block group shadow-sm"
                  >
                    <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 space-y-12 custom-scrollbar">
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-primary/5 rounded-full border border-primary/20 shadow-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(8,145,178,0.5)]" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Neural_Cluster_Alpha</span>
                    </div>
                    <div className="px-6 py-2.5 bg-surface-container rounded-full border border-outline shadow-sm">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic">{selectedVideo.platform || 'Grid_Node'}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-surface-container border border-outline p-8 rounded-3xl shadow-inner">
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase mb-3 font-black tracking-widest italic opacity-40">Language</p>
                        <p className="font-headline-md text-2xl text-on-surface italic uppercase font-black">{selectedVideo.language || 'EN'}</p>
                      </div>
                      <div className="bg-surface-container border border-outline p-8 rounded-3xl shadow-inner">
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase mb-3 font-black tracking-widest italic opacity-40">Recorded</p>
                        <p className="font-headline-md text-2xl text-on-surface italic uppercase font-black">{new Date(selectedVideo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                         <div className="h-[1px] w-10 bg-outline" />
                         <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-[0.4em] font-black italic opacity-40">Neural_Log</p>
                         <div className="h-[1px] flex-1 bg-outline" />
                      </div>
                      <div className="p-10 bg-surface-container border border-outline rounded-[2.5rem] font-mono text-[13px] text-on-surface-variant leading-relaxed italic uppercase font-black shadow-inner">
                         "{selectedVideo.script_summary || 'Protocol synthesis successful. Asset is ready for multi-channel distribution across all authorized network nodes.'}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-12 mt-auto grid grid-cols-2 gap-6">
                  <a 
                    href={selectedVideo.video_url} 
                    download
                    className="flex items-center justify-center gap-4 py-6 bg-on-surface text-white font-black uppercase italic text-xs tracking-[0.2em] transition-all hover:brightness-110 rounded-2xl shadow-xl shadow-on-surface/10"
                  >
                    <Download size={20} /> Download
                  </a>
                  <button 
                    onClick={async () => {
                      const success = await retryProduction(selectedVideo.id);
                      if (success) {
                        alert('🔄 RETRY_INITIATED');
                        setSelectedVideo(null);
                      }
                    }}
                    className="flex items-center justify-center gap-4 py-6 bg-surface-container text-on-surface border border-outline font-black uppercase italic text-xs tracking-[0.2em] transition-all hover:bg-surface rounded-2xl shadow-sm"
                  >
                    <RefreshCw size={20} /> Retry
                  </button>
                  <button className="col-span-2 flex items-center justify-center gap-4 py-8 bg-primary text-white font-black uppercase italic text-sm tracking-[0.3em] transition-all hover:brightness-110 rounded-3xl shadow-2xl shadow-primary/30 mt-4">
                    <Share2 size={24} /> Distribute Asset
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
