import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { usePipelineStore } from './store/pipelineStore';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AutoSeries from './pages/AutoSeries';
import TrendAnalyzer from './pages/TrendAnalyzer';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Factory from './pages/Factory';
import Login from './pages/Login';
import Agents from './pages/Agents';

function App() {
  const fetchInitialData = usePipelineStore(state => state.fetchInitialData);
  const subscribeToChanges = usePipelineStore(state => state.subscribeToChanges);
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
    const unsubscribeChanges = subscribeToChanges();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      if (typeof unsubscribeChanges === 'function') unsubscribeChanges();
      if (subscription) subscription.unsubscribe();
    };
  }, [fetchInitialData, subscribeToChanges]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131314] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(189,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(189,0,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <div className="relative z-10 space-y-6 flex flex-col items-center">
           <div className="w-16 h-16 border border-[#BD00FF]/20 flex items-center justify-center clipped-corner animate-pulse">
              <div className="w-8 h-8 bg-[#BD00FF] clipped-corner-sm" />
           </div>
           <div className="font-data-mono text-[10px] text-[#BD00FF] tracking-[0.5em] italic animate-pulse">
             INITIALIZING_KINETIC_LINK...
           </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login onSuccess={() => {}} />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/factory" element={<Factory />} />
          <Route path="/auto-series" element={<AutoSeries />} />
          <Route path="/trends" element={<TrendAnalyzer />} />
          <Route path="/archive" element={<Library />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logs" element={<div className="font-data-mono text-zinc-500">SYSTEM_LOGS_TERMINAL: STABLE</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
