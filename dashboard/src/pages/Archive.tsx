import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { History, RefreshCw, CheckCircle2, AlertTriangle, Loader, Search, Filter } from 'lucide-react';
import type { OrderStatus } from '../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  queued:           { label: 'Køet',           color: 'text-gray-400',      bg: 'bg-gray-400/10' },
  script_generation:{ label: 'Manus',           color: 'text-blue-400',      bg: 'bg-blue-400/10' },
  rendering:        { label: 'Rendrer',         color: 'text-neon-cyan',     bg: 'bg-neon-cyan/10' },
  uploading:        { label: 'Laster opp',      color: 'text-purple-400',    bg: 'bg-purple-400/10' },
  complete:         { label: 'Fullført',        color: 'text-green-400',     bg: 'bg-green-400/10' },
  published:        { label: 'Publisert',       color: 'text-green-400',     bg: 'bg-green-400/10' },
  failed:           { label: 'Feilet',          color: 'text-red-400',       bg: 'bg-red-400/10' },
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
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <History className="text-neon-cyan" size={32} />
            Video Arkiv & Historikk
          </h1>
          <p className="text-gray-500 mt-2">Oversikt over alle genererte videoer og deres status.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Søk i arkivet..."
              className="bg-surface/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-neon-cyan/30 outline-none w-64"
            />
          </div>
          <button 
            onClick={() => fetchOrders()}
            className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'queued', 'rendering', 'complete', 'failed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              statusFilter === s 
                ? 'bg-neon-cyan text-black border-neon-cyan' 
                : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-black/20">
                <th className="p-6">ID / Referanse</th>
                <th className="p-6">Video Detaljer</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Dato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-600 font-mono text-sm">
                    Ingen videoer funnet i arkivet.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="p-6 font-mono text-[10px] text-gray-500">
                      {order.id?.slice(0, 8)}...
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">
                          {order.title || order.topic}
                        </p>
                        <div className="flex gap-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 text-gray-500 rounded uppercase">
                            {order.language || 'Norsk'}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-neon-cyan/5 text-neon-cyan/50 rounded uppercase">
                            {order.ai_voice?.split('-')[2] || 'Voice'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {order.status === 'complete' ? (
                          <CheckCircle2 size={14} className="text-green-400" />
                        ) : order.status === 'failed' ? (
                          <AlertTriangle size={14} className="text-red-400" />
                        ) : (
                          <Loader size={14} className="text-neon-cyan animate-spin" />
                        )}
                        <span className={`text-xs font-bold uppercase ${STATUS_CONFIG[order.status]?.color || 'text-gray-400'}`}>
                          {STATUS_CONFIG[order.status]?.label || order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right text-xs text-gray-600 font-mono">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Ukjent'}
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
