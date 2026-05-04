import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Video, Library, Settings, 
  Menu, X, Sparkles, TrendingUp, Cpu, 
  Radio, Zap, Layers, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

export default function Layout() {
  const { t } = useLanguage();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  const NAV_ITEMS = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard, color: 'text-neon-purple' },
    { path: '/factory', label: t('nav.factory'), icon: Video, color: 'text-neon-cyan' },
    { path: '/auto-series', label: t('nav.auto_series'), icon: Radio, color: 'text-neon-pink' },
    { path: '/trends', label: t('nav.trends'), icon: TrendingUp, color: 'text-neon-amber' },
    { path: '/agents', label: t('nav.agents'), icon: Cpu, color: 'text-neon-green' },
    { path: '/archive', label: t('nav.archive'), icon: History, color: 'text-gray-400' },
    { path: '/settings', label: t('nav.settings'), icon: Settings, color: 'text-gray-500' },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user?.email || 'Guest'}`;

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-neon-purple selection:text-white relative overflow-hidden">
      {/* Dynamic Background Particles - REINFORCED */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-cyber-grid opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-2/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-1/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-background/50" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Modern Vertical Sidebar */}
        <motion.aside 
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className="glass-ultra border-r border-white/5 flex flex-col relative z-20"
        >
          {/* Logo Area */}
          <div className="p-6 mb-8 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div 
                  key="full" 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Operator Profile Section */}
                  <div className="p-6 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-brand-2/30 overflow-hidden relative group">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-fIaMjUpIG-hmKh9K9cou9riV2WyqOnY7VWcrRdy2sf6MJLtaTdBw2la_-cCf1gv7qRV_yIWjrLOH994sIaJOPef_VjRx4NstoNc6GxtdSBpH5LblFzyh4ns4517-p5xWRlHrpzH2-txtsrNYH0aq-hUDzS_3eV36cw0YqElns9rwV23faJTkUVEbbBAOvbSWHHuqJ4lNUhKqxsMFp63sfvyMN96xJv6klnHEXOl78wUGC0g2xizBqfkbvLhhFhre7--hnk4JWB-e" 
                          alt="OPERATOR_01" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-brand-2/10 pointer-events-none" />
                      </div>
                      <div>
                        <div className="text-brand-2 font-black font-['Space_Grotesk'] text-sm uppercase tracking-tighter italic">OPERATOR_01</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic opacity-70 flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-brand-1 animate-pulse" />
                          System Online
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 px-3 py-1 bg-brand-2/10 border border-brand-2/20 text-[10px] text-brand-2 font-black font-mono rounded inline-block uppercase tracking-[0.2em] italic">
                      AI_STRENGTH_98%
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="icon" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="mx-auto"
                >
                  <Logo size="sm" hideText />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-white/5 text-white border border-white/5 shadow-xl' 
                      : 'text-gray-500 hover:text-white hover:bg-neon-cyan/5'}
                  `}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className={`absolute inset-0 bg-gradient-to-r ${item.color.replace('text-', 'from-')}/15 to-transparent rounded-2xl border-l-2 ${item.color.replace('text-', 'border-')}`}
                    />
                  )}
                  <item.icon size={20} className={`relative z-10 transition-all duration-500 ${isActive ? item.color + ' scale-110 drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]' : 'group-hover:text-white'}`} />
                  {isSidebarOpen && (
                    <span className={`relative z-10 font-black text-[13px] uppercase tracking-widest italic transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && isSidebarOpen && (
                    <div className={`ml-auto w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor] animate-pulse`} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 py-6 space-y-4">
             <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-600 hover:text-red-500 hover:bg-red-500/5 transition-all group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
              {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">{t('nav.sign_out')}</span>}
            </button>

            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-700 hover:text-neon-cyan transition-colors group"
            >
              {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} className="mx-auto" />}
              {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">{t('nav.collapse')}</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Top Bar / Breadcrumb */}
          <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black font-mono text-neon-purple uppercase tracking-[0.4em]">System Node: </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{location.pathname === '/' ? 'Root/Command_Center' : `Root${location.pathname.replace('/', '/')}`}</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Live Link: Stable</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-purple to-neon-pink p-[1px]">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                   <img src={avatarUrl} alt="avatar" className="w-8 h-8 object-cover" />
                </div>
              </div>
            </div>
          </header>

          {/* Scanline Overlay */}
          <div className="absolute inset-0 scanline z-[60] pointer-events-none opacity-50" />
          
          <main className="relative z-10 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
