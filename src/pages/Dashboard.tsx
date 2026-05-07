import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  Clock, 
  Users, 
  Play, 
  CheckCircle,
  Activity,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Logo } from '../components/ui/Logo';
import { supabase } from '../lib/supabase';
import { Production } from '../types';

const data = [
  { name: '01. Mai', views: 4000, engagement: 2400 },
  { name: '02. Mai', views: 3000, engagement: 1398 },
  { name: '03. Mai', views: 2000, engagement: 9800 },
  { name: '04. Mai', views: 2780, engagement: 3908 },
  { name: '05. Mai', views: 1890, engagement: 4800 },
  { name: '06. Mai', views: 2390, engagement: 3800 },
  { name: '07. Mai', views: 3490, engagement: 4300 },
];

const StatCard = ({ label, value, icon: Icon, trend, color = "primary" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface border border-primary/10 p-6 rounded-xl relative overflow-hidden group shadow-sleek transition-all duration-300"
  >
    <p className="text-[10px] uppercase font-mono text-accent mb-1 tracking-widest">{label}</p>
    <div className="flex justify-between items-end">
      <h2 className="text-3xl font-bold text-text tracking-tighter">{value}</h2>
      <div className="text-xs text-emerald-400 flex items-center gap-1 font-mono mb-1">
        <ArrowUpRight size={10} strokeWidth={3} />
        +{trend}%
      </div>
    </div>
    {label === "Brukerrettet" && (
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: value }} />
      </div>
    )}
    {label === "Konvertering" && (
      <p className="mt-4 text-[10px] opacity-50 font-mono">Benchmark: 7.2%</p>
    )}
  </motion.div>
);

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVideos: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });
  const [recentQueued, setRecentQueued] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: allProd, error: prodError } = await supabase
          .from('productions')
          .select('id, status, title');

        if (prodError) throw prodError;

        if (allProd) {
          const total = allProd.length;
          const proc = allProd.filter(p => p.status === 'processing').length;
          const comp = allProd.filter(p => p.status === 'completed').length;
          const fail = allProd.filter(p => p.status === 'failed').length;

          setStats({
            totalVideos: total,
            processing: proc,
            completed: comp,
            failed: fail
          });

          // Most recent 5
          setRecentQueued(allProd.slice(0, 5) as any);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productions' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSave = () => {
    // Simulate save functionality
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerText;
      btn.innerText = 'LAGRET!';
      btn.classList.add('bg-emerald-500', 'text-white');
      setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('bg-emerald-500', 'text-white');
      }, 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Logo size="lg" className="hidden md:block shadow-[0_0_50px_rgba(34,211,238,0.2)]" />
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl uppercase tracking-tighter mb-2 text-text font-black leading-none">
                {t('dashboard.title')} 
                <button 
                  onClick={() => alert('Sjekker systemintegritet... Alle noder er online.')}
                  className="text-primary hover:text-white transition-colors mono ml-4 text-sm tracking-normal cursor-pointer animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                >
                  [ ONLINE ]
                </button>
              </h1>
              <p className="text-text-muted font-mono text-sm tracking-[0.2em] uppercase italic opacity-70">
                Next-Gen AI Viral Engine / Cluster v2.4
              </p>
            </motion.div>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            id="save-btn"
            onClick={handleSave}
            className="flex-1 md:flex-none bg-surface border border-primary/30 text-primary px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-all shadow-lg shadow-primary/5 active:scale-95"
          >
            {t('common.save')}
          </button>
          <button 
            onClick={() => navigate('/create')}
            className="flex-1 md:flex-none bg-primary text-background px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:neon-glow transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={14} strokeWidth={3} />
            Ny Produksjon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={t('dashboard.stats.totalVideos')} value={stats.totalVideos} icon={Eye} trend={12.5} color="primary" />
        <StatCard label="I produksjon" value={stats.processing} icon={Clock} trend={8.2} color="secondary" />
        <StatCard label="Fullført" value={stats.completed} icon={CheckCircle} trend={4.1} color="accent" />
        <StatCard label="Feilet" value={stats.failed} icon={TrendingUp} trend={15.9} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface border border-primary/20 rounded-xl flex flex-col">
          <div className="px-6 py-4 border-b border-primary/10 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text">{t('dashboard.title')} Cluster</h3>
            <span className="text-[10px] px-2 py-0.5 border border-emerald-500/50 text-emerald-500 rounded bg-emerald-500/5 uppercase font-mono">System Stabilt</span>
          </div>
          <div className="p-8">
            <div className="flex gap-6 mb-8 text-[10px] font-mono tracking-widest text-text-muted uppercase">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> {t('dashboard.stats.totalVideos')}</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary" /> {t('dashboard.efficiency')}</div>
            </div>
            <div className="h-[350px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e0b6ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e0b6ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(34, 211, 238, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#b9cacb" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#b9cacb" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121415', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#e2e2e4' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="engagement" stroke="#e0b6ff" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="px-6 py-3 bg-background border-t border-primary/10 font-mono text-[9px] text-primary/60">
            [2026-05-06 19:26:19] NODE_SYNC: Alt trafikk flyter optimalt gjennom Snöstorm nettverket.
          </div>
        </div>

         <div className="lg:col-span-4 bg-surface border border-accent/20 rounded-xl p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">{t('dashboard.productionQueue')}</h3>
          <div className="space-y-4 flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-10">
                <Loader2 className="animate-spin text-accent" size={20} />
              </div>
            ) : recentQueued.length === 0 ? (
              <div className="text-center p-10">
                <p className="text-[10px] mono text-text-muted uppercase">Ingen nylige ordrer</p>
              </div>
            ) : recentQueued.map((order) => (
              <div 
                key={order.id} 
                className="flex gap-4 group cursor-pointer border-b border-primary/5 pb-4 last:border-0"
                onClick={() => navigate('/orders')}
              >
                <div className="w-16 h-10 bg-background rounded-lg border border-primary/10 overflow-hidden flex-shrink-0">
                   <img 
                     src={`https://picsum.photos/seed/${order.id}/160/100`} 
                     alt={order.title} 
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                   />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{order.title}</p>
                  <p className="text-[9px] mono text-text-muted mt-1 uppercase flex items-center gap-2">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      order.status === 'completed' ? "bg-emerald-400" : 
                      order.status === 'processing' ? "bg-primary animate-pulse" : "bg-red-400"
                    )} />
                    {order.status === 'processing' ? 'I produksjon' : order.status === 'completed' ? 'Ferdigstilt' : 'Feilet'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button 
              onClick={() => navigate('/library')}
              className="w-full py-2 border border-accent/30 rounded text-[10px] uppercase font-bold text-accent hover:bg-accent/10 transition-all"
            >
              {t('sidebar.items.library')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
