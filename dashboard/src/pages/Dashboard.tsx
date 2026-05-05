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
import { useI18nStore } from '../store/i18nStore';

export default function Dashboard() {
  const { t } = useI18nStore();
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
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'processing': return 'text-primary bg-primary/10 border-primary/20';
      case 'failed': return 'text-error bg-error/10 border-error/20';
      default: return 'text-on-surface-variant bg-surface-container border-outline';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <h1 className="text-4xl font-black text-on-surface font-headline-md italic uppercase tracking-tighter leading-none">
            {t('COMMAND_CENTER')}
          </h1>
          <p className="text-on-surface-variant mt-2 font-mono text-[10px] uppercase font-black tracking-widest italic opacity-60">Neural_Production_Matrix // Node_Stable</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-4 bg-surface border border-outline rounded-2xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all font-mono">
             <Filter size={14} />
             Filters_Matrix
           </button>
           <Link to="/create-order" className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all italic">
             <Plus size={18} />
             {t('INITIATE_PRODUCTION')}
           </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('FINISHED_ASSETS'), value: stats.total, icon: Video, color: 'text-primary' },
          { label: 'Avg Render Time', value: stats.avgTime, icon: Clock, color: 'text-on-surface-variant' },
          { label: t('ACTIVE_NODES'), value: stats.active, icon: Cpu, color: 'text-success' },
          { label: 'Success Rate', value: stats.successRate, icon: CheckCircle2, color: 'text-primary' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-surface border border-outline rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{stat.label}</span>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-4xl font-black text-on-surface font-headline-md italic tracking-tighter">{stat.value}</div>
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
            <h2 className="text-xl font-black text-on-surface italic uppercase tracking-tighter">Your Projects</h2>
            <Link to="/archive" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</Link>
          </div>

          <div className="bg-surface border border-outline rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline bg-surface-container/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Project</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6 h-20 bg-surface-container/20" />
                    </tr>
                  ))
                ) : productions.length > 0 ? productions.map((p) => (
                  <tr key={p.id} className="group hover:bg-surface-container transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-container rounded-xl border border-outline flex items-center justify-center overflow-hidden">
                          {p.thumbnail_url ? (
                            <img src={p.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Video size={20} className="text-on-surface-variant/30" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface uppercase italic tracking-tight">{p.title || 'Untitled_Node'}</p>
                          <p className="text-[10px] text-on-surface-variant/60 font-mono">#{String(p.id).slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[11px] text-on-surface-variant font-mono uppercase">
                      {new Date(p.created_at).toLocaleDateString('no-NO')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 text-on-surface-variant/30 hover:text-primary transition-colors">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-on-surface-variant/40 font-mono text-xs uppercase tracking-widest">
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
            <h2 className="text-xl font-black text-on-surface italic uppercase tracking-tighter">Neural Feed</h2>
            <Activity size={18} className="text-primary animate-pulse" />
          </div>

          <div className="bg-surface border border-outline rounded-[2rem] p-8 space-y-8 shadow-sm">
            {productions.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex gap-6 relative">
                {i !== 4 && <div className="absolute left-[11px] top-8 bottom-[-32px] w-[2px] bg-outline" />}
                <div className={`w-6 h-6 rounded-full border-2 border-surface z-10 flex items-center justify-center ${
                  p.status === 'completed' ? 'bg-success' : 'bg-primary'
                }`}>
                  {p.status === 'completed' ? <CheckCircle2 size={12} className="text-white" /> : <Zap size={12} className="text-white" />}
                </div>
                <div className="flex-1 space-y-1">
                   <p className="text-xs font-black text-on-surface uppercase italic tracking-tight leading-none">
                     {p.status === 'completed' ? 'Node Finalized' : 'Node Initiated'}
                   </p>
                   <p className="text-[10px] text-on-surface-variant uppercase tracking-widest truncate w-48">
                     {p.title || 'Untitled'}
                   </p>
                   <p className="text-[9px] text-on-surface-variant/60 font-mono mt-2 uppercase">
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
