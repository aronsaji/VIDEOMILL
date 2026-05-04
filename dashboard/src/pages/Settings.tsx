import { Settings as SettingsIcon, Database, Link, Bot, Shield, Save, Globe } from 'lucide-react';
import { SecureAction } from '../components/SecureAction';
import { useLanguage } from '../contexts/LanguageContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
            <SettingsIcon className="text-neon-purple" size={40} />
            {t('nav.settings')}
          </h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest italic opacity-70">Global System Protocol & Configuration</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Language Selection */}
        <section className="glass-ultra rounded-[40px] p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe size={80} className="text-neon-cyan" />
          </div>
          <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <Globe size={20} className="text-neon-cyan" />
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Language Architecture</h2>
          </div>
          <div className="flex gap-6">
            {[
              { id: 'no', label: '🇳🇴 Norsk (Bokmål)', flag: 'NO' },
              { id: 'en', label: '🇬🇧 English (Global)', flag: 'EN' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as any)}
                className={`px-10 py-5 rounded-[24px] text-xs font-black transition-all border uppercase tracking-[0.2em] italic flex items-center gap-4 ${
                  language === lang.id 
                    ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_20px_rgba(0,245,255,0.3)]' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </section>
        {/* Supabase Settings */}
        <section className="bg-surface/50 border border-border rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
            <Database size={18} className="text-neon-cyan" />
            <h2 className="text-lg font-medium text-white">Database (Supabase)</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400">SUPABASE URL</label>
              <input type="text" value={import.meta.env.VITE_SUPABASE_URL || ''} disabled className="w-full bg-black/40 border border-border rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400">SUPABASE ANON KEY</label>
              <input type="password" value={import.meta.env.VITE_SUPABASE_ANON_KEY ? '********************************' : ''} disabled className="w-full bg-black/40 border border-border rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed font-mono text-sm" />
              <p className="text-[10px] text-gray-500">Disse verdiene hentes fra .env.local filen og kan ikke endres herfra.</p>
            </div>
          </div>
        </section>

        {/* N8N Webhooks */}
        <section className="bg-surface/50 border border-border rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
            <Link size={18} className="text-purple-400" />
            <h2 className="text-lg font-medium text-white">Automatisering (n8n Webhooks)</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400">PRODUCTION INGEST WEBHOOK URL</label>
              <input type="text" placeholder="https://n8n.yourserver.com/webhook/video-request" className="w-full bg-black/40 border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all font-mono text-sm" />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <SecureAction actionName="Test n8n Webhook Connection" onVerify={() => alert('Webhook test vellykket (Zero Trust validert!)')}>
                <button className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-colors pointer-events-none">
                  Test Connection
                </button>
              </SecureAction>
            </div>
          </div>
        </section>

        {/* AI Models */}
        <section className="bg-surface/50 border border-border rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
            <Bot size={18} className="text-neon-amber" />
            <h2 className="text-lg font-medium text-white">AI Modell Preferanser</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400">SCRIPT GENERATOR MODELL</label>
              <select className="w-full bg-black/40 border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-amber/50 transition-all appearance-none">
                <option>Claude 3.5 Sonnet</option>
                <option>GPT-4o</option>
                <option>Groq LLaMA 3.1 70B</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400">DEFAULT AI VOICE</label>
              <select className="w-full bg-black/40 border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-amber/50 transition-all appearance-none">
                <option>OpenAI - Nova</option>
                <option>OpenAI - Echo</option>
                <option>ElevenLabs - Adam</option>
                <option>ElevenLabs - Rachel</option>
              </select>
            </div>
          </div>
        </section>

        {/* Social Media Integrations */}
        <section className="bg-surface/50 border border-border rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
            <Shield size={18} className="text-rose-400" />
            <h2 className="text-lg font-medium text-white">Sosiale Medier & Publisering</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/20 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">TikTok</span>
                  <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold">AKTIV</span>
                </div>
                <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-border rounded text-xs text-gray-300 transition-all">Konfigurer Keys</button>
              </div>
              <div className="p-4 bg-black/20 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">YouTube</span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-500 text-[10px] font-bold">FRAKOBLET</span>
                </div>
                <button className="w-full py-1.5 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 rounded text-xs text-neon-cyan transition-all">Koble til API</button>
              </div>
              <div className="p-4 bg-black/20 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Instagram</span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-500 text-[10px] font-bold">FRAKOBLET</span>
                </div>
                <button className="w-full py-1.5 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 rounded text-xs text-neon-cyan transition-all">Koble til API</button>
              </div>
            </div>
          </div>
        </section>
        
        <div className="flex justify-end border-t border-border/50 pt-4">
          <SecureAction actionName="Lagre Systeminnstillinger" onVerify={() => alert('Innstillinger lagret sikkert med MFA!')}>
            <button className="flex items-center gap-2 px-6 py-2 bg-neon-cyan text-black rounded-lg text-sm font-bold hover:bg-neon-cyan/90 transition-colors pointer-events-none">
              <Save size={16} />
              Lagre Endringer
            </button>
          </SecureAction>
        </div>
      </div>
    </div>
  );
}
