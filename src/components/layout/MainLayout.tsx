import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-80">
        <TopBar />
        <main className="flex-1 overflow-y-auto pt-16 h-full custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-8 relative">
             {/* Atmospheric ambient glows */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-mist" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
