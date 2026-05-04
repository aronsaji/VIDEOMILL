import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from './store/pipelineStore';
import { Play, Activity, Flame, ArrowUpRight } from 'lucide-react';

function App() {
  const { videos, trends, fetchInitialData, subscribeToChanges, isLoading } = usePipelineStore();

  useEffect(() => {
    fetchInitialData();
    subscribeToChanges();
  }, []);

  const activeVideo = videos[0]; // For demonstration, show the most recent video in the pipeline

  return (
    <Layout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Production Line */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-surface/50 border border-border rounded-xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col h-[500px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-blue-500 to-purple-600"></div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="font-mono text-sm text-gray-400 uppercase flex items-center gap-2">
                  <Activity size={16} className="text-neon-cyan" />
                  Live Production Line
                </h2>
                {activeVideo && (
                  <div className="mt-2">
                    <h3 className="text-xl font-bold">{activeVideo.title}</h3>
                    <p className="text-sm text-neon-cyan font-mono">{activeVideo.video_id} // {activeVideo.platform.toUpperCase()}</p>
                  </div>
                )}
              </div>
              <button className="bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 px-4 py-2 rounded-lg font-mono text-sm uppercase flex items-center gap-2 transition-colors">
                <Play size={16} />
                Force Start
              </button>
            </div>

            {/* Pipeline Flow Visualization */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
              {activeVideo ? (
                <div className="flex flex-col gap-4">
                  <PipelineNode title="1. Trend Ingestion" status={activeVideo.progress >= 0 ? 'complete' : 'pending'} details="Sourced from RSS" />
                  <PipelineConnector active={activeVideo.progress >= 10} />
                  <PipelineNode title="2. AI Scripting" status={activeVideo.status === 'scripting' ? 'active' : activeVideo.progress > 10 ? 'complete' : 'pending'} details={activeVideo.status === 'scripting' ? activeVideo.sub_status || 'Waiting...' : ''} />
                  <PipelineConnector active={activeVideo.progress >= 50} />
                  <PipelineNode title="3. Video Rendering" status={activeVideo.status === 'rendering' ? 'active' : activeVideo.progress >= 90 ? 'complete' : 'pending'} details="Edge-TTS + FFmpeg" />
                  <PipelineConnector active={activeVideo.progress >= 100} />
                  <PipelineNode title="4. Distribution" status={activeVideo.status === 'complete' ? 'complete' : 'pending'} details="Ready for upload" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 font-mono text-sm">
                  WAITING FOR NEW TREND SIGNAL...
                </div>
              )}
            </div>
          </div>

          {/* Recent Generations */}
          <div className="bg-surface/50 border border-border rounded-xl p-6 backdrop-blur-sm">
            <h2 className="font-mono text-sm text-gray-400 mb-4 uppercase">Generation History</h2>
            <div className="space-y-2">
              {videos.slice(1, 5).map(v => (
                <div key={v.id} className="flex justify-between items-center py-3 border-b border-border/50 hover:bg-white/5 px-2 rounded transition-colors cursor-pointer">
                  <div>
                    <p className="text-gray-200 text-sm font-medium">{v.title}</p>
                    <p className="text-xs font-mono text-gray-500">{v.video_id} • {new Date(v.created_at).toLocaleTimeString()}</p>
                  </div>
                  <span className={`font-mono text-xs px-2 py-1 rounded ${v.status === 'complete' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20'}`}>
                    {v.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panels - Trend Radar */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-surface/50 border border-border rounded-xl p-6 backdrop-blur-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono text-sm text-gray-400 uppercase flex items-center gap-2">
                <Flame size={16} className="text-neon-amber" />
                Trend Radar
              </h2>
              <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-gray-400">Top {trends.length} Signals</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <AnimatePresence>
                {trends.map((trend, i) => (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 border border-border rounded-lg bg-black/20 hover:border-neon-amber/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-gray-200 group-hover:text-neon-amber transition-colors line-clamp-1">{trend.title}</h3>
                      <div className="flex items-center gap-1 text-neon-amber font-mono text-xs">
                        <ArrowUpRight size={14} />
                        {trend.viral_score}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{trend.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {trend.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-mono bg-white/5 text-gray-300 px-1.5 py-0.5 rounded">#{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

const PipelineNode = ({ title, status, details }: { title: string, status: 'active' | 'pending' | 'complete', details?: string }) => {
  const getStatusColor = () => {
    if (status === 'active') return 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.15)]';
    if (status === 'complete') return 'border-green-500/50 bg-green-500/10 text-green-400';
    return 'border-border bg-black/20 text-gray-500';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${getStatusColor()} flex justify-between items-center transition-all duration-500`}
    >
      <div className="flex flex-col">
        <span className="font-mono text-sm uppercase tracking-wider">{title}</span>
        {details && <span className="text-xs opacity-70 mt-1 font-mono">{details}</span>}
      </div>
      <span className="text-xs font-mono">
        {status === 'active' && <span className="flex items-center gap-2"><span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></span> PROCESSING</span>}
        {status === 'pending' && 'WAITING'}
        {status === 'complete' && 'DONE'}
      </span>
    </motion.div>
  );
};

const PipelineConnector = ({ active }: { active: boolean }) => (
  <div className="flex justify-center -my-3 z-0 relative">
    <div className={`w-0.5 h-8 transition-colors duration-500 ${active ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.5)]' : 'bg-border'}`}></div>
  </div>
);

export default App;
