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
  const { fetchInitialData, subscribeToChanges } = usePipelineStore();
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
      if (unsubscribeChanges) unsubscribeChanges();
      subscription.unsubscribe();
    };
  }, [fetchInitialData, subscribeToChanges]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-data-mono text-[10px] text-[#BD00FF] tracking-[0.5em] italic">
        INITIALIZING_SYSTEM_UPLINK...
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
