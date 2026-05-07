import React, { useEffect, useState } from 'react';
import { Logo } from '../ui/Logo';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  Cpu, 
  TrendingUp, 
  PlusCircle, 
  Video, 
  Factory, 
  Settings, 
  Plus,
  Layers,
  LayoutDashboard,
  Library,
  ClipboardList,
  Flame,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

export const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('videomill_demo_mode');
    await supabase.auth.signOut();
    navigate('/login');
  };
  const groups = [
    {
      label: t('sidebar.groups.core'),
      items: [
        { name: t('sidebar.items.dashboard'), icon: LayoutDashboard, path: '/' },
        { name: t('sidebar.items.factory'), icon: Factory, path: '/factory' },
        { name: t('sidebar.items.production'), icon: PlusCircle, path: '/create' },
      ]
    },
    {
      label: t('sidebar.groups.intelligence'),
      items: [
        { name: t('sidebar.items.trending'), icon: Flame, path: '/trending' },
        { name: t('sidebar.items.analyzer'), icon: TrendingUp, path: '/trends' },
        { name: t('sidebar.items.agents'), icon: Cpu, path: '/agents' },
      ]
    },
    {
      label: t('sidebar.groups.assets'),
      items: [
        { name: t('sidebar.items.library'), icon: Library, path: '/library' },
        { name: t('sidebar.items.templates'), icon: Video, path: '/templates' },
        { name: t('sidebar.items.series'), icon: Layers, path: '/series' },
      ]
    },
    {
      label: t('sidebar.groups.system'),
      items: [
        { name: t('sidebar.items.orders'), icon: ClipboardList, path: '/orders' },
        { name: t('sidebar.items.settings'), icon: Settings, path: '/settings' },
      ]
    }
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-80 border-r border-primary/20 bg-[#0a0a0a] flex flex-col py-6 px-4 z-40 overflow-y-auto custom-scrollbar">
      <div className="mb-10 px-2 flex flex-col items-center">
        <NavLink to="/" className="mb-6 hover:scale-105 transition-transform">
          <Logo size="md" />
        </NavLink>
        <div className="text-center px-2">
          <span className="text-3xl font-display font-black tracking-tighter text-text uppercase block">VideoMill</span>
          <span className="text-[10px] mono text-primary uppercase tracking-[0.1em] font-bold block mt-1 leading-tight opacity-80">
            The Non-Stop Viral Engine
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 mt-4 border border-primary/10 px-2 py-0.5 rounded-full bg-primary/5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <p className="mono text-[7px] text-primary uppercase tracking-[0.2em] font-bold">{t('sidebar.status')}</p>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => toggleLanguage('en')}
            className={cn("px-2 py-1 rounded text-[8px] mono border transition-all", i18n.language === 'en' ? "bg-primary border-primary text-background" : "border-primary/20 text-text-muted")}
          >
            EN
          </button>
          <button 
            onClick={() => toggleLanguage('no')}
            className={cn("px-2 py-1 rounded text-[8px] mono border transition-all", i18n.language === 'no' ? "bg-primary border-primary text-background" : "border-primary/20 text-text-muted")}
          >
            NO
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {groups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50">{group.label}</p>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium text-text-muted hover:bg-white/5 transition-all group relative border border-transparent",
                  isActive && "bg-primary/10 text-primary border-primary/20 shadow-sleek"
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={cn("transition-transform group-hover:scale-110", isActive && "text-primary")} />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-primary/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-background font-bold uppercase">
            {user?.email?.[0] || 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold truncate text-text">{user?.email || 'Admin User'}</p>
            <p className="text-[8px] opacity-50 font-mono tracking-widest text-primary">{t('sidebar.proNode')}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[10px] font-bold text-red-400 hover:bg-red-400/10 transition-all uppercase tracking-widest border border-red-400/20"
        >
          <LogOut size={14} />
          {t('common.logout')}
        </button>
      </div>
    </nav>
  );
};
