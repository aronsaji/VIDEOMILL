import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Video, Library, Layers, 
  BarChart3, HelpCircle, Settings, Bell, Search, 
  History, Plus, LogOut, Cpu, Activity,
  TrendingUp, Bot, Zap, Archive, Factory
} from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo';
import LiveStatusTracker from './LiveStatusTracker';

export default function Layout() {
  const { language, setLanguage, t } = useI18nStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [engineStatus, setEngineStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [gpuInfo, setGpuInfo] = useState<{ temp: number; load: number } | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkEngine = async () => {
      try {
        const res = await fetch('http://localhost:3001/health');
        if (res.ok) {
          const data = await res.json();
          setEngineStatus('online');
          setGpuInfo(data.gpu || { temp: 42, load: 15 });
        } else {
          setEngineStatus('offline');
        }
      } catch {
        setEngineStatus('offline');
      }
    };
    checkEngine();
    const interval = setInterval(checkEngine, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: t('COMMAND_CENTER'), icon: LayoutDashboard },
    { path: '/trends', label: t('TREND_RADAR'), icon: TrendingUp },
    { path: '/factory', label: t('THE_FACTORY'), icon: Factory },
    { path: '/create-order', label: t('INITIATE_PRODUCTION'), icon: Plus },
    { path: '/auto-series', label: t('AUTO_SERIES'), icon: Zap },
    { path: '/agents', label: t('AI_AGENTS'), icon: Bot },
    { path: '/archive', label: t('VIDEO_ARCHIVE'), icon: Archive },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex overflow-hidden">
      {/* SideNavBar - Clean Theme Edition */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 py-6 bg-surface border-r border-outline w-64 z-50 shadow-sm">
        <div className="px-6 mb-10">
          <AnimatedLogo size="sm" />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 font-label-sm text-[10px] uppercase tracking-[0.15em] transition-all duration-200 group rounded-xl
                  ${isActive 
                    ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}
                `}
              >
                <item.icon size={16} className={isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* System Health / GPU Telemetry */}
        <div className="px-4 mb-6">
          <div className="p-4 bg-surface-container border border-outline rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-label-sm uppercase font-black text-on-surface-variant/40 tracking-widest">RTX_4080_LINK</span>
              <div className={`w-1.5 h-1.5 rounded-full ${engineStatus === 'online' ? 'bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
            </div>
            {gpuInfo && (
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-label-sm">
                  <span className="text-on-surface-variant uppercase">Temp</span>
                  <span className="text-on-surface font-bold">{gpuInfo.temp}°C</span>
                </div>
                <div className="h-1 bg-outline rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(gpuInfo.temp / 90) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 mb-8">
          <Link 
            to="/create-order" 
            className="w-full py-4 bg-primary text-white font-headline-md text-xs font-black rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 uppercase tracking-widest"
          >
            <Plus size={18} />
            {t('INITIATE_PRODUCTION')}
          </Link>
        </div>

        <div className="px-4 mb-8">
          <LiveStatusTracker />
        </div>

        <footer className="px-4 space-y-1 border-t border-outline pt-6 mt-auto">
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-[10px] uppercase tracking-widest transition-all rounded-lg">
            <Settings size={16} />
            <span>{t('SETTINGS')}</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-error hover:bg-error/5 font-label-sm text-[10px] uppercase tracking-widest transition-all rounded-lg"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto bg-background">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-12 h-16 sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline">
          <div className="flex items-center gap-6">
            <h2 className="font-label-sm text-[11px] font-black tracking-widest text-primary uppercase">
              {location.pathname === '/' ? t('COMMAND_CENTER') : location.pathname.split('/')[1].toUpperCase().replace('-', '_')}
            </h2>
            <div className="h-4 w-[1px] bg-outline hidden md:block" />
            <div className="hidden md:flex bg-surface-container p-1 border border-outline rounded-xl">
              {(['NO', 'EN'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-[9px] font-black transition-all rounded-lg ${
                    language === lang 
                      ? 'bg-surface text-primary shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={14} />
              <input 
                className="bg-surface-container border border-outline rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface w-64 transition-all" 
                placeholder="Neural search..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-3 border-l border-outline pl-6">
              <button className="p-2 text-on-surface-variant/40 hover:bg-surface-container hover:text-on-surface transition-all rounded-full relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-surface-container border border-outline overflow-hidden cursor-pointer hover:border-primary transition-all">
                <img 
                  src={session?.user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Operator"} 
                  alt="User avatar" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="flex-1 p-12 max-w-[1600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
