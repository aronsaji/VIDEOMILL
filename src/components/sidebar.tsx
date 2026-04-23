import { LayoutDashboard, TrendingUp, Film, Library, Share2, MessageSquare, BarChart3, Settings, LogOut, ShoppingCart, Clapperboard, Layers, Bot } from 'lucide-react';
import { Page } from '../lib/types';
import { useLanguage } from '../contexts/languageContext';
import { useAuth } from '../contexts/authContext';
import Logo from './logo';
import { motion } from 'framer-motion';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  const { t, language } = useLanguage();
  const { signOut } = useAuth();

  const navItems: { page: Page; label: string; label_en: string; icon: React.ReactNode; badge?: string }[] = [
    { page: 'dashboard',    label: t.nav.dashboard,    label_en: 'Dashboard',    icon: <LayoutDashboard size={20} /> },
    { page: 'studio',       label: 'Command Center', label_en: 'Command Center', icon: <Clapperboard size={20} />, badge: 'NY' },
    { page: 'series',       label: 'Auto-Serie',       label_en: 'Auto Series',       icon: <Layers size={20} />,       badge: 'AI' },
    { page: 'bestilling',   label: t.nav.bestilling,   label_en: 'Orders',   icon: <ShoppingCart size={20} /> },
    { page: 'trends',       label: t.nav.trends,       label_en: 'Trends',       icon: <TrendingUp size={20} /> },
    { page: 'production',   label: t.nav.production,   label_en: 'Production',   icon: <Film size={20} /> },
    { page: 'library',      label: t.nav.library,      label_en: 'Library',      icon: <Library size={20} /> },
    { page: 'distribution', label: t.nav.distribution, label_en: 'Distribution', icon: <Share2 size={20} /> },
    { page: 'engagement',   label: t.nav.engagement,   label_en: 'Engagement',   icon: <MessageSquare size={20} /> },
    { page: 'analytics',    label: t.nav.analytics,    label_en: 'Analytics',    icon: <BarChart3 size={20} /> },
    { page: 'agents',      label: 'AI Agenter',    label_en: 'AI Agents',    icon: <Bot size={20} />,    badge: 'AI' },
  ];

  const getLabel = (item: typeof navItems[0]) => language === 'en' ? item.label_en : item.label;

  return (
    <aside className="w-64 h-full bg-[#050505]/80 glass border-r border-violet-500/10 flex flex-col backdrop-blur-xl">
      <div className="px-4 lg:px-5 py-4 lg:py-5 border-b border-violet-500/10">
        <Logo size="md" />
      </div>

      <nav className="flex-1 px-2 lg:px-3 py-3 lg:py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ page, label, label_en, icon, badge }) => {
          const active = current === page;
          return (
            <motion.button
              key={page}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(page)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl text-[14px] lg:text-[15px] font-medium transition-all duration-200 ${
                active
                  ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                  : 'text-white/60 hover:bg-white/5 hover:text-white hover:border-white/10 border border-transparent'
              }`}
            >
              <span className={`flex-shrink-0 transition-colors ${active ? 'text-violet-400' : 'text-white/40'}`}>{icon}</span>
              <span className="truncate">{language === 'en' ? label_en : label}</span>
              {badge && !active && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-teal-500/20 text-violet-400 border border-violet-500/30">
                  {badge}
                </span>
              )}
              {active && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${
            current === 'settings'
              ? 'bg-cyan-500/15 text-cyan-400'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Settings size={18} />
          {t.nav.settings}
        </button>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          {t.common.logout}
        </button>

        <div className="mt-2 mx-1 px-4 py-3 rounded-2xl glass border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400">{t.common.systemActive}</span>
          </div>
          <p className="text-xs text-white/30">{t.common.nextScan} 2t 14min</p>
        </div>
      </div>
    </aside>
  );
}
