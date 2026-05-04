import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { ShoppingCart, Plus, Filter, Clock, CheckCircle2, AlertTriangle, Loader, RefreshCw, Film } from 'lucide-react';
import { triggerProduction } from '../lib/api';
import type { OrderStatus } from '../types';

export default function Orders() {
  const { orders = [], fetchOrders } = usePipelineStore();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  // Form states
  const [topic, setTopic] = useState('');
  const [styleTone, setStyleTone] = useState('⚡ Engaging');
  const [targetAudience, setTargetAudience] = useState('🎮 Youth (18–25)');
  const [aiVoice, setAiVoice] = useState('🗣️ Nova (Female)');
  const [videoFormat, setVideoFormat] = useState('📱 9:16 (Vertical)');
  const [platforms, setPlatforms] = useState<string[]>(['TikTok', 'YouTube Shorts']);
  const [language, setLanguage] = useState('Norsk');
  const [instructions, setInstructions] = useState('');

  // Hent ordrer når siden lastes
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    if (!topic) return;
    const success = await triggerProduction({
      action: 'MANUAL_START',
      title: topic,
      topic: topic,
      style_tone: styleTone,
      target_audience: targetAudience,
      video_format: videoFormat,
      ai_voice: aiVoice,
      platforms: platforms.map(p => p.toLowerCase().split(' ')[0]),
      language,
      custom_instructions: instructions
    });

    if (success) {
      setShowForm(false);
      setTopic('');
      fetchOrders(); // Hent på nytt for å se den nye ordren
    } else {
      alert('Kunne ikke koble til n8n-serveren. Kontroller at den kjører!');
    }
  };

  // Sikkerhets-sjekk for orders array
  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = statusFilter === 'all' 
    ? safeOrders 
    : safeOrders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-6 max-w-6xl pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Film className="text-neon-cyan" />
            Produksjonskø & Arkiv
          </h1>
          <p className="text-sm text-gray-500 mt-1">Full oversikt over dine AI-genererte videoer</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchOrders()}
            className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all border border-white/5"
            title="Oppdater liste"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-neon-cyan text-black rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:scale-105"
          >
            <Plus size={18} />
            Opprett Video
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface/80 border border-neon-cyan/20 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-neon-cyan" />
              Ny Videobestilling
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neon-cyan/70 uppercase">Tittel / Tema</label>
                  <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-cyan/50 transition-all" placeholder="Hva skal videoen handle om?" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neon-cyan/70 uppercase">Spesielle instrukser</label>
                  <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-cyan/50 transition-all resize-none" placeholder="F.eks: 'Bruk en dramatisk stemme'..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <label className="text-xs font-mono text-gray-500 uppercase">Stemme</label>
                    <select value={aiVoice} onChange={e => setAiVoice(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white">
                       {['🗣️ Nova (Female)', '🗣️ Echo (Male)', '🗣️ Onyx (Deep)'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs font-mono text-gray-500 uppercase">Språk</label>
                    <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white">
                       {['Norsk', 'Engelsk', 'Svensk'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                 </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors">Avbryt</button>
              <button onClick={handleCreateOrder} className="px-8 py-2 bg-neon-cyan text-black rounded-xl font-bold hover:scale-105 transition-all">Start Produksjon</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-surface/30 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden min-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-black/20">
                <th className="p-5 font-medium">Video ID</th>
                <th className="p-5 font-medium">Video Detaljer</th>
                <th className="p-5 font-medium">Status & Fremdrift</th>
                <th className="p-5 font-medium text-right">Tidspunkt</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                if (!order) return null;
                const isWorking = ['script_generation', 'rendering', 'uploading'].includes(order.status);
                return (
                  <tr key={order.id || order.video_id} className="border-b border-white/5 hover:bg-neon-cyan/[0.03] transition-all group">
                    <td className="p-5">
                      <span className={`font-mono text-xs ${isWorking ? 'text-neon-cyan animate-pulse' : 'text-gray-500'}`}>
                        {order.video_id || 'Generating...'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="space-y-1">
                        <p className={`text-sm font-bold transition-colors ${isWorking ? 'text-neon-cyan' : 'text-white group-hover:text-neon-cyan'}`}>
                          {order.title || order.topic}
                        </p>
                        <div className="flex gap-2">
                          {(order.platform_destinations || []).map(p => (
                            <span key={p} className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 text-gray-500 rounded uppercase">{p}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {order.status === 'complete' || order.status === 'published' ? (
                            <CheckCircle2 size={14} className="text-green-400" />
                          ) : order.status === 'failed' ? (
                            <AlertTriangle size={14} className="text-red-400" />
                          ) : (
                            <Loader size={14} className="text-neon-cyan animate-spin" />
                          )}
                          <span className={`text-xs font-mono uppercase ${order.status === 'failed' ? 'text-red-400' : 'text-gray-300'}`}>
                            {(order.status || 'queued').replace('_', ' ')}
                          </span>
                        </div>
                        
                        {isWorking && (
                          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-neon-cyan shadow-[0_0_10px_#00f5ff]"
                              initial={{ width: 0 }}
                              animate={{ width: `${order.progress || 10}%` }}
                            />
                          </div>
                        )}

                        {order.status === 'failed' && (
                          <button
                            onClick={() => usePipelineStore.getState().retryOrder(order)}
                            className="flex items-center gap-1.5 w-fit px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase transition-all"
                          >
                            <RefreshCw size={10} />
                            Prøv Igjen
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-right font-mono text-[10px] text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleString('nb-NO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Nylig'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center text-gray-600 font-mono text-sm">
              Ingen videoer i denne kategorien.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
