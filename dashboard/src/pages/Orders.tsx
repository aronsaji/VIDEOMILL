import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { ShoppingCart, Plus, Filter, Clock, CheckCircle2, AlertTriangle, Loader, RefreshCw, Film, User, Users } from 'lucide-react';
import { triggerProduction } from '../lib/api';
import type { OrderStatus } from '../types';

// Auto-voice mapping logic
const VOICE_MAP: Record<string, Record<string, string>> = {
  'Norsk': { 'Mann': 'nb-NO-FinnNeural', 'Dame': 'nb-NO-PernilleNeural' },
  'Engelsk': { 'Mann': 'en-US-AndrewNeural', 'Dame': 'en-US-AvaNeural' },
  'Svensk': { 'Mann': 'sv-SE-MattiasNeural', 'Dame': 'sv-SE-SofieNeural' },
  'Tamil': { 'Mann': 'ta-IN-ValluvarNeural', 'Dame': 'ta-IN-PallaviNeural' },
  'Hindi': { 'Mann': 'hi-IN-MadhurNeural', 'Dame': 'hi-IN-SwararaNeural' },
};

const LANGUAGES = [
  { name: 'Norsk', flag: '🇳🇴' },
  { name: 'Engelsk', flag: '🇬🇧' },
  { name: 'Svensk', flag: '🇸🇪' },
  { name: 'Tamil', flag: '🇮🇳' },
  { name: 'Hindi', flag: '🇮🇳' },
];

export default function Orders() {
  const { orders = [], fetchOrders } = usePipelineStore();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  // Form states
  const [topic, setTopic] = useState('');
  const [gender, setGender] = useState<'Mann' | 'Dame'>('Dame');
  const [language, setLanguage] = useState('Norsk');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    if (!topic) return;

    // AUTO-SELECT VOICE
    const selectedVoice = VOICE_MAP[language]?.[gender] || 'nb-NO-PernilleNeural';

    const success = await triggerProduction({
      action: 'MANUAL_START',
      title: topic,
      topic: topic,
      style_tone: '⚡ Engaging',
      target_audience: 'Global',
      video_format: '📱 9:16 (Vertical)',
      ai_voice: selectedVoice,
      platforms: ['tiktok', 'youtube'],
      language,
      custom_instructions: instructions
    });

    if (success) {
      setShowForm(false);
      setTopic('');
      setInstructions('');
      fetchOrders();
    } else {
      alert('Kunne ikke starte produksjonen. Sjekk n8n!');
    }
  };

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
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-neon-cyan text-black rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:scale-105"
          >
            <Plus size={18} />
            Ny Video
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface/80 border border-neon-cyan/20 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,245,255,0.1)] overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: Input */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neon-cyan uppercase tracking-tighter">Tittel / Tema</label>
                  <input 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)} 
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all outline-none text-lg" 
                    placeholder="Hva skal videoen handle om?" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neon-cyan uppercase tracking-tighter">Spesielle instrukser (Valgfritt)</label>
                  <textarea 
                    value={instructions} 
                    onChange={e => setInstructions(e.target.value)} 
                    rows={4} 
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-neon-cyan/50 transition-all resize-none outline-none" 
                    placeholder="F.eks: 'Gjør stemmen ekstra entusiastisk'..." 
                  />
                </div>
              </div>

              {/* Right Column: Buttons */}
              <div className="space-y-8">
                {/* Gender Toggle */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Velg Stemme-Kjønn</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Dame', 'Mann'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g as any)}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all duration-300 font-bold ${
                          gender === g 
                            ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]'
                            : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        {g === 'Dame' ? <User size={18} /> : <Users size={18} />}
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Velg Språk</label>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.name}
                        onClick={() => setLanguage(lang.name)}
                        className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-300 ${
                          language === lang.name 
                            ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.1)]'
                            : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl mb-1">{lang.flag}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <p className="text-[10px] font-mono text-gray-500 italic">
                    AI velger automatisk: <span className="text-neon-cyan">{VOICE_MAP[language]?.[gender]}</span>
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setShowForm(false)} className="px-6 py-2 text-sm text-gray-500 hover:text-white transition-colors">Avbryt</button>
                    <button 
                      onClick={handleCreateOrder} 
                      className="px-10 py-3 bg-neon-cyan text-black rounded-xl font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                    >
                      Start Produksjon
                    </button>
                  </div>
                </div>
              </div>
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
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-neon-cyan/5 text-neon-cyan/50 rounded uppercase">{order.language}</span>
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
        </div>
      </div>
    </div>
  );
}
