import React from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  ClipboardList, Search, Filter, 
  Clock, CheckCircle2, Zap, AlertCircle,
  MoreVertical, ArrowUpRight, Play,
  Download, Trash2, Database, Radio, Activity,
  Box
} from 'lucide-react';

export default function Orders() {
  const { orders = [], fetchOrders, subscribeToChanges } = usePipelineStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    fetchOrders();
    const unsubscribe = subscribeToChanges();
    return () => {
       if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const filteredOrders = safeOrders.filter(o => 
    (o.topic || o.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-[#6bff83] border-[#6bff83]/20 bg-[#6bff83]/5';
      case 'processing': return 'text-primary-container border-primary-container/20 bg-primary-container/5';
      case 'rendering': return 'text-[#e90053] border-[#e90053]/20 bg-[#e90053]/5';
      case 'failed': return 'text-[#ff4444] border-[#ff4444]/20 bg-[#ff4444]/5';
      default: return 'text-zinc-500 border-white/10 bg-white/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'processing': return <Zap size={14} className="animate-pulse" />;
      case 'rendering': return <Activity size={14} className="animate-pulse" />;
      case 'failed': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <ClipboardList size={14} className="animate-pulse" />
            ORDER_LOG_LOGISTICS_v4.2
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            Orders_<span className="text-primary-container">Terminal</span>
          </h1>
        </div>

        <div className="flex gap-6">
           <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl flex flex-col min-w-[180px] shadow-2xl">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-2">TOTAL_REQS</span>
              <span className="text-4xl font-black text-white font-headline-md italic tracking-tighter leading-none">{safeOrders.length}</span>
           </div>
           <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl flex flex-col min-w-[180px] shadow-2xl">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-2">ACTIVE_NODES</span>
              <span className="text-4xl font-black text-primary-container font-headline-md italic tracking-tighter leading-none">
                {safeOrders.filter(o => o.status !== 'completed').length}
              </span>
           </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-primary-container transition-colors" />
          <input 
            type="text" 
            placeholder="Search Order Topic or ID..."
            className="w-full bg-surface-container-low border border-white/5 py-6 pl-16 pr-10 rounded-2xl text-sm text-white focus:outline-none focus:border-primary-container/50 transition-all font-mono uppercase font-black tracking-widest placeholder:text-zinc-900 shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-surface-container-low p-2 border border-white/5 rounded-2xl shadow-2xl">
           {['ALL', 'PROCESSING', 'COMPLETED', 'FAILED'].map(f => (
             <button key={f} className="px-8 py-4 font-black uppercase italic text-[10px] text-zinc-700 hover:text-white transition-all tracking-widest rounded-xl hover:bg-white/5">
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-low border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="p-8 font-mono text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">Order_ID</th>
                <th className="p-8 font-mono text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">Neural_Topic</th>
                <th className="p-8 font-mono text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black text-center">Status</th>
                <th className="p-8 font-mono text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black text-center">Platform</th>
                <th className="p-8 font-mono text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">Timestamp</th>
                <th className="p-8 font-mono text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">Progress</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="p-8">
                    <span className="font-mono text-[10px] text-primary-container font-black tracking-widest">
                      #{String(order.id).slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-8 max-w-md">
                    <div className="flex flex-col gap-2">
                      <span className="text-xl font-black text-white font-headline-md italic uppercase tracking-tighter truncate leading-none group-hover:text-primary-container transition-colors">
                        {order.topic || order.title || 'NEURAL_RENDER'}
                      </span>
                      <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-widest">CLUSTER_ALPHA_NODE_04</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-mono text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status || 'PENDING'}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 bg-black/40 border border-white/10 text-white font-mono text-[9px] font-black uppercase tracking-[0.2em] rounded-lg">
                        {order.platform || 'TIKTOK'}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="font-mono text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                      {new Date(order.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-8 min-w-[200px]">
                    <div className="flex flex-col gap-3">
                       <div className="flex justify-between font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest">
                          <span>{order.progress || 0}%</span>
                       </div>
                       <div className="h-1.5 bg-black border border-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${order.progress || 0}%` }}
                            className="h-full bg-primary-container shadow-[0_0_10px_#22d3ee]"
                          />
                       </div>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <button className="p-3 text-zinc-800 hover:text-white transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <Box size={64} className="text-zinc-900" />
                      <p className="font-mono text-zinc-800 uppercase tracking-[0.4em] font-black italic">
                        Zero orders detected in cluster database.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
