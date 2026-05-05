import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Key, Zap, Database, GitBranch,
  CreditCard, LifeBuoy, FileText, Shield
} from 'lucide-react';

const glass = {
  background: 'rgba(14, 21, 17, 0.6)',
  backdropFilter: 'blur(20px) saturate(150%)',
  border: '1px solid rgba(139, 92, 246, 0.15)',
  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
};

const API_INTEGRATIONS = [
  { name: 'Groq LPU Acceleration', desc: 'Ultra-fast inference for script generation', icon: Zap, active: true },
  { name: 'Supabase Vector Vault', desc: 'Decentralized asset and metadata storage', icon: Database, active: true },
  { name: 'n8n Workflow Engine', desc: 'Automated distribution and hand-off', icon: GitBranch, active: false },
];

export default function Settings() {
  const [fullName, setFullName] = useState('Alexander Sterling');
  const [email, setEmail] = useState('sterling@videomill.ai');
  const [role, setRole] = useState('Chief Production Officer');
  const [integrations, setIntegrations] = useState(API_INTEGRATIONS);

  const toggleIntegration = (index: number) => {
    setIntegrations(prev => prev.map((item, i) => i === index ? { ...item, active: !item.active } : item));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-['Space_Grotesk'] text-3xl font-semibold text-white">System Configuration</h1>
        <p className="text-zinc-500 mt-1 max-w-2xl">Manage your executive profile, scaling parameters, and secure infrastructure integrations for the VideoMill engine.</p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Profile + API Section (Left) */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          {/* Profile Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-6"
            style={{ ...glass, borderTop: '1px solid rgba(139,92,246,0.3)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white flex items-center gap-2">
                <User size={20} className="text-violet-400" />
                Executive Profile
              </h2>
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-400 hover:bg-violet-500/10 transition-all rounded" style={{ border: '1px solid rgba(139,92,246,0.4)' }}>
                Update Credentials
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                <input
                  value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full bg-zinc-900/80 border-b border-zinc-700 hover:border-violet-500 focus:border-violet-400 focus:ring-0 text-white py-3 px-4 rounded-t-lg text-sm transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Identity</label>
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/80 border-b border-zinc-700 hover:border-violet-500 focus:border-violet-400 focus:ring-0 text-white py-3 px-4 rounded-t-lg text-sm transition-colors"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Organization Role</label>
                <input
                  value={role} onChange={e => setRole(e.target.value)}
                  className="w-full bg-zinc-900/80 border-b border-zinc-700 hover:border-violet-500 focus:border-violet-400 focus:ring-0 text-white py-3 px-4 rounded-t-lg text-sm transition-colors"
                />
              </div>
            </div>
          </motion.div>

          {/* API Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-6"
            style={{ ...glass, borderTop: '1px solid rgba(139,92,246,0.3)' }}
          >
            <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Key size={20} className="text-violet-400" />
              API Infrastructure
            </h2>
            <div className="space-y-4">
              {integrations.map((api, i) => (
                <div
                  key={api.name}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ background: 'rgba(9,16,12,0.85)', border: '1px solid rgba(60,74,65,0.3)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(26,33,29,0.6)', border: `1px solid ${api.active ? 'rgba(139,92,246,0.2)' : 'rgba(60,74,65,0.3)'}` }}>
                      <api.icon size={18} className={api.active ? 'text-violet-400' : 'text-zinc-600'} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{api.name}</div>
                      <div className="text-xs text-zinc-500">{api.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${api.active ? 'bg-violet-500/10 text-violet-400' : 'bg-zinc-800 text-zinc-600'}`}>
                      {api.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <button
                      onClick={() => toggleIntegration(i)}
                      className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                      style={{ background: api.active ? '#8B5CF6' : 'rgba(47,55,50,1)' }}
                    >
                      <div
                        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ left: api.active ? '24px' : '4px' }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Billing Section (Right) */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          {/* Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl p-6 relative overflow-hidden"
            style={{ ...glass, borderTop: '1px solid rgba(139,92,246,0.4)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
            <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white mb-6">Subscription</h2>
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Current Plan</div>
              <div className="text-3xl font-['Space_Grotesk'] font-bold text-violet-400" style={{ textShadow: '0 0 10px rgba(139,92,246,0.3)' }}>Enterprise</div>
              <div className="text-sm text-zinc-500 mt-1">Next billing: Oct 24, 2024</div>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-500">Compute Cycles</span>
                  <span className="text-white">840/1,000</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[84%] rounded-full relative" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }}>
                    <div className="absolute right-0 top-0 h-full w-2 bg-white/40 blur-sm" />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-500">Video Tokens</span>
                  <span className="text-white">12,500/20k</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[62%] rounded-full relative" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }}>
                    <div className="absolute right-0 top-0 h-full w-2 bg-white/40 blur-sm" />
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full py-3 text-violet-400 text-xs font-bold uppercase tracking-widest hover:bg-violet-500/5 transition-all mb-3 rounded" style={{ border: '1px solid rgba(139,92,246,0.4)' }}>
              Manage Billing
            </button>
            <button className="w-full py-3 bg-zinc-900 text-zinc-500 text-xs font-bold uppercase tracking-widest rounded">
              View Invoices
            </button>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-6"
            style={{ ...glass, background: 'rgba(9,16,12,0.9)', borderTop: '1px solid rgba(139,92,246,0.3)' }}
          >
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-white mb-3">Concierge Support</h3>
            <p className="text-sm text-zinc-500 mb-4">Access your dedicated account manager for custom infrastructure scaling or enterprise SLAs.</p>
            <div className="flex items-center gap-4 mb-4 p-2 bg-zinc-900/50 rounded">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">SC</div>
              <div>
                <div className="text-sm font-bold text-white">Sarah Chen</div>
                <div className="text-xs text-violet-400">Senior Solutions Architect</div>
              </div>
            </div>
            <a href="#" className="block text-center text-violet-400 text-xs font-bold uppercase tracking-widest pb-1 hover:text-violet-300 transition-colors" style={{ borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
              Open Priority Ticket
            </a>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
