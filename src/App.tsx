import { useState, useEffect } from 'react';
import { Page } from './lib/types';
import { AuthProvider, useAuth } from './contexts/authContext';
import { LanguageProvider } from './contexts/languageContext';
import Layout from './components/layout';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Trends from './pages/trends';
import Production from './pages/production';
import Library from './pages/library';
import Distribution from './pages/distribution';
import Engagement from './pages/engagement';
import Analytics from './pages/analytics';
import Settings from './pages/settings';
import Bestilling from './pages/bestilling';
import Agents from './pages/agents';
import Studio from './pages/studio';
import SeriesPage from './pages/series';
import Onboarding, { useOnboarding } from './components/onboarding';
import Billing from './pages/billing';
import AdminDashboard from './pages/admin';
import { useAdminRole } from './lib/hooks/useRoles';

// ── Hash-based routing so F5 / direct URL keeps the correct page ──
const VALID_PAGES: Page[] = [
  'dashboard', 'trends', 'production', 'library',
  'distribution', 'engagement', 'analytics', 'settings', 'bestilling', 'studio', 'series', 'agents',
  'billing', 'admin',
];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '').split('?')[0] as Page;
  return VALID_PAGES.includes(hash) ? hash : 'dashboard';
}

function AppContent() {
  const { user, loading } = useAuth();
  const { role: adminRole } = useAdminRole();
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);
  const { showOnboarding, completeOnboarding: dismissOnboarding } = useOnboarding();

  // Keep URL hash in sync with page state
  const handleNavigate = (page: Page) => {
    window.location.hash = page;
    setCurrentPage(page);
  };

  // React to browser back / forward and manual URL edits
  useEffect(() => {
    const onHashChange = () => setCurrentPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
        <div className="bg-animated" />
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center animate-pulse-glow">
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute -inset-2 rounded-2xl bg-cyan-500/10 blur-xl animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-white/60 text-sm font-medium">Laster VideoMill</div>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full animate-shimmer" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    // Admin pages - kun for ansatte med rolle
    if (adminRole && currentPage === 'admin') {
      return <AdminDashboard role={adminRole} onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'dashboard':    return <Dashboard onNavigate={handleNavigate} />;
      case 'bestilling':   return <Bestilling />;
      case 'studio':       return <Studio />;
      case 'trends':       return <Trends onNavigate={handleNavigate} />;
      case 'production':   return <Production onNavigate={handleNavigate} />;
      case 'library':      return <Library />;
      case 'distribution': return <Distribution />;
      case 'engagement':   return <Engagement />;
      case 'analytics':    return <Analytics />;
      case 'series':       return <SeriesPage />;
      case 'settings':     return <Settings />;
      case 'agents':       return <Agents />;
      case 'billing':      return <Billing />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
      {showOnboarding && user && (
        <Onboarding onComplete={() => dismissOnboarding()} onSkip={() => dismissOnboarding()} />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
