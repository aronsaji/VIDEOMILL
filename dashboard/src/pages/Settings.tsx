import React, { useState } from 'react';
import { 
  Shield, Key, User, Bell, Globe, 
  Lock, Smartphone, Mail, Database, 
  Cloud, Cpu, Zap, Activity, ShieldAlert,
  ChevronRight, Save, RefreshCcw, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18nStore } from '../store/i18nStore';

export default function Settings() {
  const { t } = useI18nStore();
  const [activeCategory, setActiveCategory] = useState('security');

  const categories = [
    { id: 'security', label: 'Security_Manifest', icon: Shield },
    { id: 'accounts', label: 'Neural_Bridges', icon: Globe },
    { id: 'api', label: 'API_Protocols', icon: Cpu },
    { id: 'storage', label: 'Sector_Storage', icon: Database },
    { id: 'notifications', label: 'Comm_Signals', icon: Bell },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#bec9bf] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Lock size={18} className="animate-pulse" />
            CORE_CONFIGURATION_v2.0
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            System_<span className="text-[#b1cdb7]">Settings</span>
          </h1>
        </div>
        <button className="flex items-center gap-4 px-12 py-5 bg-[#b1cdb7] text-[#1d3526] rounded-soft-lg text-[12px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#b1cdb7]/10 hover:brightness-110 transition-all italic font-label-sm">
          <Save size={18} />
          Commit_Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation - Panel System */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-[#1b1c1a] border border-[#424843] p-6 rounded-soft-xl space-y-2 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-soft font-label-sm text-[12px] font-bold uppercase tracking-widest transition-all italic ${
                  activeCategory === cat.id 
                    ? 'bg-[#2d4535] text-[#b1cdb7] shadow-lg' 
                    : 'text-[#8c928c] hover:text-[#e4e2e0] hover:bg-[#131412]'
                }`}
              >
                <cat.icon size={18} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="p-8 bg-[#ffb4ab]/5 border border-[#ffb4ab]/10 rounded-soft-xl">
             <div className="flex items-center gap-4 text-[#ffb4ab] mb-4">
                <ShieldAlert size={18} />
                <span className="font-label-sm text-[10px] font-bold uppercase tracking-[0.2em] italic">System_Warning</span>
              </div>
              <p className="font-body-md text-[13px] text-[#8c928c] leading-relaxed italic">
                Unauthorized protocol changes may disrupt neural bridge stability. Proceed with certified credentials only.
              </p>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-10">
          <section className="bg-[#1b1c1a] border border-[#424843] p-12 rounded-soft-xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#b1cdb7]/5 blur-[80px] rounded-full" />
            
            <div className="space-y-12 relative z-10">
               <div className="flex items-center gap-6 pb-8 border-b border-[#424843]">
                  <div className="p-4 bg-[#b1cdb7]/10 rounded-soft-lg text-[#b1cdb7]">
                     <Shield size={28} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-[#e4e2e0] font-headline-md italic uppercase tracking-tighter">Security_Manifest</h2>
                     <p className="font-label-sm text-[10px] text-[#8c928c] uppercase tracking-widest mt-1 opacity-60 italic">ISO_27001 // Neural_Encryption_Active</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-[0.3em] italic opacity-40">ENCRYPTION_KEY_ID</label>
                     <div className="flex gap-4">
                        <div className="flex-1 bg-[#131412] border border-[#424843] p-6 rounded-soft-lg text-[#e4e2e0] font-label-sm text-[12px] font-bold italic tracking-widest">
                           ********************************
                        </div>
                        <button className="p-5 bg-[#1b1c1a] border border-[#424843] rounded-soft-lg text-[#b1cdb7] hover:bg-[#b1cdb7] hover:text-[#1d3526] transition-all shadow-sm">
                           <RefreshCcw size={20} />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-[0.3em] italic opacity-40">MULTI_FACTOR_STATUS</label>
                     <div className="flex items-center justify-between bg-[#131412] border border-[#424843] p-6 rounded-soft-lg">
                        <span className="font-label-sm text-[12px] font-bold text-[#b1cdb7] uppercase italic tracking-widest">ACTIVE_ENABLED</span>
                        <div className="w-12 h-6 bg-[#2d4535] rounded-full relative p-1 flex items-center justify-end border border-[#b1cdb7]/20">
                           <div className="w-4 h-4 bg-[#b1cdb7] rounded-full shadow-[0_0_10px_#b1cdb7]" />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-6 pt-10">
                  <h3 className="font-label-sm text-[12px] font-bold uppercase tracking-[0.3em] text-[#e4e2e0] italic">Active_Neural_Sessions</h3>
                  <div className="space-y-4">
                     {[
                        { device: 'Workstation_OSX_14.2', location: 'Oslo, Norway', status: 'Primary', time: 'Last_Active: Now' },
                        { device: 'Mobile_Link_v9', location: 'Oslo, Norway', status: 'Standby', time: 'Last_Active: 2h ago' },
                     ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-8 bg-[#131412] border border-[#424843] rounded-soft-xl hover:border-[#b1cdb7]/30 transition-all group">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-[#1b1c1a] border border-[#424843] rounded-soft flex items-center justify-center text-[#8c928c] group-hover:text-[#b1cdb7] transition-colors">
                                 <Smartphone size={24} />
                              </div>
                              <div>
                                 <p className="text-base font-bold text-[#e4e2e0] uppercase italic tracking-tight">{session.device}</p>
                                 <p className="font-label-sm text-[10px] text-[#8c928c] uppercase tracking-widest opacity-60">{session.location} // {session.time}</p>
                              </div>
                           </div>
                           <span className={`px-4 py-1.5 rounded-soft text-[9px] font-bold uppercase tracking-widest border italic ${
                              session.status === 'Primary' ? 'text-[#b1cdb7] border-[#b1cdb7]/30 bg-[#2d4535]/20' : 'text-[#8c928c] border-[#424843]'
                           }`}>
                              {session.status}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl space-y-6 shadow-sm">
                <div className="flex items-center gap-4 text-[#bec9bf]">
                   <Database size={20} />
                   <h3 className="font-label-sm text-[12px] font-bold uppercase tracking-[0.2em] italic">Sector_Usage</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between font-label-sm text-[10px] font-bold italic tracking-widest uppercase">
                      <span className="text-[#8c928c]">Cloud_Storage</span>
                      <span className="text-[#e4e2e0]">84.2 GB / 500 GB</span>
                   </div>
                   <div className="h-1.5 bg-[#131412] border border-[#424843] rounded-full overflow-hidden">
                      <div className="h-full bg-[#bec9bf] w-[16%]" />
                   </div>
                </div>
             </div>
             <div className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl flex items-center justify-between shadow-sm hover:border-[#b1cdb7]/40 transition-all cursor-pointer group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-[#131412] border border-[#424843] rounded-soft flex items-center justify-center text-[#8c928c] group-hover:text-[#b1cdb7] transition-colors">
                      <ExternalLink size={24} />
                   </div>
                   <div>
                      <p className="text-base font-bold text-[#e4e2e0] uppercase italic tracking-tight">Documentation</p>
                      <p className="font-label-sm text-[10px] text-[#8c928c] uppercase tracking-widest opacity-60">Neural_Bridge_Protocols</p>
                   </div>
                </div>
                <ChevronRight size={20} className="text-[#8c928c] group-hover:text-[#b1cdb7] transition-all" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
