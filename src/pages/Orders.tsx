import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
// ... lucide imports ...
import { 
  ClipboardList, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  User,
  Cpu,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Production } from '../types';

export const Orders = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const handleRetry = async (order: Production) => {
    setRetryingId(order.id);
    try {
      // 1. Update status in Supabase
      const { error: dbError } = await supabase
        .from('productions')
        .update({ status: 'processing', progress: 0 })
        .eq('id', order.id);

      if (dbError) throw dbError;

      // 2. Call n8n retry webhook
      const response = await fetch('/api/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...order,
          video_id: order.id,
          retry: true
        }),
      });

      if (!response.ok) {
        throw new Error('Kunne ikke kontakte n8n for retry');
      }

    } catch (err: any) {
      console.error("Retry error:", err);
      // Revert status if possible or just log
      await supabase
        .from('productions')
        .update({ status: 'failed' })
        .eq('id', order.id);
      
      alert(`Retry feilet: ${err.message}`);
    } finally {
      setRetryingId(null);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setErrorStatus(null);
      try {
        const { data, error } = await supabase
          .from('productions')
          .select('id, title, status, progress, duration, created_at, error')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setOrders(data);
      } catch (err: any) {
        console.error("Fetch orders error:", err);
        setErrorStatus(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const subscription = supabase
      .channel('productions_orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productions' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [payload.new as Production, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new as Production : o));
        } else if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(o => o.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('orders.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('orders.subtitle')}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-2 rounded-lg flex items-center gap-4">
            <div className="flex flex-col items-end border-r border-outline pr-4">
              <span className="mono text-[8px] text-text-muted uppercase tracking-widest">Kø-belastning</span>
              <span className="mono text-xs text-primary font-bold">12 AKTIVE / 4 VENTER</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="mono text-[8px] text-text-muted uppercase tracking-widest">Gj.snitt Tid</span>
              <span className="mono text-xs text-secondary font-bold">4min 12s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Søk etter ordre ID eller tittel..." 
            className="w-full bg-surface border border-outline rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-all font-mono text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['Alle', 'Aktiv', 'Ferdig', 'Feilet'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={cn(
                "px-4 py-3 rounded-xl border mono text-[10px] uppercase tracking-widest transition-all",
                filter === f.toLowerCase() ? "bg-primary/10 border-primary text-primary" : "bg-surface border-outline text-text-muted hover:border-text-muted"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-white/5 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-outline">
              <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">{t('orders.id')}</th>
              <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">AI Agent</th>
              <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Operatør</th>
              <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Status</th>
              <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Prioritet</th>
              <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">{t('common.time')}</th>
              <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Logg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/30">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-20 text-center">
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                     <p className="mono text-[10px] uppercase text-text-muted">Henter ordrer...</p>
                   </div>
                </td>
              </tr>
            ) : errorStatus ? (
              <tr>
                <td colSpan={7} className="p-20 text-center">
                   <div className="flex flex-col items-center gap-4">
                     <AlertCircle className="text-red-400" size={32} />
                     <p className="mono text-[12px] uppercase text-red-400 font-bold">FEIL VED HENTING AV DATA</p>
                     <p className="text-[10px] text-text-muted max-w-md mx-auto">{errorStatus}</p>
                     {!import.meta.env.VITE_SUPABASE_URL && (
                       <p className="text-[9px] text-orange-400 font-bold mt-2 uppercase">Tips: Supabase URL mangler i konfigurasjonen.</p>
                     )}
                   </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-20 text-center">
                   <p className="mono text-[10px] uppercase text-text-muted tracking-[0.2em]">Ingen ordrer funnet i systemet</p>
                </td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="mono text-[10px] text-primary font-bold mb-1 tracking-wider">{order.id.slice(0, 8)}</span>
                    <span className="font-bold group-hover:text-primary transition-colors truncate max-w-[200px]">{order.title}</span>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Cpu size={12} className="text-primary" />
                      </div>
                      <span className="text-[10px] mono font-bold uppercase text-primary">ATLAS</span>
                   </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface border border-outline flex items-center justify-center">
                        <User size={12} className="text-text-muted" />
                      </div>
                      <span className="text-xs font-medium truncate max-w-[100px]">{currentUser?.email || 'Admin User'}</span>
                   </div>
                </td>
                <td className="p-4">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-2 py-1 rounded text-[10px] mono font-bold uppercase",
                    order.status === 'completed' ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" :
                    order.status === 'processing' ? "text-primary bg-primary/10 border border-primary/20" :
                    order.status === 'failed' ? "text-red-400 bg-red-400/10 border border-red-400/20" :
                    "text-text-muted bg-surface border border-outline"
                  )}>
                    {order.status === 'processing' && <Clock size={10} className="animate-pulse" />}
                    {order.status === 'completed' && <CheckCircle size={10} />}
                    {order.status === 'failed' && <AlertCircle size={10} />}
                    {order.status}
                  </div>
                </td>
                <td className="p-4">
                   <span className="text-[10px] mono uppercase font-bold text-red-400">
                     4K
                   </span>
                </td>
                <td className="p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest whitespace-nowrap">
                  {order.created_at}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {order.status === 'failed' && (
                      <button 
                        onClick={() => handleRetry(order)}
                        disabled={retryingId === order.id}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-all text-[10px] mono font-bold uppercase",
                          retryingId === order.id && "opacity-50 cursor-not-allowed"
                        )}
                        title="Retry Production"
                      >
                        <RefreshCw size={12} className={cn(retryingId === order.id && "animate-spin")} />
                        {retryingId === order.id ? 'Retrying...' : 'Retry'}
                      </button>
                    )}
                    <button className="text-text-muted hover:text-primary transition-colors p-1" title="View Details">
                      <Eye size={16} />
                    </button>
                    <button className="text-text-muted hover:text-primary transition-colors p-1" title="External Link">
                      <ExternalLink size={16} />
                    </button>
                    <button className="text-text-muted hover:text-white transition-colors p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-8">
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-outline hover:border-primary text-text-muted hover:text-primary transition-all rounded mono text-[10px] uppercase">Forrige</button>
            <div className="flex gap-1">
               <button className="w-8 h-8 flex items-center justify-center bg-primary text-background font-bold rounded text-xs">1</button>
               <button className="w-8 h-8 flex items-center justify-center hover:bg-surface rounded text-xs">2</button>
               <button className="w-8 h-8 flex items-center justify-center hover:bg-surface rounded text-xs">3</button>
            </div>
            <button className="px-4 py-2 border border-outline hover:border-primary text-text-muted hover:text-primary transition-all rounded mono text-[10px] uppercase">Neste</button>
         </div>
      </div>
    </div>
  );
};
