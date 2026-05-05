import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Factory, Zap, Radar, 
  Bot, Archive, Settings, Menu, X, 
  LogOut, User, Activity, Shield, Terminal, Globe
} from 'lucide-react';
import Logo from './Logo';
import { triggerProduction } from '../lib/api';

const NAV_ITEMS = [
  { path: '/', label: 'COMMAND_CENTER', icon: LayoutDashboard, color: 'text-[#BD00FF]' },
  { path: '/factory', label: 'THE_FACTORY', icon: Factory, color: 'text-[#6bff83]' },
  { path: '/auto-series', label: 'AUTO_SERIES', icon: Zap, color: 'text-[#e90053]' },
  { path: '/trends', label: 'TREND_RADAR', icon: Radar, color: 'text-[#00f5ff]' },
  { path: '/agents', label: 'AI_AGENTS', icon: Bot, color: 'text-[#ffaa00]' },
  { path: '/archive', label: 'VIDEO_ARCHIVE', icon: Archive, color: 'text-zinc-400' },
  { path: '/settings', label: 'SETTINGS', icon: Settings, color: 'text-zinc-500' },
  { path: '/logs', label: 'ENCRYPTED_LINK', icon: Terminal, color: 'text-[#BD00FF]' },
];

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isInitiating, setIsInitiating] = useState(false);
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

  const handleGlobalInitiate = async () => {
    setIsInitiating(true);
    try {
      await triggerProduction({
        action: 'FIXED_PIPELINE_START',
        source: 'GLOBAL_SIDEBAR_CMD',
        timestamp: new Date().toISOString()
      });
      // Visual feedback via temporary success state if needed
    } finally {
      setIsInitiating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] font-sans selection:bg-[#BD00FF]/30 overflow-hidden relative">
      {/* Kinetic Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(189,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(189,0,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 scanline-overlay opacity-[0.05]" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar - Kinetic Industrial Design */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 320 : 80 }}
          className="h-full bg-[#0A0A0B]/90 backdrop-blur-md border-r border-white/5 flex flex-col relative z-50 shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* Top Branding */}
          <div className="h-28 flex items-center px-8 border-b border-white/5 bg-black/20">
            <Logo size={isSidebarOpen ? 'md' : 'sm'} hideText={!isSidebarOpen} />
          </div>

          {/* User Profile Terminal (ENCRYPTED_LINK) */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="px-6 py-8 space-y-4"
              >
                <div className="panel-kinetic p-5 group border-[#BD00FF]/20 bg-[#BD00FF]/5 clipped-corner-sm relative">
                  <div className="absolute top-0 right-0 p-2">
                    <div className="w-1 h-1 bg-[#BD00FF] animate-pulse-led" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#BD00FF] to-[#00f5ff] p-[1.5px] clipped-corner-sm">
                      <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                         {session?.user?.user_metadata?.avatar_url ? (
                           <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                         ) : (
                           <User size={24} className="text-[#BD00FF]" />
                         )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-headline text-[13px] font-black text-white uppercase italic tracking-tighter truncate">
                        {session?.user?.email?.split('@')[0] || 'SAJI_OPERATOR'}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Activity size={10} className="text-[#6bff83] animate-pulse-led" />
                        <span className="font-data-mono text-[9px] text-[#6bff83] uppercase tracking-widest font-bold">LINK_ESTABLISHED</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Global Initiate Trigger */}
                <button 
                  onClick={handleGlobalInitiate}
                  disabled={isInitiating}
                  className="w-full btn-kinetic btn-kinetic-primary py-4 px-4 text-[10px] group flex items-center justify-between"
                >
                  <span className="font-headline font-black italic tracking-wider">
                    {isInitiating ? 'EXECUTING...' : 'INITIATE_PRODUCTION'}
                  </span>
                  <Zap size={14} className={isInitiating ? 'animate-pulse' : 'fill-current'} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSidebarOpen && (
            <div className="px-4 py-8 flex flex-col items-center gap-4">
               <button 
                onClick={handleGlobalInitiate}
                className="w-12 h-12 flex items-center justify-center bg-[#BD00FF] text-black clipped-corner-sm hover:shadow-[0_0_15px_#BD00FF] transition-all"
               >
                 <Zap size={18} className="fill-current" />
               </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-4">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-5 px-6 py-4 transition-all duration-300 group overflow-hidden
                    ${isActive 
                      ? 'bg-white/[0.05] border-y border-white/5' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'}
                  `}
                >
                  <item.icon size={18} className={`relative z-10 transition-colors ${isActive ? item.color : 'group-hover:text-zinc-300'}`} />
                  {isSidebarOpen && (
                    <span className={`relative z-10 font-headline text-[11px] font-black uppercase tracking-[0.2em] italic transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <>
                      <motion.div 
                        layoutId="sidebar-active-bar"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#BD00FF] shadow-[0_0_15px_#BD00FF]"
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#BD00FF] rounded-full mr-2 opacity-50" />
                    </>
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
              {isSidebarOpen && <span className="font-label-caps text-[9px] uppercase font-bold tracking-[0.2em]">TOGGLE_NODE_INTERFACE</span>}
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-4 px-6 py-4 text-zinc-700 hover:text-[#e90053] transition-colors group"
            >
              <LogOut size={18} className={!isSidebarOpen ? 'mx-auto' : ''} />
              {isSidebarOpen && <span className="font-label-caps text-[9px] uppercase font-bold tracking-[0.2em]">TERMINATE_CONNECTION</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Viewport */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Header Bar */}
          <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-[#0A0A0B]/80 backdrop-blur-md relative z-40">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/[0.02] border border-white/5 clipped-corner-sm">
                 <Shield size={18} className="text-[#BD00FF]" />
              </div>
              <div className="flex flex-col">
                 <span className="font-data-mono text-[9px] text-zinc-600 uppercase tracking-[0.4em]">SYSTEM_PATH</span>
                 <span className="font-headline text-[14px] font-black text-white uppercase italic tracking-[0.1em]">
                   {location.pathname === '/' ? 'ROOT_CMD' : location.pathname.toUpperCase().replace('/', '').replace('-', '_')}
                 </span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-8 px-8 py-3 bg-white/[0.02] border border-white/5 clipped-corner-sm">
                <div className="flex items-center gap-3">
                  <Activity size={14} className="text-[#6bff83] animate-pulse-led" />
                  <span className="font-data-mono text-[10px] text-zinc-400 uppercase font-bold">ENGINE_LOAD: 24%</span>
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-3">
                  <Globe size={14} className="text-[#00f5ff]" />
                  <span className="font-data-mono text-[10px] text-zinc-400 uppercase font-bold">NETWORK_LIVE</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <div className="font-data-mono text-[10px] text-white uppercase font-black tracking-widest">ENCRYPTED_V2</div>
                    <div className="font-data-mono text-[9px] text-zinc-600 uppercase tracking-tighter">NY_CLUSTER_04</div>
                 </div>
                 <div className="w-12 h-12 bg-zinc-900/50 border border-white/10 flex items-center justify-center clipped-corner-sm hover:border-[#BD00FF]/50 transition-colors">
                    <User size={20} className="text-zinc-500" />
                 </div>
              </div>
            </div>
          </header>

          {/* Dynamic Stage */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
             <div className="p-10 pb-24">
                <Outlet />
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
