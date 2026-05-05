import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_VIDEOS = [
  { id: '1', title: 'CYBER_STREET_01', platform: 'TIKTOK', views: '1.2M', engagement: '18.4%', date: '2024-05-18', status: 'PUBLISHED', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP0uZ_CKEGWCnNWuEUtPimZtJ1FFakmFUduu5uqKaCIN_z0geTcZ1nsyGMChJ5j_ET6bPjXdlIpxO8VYLJd7gP0xjKl_6yg09G9PHcRIuJzNZuN8JpyGm89l2RRBK4QBQN4OlhoO0sWhT2CQkESvbjfmSQpPnOQqAzJ72PIzJYSDdFxHu9J_MlEa6aMLtcHRa4PbZb1AdNg7S6m3eWIeGY1ipXF5S51zn2Ub4vMWoWAACu_60BSDF1t6JhazUqUQfKUE74M3Ww9Ak' },
  { id: '2', title: 'NEON_GLITCH_DREAM', platform: 'REELS', views: '842K', engagement: '12.1%', date: '2024-05-17', status: 'PUBLISHED', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATPlUBGNQo5QaXrmoKV0tQHPMe_EEVp800iXRdmjAVyTHf360rzMkL_7TU6eLIJXPLku0jI91ENtLriV_KxMa6JQf9G8F8mePE54Wy5bLGplxHxqvkSXZw01ZBl75kr5bx9TKfaNuKIv7pJbpnT4Emyta-L5FRVh6Fr9YHk4oSxhZ9jge0T1hltViR9mMfz54DT7WfsSLrqfTzfEHZh6RkutbwBPa30n45jgbB3F3iFrXEetsfLIzLEbQH5hkxdq57ukuICTI-QUQ' },
  { id: '3', title: 'FUTURE_MINIMALIST', platform: 'SHORTS', views: '450K', engagement: '9.8%', date: '2024-05-16', status: 'ARCHIVED', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxq5GoUIWHjIdgy1jobi7njr24GCqg4SgWktWBW5FGAtAF7Km-pVcTXidWxXru-ZXOMna8wUVRw9EUaYrVwWO9bYg-3_m2L5dzDZvzlKIAEibZY4uYQFAaSvdPC2iM8zKfVh--7fJaZhP1BXI05AvN5-Y4-vmmLro_i5xaOzlpaaATI_lOWctacvW6cCYx8tUsIY4Wwmaf29HDG4NO4v3kxot3C8fXaoVglSAGxcHMH0zwPrnL0bgPODxw-HoF_s_SF2ewwot7XYQ' },
  { id: '4', title: 'HYPER_DRIVE_SYNC', platform: 'TIKTOK', views: '2.4M', engagement: '22.5%', date: '2024-05-15', status: 'PUBLISHED', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlxbEPnOCEnoR_be_AC0UKmF0YuFbEv7Yj3W4cuolzvIkqK_Vm6PHyCy6wIR3kp1mH16a_CMlaN2CQGjDRMMQqtlQljbtlWDwk-nNWZ1ZEtNSr89Z8qyIF_EIH6Lzp0stCPbFw77V932dAyxwcvf_nWmIGRbcHdFxS8mJ1nPW-lKm0Sp5bhMmxK1OuTvc-XyQEc7qnJg7OuAcWbDkDTw28rjuefF_rf5UZpUGqv6ZcQgTydxfRaG16Z1bql8X-muAE6nPNGFfafRM' },
];

export default function Archive() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
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
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">TOTAL_STORAGE</span>
            <span className="font-data-mono text-[#ecb2ff] text-lg">1.4 TB / 5.0 TB</span>
          </div>
          <div className="bg-[#1c1b1c] border border-white/10 px-6 py-2 flex flex-col items-end">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">ASSET_COUNT</span>
            <span className="font-data-mono text-[#6bff83] text-lg">1,244</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-[#0A0A0B] border border-white/10 p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search assets by project name, ID, or tag..."
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
        {MOCK_VIDEOS.map((video) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-[#0A0A0B] border border-white/10 group overflow-hidden"
          >
            <div className="relative aspect-[9/16] bg-[#1c1b1c] overflow-hidden">
               <img 
                 src={video.img} 
                 alt={video.title} 
                 className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
               <div className="absolute top-4 right-4 flex gap-2">
                 <span className={`px-2 py-1 text-[8px] font-black tracking-widest uppercase rounded-sm ${
                   video.platform === 'TIKTOK' ? 'bg-[#00f5ff] text-black' : video.platform === 'REELS' ? 'bg-[#ff00ff] text-white' : 'bg-[#ffaa00] text-black'
                 }`}>
                   {video.platform}
                 </span>
               </div>
               <div className="absolute bottom-4 left-4 right-4">
                 <div className="flex justify-between items-end">
                   <div className="space-y-1">
                     <h3 className="font-headline text-lg font-bold text-white uppercase italic truncate">{video.title}</h3>
                     <span className="font-data-mono text-[9px] text-zinc-400 uppercase">{video.date} // {video.status}</span>
                   </div>
                 </div>
               </div>
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-[#BD00FF]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            
            <div className="p-4 bg-[#1c1b1c] border-t border-white/5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="font-label-caps text-[9px] text-zinc-500 uppercase mb-1">Views</span>
                  <span className="font-data-mono text-sm text-[#6bff83]">{video.views}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-[9px] text-zinc-500 uppercase mb-1">Engagement</span>
                  <span className="font-data-mono text-sm text-[#00f5ff]">{video.engagement}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all font-label-caps text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xs">download</span> Download
                </button>
                <button className="flex-1 py-2 bg-white/5 border border-white/10 text-zinc-400 hover:text-[#e90053] hover:border-[#e90053]/30 transition-all font-label-caps text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xs">delete</span> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-center pt-8">
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center border border-white/10 text-zinc-500 hover:border-[#BD00FF] transition-all">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-[#BD00FF] text-[#BD00FF] bg-[#BD00FF]/5">1</button>
          <button className="w-10 h-10 flex items-center justify-center border border-white/10 text-zinc-500 hover:border-[#BD00FF] transition-all">2</button>
          <button className="w-10 h-10 flex items-center justify-center border border-white/10 text-zinc-500 hover:border-[#BD00FF] transition-all">3</button>
          <button className="w-10 h-10 flex items-center justify-center border border-white/10 text-zinc-500 hover:border-[#BD00FF] transition-all">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
