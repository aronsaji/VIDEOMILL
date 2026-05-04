import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Zap, Send, Target, Globe, Mic, Type, 
  Smartphone, Monitor, Sparkles, AlertCircle,
  CheckCircle2, Loader2, Activity, Cpu, ShieldAlert
} from 'lucide-react';

export default function Orders() {
  const { triggerProduction } = usePipelineStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    language: 'Norwegian',
    platform: 'TikTok',
    ai_voice: 'nova',
    style: 'documentary'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await triggerProduction({
        ...formData,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ ...formData, topic: '' });
    } catch (error) {
      console.error('Failed to trigger production:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-16 pb-24 px-4 lg:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-brand-2 font-mono text-[13px] font-black uppercase tracking-[0.4em]"
          >
            <Activity size={14} className="animate-pulse" />
            Direct Synthesis Protocol v1.2
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              Manual <span className="text-brand-2">Trigger</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-16 bg-brand-2/50" />
               <p className="text-gray-500 font-bold uppercase tracking-widest text-[13px] italic">Bypass automated neural analysis engines</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card-standard !p-12 space-y-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-2/[0.01] pointer-events-none" />
            
            {/* Topic Input */}
            <div className="space-y-4">
              <label className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Production Blueprint / Concept</label>
              <div className="relative">
                <Target className="absolute left-8 top-8 text-brand-2" size={24} />
                <textarea 
                  required
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="E.g. The secret history of Cyberpunk architecture in Tokyo..."
                  className="w-full bg-black/40 border border-white/5 rounded-[32px] p-8 pl-20 min-h-[200px] text-[18px] font-black text-white placeholder:text-gray-700 focus:border-brand-2/40 outline-none transition-all resize-none italic uppercase tracking-tight"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Language */}
              <div className="space-y-4">
                <label className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Neural Language</label>
                <div className="relative">
                  <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-2" size={20} />
                  <select 
                    value={formData.language}
                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-[24px] p-5 pl-16 text-[14px] font-black text-white appearance-none focus:border-brand-2/40 outline-none uppercase italic tracking-widest cursor-pointer"
                  >
                    <option value="Norwegian" className="bg-[#05060f]">Norsk_Bokmål</option>
                    <option value="English" className="bg-[#05060f]">English_Global</option>
                    <option value="Swedish" className="bg-[#05060f]">Svenska_North</option>
                    <option value="German" className="bg-[#05060f]">Deutsch_Level_1</option>
                  </select>
                </div>
              </div>

              {/* AI Voice */}
              <div className="space-y-4">
                <label className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Voice Frequency Profile</label>
                <div className="relative">
                  <Mic className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-2" size={20} />
                  <select 
                    value={formData.ai_voice}
                    onChange={e => setFormData({ ...formData, ai_voice: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-[24px] p-5 pl-16 text-[14px] font-black text-white appearance-none focus:border-brand-2/40 outline-none uppercase italic tracking-widest cursor-pointer"
                  >
                    <option value="nova" className="bg-[#05060f]">Nova (Premium Female)</option>
                    <option value="onyx" className="bg-[#05060f]">Onyx (Deep Male)</option>
                    <option value="echo" className="bg-[#05060f]">Echo (Neutral)</option>
                    <option value="fable" className="bg-[#05060f]">Fable (Narrator)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-6">
              <label className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Synthesis Dimensions</label>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: 'TikTok', icon: Smartphone, label: '9:16 Vertical' },
                  { id: 'YouTube', icon: Monitor, label: '16:9 Landscape' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: p.id })}
                    className={`flex items-center justify-center gap-4 p-8 rounded-[32px] border transition-all ${
                      formData.platform === p.id 
                        ? 'bg-brand-2/10 border-brand-2/50 text-white shadow-[0_0_30px_rgba(157,78,221,0.2)]' 
                        : 'bg-white/5 border-white/5 text-gray-600 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <p.icon size={24} />
                    <span className="font-black text-[11px] uppercase tracking-[0.3em] italic">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading || success}
              className={`w-full py-8 rounded-[32px] font-black uppercase tracking-[0.3em] text-[13px] flex items-center justify-center gap-4 transition-all ${
                success 
                  ? 'bg-brand-2 text-white shadow-[0_0_50px_rgba(157,78,221,0.4)]' 
                  : 'bg-brand-2 text-white hover:shadow-[0_0_50px_rgba(157,78,221,0.4)] group-hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : success ? (
                <>
                  <CheckCircle2 size={24} />
                  Extraction Initialized
                </>
              ) : (
                <>
                  <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Ignite Production Forge
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <div className="card-standard !p-10 space-y-8 relative overflow-hidden group">
             <div className="absolute inset-0 bg-brand-2/[0.01] pointer-events-none" />
             <div className="flex items-center gap-4 text-brand-2 font-mono text-[11px] font-black uppercase tracking-[0.4em] italic">
                <Sparkles size={18} />
                Neural Forge Intel
             </div>
             <p className="text-[13px] text-gray-500 font-bold leading-relaxed uppercase italic tracking-tight opacity-80">
               Manual triggers bypass the trend analysis engine. Use this for specific high-priority custom content synthesis.
             </p>
             <div className="h-[1px] w-full bg-white/5" />
             <ul className="space-y-6">
               {[
                 'Instant priority queueing',
                 'Custom asset sourcing',
                 'Manual script override',
                 'Multi-platform output'
               ].map(item => (
                 <li key={item} className="flex items-center gap-4 text-[11px] font-black font-mono text-gray-400 uppercase tracking-widest italic group-hover:text-white transition-colors">
                    <div className="w-2 h-2 bg-brand-2 rounded-full shadow-[0_0_8px_rgba(157,78,221,0.5)]" />
                    {item}
                 </li>
               ))}
             </ul>
          </div>

          <div className="card-standard !p-10 !border-brand-2/20 bg-brand-2/[0.03] space-y-6 relative overflow-hidden group">
             <div className="flex items-center gap-4 text-brand-2 font-mono text-[11px] font-black uppercase tracking-[0.4em] italic">
                <ShieldAlert size={18} />
                Warning Protocol
             </div>
             <p className="text-[12px] text-gray-600 font-black leading-relaxed uppercase italic tracking-tight opacity-90">
               Each manual ignition consumes 1 production credit. Ensure your blueprint is refined before initiating the forge cycle.
             </p>
             <div className="absolute -bottom-10 -right-10 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000">
                <Cpu size={120} className="text-brand-2" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
