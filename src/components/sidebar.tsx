import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Film, Library, Zap, Sparkles, 
  Layers, TrendingUp, Share2, MessageSquare, 
  BarChart3, Bot, Settings, LogOut, Circle 
} from 'lucide-react';
import { Page } from '../lib/types';
import { useLanguage } from '../contexts/languageContext';
import { useAuth } from '../contexts/authContext';
import Logo from './logo';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { page: 'dashboard' as Page, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { page: 'studio' as Page, icon: <Sparkles size={20} />, label: 'Studio' },
  { page: 'trends' as Page, icon: <TrendingUp size={20} />, label: 'Radar' },
  { page: 'library' as Page, icon: <Library size={20} />, label: 'Library' },
  { page: 'production' as Page, icon: <Film size={20} />, label: 'Factory' },
  { page: 'agents' as Page, icon: <Bot size={20} />, label: 'Agents' },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  const { signOut, user } = useAuth();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  return (
    <aside className="w-20 h-full bg-[#050505]/95 border-r border-white/5 flex flex-col items-center py-4">
      {/* Logo - Small */}
      <div className="mb-6">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          <Zap size={18} className="text-white" />
        </motion.div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(({ page, icon, label }) => {
          const active = current === page;
          return (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(page)}
              onMouseEnter={() => setShowTooltip(label)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                active 
                  ? 'bg-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {icon}
              
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="navActive"
                  className="absolute -right-1 w-1 h-4 rounded-full bg-violet-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
              
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip === label && !active && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-14 px-2 py-1 bg-violet-600 text-white text-xs rounded whitespace-nowrap z-50"
                  >
                    {label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3 mt-auto">
        {/* Status Indicator */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="relative w-12 h-12 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5"
        >
          <Circle size={8} className="text-teal-400 fill-teal-400 animate-pulse" />
          <span className="absolute -bottom-1 text-[8px] text-teal-400">ON</span>
        </motion.div>

        {/* User Avatar */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center text-sm font-bold text-white"
        >
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </motion.button>
      </div>
    </aside>
  );
}