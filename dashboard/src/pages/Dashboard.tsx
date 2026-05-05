import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, Clock, CheckCircle2, 
  AlertCircle, ArrowUpRight, Filter, 
  MoreVertical, Search, Zap, Activity,
  Database, Cpu, Box
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
      case 'completed': return 'text-[#b1cdb7] bg-[#b1cdb7]/10 border-[#b1cdb7]/20';
      case 'processing': return 'text-[#bec9bf] bg-[#bec9bf]/10 border-[#bec9bf]/20';
      case 'failed': return 'text-[#ffb4ab] bg-[#ffb4ab]/10 border-[#ffb4ab]/20';
      default: return 'text-[#8c928c] bg-[#1f201e] border-[#424843]';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            {t('COMMAND_CENTER')}
          </h1>
          <p className="font-label-sm text-[#8c928c] mt-4 uppercase tracking-[0.4em] italic opacity-60">Neural_Production_Matrix // Global_Sector_01</p>
        </div>
        <div className="flex gap-6">
           <button className="flex items-center gap-4 px-8 py-5 bg-[#1b1c1a] border border-[#424843] rounded-soft-lg text-[12px] font-bold uppercase tracking-widest text-[#b1cdb7] hover:bg-[#1f201e] transition-all font-label-sm">
             <Filter size={18} />
             Filters_Matrix
           </button>
           <Link to="/create-order" className="flex items-center gap-4 px-12 py-5 bg-[#b1cdb7] text-[#1d3526] rounded-soft-lg text-[12px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#b1cdb7]/10 hover:brightness-110 active:scale-[0.98] transition-all italic font-label-sm">
             <Plus size={22} />
             {t('INITIATE_PRODUCTION')}
           </Link>
        </div>
      </header>

      {/* Stats Grid - Using Tonal Layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: t('FINISHED_ASSETS'), value: stats.total.toString().padStart(2, '0'), icon: Video, color: 'text-[#b1cdb7]' },
          { label: 'AVG_RENDER_TIME', value: stats.avgTime, icon: Clock, color: 'text-[#bec9bf]' },
          { label: t('ACTIVE_NODES'), value: stats.active.toString().padStart(2, '0'), icon: Cpu, color: 'text-[#b1cdb7]' },
          { label: 'SUCCESS_RATE', value: stats.successRate, icon: CheckCircle2, color: 'text-[#bec9bf]' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-[#1b1c1a] border border-[#424843] rounded-soft-lg relative overflow-hidden group hover:border-[#b1cdb7]/30 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className="font-label-sm text-[11px] uppercase tracking-[0.2em] text-[#8c928c] italic opacity-40">{stat.label}</span>
              <stat.icon size={26} className={stat.color} />
            </div>
            <div className="text-5xl font-bold text-[#e4e2e0] font-headline-md italic tracking-tighter relative z-10 leading-none">{stat.value}</div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-[#b1cdb7]">
              <stat.icon size={160} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Project List - Panel System */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center px-6">
            <h2 className="text-2xl font-bold text-[#e4e2e0] font-headline-md italic uppercase tracking-tighter">Production_Archive</h2>
            <Link to="/archive" className="font-label-sm text-[12px] font-bold uppercase tracking-[0.2em] text-[#b1cdb7] hover:underline italic">View_All_Nodes</Link>
          </div>

          <div className="bg-[#1b1c1a] border border-[#424843] rounded-soft-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#424843] bg-[#1f201e]/50">
                    <th className="px-10 py-8 font-label-sm text-[11px] font-bold uppercase tracking-widest text-[#8c928c] italic">Node_Identity</th>
                    <th className="px-10 py-8 font-label-sm text-[11px] font-bold uppercase tracking-widest text-[#8c928c] text-center italic">Status_Link</th>
                    <th className="px-10 py-8 font-label-sm text-[11px] font-bold uppercase tracking-widest text-[#8c928c] italic">Timestamp</th>
                    <th className="px-10 py-8 font-label-sm text-[11px] font-bold uppercase tracking-widest text-[#8c928c] text-right italic">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#424843]">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-10 py-8 h-24 bg-[#1b1c1a]/50" />
                      </tr>
                    ))
                  ) : productions.length > 0 ? productions.map((p) => (
                    <tr key={p.id} className="group hover:bg-[#1f201e] transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-[#1f201e] rounded-soft border border-[#424843] flex items-center justify-center overflow-hidden">
                            {p.thumbnail_url ? (
                              <img src={p.thumbnail_url} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                            ) : (
                              <Video size={24} className="text-[#8c928c]/20" />
                            )}
                          </div>
                          <div>
                            <p className="text-base font-bold text-[#e4e2e0] uppercase italic tracking-tight">{p.title || 'Untitled_Node'}</p>
                            <p className="font-label-sm text-[10px] text-[#b1cdb7] opacity-40">#{String(p.id).slice(0, 12).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-5 py-2 rounded-soft text-[10px] font-bold uppercase tracking-widest border italic ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-label-sm text-[11px] text-[#8c928c] uppercase font-bold italic">
                        {new Date(p.created_at).toLocaleDateString('no-NO')}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-4 bg-[#1f201e] border border-[#424843] rounded-soft text-[#b1cdb7] hover:bg-[#b1cdb7] hover:text-[#1d3526] transition-all shadow-sm">
                          <ArrowUpRight size={20} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-32 text-center text-[#8c928c] font-label-sm text-xs uppercase tracking-[0.4em] italic opacity-20 font-bold">
                        No productions found in neural archive.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Neural Feed */}
        <div className="lg:col-span-4 space-y-8">
           <div className="flex justify-between items-center px-6">
            <h2 className="text-2xl font-bold text-[#e4e2e0] font-headline-md italic uppercase tracking-tighter">Neural_Feed</h2>
            <Activity size={24} className="text-[#b1cdb7] animate-pulse" />
          </div>

          <div className="bg-[#1b1c1a] border border-[#424843] rounded-soft-xl p-10 space-y-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#b1cdb7]/5 blur-[60px] rounded-full" />
            {productions.slice(0, 6).map((p, i) => (
              <div key={p.id} className="flex gap-8 relative z-10">
                {i !== productions.slice(0, 6).length - 1 && <div className="absolute left-[15px] top-10 bottom-[-40px] w-[1px] bg-[#424843] opacity-40" />}
                <div className={`w-8 h-8 rounded-soft-sm border-2 border-[#131412] z-10 flex items-center justify-center shadow-lg ${
                  p.status === 'completed' ? 'bg-[#b1cdb7] shadow-[#b1cdb7]/10' : 'bg-[#bec9bf] shadow-[#bec9bf]/10'
                }`}>
                  {p.status === 'completed' ? <CheckCircle2 size={16} className="text-[#1d3526]" /> : <Zap size={16} className="text-[#1d3526]" />}
                </div>
                <div className="flex-1 space-y-2">
                   <p className="text-sm font-bold text-[#e4e2e0] uppercase italic tracking-tight leading-none">
                     {p.status === 'completed' ? 'Node Finalized' : 'Node Initiated'}
                   </p>
                   <p className="text-[12px] text-[#8c928c] uppercase font-bold tracking-widest truncate w-56 italic opacity-60">
                     {p.title || 'Untitled'}
                   </p>
                   <p className="font-label-sm text-[10px] text-[#b1cdb7] mt-3 uppercase font-bold italic opacity-40">
                     {new Date(p.created_at).toLocaleTimeString()}
                   </p>
                </div>
              </div>
            ))}
            {productions.length === 0 && (
              <div className="py-24 text-center opacity-10">
                <p className="font-label-sm text-xs uppercase tracking-[0.5em] text-[#8c928c] font-bold italic">Awaiting Activity...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
