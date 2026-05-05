import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Factory, 
  Zap, 
  Radar, 
  Bot, 
  Archive, 
  Settings, 
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const NAV_ITEMS = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard, color: 'text-[#BD00FF]' },
  { path: '/factory', label: 'The Factory', icon: Factory, color: 'text-[#6bff83]' },
  { path: '/auto-series', label: 'Auto Series', icon: Zap, color: 'text-[#e90053]' },
  { path: '/trends', label: 'Trend Radar', icon: Radar, color: 'text-[#00f5ff]' },
  { path: '/agents', label: 'AI Agents', icon: Bot, color: 'text-[#ffaa00]' },
  { path: '/archive', label: 'Archive', icon: Archive, color: 'text-zinc-400' },
  { path: '/settings', label: 'Settings', icon: Settings, color: 'text-zinc-500' },
];

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] font-sans selection:bg-[#BD00FF]/30 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#BD00FF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f5ff]/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className="h-full bg-[#0A0A0B] border-r border-white/5 flex flex-col relative"
        >
          {/* Logo Section */}
          <div className="h-24 flex items-center px-6">
            <Logo size={isSidebarOpen ? 'md' : 'sm'} hideText={!isSidebarOpen} />
          </div>

          {/* User Status (Only if open) */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-6 mb-8"
              >
                <div className="bg-white/5 border border-white/5 p-4 rounded-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#BD00FF] to-[#00f5ff] p-[1px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                       <User size={20} className="text-zinc-500" />
                    </div>
                  </div>
                  <div>
                    <div className="font-label-caps text-[10px] font-black text-[#BD00FF] uppercase tracking-tighter italic">OPERATOR_01</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#6bff83] rounded-full animate-pulse" />
                      <span className="font-data-mono text-[9px] text-zinc-500 uppercase tracking-widest">SYSTEM_ONLINE</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-4 px-4 py-3 transition-all duration-300 group
                    ${isActive 
                      ? 'bg-white/5 text-white' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'}
                  `}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 border-l-2 border-[#BD00FF] bg-gradient-to-r from-[#BD00FF]/5 to-transparent pointer-events-none"
                    />
                  )}
                  <item.icon size={20} className={`relative z-10 transition-colors ${isActive ? item.color : 'group-hover:text-white'}`} />
                  {isSidebarOpen && (
                    <span className={`relative z-10 font-label-caps text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#BD00FF] shadow-[0_0_8px_#BD00FF]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 py-6 space-y-2">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center gap-4 px-4 py-3 text-zinc-600 hover:text-white transition-colors group"
            >
              <Menu size={20} className={!isSidebarOpen ? 'mx-auto' : ''} />
              {isSidebarOpen && <span className="font-label-caps text-[10px] uppercase font-bold tracking-widest">COLLAPSE_INTERFACE</span>}
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-4 px-4 py-3 text-zinc-700 hover:text-[#e90053] transition-colors group"
            >
              <LogOut size={20} className={!isSidebarOpen ? 'mx-auto' : ''} />
              {isSidebarOpen && <span className="font-label-caps text-[10px] uppercase font-bold tracking-widest">TERMINATE_SESSION</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Bar */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0A0A0B]/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <span className="font-data-mono text-[10px] text-[#BD00FF] uppercase tracking-[0.4em]">NODE:</span>
              <span className="font-label-caps text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                {location.pathname === '/' ? 'ROOT / COMMAND_CENTER' : `ROOT${location.pathname.toUpperCase().replace('/', ' / ')}`}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10">
                <div className="w-2 h-2 bg-[#6bff83] rounded-full animate-pulse shadow-[0_0_8px_#6bff83]" />
                <span className="font-data-mono text-[10px] text-zinc-400 uppercase tracking-tighter">LINK_STABLE</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#BD00FF] to-[#00f5ff] p-[1px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                   <User size={20} className="text-zinc-500" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content Container */}
          <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            {/* CRT Scanline Global Overlay */}
            <div className="fixed inset-0 pointer-events-none scanline-overlay opacity-[0.03] z-[100]" />
            
            <div className="p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
