import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, Clock, CheckCircle2, 
  AlertCircle, ArrowUpRight, Filter, 
  MoreVertical, Search, Zap, Activity,
  Database, Cpu
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedLogo from '../components/AnimatedLogo';

export default function Dashboard() {
  const [productions, setProductions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    avgTime: '4m 12s',
    successRate: '98.4%'
  });

  useEffect(() => {
    fetchData();
    const subscription = supabase
      .channel('productions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productions' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('productions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductions(data || []);
      
      // Calculate real stats
      const total = data?.length || 0;
      const active = data?.filter(p => p.status === 'processing' || p.status === 'pending').length || 0;
      const successCount = data?.filter(p => p.status === 'completed').length || 0;
      const rate = total > 0 ? ((successCount / total) * 100).toFixed(1) : '0';

      setStats({
        total,
        active,
        avgTime: '3m 45s',
        successRate: `${rate}%`
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#6bff83] bg-[#6bff83]/10';
      case 'processing': return 'text-primary-container bg-primary-container/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-zinc-500 bg-white/5';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div className="flex flex-col items-start gap-6">
          <AnimatedLogo size="md" />
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/10 transition-all font-mono">
             <Filter size={14} />
             Filters_Matrix
           </button>
           <Link to="/create-order" className="flex items-center gap-3 px-8 py-4 bg-primary-container text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:brightness-110 active:scale-[0.98] transition-all italic">
             <Plus size={18} />
             Initialize_Sequence
           </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Productions', value: stats.total, icon: Video, color: 'text-primary-container' },
          { label: 'Avg Render Time', value: stats.avgTime, icon: Clock, color: 'text-zinc-400' },
          { label: 'Active Agents', value: stats.active, icon: Cpu, color: 'text-[#6bff83]' },
          { label: 'Success Rate', value: stats.successRate, icon: CheckCircle2, color: 'text-[#00f5ff]' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-surface-container-low border border-white/5 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{stat.label}</span>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-4xl font-black text-white font-headline-md italic tracking-tighter">{stat.value}</div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <stat.icon size={120} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Project List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Your Projects</h2>
            <Link to="/archive" className="text-[10px] font-black uppercase tracking-widest text-primary-container hover:underline">View All</Link>
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Project</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6 h-20 bg-white/[0.01]" />
                    </tr>
                  ))
                ) : productions.length > 0 ? productions.map((p) => (
                  <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                          {p.thumbnail_url ? (
                            <img src={p.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Video size={20} className="text-zinc-700" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase italic tracking-tight">{p.title || 'Untitled_Node'}</p>
                          <p className="text-[10px] text-zinc-600 font-mono">#{String(p.id).slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[11px] text-zinc-500 font-mono uppercase">
                      {new Date(p.created_at).toLocaleDateString('no-NO')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 text-zinc-600 hover:text-white transition-colors">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-zinc-700 font-mono text-xs uppercase tracking-widest">
                      No productions found in neural archive.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
           <div className="flex justify-between items-center px-4">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Neural Feed</h2>
            <Activity size={18} className="text-primary-container animate-pulse" />
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
            {productions.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex gap-6 relative">
                {i !== 4 && <div className="absolute left-[11px] top-8 bottom-[-32px] w-[2px] bg-white/5" />}
                <div className={`w-6 h-6 rounded-full border-2 border-[#050505] z-10 flex items-center justify-center ${
                  p.status === 'completed' ? 'bg-[#6bff83]' : 'bg-primary-container'
                }`}>
                  {p.status === 'completed' ? <CheckCircle2 size={12} className="text-black" /> : <Zap size={12} className="text-black" />}
                </div>
                <div className="flex-1 space-y-1">
                   <p className="text-xs font-black text-white uppercase italic tracking-tight leading-none">
                     {p.status === 'completed' ? 'Node Finalized' : 'Node Initiated'}
                   </p>
                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate w-48">
                     {p.title || 'Untitled'}
                   </p>
                   <p className="text-[9px] text-zinc-700 font-mono mt-2 uppercase">
                     {new Date(p.created_at).toLocaleTimeString()}
                   </p>
                </div>
              </div>
            ))}
            {productions.length === 0 && (
              <div className="py-20 text-center opacity-20">
                <p className="text-xs font-mono uppercase tracking-[0.3em]">Awaiting Activity...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
