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
import Orders from './pages/Orders';
import Login from './pages/Login';
import Agents from './pages/Agents';
import CreateOrder from './pages/CreateOrder';

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-[linear-gradient(var(--primary)_1px,transparent_1px),linear-gradient(90deg,var(--primary)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />
        <div className="relative z-10 space-y-6 flex flex-col items-center">
           <div className="w-16 h-16 border border-primary/20 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 bg-primary rounded-sm" />
           </div>
           <div className="font-mono text-[10px] text-primary tracking-[0.5em] italic animate-pulse">
             INITIALIZING_VIDEO_MILL...
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
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/auto-series" element={<AutoSeries />} />
          <Route path="/trends" element={<TrendAnalyzer />} />
          <Route path="/archive" element={<Library />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logs" element={<div className="font-mono text-on-surface-variant text-[10px] uppercase">SYSTEM_LOGS_TERMINAL: STABLE</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
