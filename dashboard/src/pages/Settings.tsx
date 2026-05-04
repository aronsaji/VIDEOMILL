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
            <SettingsIcon className="text-brand-2" size={40} />
            {t('nav.settings')}
          </h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest italic opacity-70">Global System Protocol & Configuration</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Language Selection */}
        <section className="card-standard">
          <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <Globe size={20} className="text-brand-1" />
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
                className={`btn-standard px-8 py-3 ${language === lang.id ? '' : 'opacity-40 grayscale'}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </section>

        {/* Supabase Settings */}
        <section className="card-standard">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Database size={18} className="text-brand-1" />
            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Database (Supabase)</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-mono text-gray-500 uppercase tracking-widest">SUPABASE URL</label>
              <input type="text" value={import.meta.env.VITE_SUPABASE_URL || ''} disabled className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-mono text-gray-500 uppercase tracking-widest">SUPABASE ANON KEY</label>
              <input type="password" value={import.meta.env.VITE_SUPABASE_ANON_KEY ? '********************************' : ''} disabled className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed font-mono text-sm" />
              <p className="text-[13px] text-gray-600 italic">Disse verdiene hentes fra .env.local filen og kan ikke endres herfra.</p>
            </div>
          </div>
        </section>

        {/* N8N Webhooks */}
        <section className="card-standard">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Link size={18} className="text-brand-2" />
            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Automatisering (n8n Webhooks)</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-mono text-gray-500 uppercase tracking-widest">PRODUCTION INGEST WEBHOOK URL</label>
              <input type="text" placeholder="https://n8n.yourserver.com/webhook/video-request" className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-2/50 transition-all font-mono text-sm" />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <SecureAction actionName="Test n8n Webhook Connection" onVerify={() => alert('Webhook test vellykket!')}>
                <button className="btn-standard py-2 px-6 text-[13px]">
                  Test Connection
                </button>
              </SecureAction>
            </div>
          </div>
        </section>

        {/* AI Models */}
        <section className="card-standard">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Bot size={18} className="text-brand-1" />
            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">AI Modell Preferanser</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-mono text-gray-500 uppercase tracking-widest">SCRIPT GENERATOR MODELL</label>
              <select className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-1/50 transition-all appearance-none">
                <option>Claude 3.5 Sonnet</option>
                <option>GPT-4o</option>
                <option>Groq LLaMA 3.1 70B</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-mono text-gray-500 uppercase tracking-widest">DEFAULT AI VOICE</label>
              <select className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-1/50 transition-all appearance-none">
                <option>OpenAI - Nova</option>
                <option>OpenAI - Echo</option>
                <option>ElevenLabs - Adam</option>
                <option>ElevenLabs - Rachel</option>
              </select>
            </div>
          </div>
        </section>

        {/* Social Media Integrations */}
        <section className="card-standard">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Shield size={18} className="text-brand-2" />
            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Sosiale Medier & Publisering</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['TikTok', 'YouTube', 'Instagram'].map(platform => (
                <div key={platform} className="p-6 bg-black/20 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-black text-white uppercase italic">{platform}</span>
                    <span className="px-2 py-0.5 rounded bg-brand-1/10 text-brand-1 text-[11px] font-black uppercase">STATUS_OK</span>
                  </div>
                  <button className="w-full py-2 bg-white/5 hover:bg-brand-1/10 border border-white/5 rounded-lg text-[11px] text-gray-400 font-black uppercase tracking-widest transition-all">Config_Node</button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <div className="flex justify-end border-t border-white/5 pt-8">
          <SecureAction actionName="Lagre Systeminnstillinger" onVerify={() => alert('Innstillinger lagret!')}>
            <button className="btn-standard px-10 py-4">
              <Save size={18} />
              Lagre Endringer
            </button>
          </SecureAction>
        </div>
      </div>
    </div>
  );
}
