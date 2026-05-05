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
    { path: '/settings', label: t('SETTINGS'), icon: Settings },
  ];

  return (
    <div className="bg-[#131412] text-[#e4e2e0] font-body-md min-h-screen flex overflow-hidden">
      {/* Sidebar - The Naturalist Studio Edition */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 py-8 bg-[#131412] border-r border-[#424843] w-72 z-50">
        <div className="px-8 mb-12">
          <AnimatedLogo size="sm" />
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-5 py-4 font-label-sm text-[12px] uppercase tracking-[0.1em] transition-all duration-300 group rounded-soft
                  ${isActive 
                    ? 'bg-[#2d4535] text-[#b1cdb7] border-l-2 border-[#b1cdb7]' 
                    : 'text-[#c2c8c1] hover:text-[#b1cdb7] hover:bg-[#1b1c1a]'}
                `}
              >
                <item.icon size={18} className={isActive ? 'text-[#b1cdb7]' : 'text-[#8c928c] group-hover:text-[#b1cdb7] transition-colors'} />
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* System Health Telemetry - Integrated into UI Panels */}
        <div className="px-6 mb-8">
          <div className="p-5 bg-[#1b1c1a] border border-[#424843] rounded-soft-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-label-sm uppercase font-bold text-[#b1cdb7] tracking-[0.2em] italic">GPU_CORE_LINK</span>
              <div className={`w-1.5 h-1.5 rounded-full ${engineStatus === 'online' ? 'bg-[#b1cdb7] animate-pulse shadow-[0_0_8px_#b1cdb7]' : 'bg-[#ffb4ab]'}`} />
            </div>
            {gpuInfo && (
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-label-sm font-bold">
                  <span className="text-[#8c928c] uppercase">Node_Temp</span>
                  <span className="text-[#e4e2e0]">{gpuInfo.temp}°C</span>
                </div>
                <div className="h-1 bg-[#424843] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(gpuInfo.temp / 90) * 100}%` }}
                    className="h-full bg-[#b1cdb7]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="px-6 border-t border-[#424843] pt-8 mt-auto">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-5 py-4 text-[#8c928c] hover:text-[#ffb4ab] hover:bg-[#93000a]/10 font-label-sm text-[12px] uppercase tracking-widest transition-all rounded-soft font-bold"
          >
            <LogOut size={18} />
            <span>Terminate_Session</span>
          </button>
        </footer>
      </aside>

      {/* Main Workspace Canvas */}
      <main className="flex-1 ml-72 flex flex-col h-screen overflow-y-auto bg-[#131412]">
        {/* Workspace Toolbar */}
        <header className="flex justify-between items-center w-full px-12 h-20 sticky top-0 z-40 bg-[#131412]/90 backdrop-blur-xl border-b border-[#424843]">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-[#b1cdb7] rounded-full" />
               <h2 className="font-label-sm text-[13px] font-bold tracking-[0.2em] text-[#e4e2e0] uppercase">
                 {location.pathname === '/' ? t('COMMAND_CENTER') : location.pathname.split('/')[1].toUpperCase().replace(/-/g, '_')}
               </h2>
            </div>
            <div className="h-4 w-[1px] bg-[#424843]" />
            <div className="flex bg-[#1b1c1a] p-1 border border-[#424843] rounded-soft-md">
              {(['NO', 'EN'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-1.5 text-[10px] font-bold transition-all rounded-soft-sm ${
                    language === lang 
                      ? 'bg-[#2d4535] text-[#b1cdb7] shadow-sm' 
                      : 'text-[#8c928c] hover:text-[#e4e2e0]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c928c] group-focus-within:text-[#b1cdb7] transition-colors" size={16} />
              <input 
                className="bg-[#1b1c1a] border border-[#424843] rounded-soft-lg pl-12 pr-6 py-3 text-[12px] focus:ring-1 focus:ring-[#b1cdb7]/30 focus:border-[#b1cdb7] outline-none text-[#e4e2e0] w-80 transition-all font-label-sm placeholder:text-[#8c928c]/40" 
                placeholder="Neural search intercept..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-6 border-l border-[#424843] pl-8">
              <button className="p-3 text-[#8c928c] hover:bg-[#1b1c1a] hover:text-[#b1cdb7] transition-all rounded-soft-lg relative">
                <Bell size={22} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#ffb4ab] rounded-full border-2 border-[#131412]"></span>
              </button>
              <div className="flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-10 rounded-soft-lg bg-[#1b1c1a] border border-[#424843] overflow-hidden group-hover:border-[#b1cdb7] transition-all p-1">
                   <img 
                     src={session?.user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${session?.user?.email}&backgroundColor=b1cdb7`} 
                     alt="User" 
                     className="w-full h-full object-cover rounded-soft-sm"
                   />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Canvas */}
        <div className="flex-1 p-12 max-w-[1800px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
