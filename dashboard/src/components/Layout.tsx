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

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trends', label: 'TrendRadar', icon: TrendingUp },
  { path: '/factory', label: 'Production', icon: Factory },
  { path: '/create-order', label: 'Create Order', icon: Plus },
  { path: '/auto-series', label: 'AutoPilot', icon: Zap },
  { path: '/agents', label: 'Agents', icon: Bot },
  { path: '/archive', label: 'Archive', icon: Archive },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Layout() {
  const { language, setLanguage } = useI18nStore();
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

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex overflow-hidden">
      {/* SideNavBar - Cyan Theme Edition */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 py-6 bg-[#050505] border-r border-white/10 w-64 z-50">
        <div className="px-6 mb-10">
          <AnimatedLogo size="sm" />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 font-label-sm text-xs uppercase tracking-widest transition-all duration-200 group
                  ${isActive 
                    ? 'bg-white/5 text-primary-container border-r-2 border-primary-container' 
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'}
                `}
              >
                <item.icon size={18} className={isActive ? 'text-primary-container' : 'group-hover:text-primary-container'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* System Health / GPU Telemetry */}
        <div className="px-4 mb-6">
          <div className="p-4 bg-surface-container-low border border-white/5 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-label-sm uppercase font-black text-zinc-600 tracking-widest">RTX_4080_LINK</span>
              <div className={`w-1.5 h-1.5 rounded-full ${engineStatus === 'online' ? 'bg-[#6bff83] animate-pulse shadow-[0_0_8px_#6bff83]' : 'bg-red-500 shadow-[0_0_8px_red]'}`} />
            </div>
            {gpuInfo && (
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-label-sm">
                  <span className="text-zinc-500 uppercase">Temp</span>
                  <span className="text-white font-bold">{gpuInfo.temp}°C</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(gpuInfo.temp / 90) * 100}%` }}
                    className="h-full bg-primary-container"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 mb-8">
          <Link 
            to="/create-order" 
            className="w-full py-4 bg-primary-container text-on-primary-container font-headline-md text-sm rounded transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:brightness-110"
          >
            <Plus size={18} />
            New Order
          </Link>
        </div>

        <div className="px-4 mb-8">
          <LiveStatusTracker />
        </div>

        <footer className="px-4 space-y-1 border-t border-white/5 pt-6 mt-auto">
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 font-label-sm text-xs uppercase tracking-widest transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 font-label-sm text-xs uppercase tracking-widest transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-12 h-16 sticky top-0 z-40 bg-[#050505] border-b border-white/10">
          <div className="flex items-center gap-6">
            <h2 className="font-label-sm text-sm font-medium tracking-tight text-primary-container uppercase tracking-widest">
              {location.pathname === '/' ? 'Workspace Overview' : location.pathname.split('/')[1].toUpperCase()}
            </h2>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <div className="hidden md:flex bg-white/5 p-1 border border-white/10 rounded-lg">
              {(['NO', 'EN'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-[9px] font-black transition-all rounded ${
                    language === lang 
                      ? 'bg-primary-container text-on-primary-container shadow-lg' 
                      : 'text-zinc-600 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm group-focus-within:text-primary-container transition-colors" size={16} />
              <input 
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none text-zinc-300 w-64 transition-all" 
                placeholder="Search projects..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <button className="p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-all rounded-full relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full border border-[#050505]"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden cursor-pointer hover:border-primary-container transition-all">
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
