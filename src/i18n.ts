import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "common": {
        "loading": "Loading...",
        "logout": "Exit Terminal",
        "save": "Save",
        "cancel": "Cancel"
      },
      "sidebar": {
        "groups": {
          "core": "Core Operations",
          "intelligence": "Intelligence",
          "assets": "Asset Management",
          "system": "System"
        },
        "items": {
          "dashboard": "Dashboard",
          "factory": "Factory Node",
          "production": "New Production",
          "trending": "Trending Topics",
          "analyzer": "Trend Analyzer",
          "agents": "AI Agents",
          "library": "Video Library",
          "templates": "Video Templates",
          "series": "Auto Series",
          "orders": "Order History",
          "settings": "Parameters"
        },
        "status": "Neural Engine Active",
        "proNode": "PRO NODE ACTIVE"
      },
      "voiceSelector": {
        "placeholder": "Select voice...",
        "searchPlaceholder": "Search voices or languages...",
        "noResults": "No voices found",
        "customVoice": "Cloned Voice #1",
        "customVoiceSub": "Personal Clone Active",
        "preview": "Preview"
      },
      "login": {
        "title": "VideoMill",
        "subtitle": "Neural Video Production Node",
        "email": "Email",
        "password": "Password",
        "signIn": "Sign In",
        "forgot": "Forgot?",
        "orContinueWith": "Or continue with",
        "noAccount": "Don't have an account?",
        "hasAccount": "Already part of the network?",
        "signUp": "Register Node",
        "contactAdmin": "Contact Node Admin"
      },
      "createOrder": {
        "title": "CREATE NEW ORDER",
        "subtitle": "Start your next viral production",
        "steps": {
          "concept": "Concept",
          "creative": "Creative Choices",
          "review": "Review"
        },
        "topics": {
          "title": "Select Trending Topic",
          "subtitle": "Pick a hot topic to auto-fill the configuration, or write your own",
          "custom": "Custom Concept",
          "customDesc": "Start from scratch with your own script"
        },
        "productionType": {
          "label": "Production Mode",
          "single": "Single Video",
          "series": "Auto Series",
          "seasons": "Number of Seasons",
          "episodes": "Videos per Season"
        },
        "fields": {
          "title": "Project Title",
          "titlePlaceholder": "e.g. Viral Tech Review #1",
          "platform": "Target Platform",
          "format": "Video Format",
          "formats": {
            "v916": "Vertical (9:16)",
            "v169": "Landscape (16:9)",
            "v11": "Square (1:1)",
            "v45": "Portrait (4:5)"
          },
          "distribution": "Distribution & Publishing",
          "channels": "Connected Channels",
          "noChannels": "No channels connected",
          "country": "Country",
          "countryPlaceholder": "Norway",
          "language": "Language",
          "languagePlaceholder": "Norwegian",
          "audience": "Target Audience",
          "audiencePlaceholder": "e.g. Tech enthusiasts 18-30",
          "description": "Script / Description",
          "descriptionPlaceholder": "What should the video be about? Give instructions to the agents...",
          "voices": "Voices (Multi-Voice)",
          "addVoice": "Add voice",
          "cloning": {
            "title": "Advanced Voice Configuration",
            "enable": "Enable Voice Cloning (AI)",
            "upload": "Upload Reference Audio",
            "uploadSub": "Drop .mp3 or .wav (Max 10 mins)",
            "characteristics": "Voice Characteristics",
            "tone": "Tone / Pitch",
            "tempo": "Tempo / Speed",
            "cloningActive": "AI Cloning Sequence Initialized",
            "quality": "Clone Fidelity"
          },
          "atmosphere": "Soundscape & Atmosphere",
          "atmospheres": {
            "cinema": "Cinema Atmosphere",
            "modern": "Modern Beats",
            "minimal": "Minimalist Pulse"
          }
        },
        "review": {
          "title": "Ready for Dispatch",
          "subtitle": "The system has validated the parameters for",
          "noTitle": "Untitled",
          "description": "The production will automatically start in the Factory immediately after approval.",
          "summary": {
            "voices": "Voices",
            "language": "Language",
            "country": "Country",
            "platform": "Platform"
          }
        },
        "buttons": {
          "back": "Go Back",
          "next": "Next Step",
          "submit": "Initialize Production"
        }
      },
      "dashboard": {
        "title": "Control Center",
        "subtitle": "Real-time production management",
        "nodeActive": "NODE_01 ACTIVE",
        "efficiency": "EFFICIENCY",
        "alerts": "ALERTS",
        "uptime": "UPTIME",
        "productionQueue": "Production Queue",
        "agentStatus": "Agent Deployment",
        "stats": {
          "totalVideos": "Total Productions",
          "storage": "Storage Used",
          "apiCalls": "Neural API Calls"
        }
      },
      "factory": {
        "title": "Factory Node",
        "subtitle": "High-velocity content synthesis",
        "activeProcesses": "Active Processes",
        "queue": "Neural Queue",
        "throughput": "Throughput",
        "status": {
          "rendering": "Rendering",
          "synthesizing": "Synthesizing",
          "uploading": "Uploading",
          "completed": "Completed"
        }
      },
      "trending": {
        "title": "Trending Topics",
        "subtitle": "Real-time viral wave capture",
        "scanActive": "SCANNING GLOBAL NETWORKS",
        "relevance": "RELEVANCE",
        "momentum": "MOMENTUM",
        "action": {
          "generate": "Base Production on this Trend"
        }
      },
      "analyzer": {
        "title": "Trend Analyzer",
        "subtitle": "Deep neural market intelligence",
        "analyzing": "Analyzing Data Clusters",
        "prediction": "Viral Prediction",
        "confidence": "Neural Confidence"
      },
      "agents": {
        "title": "AI Agents",
        "subtitle": "Autonomous production intelligence",
        "deploy": "Deploy New Agent",
        "status": {
          "idle": "Idle",
          "working": "Processing",
          "monitoring": "Monitoring"
        }
      },
      "library": {
        "title": "Video Library",
        "subtitle": "Stored content assets",
        "search": "Search library...",
        "views": "Views",
        "exportSelected": "Export Selected",
        "status": {
          "processing": "Processing",
          "failed": "Failed",
          "retry": "Retry"
        },
        "export": {
          "title": "Export Configuration",
          "subtitle": "Select format and quality parameters for synthesized assets",
          "format": "Target Format",
          "quality": "Quality Output",
          "template": "Export Template",
          "templates": {
            "custom": "Custom settings",
            "social": "Social Media (Fast & Compressed)",
            "story": "Social Media Story (Vertical Optimized)",
            "webinar": "Webinar Recording (Balanced)",
            "web": "Web Content (Standard)",
            "high": "Cinematic (Max Quality)",
            "master": "Archival Master (Highest Quality & Raw)"
          },
          "confirm": "Initialize Export",
          "close": "Cancel"
        }
      },
      "templates": {
        "title": "Video Templates",
        "subtitle": "Verified high-retention frameworks",
        "use": "Use Template"
      },
      "series": {
        "title": "Auto Series",
        "subtitle": "Automated episodic growth",
        "frequency": "Post Frequency",
        "active": "Active Series"
      },
      "orders": {
        "title": "Order History",
        "subtitle": "Node transaction log",
        "id": "Order ID",
        "amount": "Credits"
      },
      "settings": {
        "title": "System Parameters",
        "subtitle": "Core node configurations",
        "general": "General",
        "voices": "AI Voices",
        "api": "API Access",
        "security": "Neural Security"
      }
    }
  },
  no: {
    translation: {
      "common": {
        "loading": "Laster...",
        "logout": "Terminal Avslutning",
        "save": "Lagre",
        "cancel": "Avbryt"
      },
      "sidebar": {
        "groups": {
          "core": "Kjerneoperasjoner",
          "intelligence": "Intelligens",
          "assets": "Eiendelsforvaltning",
          "system": "System"
        },
        "items": {
          "dashboard": "Dashbord",
          "factory": "Fabrikknode",
          "production": "Ny Produksjon",
          "trending": "Trendende Temaer",
          "analyzer": "Trendanalysator",
          "agents": "AI-Agenter",
          "library": "Videobibliotek",
          "templates": "Videomaler",
          "series": "Autoserier",
          "orders": "Ordrehistorikk",
          "settings": "Parametere"
        },
        "status": "Nevral Motor Aktiv",
        "proNode": "PRO NODE AKTIV"
      },
      "voiceSelector": {
        "placeholder": "Velg stemme...",
        "searchPlaceholder": "Søk i stemmer eller språk...",
        "noResults": "Ingen stemmer funnet",
        "customVoice": "Klonet Stemme #1",
        "customVoiceSub": "Personlig Klone Aktiv",
        "preview": "Forhåndsvis"
      },
      "login": {
        "title": "VideoMill",
        "subtitle": "Nevral Videoproduksjonsnode",
        "email": "E-post",
        "password": "Passord",
        "signIn": "Logg Inn",
        "forgot": "Glemt?",
        "orContinueWith": "Eller fortsett med",
        "noAccount": "Har du ikke konto?",
        "hasAccount": "Allerede med i nettverket?",
        "signUp": "Registrer Node",
        "contactAdmin": "Kontakt Node Admin"
      },
      "createOrder": {
        "title": "OPPRETT NY ORDRE",
        "subtitle": "Start din neste virale produksjon",
        "steps": {
          "concept": "Konsept",
          "creative": "Kreative Valg",
          "review": "Gjennomgang"
        },
        "topics": {
          "title": "Velg Trendende Tema",
          "subtitle": "Velg et hett tema for å fylle ut konfigurasjonen automatisk, eller skriv ditt eget",
          "custom": "Eget Konsept",
          "customDesc": "Start fra bunnen med ditt eget manuskript"
        },
        "productionType": {
          "label": "Produksjonsmodus",
          "single": "Enkeltvideo",
          "series": "Autoserie",
          "seasons": "Antall Sesonger",
          "episodes": "Videoer per Sesong"
        },
        "fields": {
          "title": "Prosjekt Tittel",
          "titlePlaceholder": "f.eks. Viral Tech Review #1",
          "platform": "Målplattform",
          "format": "Videoformat",
          "formats": {
            "v916": "Vertikal (9:16)",
            "v169": "Landskap (16:9)",
            "v11": "Kvadrat (1:1)",
            "v45": "Portrett (4:5)"
          },
          "distribution": "Distribusjon & Publisering",
          "channels": "Tilkoblede Kanaler",
          "noChannels": "Ingen kanaler tilkoblet",
          "country": "Land",
          "countryPlaceholder": "Norge",
          "language": "Språk",
          "languagePlaceholder": "Norsk",
          "audience": "Målgruppe",
          "audiencePlaceholder": "f.eks. Tech-interesserte 18-30",
          "description": "Manuskript / Beskrivelse",
          "descriptionPlaceholder": "Hva skal videoen handle om? Gi instruksjoner til agentene...",
          "voices": "Stemmer (Multi-Voice)",
          "addVoice": "Legg til stemme",
          "cloning": {
            "title": "Avansert Stemmekonfigurasjon",
            "enable": "Aktiver Stemmekloning (AI)",
            "upload": "Last opp referanselyd",
            "uploadSub": "Slipp .mp3 eller .wav (Maks 10 min)",
            "characteristics": "Stemmekarakteristikker",
            "tone": "Tone / Pitch",
            "tempo": "Tempo / Hastighet",
            "cloningActive": "AI-kloningssekvens initialisert",
            "quality": "Klonekvalitet"
          },
          "atmosphere": "Lydbilde & Atmosfære",
          "atmospheres": {
            "cinema": "Kino-atmosfære",
            "modern": "Moderne Beats",
            "minimal": "Minimalistisk Puls"
          }
        },
        "review": {
          "title": "Klar for Utsendelse",
          "subtitle": "Systemet har validert parametrene for",
          "noTitle": "Uten Tittel",
          "description": "Produksjonen vil automatisk starte i Fabrikken umiddelbart etter godkjenning.",
          "summary": {
            "voices": "Stemmer",
            "language": "Språk",
            "country": "Land",
            "platform": "Plattform"
          }
        },
        "buttons": {
          "back": "Gå Tilbake",
          "next": "Neste Steg",
          "submit": "Initialiser Produksjon"
        }
      },
      "dashboard": {
        "title": "Kontrollsenter",
        "subtitle": "Sanntids videoproduksjon",
        "nodeActive": "NODE_01 AKTIV",
        "efficiency": "EFFEKTIVITET",
        "alerts": "VARSLER",
        "uptime": "OPPETID",
        "productionQueue": "Produksjonskø",
        "agentStatus": "Agent Distribusjon",
        "stats": {
          "totalVideos": "Total Produksjon",
          "storage": "Lagring Brukt",
          "apiCalls": "Nevrale API-kall"
        }
      },
      "factory": {
        "title": "Fabrikknode",
        "subtitle": "Høyhastighets innholdssyntese",
        "activeProcesses": "Aktive Prosesser",
        "queue": "Nevral Kø",
        "throughput": "Gjennomstrømming",
        "status": {
          "rendering": "Rendering",
          "synthesizing": "Syntetiserer",
          "uploading": "Laster opp",
          "completed": "Fullført"
        }
      },
      "trending": {
        "title": "Trendende Temaer",
        "subtitle": "Sanntids fangst av virale bølger",
        "scanActive": "SKANNER GLOBALE NETTVERK",
        "relevance": "RELEVANS",
        "momentum": "MOMENTUM",
        "action": {
          "generate": "Baser produksjon på denne trenden"
        }
      },
      "analyzer": {
        "title": "Trendanalysator",
        "subtitle": "Dyp nevral markedsintelligens",
        "analyzing": "Analyserer dataklynger",
        "prediction": "Viral prediksjon",
        "confidence": "Nevral selvsikkerhet"
      },
      "agents": {
        "title": "AI-Agenter",
        "subtitle": "Autonom produksjonsintelligens",
        "deploy": "Distribuer ny agent",
        "status": {
          "idle": "Inaktiv",
          "working": "Prosesserer",
          "monitoring": "Overvåker"
        }
      },
      "library": {
        "title": "Videobibliotek",
        "subtitle": "Lagrede innholdseiendeler",
        "search": "Søk i bibliotek...",
        "views": "Visninger",
        "exportSelected": "Eksporter Valgte",
        "status": {
          "processing": "Behandler",
          "failed": "Feilet",
          "retry": "Prøv på nytt"
        },
        "export": {
          "title": "Konfigurer Eksport",
          "subtitle": "Velg format og kvalitetsparametere for syntetiserte filer",
          "format": "Målformat",
          "quality": "Kvalitetsutgang",
          "template": "Eksportmal",
          "templates": {
            "custom": "Egendefinerte innstillinger",
            "social": "Sosiale Medier (Rask & Komprimert)",
            "story": "Sosiale Medier Story (Vertikalt Optimalisert)",
            "webinar": "Webinar-opptak (Balansert)",
            "web": "Nettsideinnhold (Standard)",
            "high": "Filmatisk (Maks Kvalitet)",
            "master": "Arkivmester (Høyeste Kvalitet & Raw)"
          },
          "confirm": "Initialiser Eksport",
          "close": "Avbryt"
        }
      },
      "templates": {
        "title": "Videomaler",
        "subtitle": "Verifiserte rammeverk med høy retensjon",
        "use": "Bruk mal"
      },
      "series": {
        "title": "Autoserier",
        "subtitle": "Automatisert episodisk vekst",
        "frequency": "Postingsfrekvens",
        "active": "Aktive serier"
      },
      "orders": {
        "title": "Ordrehistorikk",
        "subtitle": "Node transaksjonslogg",
        "id": "Ordre-ID",
        "amount": "Kreditt"
      },
      "settings": {
        "title": "Systemparametre",
        "subtitle": "Kjernekonfigurasjoner for noder",
        "general": "Generelt",
        "voices": "AI-Stemmer",
        "api": "API-tilgang",
        "security": "Nevral sikkerhet"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
