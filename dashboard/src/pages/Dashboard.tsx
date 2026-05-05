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
      case 'processing': return 'text-[#4169E1] bg-[#4169E1]/10 border-[#4169E1]/20';
      case 'failed': return 'text-error bg-error/10 border-error/20';
      default: return 'text-on-surface-variant bg-surface-container border-outline';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <h1 className="text-6xl font-black text-[#1E3A8A] font-headline-md italic uppercase tracking-tighter leading-none">
            {t('COMMAND_CENTER')}
          </h1>
          <p className="text-on-surface-variant mt-4 font-mono text-[11px] uppercase font-black tracking-widest italic opacity-60">Neural_Production_Matrix // Global_Sector_01</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-3 px-8 py-5 bg-surface border border-outline rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#4169E1] hover:bg-surface-container transition-all font-mono shadow-sm">
             <Filter size={16} />
             Filters_Matrix
           </button>
           <Link to="/create-order" className="flex items-center gap-4 px-10 py-5 bg-[#4169E1] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#4169E1]/20 hover:brightness-110 active:scale-[0.98] transition-all italic">
             <Plus size={20} />
             {t('INITIATE_PRODUCTION')}
           </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: t('FINISHED_ASSETS'), value: stats.total.toString().padStart(2, '0'), icon: Video, color: 'text-[#4169E1]' },
          { label: 'AVG_RENDER_TIME', value: stats.avgTime, icon: Clock, color: 'text-[#1E3A8A]' },
          { label: t('ACTIVE_NODES'), value: stats.active.toString().padStart(2, '0'), icon: Cpu, color: 'text-success' },
          { label: 'SUCCESS_RATE', value: stats.successRate, icon: CheckCircle2, color: '#4169E1' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-surface border border-outline rounded-[2.5rem] relative overflow-hidden group hover:border-[#4169E1]/30 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant italic opacity-40">{stat.label}</span>
              <stat.icon size={24} className={typeof stat.color === 'string' ? stat.color : ''} style={{ color: typeof stat.color === 'string' && !stat.color.startsWith('text-') ? stat.color : undefined }} />
            </div>
            <div className="text-5xl font-black text-[#1E3A8A] font-headline-md italic tracking-tighter relative z-10 leading-none">{stat.value}</div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <stat.icon size={160} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Project List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-2xl font-black text-[#1E3A8A] italic uppercase tracking-tighter">Production_Archive</h2>
            <Link to="/archive" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4169E1] hover:underline italic">View_All_Nodes</Link>
          </div>

          <div className="bg-surface border border-outline rounded-[3rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline bg-surface-container/30">
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-on-surface-variant italic">Node_Identity</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-on-surface-variant text-center italic">Status_Link</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-on-surface-variant italic">Timestamp</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-on-surface-variant text-right italic">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-10 py-8 h-24 bg-surface-container/10" />
                      </tr>
                    ))
                  ) : productions.length > 0 ? productions.map((p) => (
                    <tr key={p.id} className="group hover:bg-surface-container transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-surface-container rounded-2xl border border-outline flex items-center justify-center overflow-hidden shadow-inner">
                            {p.thumbnail_url ? (
                              <img src={p.thumbnail_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            ) : (
                              <Video size={24} className="text-[#4169E1]/30" />
                            )}
                          </div>
                          <div>
                            <p className="text-base font-black text-[#1E3A8A] uppercase italic tracking-tight">{p.title || 'Untitled_Node'}</p>
                            <p className="text-[10px] text-[#4169E1] font-mono font-black opacity-40">#{String(p.id).slice(0, 12).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border italic shadow-sm ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-[11px] text-on-surface-variant font-mono uppercase font-black italic">
                        {new Date(p.created_at).toLocaleDateString('no-NO')}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-4 bg-surface-container border border-outline rounded-xl text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-all shadow-sm">
                          <ArrowUpRight size={20} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-32 text-center text-on-surface-variant font-mono text-xs uppercase tracking-[0.4em] italic opacity-20 font-black">
                        No productions found in neural archive.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-4 space-y-8">
           <div className="flex justify-between items-center px-4">
            <h2 className="text-2xl font-black text-[#1E3A8A] italic uppercase tracking-tighter">Neural_Feed</h2>
            <Activity size={20} className="text-[#4169E1] animate-pulse" />
          </div>

          <div className="bg-surface border border-outline rounded-[3rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4169E1]/5 blur-[60px] rounded-full" />
            {productions.slice(0, 6).map((p, i) => (
              <div key={p.id} className="flex gap-8 relative z-10">
                {i !== productions.slice(0, 6).length - 1 && <div className="absolute left-[15px] top-10 bottom-[-40px] w-[2px] bg-outline opacity-40" />}
                <div className={`w-8 h-8 rounded-xl border-2 border-surface z-10 flex items-center justify-center shadow-lg ${
                  p.status === 'completed' ? 'bg-success shadow-success/20' : 'bg-[#4169E1] shadow-[#4169E1]/20'
                }`}>
                  {p.status === 'completed' ? <CheckCircle2 size={16} className="text-white" /> : <Zap size={16} className="text-white" />}
                </div>
                <div className="flex-1 space-y-2">
                   <p className="text-sm font-black text-[#1E3A8A] uppercase italic tracking-tight leading-none">
                     {p.status === 'completed' ? 'Node Finalized' : 'Node Initiated'}
                   </p>
                   <p className="text-[12px] text-on-surface-variant uppercase font-black tracking-widest truncate w-56 italic opacity-60">
                     {p.title || 'Untitled'}
                   </p>
                   <p className="text-[10px] text-[#4169E1] font-mono mt-3 uppercase font-black italic opacity-40">
                     {new Date(p.created_at).toLocaleTimeString()}
                   </p>
                </div>
              </div>
            ))}
            {productions.length === 0 && (
              <div className="py-24 text-center opacity-10">
                <p className="text-xs font-mono uppercase tracking-[0.5em] text-on-surface-variant font-black italic">Awaiting Activity...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
