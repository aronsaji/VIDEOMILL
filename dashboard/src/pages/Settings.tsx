import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Key, Lock, Globe, 
  Terminal, Activity, RefreshCw, 
  Trash2, Save, User, CreditCard,
  Zap, Database, Radio, CheckCircle2,
  Cpu, Server, HardDrive
} from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';

export default function Settings() {
  const { t } = useI18nStore();
  const [profile, setProfile] = useState({
    name: 'OPERATOR_01',
    email: 'admin@videomill.ai',
    role: 'EXECUTIVE_COMMANDER',
  });

  const [apis, setApis] = useState({
    groq: { status: 'ACTIVE', key: '••••••••••••••••' },
    supabase: { status: 'ACTIVE', key: '••••••••••••••••' },
    n8n: { status: 'STABLE', key: '••••••••••••••••' },
    youtube: { status: 'CONNECTED', key: 'verified_auth' },
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <div className="flex items-center gap-3 text-[#4169E1] font-mono text-[11px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Lock size={14} className="animate-pulse" />
            SECURITY_INFRASTRUCTURE_CORE
          </div>
          <h1 className="text-6xl font-black text-[#1E3A8A] font-headline-md tracking-tighter italic uppercase leading-none">
            System_<span className="text-[#4169E1]">Config</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-5 bg-[#4169E1] text-white font-black uppercase italic text-[11px] tracking-[0.2em] rounded-2xl shadow-xl shadow-[#4169E1]/20 hover:brightness-110 active:scale-[0.98] transition-all">
              Save Manifest
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-4 space-y-10">
          <section className="bg-surface border border-outline p-10 rounded-[3rem] relative overflow-hidden group shadow-sm">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-[#4169E1] to-[#1E3A8A] p-[2px] mb-8 group-hover:rotate-6 transition-transform duration-700 shadow-lg">
                <div className="w-full h-full rounded-[2rem] bg-surface flex items-center justify-center overflow-hidden">
                   <img 
                     src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Operator" 
                     alt="Profile" 
                     className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                   />
                </div>
              </div>
              <h2 className="text-3xl font-black text-[#1E3A8A] font-headline-md uppercase italic tracking-tighter">{profile.name}</h2>
              <p className="font-mono text-[11px] tracking-[0.3em] text-[#4169E1] uppercase mt-2 font-black italic">{profile.role}</p>
              
              <div className="w-full mt-10 space-y-6">
                <div className="text-left space-y-2">
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest block ml-2 italic">Neural_Identity</label>
                  <div className="w-full bg-surface-container border border-outline rounded-xl px-5 py-4 text-[11px] text-[#1E3A8A] font-mono flex items-center justify-between font-black uppercase tracking-widest">
                    <span>{profile.email}</span>
                    <RefreshCw size={14} className="text-[#4169E1] hover:text-[#1E3A8A] cursor-pointer transition-colors" />
                  </div>
                </div>
                <button className="w-full py-4 bg-surface-container border border-outline rounded-xl text-[10px] font-black uppercase tracking-widest text-[#4169E1] hover:bg-[#4169E1] hover:text-white transition-all font-mono">
                  Rotate Security Token
                </button>
              </div>
            </div>
          </section>

          <section className="bg-surface border border-outline p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
               <CreditCard size={20} className="text-success" />
               <h3 className="text-[11px] font-black text-[#1E3A8A] uppercase italic tracking-[0.2em]">License_Tier</h3>
            </div>
            <div className="bg-surface-container border border-outline p-8 rounded-2xl mb-8 group hover:border-[#4169E1]/30 transition-all">
              <div className="flex justify-between items-center mb-6">
                <span className="text-4xl font-black text-[#1E3A8A] font-headline-md uppercase italic tracking-tighter">Enterprise</span>
                <span className="bg-success text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic shadow-sm shadow-success/20">Active</span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-mono uppercase tracking-widest leading-relaxed font-black opacity-60 italic">Unlimited Autonomous Rendering // Multi-Agent Orchestration // 24/7 Priority Compute</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono font-black uppercase tracking-widest italic">
                  <span className="text-on-surface-variant">Compute usage</span>
                  <span className="text-[#4169E1]">42.8%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden border border-outline/10 shadow-inner">
                   <div className="bg-[#4169E1] h-full shadow-[0_0_10px_rgba(65,105,225,0.2)]" style={{ width: '42.8%' }} />
                </div>
              </div>
              <button className="w-full py-5 bg-[#4169E1]/10 border border-[#4169E1]/20 text-[#4169E1] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#4169E1] hover:text-white transition-all shadow-sm">
                Upgrade Command Tier
              </button>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-10">
          <section className="bg-surface border border-outline p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                 <Database size={20} className="text-[#4169E1]" />
                 <h3 className="text-xs font-black text-[#1E3A8A] uppercase italic tracking-[0.2em]">Neural_Bridges</h3>
              </div>
              <button className="text-[10px] font-mono text-[#4169E1] hover:underline uppercase font-black tracking-widest italic">Rescan All Signals</button>
            </div>

            <div className="space-y-6">
              {Object.entries(apis).map(([id, data]) => (
                <div key={id} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-surface-container border border-outline rounded-3xl group hover:border-[#4169E1]/30 transition-all shadow-sm">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-14 h-14 bg-surface border border-outline rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                       <span className="font-mono text-sm text-[#4169E1] font-black">{id.toUpperCase().slice(0, 2)}</span>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-[#1E3A8A] font-headline-md uppercase italic tracking-tighter leading-none mb-2">{id.toUpperCase()}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'CONNECTED' || data.status === 'ACTIVE' ? 'bg-success animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#4169E1] animate-pulse shadow-[0_0_10px_rgba(65,105,225,0.5)]'}`} />
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest italic">{data.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="font-mono text-[11px] text-[#1E3A8A] bg-surface px-6 py-4 border border-outline rounded-xl min-w-[240px] tracking-widest font-black italic">
                      {data.key}
                    </div>
                    <div className="flex gap-4">
                      <button className="text-on-surface-variant hover:text-[#4169E1] transition-colors p-2 bg-surface border border-outline rounded-lg"><Save size={18} /></button>
                      <button className="text-on-surface-variant hover:text-[#4169E1] transition-colors p-2 bg-surface border border-outline rounded-lg"><RefreshCw size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface border border-outline rounded-[3rem] shadow-sm relative overflow-hidden">
            <div className="p-8 border-b border-outline flex justify-between items-center bg-surface-container/30">
              <h3 className="text-xs font-black text-[#1E3A8A] uppercase italic tracking-[0.2em]">Security_Manifest</h3>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="font-mono text-[10px] text-success uppercase tracking-widest font-black italic">Live Monitoring Active</span>
              </div>
            </div>
            <div className="p-10 space-y-6 font-mono text-[11px]">
              <div className="flex gap-8 items-start border-l-2 border-success pl-8 py-3 group hover:bg-surface-container transition-colors rounded-r-xl">
                <span className="text-on-surface-variant font-black shrink-0">14:22:01</span>
                <p className="text-on-surface-variant uppercase tracking-widest font-black italic">Access_Granted // <span className="text-success italic">Operator_01</span> // IP: 192.168.1.44</p>
              </div>
              <div className="flex gap-8 items-start border-l-2 border-[#4169E1] pl-8 py-3 group hover:bg-surface-container transition-colors rounded-r-xl">
                <span className="text-on-surface-variant font-black shrink-0">13:58:12</span>
                <p className="text-on-surface-variant uppercase tracking-widest font-black italic">Api_Key_Rotated // <span className="text-[#4169E1] italic">Groq_Infra</span> // System_Auto_Maint</p>
              </div>
              <div className="flex gap-8 items-start border-l-2 border-error pl-8 py-3 group hover:bg-surface-container transition-colors rounded-r-xl">
                <span className="text-on-surface-variant font-black shrink-0">12:14:55</span>
                <p className="text-error uppercase tracking-widest font-black italic">Unauthorized_Access_Blocked // <span className="underline decoration-error/30">Unknown_Origin</span> // Port_3001_Protected</p>
              </div>
            </div>
            <button className="w-full py-8 border-t border-outline text-[11px] text-[#4169E1] hover:text-[#1E3A8A] hover:bg-surface-container transition-all font-black uppercase tracking-[0.4em] italic">
               Download Intelligence Log
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
