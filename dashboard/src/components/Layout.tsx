import React from 'react';
import { motion } from 'framer-motion';
import { Activity, LayoutDashboard, Settings, Video, Terminal, Film, Library, List } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarIcon = ({ icon: Icon, to, active = false }: { icon: any; to: string; active?: boolean }) => (
  <Link
    to={to}
    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
      active
        ? 'bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]'
        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
    }`}
  >
    <Icon size={24} />
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden text-gray-200">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-20 bg-surface border-r border-border flex flex-col items-center py-6 gap-8 z-10"
      >
        <div className="text-neon-cyan">
          <Terminal size={32} />
        </div>
        <nav className="flex flex-col gap-4 flex-1 mt-4">
          <SidebarIcon icon={LayoutDashboard} to="/" active={location.pathname === '/'} />
          <SidebarIcon icon={Film} to="/auto-series" active={location.pathname === '/auto-series'} />
          <SidebarIcon icon={Library} to="/library" active={location.pathname === '/library'} />
          <SidebarIcon icon={List} to="/orders" active={location.pathname === '/orders'} />
          <SidebarIcon icon={Activity} to="/trends" active={location.pathname === '/trends'} />
        </nav>
        <SidebarIcon icon={Settings} to="/settings" active={location.pathname === '/settings'} />
      </motion.aside>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Background Grid Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="h-20 border-b border-border flex items-center px-8 justify-between z-10 bg-surface/50 backdrop-blur-md"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              VIDEOMILL
              <span className="text-xs font-mono bg-neon-amber/20 text-neon-amber px-2 py-0.5 rounded border border-neon-amber/30 uppercase">
                ERP Active
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-1">THE NON-STOP VIRAL ENGINE // v2.0</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-mono text-gray-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
              </span>
              SYSTEM ONLINE
            </div>
          </div>
        </motion.header>

        {/* Dynamic Content */}
        <motion.main
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto p-8 z-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
