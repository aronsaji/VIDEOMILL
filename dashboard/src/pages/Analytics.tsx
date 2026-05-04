import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Users, Clock, Eye, 
  Share2, ThumbsUp, MessageSquare, Activity,
  Zap, Target, Globe, ArrowUpRight, BarChart3,
  Cpu, Database
} from 'lucide-react';

export default function Analytics() {
  // Mock data for analytics
  const metrics = [
    { label: 'Total Views', value: '1.2M', change: '+14%', isPositive: true, icon: Eye },
    { label: 'Watch Time', value: '45.2K hrs', change: '+8%', isPositive: true, icon: Clock },
    { label: 'Retention', value: '62%', change: '-2%', isPositive: false, icon: Users },
    { label: 'Engagement', value: '84.3K', change: '+24%', isPositive: true, icon: TrendingUp },
  ];

  const topVideos = [
    { id: 'VM-8289', title: 'The Quiet Luxury trend explained', views: 890000, likes: 45000, shares: 12000, ctr: '8.4%' },
    { id: 'VM-8280', title: 'Why software engineering is changing forever', views: 210000, likes: 18000, shares: 3400, ctr: '6.2%' },
    { id: 'VM-8275', title: 'Tech news you missed this week', views: 95000, likes: 5200, shares: 800, ctr: '4.1%' },
  ];

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-20 px-4 lg:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-brand-1 font-mono text-[13px] font-black uppercase tracking-[0.4em]"
          >
            <Activity size={14} className="animate-pulse" />
            Neural Performance Metrics v1.0
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              Performance <span className="text-brand-1">Analytics</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-16 bg-brand-1/50" />
               <p className="text-gray-500 font-bold uppercase tracking-widest text-[13px] italic">Deep data synthesis across global networks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div 
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-standard !p-8 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <m.icon size={60} className="text-brand-1" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-[0.3em]">{m.label}</p>
                <span className={`text-[12px] font-black font-mono px-3 py-1 rounded-full ${
                  m.isPositive ? 'bg-brand-1/10 text-brand-1 border border-brand-1/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {m.change}
                </span>
              </div>
              <p className="text-4xl font-black text-white italic tracking-tighter uppercase">{m.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Visualization Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graph Placeholder Section */}
        <div className="lg:col-span-2 card-standard !p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-1/[0.01] pointer-events-none" />
          <div className="absolute -top-20 -right-20 p-24 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
            <BarChart3 size={400} className="text-brand-1" />
          </div>
          
          <div className="text-center space-y-6 relative z-10">
            <div className="p-8 bg-brand-1/5 rounded-[40px] border border-brand-1/10 inline-block">
               <Cpu size={64} className="text-brand-1 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Telemetry Pipeline <span className="text-brand-1">Offline</span></h3>
              <p className="text-[13px] text-gray-600 font-bold uppercase tracking-widest italic max-w-sm mx-auto">Chart.js integration pending synchronization with local performance snapshots.</p>
            </div>
            <button className="btn-standard !bg-brand-1 !shadow-brand-1/30 px-10 py-4 mt-4">
               Re-Sync Data Source
            </button>
          </div>
        </div>

        {/* Top Performers Sidebar */}
        <div className="card-standard !p-10 flex flex-col space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Top <span className="text-brand-1">Performers</span></h2>
            <p className="text-[11px] text-gray-600 font-black font-mono uppercase tracking-[0.3em]">Last 30 Cycle Window</p>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {topVideos.map((video, i) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="p-8 bg-black/40 border border-white/5 rounded-[32px] hover:border-brand-1/30 transition-all group/item cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <p className="text-[15px] font-black text-white group-hover/item:text-brand-1 transition-colors italic uppercase tracking-tight leading-tight flex-1 mr-4">
                      {video.title}
                    </p>
                    <ArrowUpRight size={16} className="text-gray-700 group-hover/item:text-brand-1 transition-colors shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-black font-mono text-brand-1/50 uppercase tracking-widest">{video.id}</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-600 font-black font-mono uppercase tracking-widest">Views</span>
                      <p className="text-[14px] text-white font-black italic">{(video.views / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-600 font-black font-mono uppercase tracking-widest">Likes</span>
                      <p className="text-[14px] text-white font-black italic">{(video.likes / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] text-gray-600 font-black font-mono uppercase tracking-widest">CTR</span>
                      <p className="text-[14px] text-brand-1 font-black italic">{video.ctr}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full py-6 bg-white/5 hover:bg-brand-1/10 border border-white/5 rounded-[24px] text-[11px] text-gray-500 hover:text-white font-black uppercase tracking-[0.3em] transition-all italic mt-auto">
             View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
