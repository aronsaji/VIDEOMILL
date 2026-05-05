import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Key, Lock, Globe, 
  Terminal, Activity, RefreshCw, 
  Trash2, Save, User, CreditCard,
  Zap, Database, Radio
} from 'lucide-react';

export default function Settings() {
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
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Lock size={14} className="animate-pulse" />
            SECURITY_INFRASTRUCTURE_CORE
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            System_<span className="text-primary-container">Config</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-4 bg-primary-container text-black font-black uppercase italic text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 transition-all">
              Save Manifest
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column: Profile & Subscription */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          {/* Profile Card */}
          <section className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-primary-container to-[#00f5ff] p-[2px] mb-8 group-hover:rotate-6 transition-transform duration-700">
                <div className="w-full h-full rounded-[2rem] bg-black flex items-center justify-center overflow-hidden">
                   <img 
                     src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Operator" 
                     alt="Profile" 
                     className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                   />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white font-headline-md uppercase italic tracking-tighter">{profile.name}</h2>
              <p className="font-mono text-[10px] tracking-[0.3em] text-primary-container uppercase mt-2 font-black">{profile.role}</p>
              
              <div className="w-full mt-10 space-y-6">
                <div className="text-left space-y-2">
                  <label className="font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest block">Neural_Identity</label>
                  <div className="w-full bg-black border border-white/5 rounded-xl px-5 py-4 text-xs text-zinc-500 font-mono flex items-center justify-between">
                    <span>{profile.email}</span>
                    <RefreshCw size={14} className="text-zinc-800 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                  Rotate Security Token
                </button>
              </div>
            </div>
          </section>

          {/* Billing Card */}
          <section className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
               <CreditCard size={20} className="text-[#6bff83]" />
               <h3 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">License_Tier</h3>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl mb-8 group hover:border-primary-container/30 transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="text-4xl font-black text-white font-headline-md uppercase italic tracking-tighter">Enterprise</span>
                <span className="bg-primary-container text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
              </div>
              <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest leading-relaxed">Unlimited Autonomous Rendering // Multi-Agent Orchestration // 24/7 Priority Compute</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono font-black uppercase tracking-widest">
                  <span className="text-zinc-700">Compute usage</span>
                  <span className="text-primary-container">42.8%</span>
                </div>
                <div className="w-full bg-black border border-white/5 h-2 rounded-full overflow-hidden">
                   <div className="bg-primary-container h-full shadow-[0_0_10px_#22d3ee]" style={{ width: '42.8%' }} />
                </div>
              </div>
              <button className="w-full py-5 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-container hover:text-black transition-all shadow-xl">
                Upgrade Command Tier
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: API Infrastructure */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <section className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                 <Database size={20} className="text-primary-container" />
                 <h3 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Neural_Bridges</h3>
              </div>
              <button className="text-[9px] font-mono text-primary-container hover:underline uppercase font-black tracking-widest">Rescan All Signals</button>
            </div>

            <div className="space-y-6">
              {Object.entries(apis).map(([id, data]) => (
                <div key={id} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-primary-container/30 hover:bg-white/[0.03] transition-all">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-14 h-14 bg-black border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                       <span className="font-mono text-sm text-primary-container font-black">{id.toUpperCase().slice(0, 2)}</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white font-headline-md uppercase italic tracking-tighter leading-none mb-2">{id.toUpperCase()}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'CONNECTED' || data.status === 'ACTIVE' ? 'bg-[#6bff83] animate-pulse shadow-[0_0_10px_#6bff83]' : 'bg-primary-container animate-pulse shadow-[0_0_10px_#22d3ee]'}`} />
                        <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-widest italic">{data.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="font-mono text-[10px] text-zinc-500 bg-black px-6 py-4 border border-white/5 rounded-xl min-w-[240px] tracking-widest">
                      {data.key}
                    </div>
                    <div className="flex gap-4">
                      <button className="text-zinc-700 hover:text-primary-container transition-colors"><Save size={18} /></button>
                      <button className="text-zinc-700 hover:text-[#e90053] transition-colors"><RefreshCw size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security Audit Log */}
          <section className="bg-surface-container-low border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Security_Manifest</h3>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#6bff83] animate-pulse shadow-[0_0_8px_#6bff83]" />
                 <span className="font-mono text-[9px] text-[#6bff83] uppercase tracking-widest font-black">Live Monitoring Active</span>
              </div>
            </div>
            <div className="p-10 space-y-6 font-mono text-[10px]">
              <div className="flex gap-6 items-start border-l-2 border-[#6bff83] pl-6 py-2 group hover:bg-white/5 transition-colors">
                <span className="text-zinc-700 shrink-0">14:22:01</span>
                <p className="text-zinc-300 uppercase tracking-widest">Access_Granted // <span className="text-[#6bff83]">Operator_01</span> // IP: 192.168.1.44</p>
              </div>
              <div className="flex gap-6 items-start border-l-2 border-primary-container pl-6 py-2 group hover:bg-white/5 transition-colors">
                <span className="text-zinc-700 shrink-0">13:58:12</span>
                <p className="text-zinc-300 uppercase tracking-widest">Api_Key_Rotated // <span className="text-primary-container">Groq_Infra</span> // System_Auto_Maint</p>
              </div>
              <div className="flex gap-6 items-start border-l-2 border-[#e90053] pl-6 py-2 group hover:bg-white/5 transition-colors">
                <span className="text-zinc-700 shrink-0">12:14:55</span>
                <p className="text-[#e90053] uppercase tracking-widest font-black italic">Unauthorized_Access_Blocked // <span className="underline">Unknown_Origin</span> // Port_3001_Protected</p>
              </div>
            </div>
            <button className="w-full py-6 border-t border-white/5 text-[10px] text-zinc-700 hover:text-white hover:bg-white/5 transition-all font-black uppercase tracking-[0.3em] italic">
               Download Intelligence Log
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
