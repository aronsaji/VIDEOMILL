import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Factory, Zap, Radar, 
  Bot, Archive, Settings, Menu, X, 
  LogOut, User, Activity, Shield, Terminal
} from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const NAV_ITEMS = [
  { path: '/', label: 'COMMAND_CENTER', icon: LayoutDashboard, color: 'text-[#BD00FF]' },
  { path: '/factory', label: 'THE_FACTORY', icon: Factory, color: 'text-[#6bff83]' },
  { path: '/auto-series', label: 'AUTO_SERIES', icon: Zap, color: 'text-[#e90053]' },
  { path: '/trends', label: 'TREND_RADAR', icon: Radar, color: 'text-[#00f5ff]' },
  { path: '/agents', label: 'AI_AGENTS', icon: Bot, color: 'text-[#ffaa00]' },
  { path: '/archive', label: 'VIDEO_ARCHIVE', icon: Archive, color: 'text-zinc-400' },
  { path: '/settings', label: 'SETTINGS', icon: Settings, color: 'text-zinc-500' },
];

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e3] font-sans selection:bg-[#BD00FF]/30 overflow-hidden">
      {/* Cinematic Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
         <div className="absolute inset-0 scanline-overlay opacity-[0.02]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 300 : 80 }}
          className="h-full bg-[#0A0A0B] border-r border-white/5 flex flex-col relative z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Top Branding */}
          <div className="h-28 flex items-center px-8 border-b border-white/5 bg-black/40">
            <Logo size={isSidebarOpen ? 'md' : 'sm'} hideText={!isSidebarOpen} />
          </div>

          {/* User Profile Terminal */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="px-8 py-10"
              >
                <div className="bg-white/[0.02] border border-white/5 p-5 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[#BD00FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#BD00FF] to-[#00f5ff] p-[1.5px] rounded-sm">
                      <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-sm">
                         {session?.user?.user_metadata?.avatar_url ? (
                           <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                         ) : (
                           <User size={24} className="text-zinc-500" />
                         )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-headline text-[13px] font-black text-white uppercase italic tracking-tighter truncate">
                        {session?.user?.email?.split('@')[0] || 'GUEST_OPERATOR'}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 bg-[#6bff83] rounded-full animate-pulse shadow-[0_0_8px_#6bff83]" />
                        <span className="font-data-mono text-[9px] text-zinc-500 uppercase tracking-widest">ENCRYPTED_LINK_v2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-5 px-6 py-4 transition-all duration-300 group
                    ${isActive 
                      ? 'bg-white/[0.03] border border-white/5' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/[0.01] border border-transparent'}
                  `}
                >
                  <item.icon size={20} className={`relative z-10 transition-colors ${isActive ? item.color : 'group-hover:text-zinc-300'}`} />
                  {isSidebarOpen && (
                    <span className={`relative z-10 font-headline text-[11px] font-black uppercase tracking-[0.15em] italic transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#BD00FF] shadow-[0_0_15px_#BD00FF]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* System Footer */}
          <div className="p-4 bg-black/40 border-t border-white/5 space-y-1">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center gap-4 px-6 py-4 text-zinc-600 hover:text-white transition-colors group"
            >
              <Terminal size={18} className={!isSidebarOpen ? 'mx-auto' : ''} />
              {isSidebarOpen && <span className="font-label-caps text-[9px] uppercase font-bold tracking-[0.2em]">COLLAPSE_NODE</span>}
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-4 px-6 py-4 text-zinc-700 hover:text-[#e90053] transition-colors group"
            >
              <LogOut size={18} className={!isSidebarOpen ? 'mx-auto' : ''} />
              {isSidebarOpen && <span className="font-label-caps text-[9px] uppercase font-bold tracking-[0.2em]">KILL_SESSION</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#131314]">
          {/* Top Terminal Bar */}
          <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black relative z-40">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/[0.02] border border-white/5">
                 <Shield size={18} className="text-[#BD00FF]" />
              </div>
              <div className="flex flex-col">
                 <span className="font-data-mono text-[9px] text-zinc-600 uppercase tracking-[0.4em]">CURRENT_SECTOR</span>
                 <span className="font-headline text-[13px] font-black text-white uppercase italic tracking-[0.1em]">
                   {location.pathname === '/' ? 'ROOT_HUB' : location.pathname.toUpperCase().replace('/', '').replace('-', '_')}
                 </span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-6 px-6 py-3 bg-white/[0.01] border border-white/5">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#6bff83]" />
                  <span className="font-data-mono text-[10px] text-zinc-500 uppercase">SYS_LOAD: 24%</span>
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[#00f5ff]" />
                  <span className="font-data-mono text-[10px] text-zinc-500 uppercase">ZERO_TRUST_ACTIVE</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <div className="font-data-mono text-[10px] text-white uppercase font-black">STABLE_LINK</div>
                    <div className="font-data-mono text-[9px] text-zinc-600 uppercase tracking-tighter">NY_SECTOR_CLUSTER_04</div>
                 </div>
                 <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center">
                    <User size={20} className="text-zinc-600" />
                 </div>
              </div>
            </div>
          </header>

          {/* Dynamic Stage */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
             <div className="p-12 pb-24">
                <Outlet />
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
