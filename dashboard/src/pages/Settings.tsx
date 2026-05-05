import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">
          SYSTEM_CONFIGURATION
        </h1>
        <p className="font-data-mono text-[14px] text-zinc-500 uppercase tracking-widest">
          Core Infrastructure // Security Protocols // API Management
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Profile & Subscription */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Profile Card */}
          <section className="bg-[#0A0A0B] border border-white/10 p-8 relative overflow-hidden group">
            <div className="scanline-overlay absolute inset-0 opacity-10" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#BD00FF] to-[#00f5ff] p-[2px] mb-6">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                   <img 
                     src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Operator" 
                     alt="Profile" 
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                   />
                </div>
              </div>
              <h2 className="font-headline text-2xl font-bold text-white uppercase italic">{profile.name}</h2>
              <p className="font-label-caps text-[10px] tracking-[0.2em] text-[#BD00FF] uppercase mt-1">{profile.role}</p>
              
              <div className="w-full mt-8 space-y-4">
                <div className="text-left">
                  <label className="font-label-caps text-[10px] text-zinc-500 uppercase block mb-1">Email_Address</label>
                  <input 
                    type="text" 
                    value={profile.email} 
                    readOnly
                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs text-zinc-400 font-data-mono focus:outline-none"
                  />
                </div>
                <button className="w-full py-3 bg-white/5 border border-white/10 text-xs font-label-caps uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/30 transition-all">
                  UPDATE_SECURITY_TOKEN
                </button>
              </div>
            </div>
          </section>

          {/* Billing Card */}
          <section className="bg-[#0A0A0B] border border-white/10 p-8">
            <h3 className="font-label-caps text-xs tracking-[0.1em] font-bold text-zinc-500 uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">payments</span> SUBSCRIPTION_PLAN
            </h3>
            <div className="bg-[#BD00FF]/5 border border-[#BD00FF]/20 p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-headline text-2xl font-bold text-white uppercase italic">ENTERPRISE</span>
                <span className="bg-[#BD00FF] text-black text-[10px] font-black px-2 py-0.5 uppercase">ACTIVE</span>
              </div>
              <p className="text-xs text-zinc-500 font-data-mono">Unlimited AI-Visual Renders // Multi-Agent Orchestration</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-data-mono mb-1">
                  <span className="text-zinc-500 uppercase">Compute Usage</span>
                  <span className="text-[#6bff83]">42.8 GB / 100 GB</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                   <div className="bg-[#6bff83] h-full" style={{ width: '42.8%' }} />
                </div>
              </div>
              <button className="w-full py-3 bg-transparent border border-[#BD00FF] text-[#BD00FF] text-xs font-label-caps uppercase tracking-widest hover:bg-[#BD00FF] hover:text-black transition-all font-bold italic">
                UPGRADE_COMMAND_TIER
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: API Infrastructure */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="bg-[#0A0A0B] border border-white/10 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-label-caps text-xs tracking-[0.1em] font-bold text-white uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#00f5ff]">api</span> API_INFRASTRUCTURE
              </h3>
              <button className="text-[10px] font-data-mono text-[#00f5ff] hover:underline uppercase">RESCAN_ALL_CONNECTIONS</button>
            </div>

            <div className="space-y-4">
              {Object.entries(apis).map(([id, data]) => (
                <div key={id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-10 h-10 bg-black border border-white/10 flex items-center justify-center">
                       <span className="font-data-mono text-xs text-[#BD00FF]">{id.toUpperCase().slice(0, 2)}</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-lg font-bold text-white uppercase italic">{id.toUpperCase()}</h4>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6bff83] animate-pulse" />
                        <span className="font-data-mono text-[9px] text-[#6bff83] uppercase">{data.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-data-mono text-xs text-zinc-600 bg-black px-4 py-2 border border-white/5 min-w-[200px]">
                      {data.key}
                    </div>
                    <button className="material-symbols-outlined text-sm text-zinc-500 hover:text-[#BD00FF] transition-colors">edit</button>
                    <button className="material-symbols-outlined text-sm text-zinc-500 hover:text-[#e90053] transition-colors">refresh</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security Audit Log */}
          <section className="bg-[#0A0A0B] border border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-label-caps text-xs tracking-[0.1em] font-bold text-white uppercase">SECURITY_AUDIT_LOG</h3>
              <span className="font-data-mono text-[9px] text-zinc-500 uppercase tracking-widest">REAL-TIME MONITORING ACTIVE</span>
            </div>
            <div className="p-6 space-y-4 font-data-mono text-[11px]">
              <div className="flex gap-4 items-start border-l-2 border-[#6bff83] pl-4">
                <span className="text-zinc-600 shrink-0">14:22:01</span>
                <p className="text-zinc-300 uppercase">ACCESS_GRANTED // <span className="text-[#6bff83]">OPERATOR_01</span> // IP: 192.168.1.44</p>
              </div>
              <div className="flex gap-4 items-start border-l-2 border-[#BD00FF] pl-4">
                <span className="text-zinc-600 shrink-0">13:58:12</span>
                <p className="text-zinc-300 uppercase">API_KEY_ROTATED // <span className="text-[#BD00FF]">GROQ_INFRA</span> // SYSTEM_AUTO_MAINTENANCE</p>
              </div>
              <div className="flex gap-4 items-start border-l-2 border-[#e90053] pl-4">
                <span className="text-zinc-600 shrink-0">12:14:55</span>
                <p className="text-zinc-300 uppercase text-[#e90053]">LOGIN_ATTEMPT_FAILED // <span className="font-bold">UNKNOWN_ORIGIN</span> // PROTOCOL: BLOCKED</p>
              </div>
              <div className="flex gap-4 items-start border-l-2 border-zinc-700 pl-4">
                <span className="text-zinc-600 shrink-0">10:05:33</span>
                <p className="text-zinc-400 uppercase">DATABASE_SYNC_STABLE // SUPABASE_PRIMARY_CLUSTER</p>
              </div>
            </div>
            <button className="w-full py-3 border-t border-white/10 font-label-caps text-[9px] text-zinc-500 uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
              VIEW_FULL_SECURITY_MANIFEST
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
