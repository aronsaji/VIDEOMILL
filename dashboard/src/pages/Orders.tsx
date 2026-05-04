import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Zap, Send, Target, Globe, Mic, Type, 
  Smartphone, Monitor, Sparkles, AlertCircle,
  CheckCircle2, Loader2
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
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
          <Zap className="text-neon-amber" size={40} />
          Manual <span className="text-neon-amber">Trigger</span>
        </h1>
        <p className="text-gray-500 font-medium">Bypass automation and inject a custom concept directly into the forge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="glass-ultra rounded-[40px] p-10 border border-white/5 space-y-8">
            {/* Topic Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Video Concept / Topic</label>
              <div className="relative">
                <Target className="absolute left-6 top-6 text-neon-amber" size={20} />
                <textarea 
                  required
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="E.g. The secret history of Cyberpunk architecture in Tokyo..."
                  className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 pl-16 min-h-[160px] text-lg font-bold text-white placeholder:text-gray-700 focus:border-neon-amber/40 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Language */}
              <div className="space-y-3">
                <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Voice Language</label>
                <div className="relative">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <select 
                    value={formData.language}
                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-14 text-sm font-bold text-white appearance-none focus:border-neon-amber/40 outline-none"
                  >
                    <option value="Norwegian">Norwegian</option>
                    <option value="English">English</option>
                    <option value="Swedish">Swedish</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              {/* AI Voice */}
              <div className="space-y-3">
                <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">AI Voice Profile</label>
                <div className="relative">
                  <Mic className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <select 
                    value={formData.ai_voice}
                    onChange={e => setFormData({ ...formData, ai_voice: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-14 text-sm font-bold text-white appearance-none focus:border-neon-amber/40 outline-none"
                  >
                    <option value="nova">Nova (Premium Female)</option>
                    <option value="onyx">Onyx (Deep Male)</option>
                    <option value="echo">Echo (Neutral)</option>
                    <option value="fable">Fable (Narrator)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Target Dimensions</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'TikTok', icon: Smartphone, label: '9:16 Vertical' },
                  { id: 'YouTube', icon: Monitor, label: '16:9 Landscape' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: p.id })}
                    className={`flex items-center justify-center gap-3 p-6 rounded-3xl border transition-all ${
                      formData.platform === p.id 
                        ? 'bg-neon-amber/10 border-neon-amber/40 text-neon-amber shadow-[0_0_20px_rgba(255,191,0,0.1)]' 
                        : 'bg-white/5 border-white/5 text-gray-600 hover:border-white/10'
                    }`}
                  >
                    <p.icon size={20} />
                    <span className="font-bold text-xs uppercase tracking-widest">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading || success}
              className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${
                success 
                  ? 'bg-neon-green text-black' 
                  : 'bg-neon-amber text-black hover:shadow-[0_0_30px_rgba(255,191,0,0.5)]'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : success ? (
                <>
                  <CheckCircle2 size={20} />
                  Initiated
                </>
              ) : (
                <>
                  <Send size={18} />
                  Ignite Production
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="glass-ultra rounded-[32px] p-8 border border-white/5 space-y-6">
             <div className="flex items-center gap-3 text-neon-cyan">
                <Sparkles size={20} />
                <h3 className="font-black italic uppercase tracking-tighter">Forge Intel</h3>
             </div>
             <p className="text-xs text-gray-500 leading-relaxed">
               Manual triggers bypass the trend analysis engine. Use this for specific client requests or high-priority custom content.
             </p>
             <ul className="space-y-4">
               {[
                 'Instant priority queueing',
                 'Custom asset sourcing',
                 'Manual script override',
                 'Multi-platform output'
               ].map(item => (
                 <li key={item} className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
                    <div className="w-1 h-1 bg-neon-amber rounded-full" />
                    {item}
                 </li>
               ))}
             </ul>
          </div>

          <div className="glass-ultra rounded-[32px] p-8 border border-red-500/10 bg-red-500/5 space-y-4">
             <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={20} />
                <h3 className="font-black italic uppercase tracking-tighter">Warning</h3>
             </div>
             <p className="text-[10px] text-gray-500 leading-relaxed">
               Each manual ignition consumes 1 production credit. Ensure your concept is refined before initiating.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
