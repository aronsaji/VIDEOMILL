import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { History, RefreshCw, CheckCircle2, AlertTriangle, Loader, Search, Filter, Database, ArrowUpRight, Download, Share2 } from 'lucide-react';
import type { OrderStatus } from '../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  queued:           { label: 'Queued',       color: 'text-gray-400',      bg: 'bg-white/5',       border: 'border-zinc-700' },
  script_generation:{ label: 'Processing',  color: 'text-violet-400',    bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  rendering:        { label: 'Processing',  color: 'text-violet-400',    bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  uploading:        { label: 'Uploading',    color: 'text-violet-400',    bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  complete:         { label: 'Completed',    color: 'text-emerald-400',   bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
  published:        { label: 'Completed',    color: 'text-emerald-400',   bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
  failed:           { label: 'Failed',       color: 'text-red-400',       bg: 'bg-red-500/10',    border: 'border-red-500/30' },
};

export default function Archive() {
  const { orders = [], fetchOrders } = usePipelineStore();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = (o.title || o.topic || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const isCompleted = (status: string) => status === 'complete' || status === 'published';
  const isProcessing = (status: string) => status === 'rendering' || status === 'script_generation' || status === 'uploading' || status === 'queued';

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <header className="mb-8">
        <h2 className="font-['Space_Grotesk'] text-3xl font-semibold text-white uppercase tracking-tight mb-1">VIDEO ARCHIVE</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Overview of all generated videos and their system status.</p>
      </header>

      {/* Filters */}
      <section className="flex flex-wrap items-center justify-between gap-4 border-y border-zinc-800 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded flex items-center gap-1 transition-all ${
              statusFilter === 'all'
                ? 'bg-violet-500 text-white'
                : 'border border-zinc-700 text-zinc-400 hover:text-white hover:border-violet-500'
            }`}
          >
            <Search size={14} />
            ALL
          </button>
          <button
            onClick={() => setStatusFilter('published' as any)}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded flex items-center gap-1 transition-all ${
              statusFilter === 'published'
                ? 'bg-violet-500 text-white'
                : 'border border-zinc-700 text-zinc-400 hover:text-white hover:border-violet-500'
            }`}
          >
            <CheckCircle2 size={14} />
            COMPLETED
          </button>
          <button
            onClick={() => setStatusFilter('failed' as any)}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded flex items-center gap-1 transition-all ${
              statusFilter === 'failed'
                ? 'bg-violet-500 text-white'
                : 'border border-zinc-700 text-zinc-400 hover:text-white hover:border-violet-500'
            }`}
          >
            <AlertTriangle size={14} />
            FAILED
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">System Health:</span>
          <div className="flex gap-[2px]">
            <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
            <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
            <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
            <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
            <div className="w-1 h-3 bg-zinc-800"></div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      {filteredOrders.length === 0 ? (
        <div className="py-32 text-center">
          <div className="flex flex-col items-center gap-4 opacity-20">
            <Database size={64} className="text-gray-500" />
            <span className="text-xs font-bold font-mono uppercase tracking-widest">No Records Found</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order, i) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.queued;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex flex-col overflow-hidden rounded-sm"
                style={{
                  background: 'rgba(31, 31, 35, 0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(149, 142, 160, 0.1)',
                }}
              >
                {/* Thumbnail Area */}
                <div className="relative aspect-video overflow-hidden">
                  {isCompleted(order.status) ? (
                    <>
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-violet-950/30 to-zinc-900 flex items-center justify-center">
                        <CheckCircle2 size={48} className="text-violet-500/20" />
                      </div>
                      {/* Scanline overlay */}
                      <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%)',
                          backgroundSize: '100% 4px',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                    </>
                  ) : order.status === 'failed' ? (
                    <div className="w-full h-full bg-red-950/20 flex flex-col items-center justify-center gap-1">
                      <AlertTriangle size={32} className="text-red-400" />
                      <p className="font-mono text-[10px] text-red-400 uppercase">RENDER_ERROR</p>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-2">
                      <Loader size={28} className="text-violet-500 animate-pulse" />
                      <div className="w-1/2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                          style={{ width: `${order.progress || 30}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-mono text-violet-400 uppercase animate-pulse">
                        Synthesizing... {order.progress || 30}%
                      </p>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`${config.bg} ${config.color} ${config.border} border px-2 py-1 text-[10px] font-bold rounded-sm uppercase`} style={{ backdropFilter: 'blur(8px)' }}>
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-base font-medium text-white mb-1 uppercase">
                        {(order.title || order.topic || 'UNTITLED_RENDER').toUpperCase().replace(/\s+/g, '_').slice(0, 24)}
                      </h3>
                      <span className="font-mono text-xs text-zinc-500 tracking-wide">
                        SYNTH_ID: {order.id?.slice(0, 3).toUpperCase()}-{order.id?.slice(3, 4).toUpperCase()}
                      </span>
                    </div>
                    {isCompleted(order.status) && (
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-500 uppercase">Views</p>
                        <p className="text-violet-400 font-black text-sm">---</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2 border-t border-zinc-800/50 pt-3">
                    {isCompleted(order.status) ? (
                      <>
                        <button className="flex-1 border border-zinc-700 hover:border-violet-500 hover:bg-violet-500/10 text-zinc-300 py-2 rounded transition-all flex items-center justify-center gap-1 text-[12px] font-bold uppercase">
                          <Download size={14} />
                          Download
                        </button>
                        <button className="flex-1 border border-zinc-700 hover:border-violet-500 hover:bg-violet-500/10 text-zinc-300 py-2 rounded transition-all flex items-center justify-center gap-1 text-[12px] font-bold uppercase">
                          <Share2 size={14} />
                          Share
                        </button>
                      </>
                    ) : order.status === 'failed' ? (
                      <button
                        onClick={() => fetchOrders()}
                        className="flex-1 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 py-2 rounded transition-all flex items-center justify-center gap-1 text-[12px] font-bold uppercase"
                      >
                        <RefreshCw size={14} />
                        Retry Generation
                      </button>
                    ) : (
                      <button
                        className="flex-1 border border-zinc-800 text-zinc-700 py-2 rounded flex items-center justify-center gap-1 text-[12px] font-bold uppercase cursor-not-allowed"
                        disabled
                      >
                        <Loader size={14} className="animate-spin" />
                        Pending
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
