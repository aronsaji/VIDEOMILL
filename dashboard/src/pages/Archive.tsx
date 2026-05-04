import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { History, RefreshCw, CheckCircle2, AlertTriangle, Loader, Search, Filter, Database, ArrowUpRight } from 'lucide-react';
import type { OrderStatus } from '../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  queued:           { label: 'Queued',           color: 'text-gray-400',      bg: 'bg-white/5' },
  script_generation:{ label: 'Drafting',         color: 'text-brand-1',      bg: 'bg-brand-1/10' },
  rendering:        { label: 'Synthesizing',     color: 'text-brand-1',      bg: 'bg-brand-1/10' },
  uploading:        { label: 'Broadcasting',     color: 'text-brand-2',      bg: 'bg-brand-2/10' },
  complete:         { label: 'Archived',         color: 'text-brand-1',      bg: 'bg-brand-1/10' },
  published:        { label: 'Released',         color: 'text-brand-1',      bg: 'bg-brand-1/10' },
  failed:           { label: 'Corrupted',        color: 'text-red-400',       bg: 'bg-red-400/10' },
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

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-neon-cyan font-mono text-[10px] uppercase tracking-[0.4em]"
          >
            <Database size={14} />
            Data Repository
          </motion.div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            Media <span className="text-brand-1">Archive</span>
          </h1>
          <p className="text-gray-500 max-w-md font-medium">Historical record of all neural production cycles and distribution logs.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors" size={18} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Query archive..."
              className="bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:border-neon-cyan/30 outline-none w-72 transition-all placeholder:text-gray-600 italic uppercase tracking-widest"
            />
          </div>
          <button 
            onClick={() => fetchOrders()}
            className="p-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-neon-cyan/10 transition-all border border-white/5 hover:text-white"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {['all', 'queued', 'rendering', 'complete', 'failed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as any)}
            className={`px-8 py-3 rounded-xl text-[13px] font-black uppercase tracking-[0.2em] transition-all border shrink-0 ${
              statusFilter === s 
                ? 'bg-brand-1 text-white border-brand-1 shadow-lg' 
                : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            {s === 'all' ? 'FULL LOG' : s}
          </button>
        ))}
      </div>

      {/* Data Grid */}
      <div className="glass-ultra rounded-[48px] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-black font-mono text-gray-500 uppercase tracking-[0.4em] bg-black/40">
                <th className="px-10 py-8">Ref_ID</th>
                <th className="px-10 py-8">Production_Details</th>
                <th className="px-10 py-8">Process_Status</th>
                <th className="px-10 py-8 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                       <Database size={64} className="text-gray-500" />
                       <span className="text-xs font-black font-mono uppercase tracking-[0.5em]">No Records Found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neon-purple/5 transition-all group cursor-pointer">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-neon-cyan transition-colors" />
                          <span className="font-mono text-[10px] text-gray-500 group-hover:text-white transition-colors">
                            {order.id?.slice(0, 12)}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <p className="text-sm font-black text-white group-hover:text-neon-cyan transition-colors italic uppercase tracking-tight">
                            {order.title || order.topic}
                          </p>
                          <ArrowUpRight size={14} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[8px] font-black font-mono px-2 py-0.5 bg-white/5 text-gray-500 rounded-md border border-white/5 uppercase">
                            {order.language || 'Global'}
                          </span>
                          <span className="text-[8px] font-black font-mono px-2 py-0.5 bg-neon-cyan/5 text-neon-cyan/40 rounded-md border border-neon-cyan/10 uppercase">
                            {order.ai_voice?.split('-')[2] || 'Neural_Core'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 ${STATUS_CONFIG[order.status]?.bg || 'bg-white/5'}`}>
                          {order.status === 'complete' || order.status === 'published' ? (
                            <CheckCircle2 size={16} className="text-brand-1" />
                          ) : order.status === 'failed' ? (
                            <AlertTriangle size={16} className="text-red-400" />
                          ) : (
                            <Loader size={16} className="text-brand-1 animate-spin" />
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-widest ${STATUS_CONFIG[order.status]?.color || 'text-gray-400'}`}>
                            {STATUS_CONFIG[order.status]?.label || order.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-gray-600 font-mono group-hover:text-white transition-colors">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : '---'}
                          </span>
                          <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                            {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'UTC_NULL'}
                          </span>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
