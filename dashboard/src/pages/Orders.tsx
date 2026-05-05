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
      case 'completed': return 'text-success border-success/20 bg-success/5';
      case 'processing': return 'text-primary border-primary/20 bg-primary/5';
      case 'rendering': return 'text-error border-error/20 bg-error/5';
      case 'failed': return 'text-error border-error/20 bg-error/5';
      default: return 'text-on-surface-variant border-outline bg-surface-container';
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
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary font-mono text-[11px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <ClipboardList size={14} className="animate-pulse" />
            ORDER_LOG_LOGISTICS_v4.2
          </div>
          <h1 className="text-6xl font-black text-on-surface font-headline-md tracking-tighter italic uppercase leading-none">
            Orders_<span className="text-primary">Terminal</span>
          </h1>
        </div>

        <div className="flex gap-6">
           <div className="bg-surface border border-outline p-6 rounded-2xl flex flex-col min-w-[180px] shadow-sm">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] mb-2">TOTAL_REQS</span>
              <span className="text-4xl font-black text-on-surface font-headline-md italic tracking-tighter leading-none">{safeOrders.length}</span>
           </div>
           <div className="bg-surface border border-outline p-6 rounded-2xl flex flex-col min-w-[180px] shadow-sm">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] mb-2">ACTIVE_NODES</span>
              <span className="text-4xl font-black text-primary font-headline-md italic tracking-tighter leading-none">
                {safeOrders.filter(o => o.status !== 'completed').length}
              </span>
           </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Order Topic or ID..."
            className="w-full bg-surface border border-outline py-6 pl-16 pr-10 rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-all font-mono uppercase font-black tracking-widest placeholder:text-on-surface-variant/20 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-surface p-2 border border-outline rounded-2xl shadow-sm">
           {['ALL', 'PROCESSING', 'COMPLETED', 'FAILED'].map(f => (
             <button key={f} className="px-8 py-4 font-black uppercase italic text-[11px] text-on-surface-variant hover:text-on-surface transition-all tracking-widest rounded-xl hover:bg-surface-container">
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface border border-outline rounded-[3rem] shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/50 border-b border-outline">
                <th className="p-8 font-mono text-[11px] text-on-surface-variant uppercase tracking-[0.3em] font-black">Order_ID</th>
                <th className="p-8 font-mono text-[11px] text-on-surface-variant uppercase tracking-[0.3em] font-black">Neural_Topic</th>
                <th className="p-8 font-mono text-[11px] text-on-surface-variant uppercase tracking-[0.3em] font-black text-center">Status</th>
                <th className="p-8 font-mono text-[11px] text-on-surface-variant uppercase tracking-[0.3em] font-black text-center">Platform</th>
                <th className="p-8 font-mono text-[11px] text-on-surface-variant uppercase tracking-[0.3em] font-black">Timestamp</th>
                <th className="p-8 font-mono text-[11px] text-on-surface-variant uppercase tracking-[0.3em] font-black">Progress</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-surface-container transition-all">
                  <td className="p-8">
                    <span className="font-mono text-[11px] text-primary font-black tracking-widest">
                      #{String(order.id).slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-8 max-w-md">
                    <div className="flex flex-col gap-2">
                      <span className="text-xl font-black text-on-surface font-headline-md italic uppercase tracking-tighter truncate leading-none group-hover:text-primary transition-colors">
                        {order.topic || order.title || 'NEURAL_RENDER'}
                      </span>
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest italic opacity-60">CLUSTER_ALPHA_NODE_04</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-mono text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status || 'PENDING'}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 bg-surface-container border border-outline text-on-surface font-mono text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                        {order.platform || 'TIKTOK'}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="font-mono text-[11px] text-on-surface-variant font-black uppercase tracking-widest">
                      {new Date(order.created_at || Date.now()).toLocaleDateString('no-NO')}
                    </span>
                  </td>
                  <td className="p-8 min-w-[200px]">
                    <div className="flex flex-col gap-3">
                       <div className="flex justify-between font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest">
                          <span>{order.progress || 0}%</span>
                       </div>
                       <div className="h-2 bg-surface-container border border-outline rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${order.progress || 0}%` }}
                            className="h-full bg-primary shadow-[0_0_10px_rgba(8,145,178,0.2)]"
                          />
                       </div>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <button className="p-3 text-on-surface-variant hover:text-primary transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <Box size={64} className="text-on-surface-variant" />
                      <p className="font-mono text-on-surface-variant uppercase tracking-[0.4em] font-black italic">
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
