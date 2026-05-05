import { create } from 'zustand';

type Language = 'NO' | 'EN';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  COMMAND_CENTER: { NO: 'KOMMANDO_SENTER', EN: 'COMMAND_CENTER' },
  FACTORY: { NO: 'FABRIKKEN', EN: 'THE_FACTORY' },
  THE_FACTORY: { NO: 'FABRIKKEN', EN: 'THE_FACTORY' },
  AUTO_SERIES: { NO: 'AUTO_SERIER', EN: 'AUTO_SERIES' },
  TREND_RADAR: { NO: 'TREND_RADAR', EN: 'TREND_RADAR' },
  TRENDS: { NO: 'TREND_RADAR', EN: 'TREND_RADAR' },
  AI_AGENTS: { NO: 'AI_AGENTER', EN: 'AI_AGENTS' },
  AGENTS: { NO: 'AI_AGENTER', EN: 'AI_AGENTS' },
  VIDEO_ARCHIVE: { NO: 'VIDEO_ARKIV', EN: 'VIDEO_ARCHIVE' },
  ARCHIVE: { NO: 'VIDEO_ARKIV', EN: 'VIDEO_ARCHIVE' },
  SETTINGS: { NO: 'INNSTILLINGER', EN: 'SETTINGS' },
  LOGS: { NO: 'LOGG_TERMINAL', EN: 'SYSTEM_LOGS' },
  INITIATE_PRODUCTION: { NO: 'START_PRODUKSJON', EN: 'INITIATE_PRODUCTION' },
  CREATE_ORDER: { NO: 'START_PRODUKSJON', EN: 'INITIATE_PRODUCTION' },
  TERMINATE_CONNECTION: { NO: 'AVSLUTT_KOBLING', EN: 'TERMINATE_CONNECTION' },
  TOGGLE_NODE_INTERFACE: { NO: 'VEKSLE_GRENSESNITT', EN: 'TOGGLE_NODE_INTERFACE' },
  ACTIVE_CYCLES: { NO: 'AKTIVE_SYKLUSER', EN: 'ACTIVE_CYCLES' },
  QUEUE_DEPTH: { NO: 'KØ_DYBDE', EN: 'QUEUE_DEPTH' },
  SIGNALS_SEC: { NO: 'SIGNALER_SEK', EN: 'SIGNALS_SEC' },
  NEURAL_LOAD: { NO: 'NEURAL_BELASTNING', EN: 'NEURAL_LOAD' },
  LANGUAGE: { NO: 'SPRÅK', EN: 'LANGUAGE' },
  COUNTRY: { NO: 'LAND', EN: 'COUNTRY' },
  PLATFORM: { NO: 'PLATTFORM', EN: 'PLATFORM' },
  VOICE_PROFILE: { NO: 'STEMME_PROFIL', EN: 'VOICE_PROFILE' },
  MALE: { NO: 'MANN', EN: 'MALE' },
  FEMALE: { NO: 'KVINNE', EN: 'FEMALE' },
  AUTO: { NO: 'AUTO', EN: 'AUTO' },
  RENDER_FLOW: { NO: 'RENDER_FLYTE', EN: 'RENDER_FLOW' },
  ARCHIVE_SIZE: { NO: 'ARKIV_STØRRELSE', EN: 'ARCHIVE_SIZE' },
  LIVE_TRENDS: { NO: 'LIVE_TRENDER', EN: 'LIVE_TRENDS' },
  ACTIVE_NODES: { NO: 'AKTIVE_NODER', EN: 'ACTIVE_NODES' },
  FINISHED_ASSETS: { NO: 'FULLFØRTE_OBJEKTER', EN: 'FINISHED_ASSETS' },
  TASKS_PENDING: { NO: 'VENTENDE_OPPGAVER', EN: 'TASKS_PENDING' },
  RADAR_ACTIVE: { NO: 'RADAR_AKTIV', EN: 'RADAR_ACTIVE' },
};

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
  language: 'EN',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const lang = get().language;
    const upperKey = key.toUpperCase().replace(/-/g, '_');
    return translations[upperKey]?.[lang] || key;
  },
}));
