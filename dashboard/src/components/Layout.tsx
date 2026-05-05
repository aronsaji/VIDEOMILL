import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Factory, Zap, Radar, 
  Bot, Archive, Settings, Bell, Search, 
  Terminal, Video, Plus, Globe
} from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';
import { supabase } from '../lib/supabase';

const NAV_ITEMS = [
  { path: '/', label: 'COMMAND_CENTER', icon: LayoutDashboard },
  { path: '/factory', label: 'THE_FACTORY', icon: Factory },
  { path: '/auto-series', label: 'AUTO_SERIES', icon: Zap },
  { path: '/trends', label: 'TREND_RADAR', icon: Radar },
  { path: '/agents', label: 'AI_AGENTS', icon: Bot },
  { path: '/archive', label: 'VIDEO_ARCHIVE', icon: Archive },
  { path: '/logs', label: 'SYSTEM_LOGS', icon: Terminal },
];

export default function Layout() {
  const { language, setLanguage, t } = useI18nStore();
  const location = useLocation();
  const [isEngineOnline, setIsEngineOnline] = useState(false);
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
        setIsEngineOnline(res.ok);
      } catch {
        setIsEngineOnline(false);
      }
    };
    checkEngine();
    const interval = setInterval(checkEngine, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container flex overflow-hidden">
      {/* SideNavBar - New Design */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 py-6 bg-[#050505] border-r border-white/10 w-64 z-50 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-container flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Video className="w-5 h-5 text-on-primary-container" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white font-headline-md tracking-tighter uppercase">Videomill</h1>
            <p className="font-headline-md text-[10px] uppercase tracking-[0.2em] text-zinc-500">Pro Workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 font-headline-md text-[11px] uppercase tracking-[0.15em] transition-all group ${
                location.pathname === item.path
                  ? 'bg-white/5 text-[#22D3EE] border-r-2 border-[#22D3EE]'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <item.icon size={16} className={`${location.pathname === item.path ? 'text-[#22D3EE]' : 'text-zinc-500 group-hover:text-zinc-200'}`} />
              <span>{t(item.label)}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 mb-8">
          <button className="w-full py-4 bg-primary-container text-on-primary-container font-headline-md text-[11px] uppercase tracking-widest rounded transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Plus size={16} />
            {t('NEW_PROJECT')}
          </button>
        </div>

        <footer className="px-4 space-y-1 border-t border-white/5 pt-6">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 font-headline-md text-[11px] uppercase tracking-[0.15em] transition-all group ${
              location.pathname === '/settings'
                ? 'bg-white/5 text-[#22D3EE] border-r-2 border-[#22D3EE]'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Settings size={16} />
            <span>{t('SETTINGS')}</span>
          </Link>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        {/* TopAppBar - New Design */}
        <header className="flex justify-between items-center w-full px-12 h-16 sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-xs font-bold tracking-[0.2em] text-[#22D3EE] uppercase">Workspace Overview</h2>
          </div>

          <div className="flex items-center gap-8">
            {/* Engine Status */}
            <a 
              href="http://localhost:3001" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-6 py-2 border rounded transition-all group ${
                isEngineOnline 
                  ? 'bg-[#22D3EE]/5 border-[#22D3EE]/20 hover:border-[#22D3EE]/50' 
                  : 'bg-red-500/5 border-red-500/20 grayscale opacity-50'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isEngineOnline ? 'bg-[#22D3EE] animate-pulse' : 'bg-red-500'}`} />
              <span className={`font-label-sm text-[10px] font-black uppercase tracking-[0.2em] ${isEngineOnline ? 'text-[#22D3EE]' : 'text-red-500'}`}>
                {isEngineOnline ? 'ENGINE: ONLINE' : 'ENGINE: OFFLINE'}
              </span>
              <Terminal size={12} className={`transition-colors ${isEngineOnline ? 'text-[#22D3EE]' : 'text-red-500'}`} />
            </a>

            {/* Search */}
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 group focus-within:border-[#22D3EE] transition-all">
              <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-[#22D3EE]" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-[11px] text-white placeholder-zinc-500 w-48 font-headline-md ml-2" 
                placeholder="Search projects..." 
                type="text"
              />
            </div>

            {/* Language & Profile */}
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <button className="p-2 text-zinc-400 hover:text-[#22D3EE] transition-all">
                <Bell size={18} />
              </button>
              
              <div className="flex bg-white/5 p-1 border border-white/10 rounded">
                {(['NO', 'EN'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-[10px] font-black transition-all ${
                      language === lang 
                        ? 'bg-[#22D3EE] text-black shadow-lg shadow-[#22D3EE]/20' 
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="w-8 h-8 rounded-full border border-[#22D3EE]/30 overflow-hidden cursor-pointer hover:border-[#22D3EE] transition-all">
                <img 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                  src={session?.user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Viewport Wrapper */}
        <div className="flex-1 p-10 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
