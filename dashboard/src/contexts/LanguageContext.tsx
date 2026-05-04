import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'no' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  no: {
    // Sidebar
    'nav.dashboard': 'Kommando-senter',
    'nav.factory': 'Fabrikken',
    'nav.auto_series': 'Auto-serier',
    'nav.trends': 'Trend-radar',
    'nav.agents': 'AI Agenter',
    'nav.archive': 'Arkiv',
    'nav.settings': 'Innstillinger',
    'nav.sign_out': 'Logg ut',
    'nav.collapse': 'Minimer meny',
    
    // Dashboard
    'dash.network_integrity': 'Nettverks-integritet',
    'dash.neural_activity': 'Nevral aktivitet',
    'dash.cognition_rate': 'Kognisjons-rate',
    'dash.data_velocity': 'Data-hastighet',
    'dash.operations_hub': 'Operasjons-senter',
    'dash.live_stream': 'Live produksjons-strøm',
    'dash.system_standby': 'System i ventemodus',
    'dash.enter_factory': 'Gå til fabrikken',

    // Factory
    'factory.title': 'Produksjons-kjerne',
    'factory.subtitle': 'Konfigurer og syntetiser nytt video-innhold',
    'factory.visual_style': 'Visuell Stil',
    'factory.target_audience': 'Målgruppe',
    'factory.generate_script': 'Generer Manus',
    
    // Trends
    'trends.title': 'Trend Radar',
    'trends.subtitle': 'Analyserer globale virale signaler',
    'trends.query_signals': 'Søk etter signaler...',
    'trends.refresh': 'Oppdater Radar',
    
    // Common
    'common.active_nodes': 'Aktive noder',
    'common.stable': 'Stabil',
    'common.loading': 'Laster...',
  },
  en: {
    // Sidebar
    'nav.dashboard': 'Command Center',
    'nav.factory': 'The Factory',
    'nav.auto_series': 'Auto Series',
    'nav.trends': 'Trend Radar',
    'nav.agents': 'AI Agents',
    'nav.archive': 'Archive',
    'nav.settings': 'Settings',
    'nav.sign_out': 'Sign Out',
    'nav.collapse': 'Collapse Menu',

    // Dashboard
    'dash.network_integrity': 'Network Integrity',
    'dash.neural_activity': 'Neural Activity',
    'dash.cognition_rate': 'Cognition Rate',
    'dash.data_velocity': 'Data Velocity',
    'dash.operations_hub': 'Operations Hub',
    'dash.live_stream': 'Live Production Stream',
    'dash.system_standby': 'System Standby',
    'dash.enter_factory': 'Enter Factory Core',

    // Factory
    'factory.title': 'Production Core',
    'factory.subtitle': 'Configure and synthesize new video assets',
    'factory.visual_style': 'Visual Style',
    'factory.target_audience': 'Target Audience',
    'factory.generate_script': 'Generate Script',

    // Trends
    'trends.title': 'Trend Radar',
    'trends.subtitle': 'Analyzing global viral signals',
    'trends.query_signals': 'Query Viral Signals...',
    'trends.refresh': 'Refresh Radar',

    // Common
    'common.active_nodes': 'Active Nodes',
    'common.stable': 'Stable',
    'common.loading': 'Loading...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app-language') as Language) || 'no';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['no']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
