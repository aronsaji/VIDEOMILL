/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Agents } from './pages/Agents';
import { TrendAnalyzer } from './pages/TrendAnalyzer';
import { Factory } from './pages/Factory';
import { CreateOrder } from './pages/CreateOrder';
import { Library } from './pages/Library';
import { Settings } from './pages/Settings';
import { VideoTemplates } from './pages/VideoTemplates';
import { AutoSeries } from './pages/AutoSeries';
import { Orders } from './pages/Orders';
import { TrendingTopics } from './pages/TrendingTopics';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const isDemo = localStorage.getItem('videomill_demo_mode') === 'true';
        const hasRealKeys = import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
        
        if (hasRealKeys && isDemo) {
          localStorage.removeItem('videomill_demo_mode');
          window.location.reload();
          return;
        }
        
        if (!import.meta.env.VITE_SUPABASE_URL || isDemo) {
          if (isDemo) {
            setSession({ user: { email: 'admin@admin.com' } } as any);
          }
          setLoading(false);
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.warn("Supabase session check skipped or failed.");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" replace />} 
        />
        
        <Route element={session ? <MainLayout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/trends" element={<TrendAnalyzer />} />
          <Route path="/factory" element={<Factory />} />
          <Route path="/create" element={<CreateOrder />} />
          <Route path="/library" element={<Library />} />
          <Route path="/templates" element={<VideoTemplates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/series" element={<AutoSeries />} />
          <Route path="/trending" element={<TrendingTopics />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
