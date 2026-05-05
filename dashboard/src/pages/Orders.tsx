import React from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  ClipboardList, Search, Filter, 
  Clock, CheckCircle2, Zap, AlertCircle,
  MoreVertical, ArrowUpRight, Play,
  Download, Trash2, Database
} from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';

export default function Orders() {
  const { t } = useI18nStore();
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
      case 'processing': return 'text-[#00f5ff] border-[#00f5ff]/20 bg-[#00f5ff]/5';
      case 'rendering': return 'text-[#BD00FF] border-[#BD00FF]/20 bg-[#BD00FF]/5';
      case 'failed': return 'text-[#ff4444] border-[#ff4444]/20 bg-[#ff4444]/5';
      default: return 'text-zinc-500 border-white/10 bg-white/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'processing': return <Zap size={14} className="animate-pulse" />;
      case 'rendering': return <Database size={14} className="animate-spin-slow" />;
      case 'failed': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-[#BD00FF] font-data-mono text-[11px] font-black uppercase tracking-[0.4em] mb-3">
            <ClipboardList size={16} />
            ORDER_LOG_LOGISTICS_v4
          </div>
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            ORDERS_<span className="text-[#BD00FF]">TERMINAL</span>
          </h1>
        </div>

        <div className="flex gap-6">
           <div className="panel-kinetic p-6 flex flex-col min-w-[180px] group border-[#BD00FF]/20 bg-[#BD00FF]/5 clipped-corner-sm">
              <span className="font-label-caps text-[11px] text-zinc-400 uppercase tracking-[0.3em] mb-1 font-bold">TOTAL_REQS</span>
              <span className="font-headline text-4xl font-black text-white italic tracking-tighter">{safeOrders.length}</span>
           </div>
           <div className="panel-kinetic p-6 flex flex-col min-w-[180px] group border-[#6bff83]/20 bg-[#6bff83]/5 clipped-corner-sm">
              <span className="font-label-caps text-[11px] text-zinc-400 uppercase tracking-[0.3em] mb-1 font-bold">ACTIVE_NODES</span>
              <span className="font-headline text-4xl font-black text-[#6bff83] italic tracking-tighter">
                {safeOrders.filter(o => o.status !== 'completed').length}
              </span>
           </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#BD00FF] transition-colors" />
          <input 
            type="text" 
            placeholder="SEARCH_BY_ORDER_TOPIC_OR_ID..."
            className="w-full bg-[#0A0A0B] border border-white/5 p-6 pl-16 text-white font-data-mono text-[13px] uppercase focus:outline-none focus:border-[#BD00FF]/50 transition-all clipped-corner-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 bg-[#0A0A0B] p-2 border border-white/5 clipped-corner-sm">
           {['ALL', 'PROCESSING', 'COMPLETED', 'FAILED'].map(f => (
             <button key={f} className="px-6 py-4 font-headline text-[11px] font-black uppercase italic text-zinc-500 hover:text-white transition-colors">
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* Orders Table/Grid */}
      <div className="panel-kinetic border-white/5 clipped-corner overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-6 font-label-caps text-[11px] text-zinc-400 uppercase tracking-widest">ORDER_ID</th>
                <th className="p-6 font-label-caps text-[11px] text-zinc-400 uppercase tracking-widest">TOPIC / TITLE</th>
                <th className="p-6 font-label-caps text-[11px] text-zinc-400 uppercase tracking-widest text-center">STATUS</th>
                <th className="p-6 font-label-caps text-[11px] text-zinc-400 uppercase tracking-widest text-center">PLATFORM</th>
                <th className="p-6 font-label-caps text-[11px] text-zinc-400 uppercase tracking-widest">TIMESTAMP</th>
                <th className="p-6 font-label-caps text-[11px] text-zinc-400 uppercase tracking-widest">PROGRESS</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="p-6">
                    <span className="font-data-mono text-[11px] text-[#BD00FF] font-black tracking-widest">
                      #{String(order.id).slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-6 max-w-md">
                    <div className="flex flex-col gap-1">
                      <span className="font-headline text-lg font-black text-white italic uppercase tracking-tight truncate">
                        {order.topic || order.title || 'NEURAL_RENDER_UNNAMED'}
                      </span>
                      <span className="font-data-mono text-[10px] text-zinc-500 uppercase">PROCESSED_BY: VIRANODE_CLUSTER_04</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-2 px-3 py-1.5 border clipped-corner-sm font-data-mono text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status || 'PENDING'}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-white font-data-mono text-[10px] font-black uppercase tracking-[0.2em] clipped-corner-sm">
                        {order.platform || 'TIKTOK'}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-data-mono text-[11px] text-zinc-400">
                      {new Date(order.created_at || Date.now()).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-6 min-w-[200px]">
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between font-data-mono text-[9px] text-zinc-500 uppercase font-black">
                          <span>Progress</span>
                          <span>{order.progress || 0}%</span>
                       </div>
                       <div className="h-1 bg-white/5 relative overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${order.progress || 0}%` }}
                            className="absolute top-0 left-0 h-full bg-[#BD00FF]"
                          />
                       </div>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-3 text-zinc-600 hover:text-white hover:bg-white/5 transition-all clipped-corner-sm">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <ClipboardList size={48} className="text-zinc-600" />
                      <p className="font-data-mono text-zinc-600 uppercase tracking-widest text-[13px]">
                        No production orders found in neural database.
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
