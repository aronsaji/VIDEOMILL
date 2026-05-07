import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Key, 
  Mic, 
  Cpu, 
  CreditCard,
  Bell,
  Monitor,
  Zap,
  Check,
  ChevronRight,
  Plus,
  Database,
  Terminal,
  Trash2,
  RefreshCw,
  Play,
  Share2,
  Youtube,
  Instagram,
  Music,
  Facebook
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('generelt');
  const [debugStatus, setDebugStatus] = useState<{
    supabase: 'connected' | 'disconnected' | 'checking' | 'missing_keys',
    n8n: 'configured' | 'missing'
  }>({ supabase: 'checking', n8n: 'configured' });

  const [voices, setVoices] = useState<any[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testingAll, setTestingAll] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const [platforms, setPlatforms] = useState([
    { 
      name: 'TikTok Business', 
      icon: Music, 
      status: 'connected', 
      statusMessage: 'Operasjonell - API v2.0',
      accounts: 2, 
      color: '#00F2EA', 
      lastSync: '2 min siden',
      tokenStatus: 'Valid',
      isTesting: false
    },
    { 
      name: 'YouTube Google Cloud', 
      icon: Youtube, 
      status: 'connected', 
      statusMessage: 'Operasjonell - OAuth Aktiv',
      accounts: 2, 
      color: '#FF0000', 
      lastSync: '10 min siden',
      tokenStatus: 'Valid',
      isTesting: false
    },
    { 
      name: 'Instagram Meta API', 
      icon: Instagram, 
      status: 'degraded', 
      statusMessage: 'Begrenset Rate Limit',
      accounts: 2, 
      color: '#E4405F', 
      lastSync: '1 time siden',
      tokenStatus: 'Valid',
      isTesting: false
    },
    { 
      name: 'Facebook Graph API', 
      icon: Facebook, 
      status: 'error', 
      statusMessage: 'Token Utløpt (Login påkrevd)',
      accounts: 1, 
      color: '#1877F2', 
      lastSync: 'Nylig feilet',
      tokenStatus: 'Expired',
      isTesting: false
    }
  ]);

  const handleTestPlatform = async (index: number) => {
    const newPlatforms = [...platforms];
    newPlatforms[index].isTesting = true;
    setPlatforms(newPlatforms);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedPlatforms = [...newPlatforms];
    updatedPlatforms[index].isTesting = false;
    updatedPlatforms[index].lastSync = 'Akkurat nå';
    
    if (updatedPlatforms[index].status === 'error') {
      setNotification({ message: `Test feilet for ${updatedPlatforms[index].name}. Re-autentisering kreves.`, type: 'error' });
    } else {
      updatedPlatforms[index].status = 'connected';
      updatedPlatforms[index].statusMessage = 'Operasjonell - API Verifisert';
      updatedPlatforms[index].tokenStatus = 'Valid';
      setNotification({ message: `Tilkobling til ${updatedPlatforms[index].name} er OK.`, type: 'success' });
    }
    
    setPlatforms(updatedPlatforms);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTestAllPlatforms = async () => {
    setTestingAll(true);
    for (let i = 0; i < platforms.length; i++) {
      await handleTestPlatform(i);
    }
    setTestingAll(false);
    setNotification({ message: 'Alle plattformtester fullført.', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReAuth = (index: number) => {
    setNotification({ message: `Starter OAuth-flyt for ${platforms[index].name}...`, type: 'info' });
    
    // Simulate successful re-auth after delay
    setTimeout(() => {
      const newPlatforms = [...platforms];
      newPlatforms[index].status = 'connected';
      newPlatforms[index].statusMessage = 'Gjenopprettet - OAuth Aktiv';
      newPlatforms[index].tokenStatus = 'Valid';
      newPlatforms[index].lastSync = 'Akkurat nå';
      setPlatforms(newPlatforms);
      setNotification({ message: `Suksessfull re-autentisering for ${platforms[index].name}.`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }, 2000);
  };

  const fetchVoices = async () => {
    setLoadingVoices(true);
    try {
      const { data, error } = await supabase
        .from('voices')
        .select('*')
        .order('voice_name', { ascending: true });
      
      if (error) throw error;
      setVoices(data || []);
    } catch (err) {
      console.error("Failed to fetch voices:", err);
    } finally {
      setLoadingVoices(false);
    }
  };

  const [isAddingVoice, setIsAddingVoice] = useState(false);
  const [newVoice, setNewVoice] = useState({
    name: '',
    language: 'nb-NO',
    type: 'neural',
    provider: 'Google',
    gender: 'female'
  });

  const handleAddVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First, try adding with gender
      const { data, error } = await supabase
        .from('voices')
        .insert([{
          voice_name: newVoice.name,
          language: newVoice.language,
          type: newVoice.type,
          provider: newVoice.provider,
          gender: newVoice.gender,
          edge_voice: `${newVoice.language}-Neural` // Placeholder for edge_voice
        }])
        .select();
      
      if (error) {
        // Fallback in case gender column doesn't exist yet
        console.warn("Retrying without gender column...");
        const { data: retryData, error: retryError } = await supabase
          .from('voices')
          .insert([{
            voice_name: newVoice.name,
            language: newVoice.language,
            type: newVoice.type,
            provider: newVoice.provider,
            edge_voice: `${newVoice.language}-Neural`
          }])
          .select();
        
        if (retryError) throw retryError;
        setVoices([...voices, ...retryData]);
      } else {
        setVoices([...voices, ...data]);
      }
      
      setIsAddingVoice(false);
      setNewVoice({ name: '', language: 'nb-NO', type: 'neural', provider: 'Google', gender: 'female' });
    } catch (err) {
      console.error("Failed to add voice:", err);
      alert("Kunne ikke legge til stemme.");
    }
  };

  const handleSyncVoices = async () => {
    setSyncing(true);
    // In a real app, this might pull from ElevenLabs or Google Cloud TTS API
    // and update the Supabase 'voices' table.
    // For now, we'll simulate a sync by re-fetching from Supabase.
    await fetchVoices();
    setTimeout(() => setSyncing(false), 1000);
  };

  const handleDeleteVoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('voices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setVoices(voices.filter(v => v.id !== id));
    } catch (err) {
      console.error("Failed to delete voice:", err);
      alert("Kunne ikke slette stemme.");
    }
  };

  useEffect(() => {
    if (activeTab === 'ai') {
      fetchVoices();
    }
  }, [activeTab]);

  useEffect(() => {
    const checkConnections = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      if (!url || !key) {
        setDebugStatus(prev => ({ ...prev, supabase: 'missing_keys' }));
      } else {
        try {
          // Check if productions table exists and is accessible
          const { data, error } = await supabase.from('productions').select('id').limit(1);
          if (error) throw error;
          setDebugStatus(prev => ({ ...prev, supabase: 'connected' }));
        } catch (err) {
          console.error("Supabase connection check failed:", err);
          setDebugStatus(prev => ({ ...prev, supabase: 'disconnected' }));
        }
      }

      setDebugStatus(prev => ({ ...prev, n8n: n8nUrl ? 'configured' : 'missing' }));
    };
    checkConnections();
  }, []);

  const tabs = [
    { id: 'generelt', label: t('settings.general'), icon: SettingsIcon },
    { id: 'ai', label: t('settings.voices'), icon: Mic },
    { id: 'api', label: t('settings.api'), icon: Key },
    { id: 'platforms', label: 'Plattformer', icon: Share2 },
    { id: 'system', label: 'System', icon: Cpu },
    { id: 'nodes', label: 'Node Helse', icon: Zap },
    { id: 'billing', label: 'Fakturering', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="mb-12 relative">
        <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('settings.title')}</h1>
        <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('settings.subtitle')}</p>
        
        {notification && (
          <div className={cn(
            "fixed top-8 right-8 z-[100] px-6 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-right duration-300 font-display text-sm uppercase tracking-widest font-bold flex items-center gap-3",
            notification.type === 'success' ? "bg-emerald-500/90 border-emerald-400 text-white" :
            notification.type === 'error' ? "bg-red-500/90 border-red-400 text-white" :
            "bg-primary/90 border-primary text-background"
          )}>
            {notification.type === 'success' && <Check size={18} />}
            {notification.type === 'error' && <Zap size={18} />}
            {notification.type === 'info' && <RefreshCw size={18} className="animate-spin" />}
            {notification.message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-xl border transition-all group",
                activeTab === tab.id ? "bg-primary/10 border-primary text-primary shadow-[inset_0_0_15px_rgba(34,211,238,0.05)]" : "bg-surface border-outline text-text-muted hover:border-text-muted hover:text-white"
              )}
            >
              <tab.icon size={20} className={cn("transition-transform group-hover:scale-110", activeTab === tab.id ? "text-primary" : "text-text-muted")} />
              <span className="font-display text-sm uppercase tracking-widest font-bold">{tab.label}</span>
              {activeTab === tab.id && <Zap size={14} className="ml-auto animate-pulse" fill="currentColor" />}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'generelt' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn(
                  "p-6 rounded-2xl border flex flex-col justify-between transition-all",
                  debugStatus.supabase === 'connected' ? "bg-emerald-500/5 border-emerald-500/20" : 
                  debugStatus.supabase === 'missing_keys' ? "bg-yellow-500/5 border-yellow-500/20" : "bg-red-500/5 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                       <Database size={14} className={debugStatus.supabase === 'connected' ? "text-emerald-400" : "text-red-400"} />
                       Supabase Infrastruktur
                    </h3>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      debugStatus.supabase === 'connected' ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                    )} />
                  </div>
                  <p className="text-[11px] text-text-muted mb-4 leading-relaxed">
                    {debugStatus.supabase === 'connected' 
                      ? "Operasjonell. Sanntids-synkronisering og database-cluster er aktive." 
                      : debugStatus.supabase === 'missing_keys'
                      ? "Mangler konfigurasjon. Vennligst sjekk dine .env-miljøvariabler."
                      : "Problem med nodetilkobling. Sjekk at 'productions' tabellen eksisterer."}
                  </p>
                  <div className="text-[9px] mono font-black uppercase py-1.5 px-3 bg-black/40 rounded border border-white/5 inline-flex items-center gap-2 self-start">
                    Status: <span className={debugStatus.supabase === 'connected' ? "text-emerald-400" : "text-red-400"}>{debugStatus.supabase.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>

                <div className={cn(
                  "p-6 rounded-2xl border flex flex-col justify-between transition-all",
                  debugStatus.n8n === 'configured' ? "bg-primary/5 border-primary/20" : "bg-yellow-500/5 border-yellow-500/20"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 text-primary">
                       <Zap size={14} /> n8n Orchestration
                    </h3>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      debugStatus.n8n === 'configured' ? "bg-primary animate-pulse" : "bg-yellow-400"
                    )} />
                  </div>
                  <p className="text-[11px] text-text-muted mb-4 leading-relaxed">
                    {debugStatus.n8n === 'configured' 
                      ? "Aktiv node-lytter. Arbeidsflyten for videogenerering er koblet til." 
                      : "Ingen webhook funnet. Bestillinger vil lagres lokalt i Supabase, men ikke prosesseres."}
                  </p>
                  <div className="text-[9px] mono font-black uppercase py-1.5 px-3 bg-black/40 rounded border border-white/5 inline-flex items-center gap-2 self-start">
                    Endpoint: <span className={debugStatus.n8n === 'configured' ? "text-primary" : "text-yellow-400"}>{debugStatus.n8n.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-2xl border border-white/5 space-y-10">
              <section>
                <h3 className="text-lg uppercase tracking-widest border-l-4 border-primary pl-4 mb-8">Operatør Profil</h3>
                <div className="flex items-center gap-8 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-surface border-2 border-outline overflow-hidden group-hover:border-primary transition-all">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDlD-M-ilw9X89ynCh7zthrcYij0VhNz3smv-61Jy-DZLrRVcqfKYvwcs_KLljROl39mPoU09ntEkEbXPf5asLo0SAeh38KQlQUqzQaQAf9crGdE6Zfn-Xj9trvgCQNEAxhqnWqG9nIfXB0pFSyFPIMv5ATlJSz73dSdwCq5KMgINTUKd8F8-eMuw7jTRvpw6URSBhqmGqOCoe1xfLYgj-2rfiKpKbFMbrPrWznKW1Fsvs1sbxNZ1H7s2XJhztZ5wncoHL7_B6zXg" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-primary text-background p-2 rounded-lg shadow-lg hover:scale-110 transition-transform">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="mono text-[10px] text-text-muted uppercase tracking-widest">Visningsnavn</label>
                      <input type="text" defaultValue="Administrator" className="w-full bg-surface border border-outline focus:border-primary px-4 py-2.5 rounded-lg text-sm outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="mono text-[10px] text-text-muted uppercase tracking-widest">E-post Adresse</label>
                       <input type="email" defaultValue="admin@videomill.io" className="w-full bg-surface border border-outline focus:border-primary px-4 py-2.5 rounded-lg text-sm outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg uppercase tracking-widest border-l-4 border-secondary pl-4 mb-8">Varslingspreferanser</h3>
                <div className="space-y-4">
                  {[
                    { label: 'E-post varsling ved ferdig produksjon', desc: 'Motta bekreftelse når en video er klar for eksport.' },
                    { label: 'Systemvarsling i dashbord', desc: 'Sanntidsmeldinger om agentstatus og feilmeldinger.' },
                    { label: 'Kritiske terminalvarsler over SSH', desc: 'For avansert monitorering av systemhelse.' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-surface/30 rounded-xl border border-outline/30 group hover:border-secondary transition-all">
                      <div>
                        <p className="text-sm font-bold group-hover:text-secondary transition-colors">{item.label}</p>
                        <p className="text-[10px] text-text-muted mono uppercase mt-1 opacity-60">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-outline rounded-full relative cursor-pointer group-hover:bg-secondary/20 transition-colors">
                        <div className={cn("absolute top-1 left-1 w-4 h-4 rounded-full transition-all", i < 2 ? "bg-primary left-7 shadow-[0_0_8px_#22d3ee]" : "bg-text-muted")} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-surface border border-outline p-6 rounded-2xl">
                <div className="space-y-1">
                  <h3 className="text-lg uppercase tracking-widest border-l-4 border-primary pl-4">AI-Stemmestyring</h3>
                  <p className="text-xs text-text-muted mono uppercase pl-5">Administrer nevrale og klonede stemmer</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleSyncVoices}
                    disabled={syncing}
                    className="flex items-center gap-2 px-6 py-2 bg-surface border border-outline hover:border-primary text-primary rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={cn(syncing && "animate-spin")} />
                    {syncing ? "Synkroniserer..." : "Synkroniser"}
                  </button>
                  <button 
                    onClick={() => setIsAddingVoice(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-background rounded-xl font-bold text-[10px] uppercase tracking-widest hover:neon-glow transition-all"
                  >
                    <Plus size={14} />
                    Legg til Stemme
                  </button>
                </div>
              </div>

              {isAddingVoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-surface border border-outline w-full max-w-md rounded-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
                    <div>
                      <h3 className="text-xl uppercase tracking-widest font-bold">Legg til ny stemme</h3>
                      <p className="text-xs text-text-muted mt-1 uppercase mono">Konfigurer stemmeparametere</p>
                    </div>

                    <form onSubmit={handleAddVoice} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase mono text-text-muted">Navn</label>
                        <input 
                          type="text" 
                          required
                          value={newVoice.name}
                          onChange={e => setNewVoice({...newVoice, name: e.target.value})}
                          placeholder="f.eks. Neural Siri" 
                          className="w-full bg-surface-dark border border-outline px-4 py-3 rounded-xl text-sm focus:border-primary outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase mono text-text-muted">Type</label>
                          <select 
                            value={newVoice.type}
                            onChange={e => setNewVoice({...newVoice, type: e.target.value})}
                            className="w-full bg-surface-dark border border-outline px-4 py-3 rounded-xl text-sm focus:border-primary outline-none transition-all appearance-none"
                          >
                            <option value="neural">Neural</option>
                            <option value="cloned">Klonet</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase mono text-text-muted">Kjønn</label>
                          <select 
                            value={newVoice.gender}
                            onChange={e => setNewVoice({...newVoice, gender: e.target.value})}
                            className="w-full bg-surface-dark border border-outline px-4 py-3 rounded-xl text-sm focus:border-primary outline-none transition-all appearance-none"
                          >
                            <option value="female">Kvinne</option>
                            <option value="male">Mann</option>
                            <option value="neutral">Nøytral</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase mono text-text-muted">Språk</label>
                          <select 
                            value={newVoice.language}
                            onChange={e => setNewVoice({...newVoice, language: e.target.value})}
                            className="w-full bg-surface-dark border border-outline px-4 py-3 rounded-xl text-sm focus:border-primary outline-none transition-all appearance-none"
                          >
                            <option value="nb-NO">Norsk (Bokmål)</option>
                            <option value="en-US">Engelsk (US)</option>
                            <option value="en-GB">Engelsk (UK)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase mono text-text-muted">Tilbyder</label>
                          <input 
                            type="text" 
                            value={newVoice.provider}
                            onChange={e => setNewVoice({...newVoice, provider: e.target.value})}
                            placeholder="f.eks. ElevenLabs" 
                            className="w-full bg-surface-dark border border-outline px-4 py-3 rounded-xl text-sm focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={() => setIsAddingVoice(false)}
                          className="flex-1 py-3 border border-outline rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                          Avbryt
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-3 bg-primary text-background rounded-xl text-sm font-bold uppercase tracking-widest hover:neon-glow transition-all"
                        >
                          Lagre Stemme
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loadingVoices ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                    <RefreshCw size={32} className="text-primary animate-spin" />
                    <p className="mono text-[10px] uppercase tracking-widest text-text-muted">Henter stemmer fra Supabase...</p>
                  </div>
                ) : voices.length === 0 ? (
                  <div className="col-span-full py-20 bg-surface border border-dashed border-outline rounded-2xl flex flex-col items-center justify-center text-center">
                    <Mic size={40} className="text-text-muted mb-4 opacity-20" />
                    <p className="mono text-[10px] uppercase tracking-widest text-text-muted mb-1">Ingen tilpassede stemmer funnet</p>
                    <p className="text-[10px] text-text-muted/60 uppercase">Klikk på 'Legg til Stemme' for å starte</p>
                  </div>
                ) : (
                  voices.map(voice => (
                    <div key={voice.id} className="p-6 bg-surface rounded-xl border border-outline group hover:border-primary transition-all relative overflow-hidden">
                       <div className="flex justify-between items-start mb-6">
                         <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                           <Mic size={20} />
                         </div>
                         <div className="flex gap-2">
                           <span className={cn(
                             "mono text-[8px] border px-2 py-0.5 rounded uppercase font-black tracking-widest",
                             voice.type === 'cloned' || voice.type === 'klonet' 
                               ? "bg-secondary/10 text-secondary border-secondary/30" 
                               : "bg-emerald-400/10 text-emerald-400 border-emerald-400/30"
                           )}>
                             {voice.type || 'NEURAL'}
                           </span>
                           <button 
                             onClick={() => handleDeleteVoice(voice.id)}
                             className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                           >
                             <Trash2 size={14} />
                           </button>
                         </div>
                       </div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{voice.voice_name || voice.name}</h4>
                        <div className="flex items-center gap-3">
                         <p className="mono text-[9px] text-text-muted uppercase tracking-[0.2em]">{voice.provider || 'AI Production'}</p>
                         <span className="w-1 h-1 bg-outline rounded-full opacity-30" />
                         <p className="mono text-[9px] text-text-muted uppercase tracking-[0.1em]">{voice.language || 'nb-NO'}</p>
                       </div>
                       <button className="mt-8 flex items-center justify-center gap-2 w-full py-2 border border-outline hover:border-primary rounded text-[10px] mono uppercase tracking-widest transition-all">
                         <Play size={12} className="text-primary" /> Test Stemme
                       </button>
                    </div>
                  ))
                )}
              </div>

              {!loadingVoices && voices.length > 0 && (
                <button 
                  onClick={() => setIsAddingVoice(true)}
                  className="w-full p-6 border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 hover:border-primary transition-all cursor-pointer group"
                >
                   <Plus size={32} className="text-text-muted group-hover:text-primary mb-4 transition-colors" />
                   <p className="mono text-[10px] uppercase tracking-widest font-black group-hover:text-primary transition-colors">Klon Ny Stemme</p>
                   <p className="text-[9px] text-text-muted mt-2">Last opp 60sek lydklipp eller koble til ElevenLabs API</p>
                </button>
              )}
            </div>
          )}

          {activeTab === 'api' && (
            <div className="glass p-8 rounded-2xl border border-white/5 space-y-8">
               <h3 className="text-lg uppercase tracking-widest border-l-4 border-primary pl-4 mb-8">API Konfigurasjon</h3>
               <div className="space-y-6">
                 {[
                   { name: 'OpenAI GPT-4o', key: 'sk-proj-••••••••••••••••••••••••••••••', status: 'Connected' },
                   { name: 'ElevenLabs Voice', key: 'el-key-••••••••••••••••••••••••••••••', status: 'Connected' },
                   { name: 'n8n Webhook Receptor', key: 'https://n8n.videomill.io/render/v2/h72...', status: 'Active' },
                 ].map(api => (
                   <div key={api.name} className="p-5 bg-surface/50 border border-outline rounded-xl flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-text-muted">
                          <Key size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{api.name}</p>
                          <p className="mono text-[9px] text-text-muted mt-1">{api.key}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <span className={cn(
                         "mono text-[8px] uppercase font-black px-2 py-0.5 rounded border",
                         api.status === 'Connected' || api.status === 'Active' ? "text-emerald-400 border-emerald-400/30" : "text-yellow-400 border-yellow-400/30"
                       )}>{api.status}</span>
                       <button className="text-text-muted hover:text-primary transition-colors"><SettingsIcon size={16} /></button>
                     </div>
                   </div>
                 ))}
                 <button className="w-full py-4 border-2 border-dashed border-outline rounded-xl flex items-center justify-center gap-3 mono text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:border-primary hover:text-primary transition-all">
                   <Plus size={18} /> Legg til ny integrasjon
                 </button>
               </div>
            </div>
          )}

          {activeTab === 'platforms' && (
            <div className="glass p-8 rounded-2xl border border-white/5 space-y-8">
               <div className="flex justify-between items-end mb-8">
                 <div className="space-y-1">
                   <h3 className="text-2xl font-black uppercase tracking-tight">Plattform-tilkoblinger</h3>
                   <p className="text-xs text-text-muted mono uppercase">Status og autorisasjon for publisering</p>
                 </div>
                 <button 
                  onClick={handleTestAllPlatforms}
                  disabled={testingAll}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
                 >
                   <RefreshCw size={12} className={cn(testingAll && "animate-spin")} /> 
                   {testingAll ? "Tester..." : "Test Alle Tilkoblinger"}
                 </button>
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {platforms.map((platform, index) => (
                    <div key={platform.name} className="p-6 bg-surface/50 border border-outline rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all font-display">
                      <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <platform.icon size={100} style={{ color: platform.color }} />
                      </div>
                      <div className="flex items-start justify-between mb-6">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-outline shadow-inner group-hover:border-primary/20 transition-colors" style={{ color: platform.color }}>
                             <platform.icon size={24} />
                           </div>
                           <div>
                             <h4 className="font-black text-sm uppercase tracking-tight">{platform.name}</h4>
                             <p className="text-[9px] mono text-text-muted uppercase tracking-widest">{platform.accounts} Aktive Kanaler</p>
                           </div>
                         </div>
                         <div className="flex flex-col items-end gap-1.5">
                           <div className={cn(
                             "px-2.5 py-1 rounded-full text-[8px] mono font-bold uppercase border flex items-center gap-1.5 shadow-sm transition-all",
                             platform.status === 'connected' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                             platform.status === 'degraded' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                             "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                           )}>
                             <div className={cn(
                               "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                               platform.status === 'connected' ? "bg-emerald-400 animate-pulse" :
                               platform.status === 'degraded' ? "bg-yellow-400" : "bg-red-500 animate-ping"
                             )} />
                             {platform.status === 'connected' ? 'Connected' : platform.status === 'degraded' ? 'Degraded' : 'Error'}
                           </div>
                           <p className={cn(
                             "text-[8px] mono uppercase tracking-tight opacity-70",
                             platform.status === 'connected' ? "text-emerald-500/80" :
                             platform.status === 'degraded' ? "text-yellow-500/80" : "text-red-500/80"
                           )}>
                             {platform.statusMessage}
                           </p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="p-3 bg-background/50 rounded-lg border border-outline/30">
                           <p className="text-[8px] mono text-text-muted uppercase mb-1">Siste Sync</p>
                           <p className="text-[10px] font-bold">{platform.lastSync}</p>
                         </div>
                         <div className="p-3 bg-background/50 rounded-lg border border-outline/30">
                           <p className="text-[8px] mono text-text-muted uppercase mb-1">Token Status</p>
                           <p className={cn(
                             "text-[10px] font-bold",
                             platform.tokenStatus === 'Expired' ? "text-red-500" : "text-emerald-500"
                           )}>{platform.tokenStatus}</p>
                         </div>
                      </div>
 
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          className="flex-1 py-2 bg-background border border-outline hover:border-primary/50 rounded text-[9px] mono uppercase tracking-widest transition-all"
                        >
                           Innstillinger
                        </button>
                        <button 
                          type="button"
                          disabled={platform.isTesting}
                          onClick={() => {
                            console.log('Action triggered for', platform.name);
                            if (platform.status === 'error') handleReAuth(index);
                            else handleTestPlatform(index);
                          }}
                          className={cn(
                            "px-4 py-2 rounded text-[9px] mono uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            platform.status === 'error' ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20",
                            platform.isTesting && "opacity-50"
                          )}
                        >
                           {platform.isTesting ? (
                             <RefreshCw size={12} className="animate-spin" />
                           ) : platform.status === 'error' ? 'Re-Auth' : 'Test'}
                        </button>
                      </div>
                    </div>
                 ))}
               </div>
 
               <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Shield size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Sikkerhet & Autorisasjon</h4>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Alle tilkoblinger bruker OAuth 2.0. Vi lagrer kun access_tokens kryptert i Supabase. 
                    Refresh-tokens blir automatisk rotert av Viranode-motoren hver 24. time for å sikre uavbrutt publisering.
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'nodes' && (
            <div className="glass p-8 rounded-2xl border border-white/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap size={150} className="text-primary" />
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Viranode Cluster</h3>
                  <p className="text-[10px] text-primary mono uppercase tracking-widest animate-pulse">[ GLOBAL NODE NETWORK ACTIVE ]</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-widest">Alle Noder OK</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Oppetid', value: '99.98%', desc: 'Siste 30 dager' },
                  { label: 'Gj.snitt Latens', value: '42ms', desc: 'Sør-Norge Cluster' },
                  { label: 'Gj.snitt RAM Bruk', value: '14.2GB', desc: 'Per GPU Node' }
                ].map(stat => (
                  <div key={stat.label} className="p-5 bg-background/50 border border-outline rounded-xl">
                    <p className="text-[9px] mono text-text-muted uppercase mb-1 tracking-widest">{stat.label}</p>
                    <p className="text-xl font-bold text-text">{stat.value}</p>
                    <p className="text-[8px] mono text-primary mt-1 opacity-60 uppercase">{stat.desc}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-primary/10">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Terminal size={14} className="text-primary" /> Aktive Produksjonsnoder
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'NODE-01', location: 'Oslo, NO', load: '12%', status: 'online' },
                    { id: 'NODE-02', location: 'Stavanger, NO', load: '45%', status: 'online' },
                    { id: 'NODE-03', location: 'Trondheim, NO', load: '0%', status: 'standby' },
                    { id: 'NODE-GPU-GROQ', location: 'Cloud-Hybrid', load: '8%', status: 'online' }
                  ].map(node => (
                    <div key={node.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-outline/30 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          node.status === 'online' ? "bg-emerald-500 animate-pulse" : "bg-primary/50"
                        )} />
                        <div>
                          <p className="text-xs font-bold group-hover:text-primary transition-colors">{node.id}</p>
                          <p className="text-[9px] mono text-text-muted uppercase">{node.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold font-mono">{node.load}</p>
                        <p className="text-[9px] mono text-text-muted uppercase">Belastning</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass p-8 rounded-2xl border border-white/5 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Kunde-fakturering</h3>
                  <p className="text-xs text-text-muted mono uppercase">Administrer betalingsflyt og planer</p>
                </div>
                <button className="bg-primary text-background px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:neon-glow transition-all">
                  Koble til Stripe
                </button>
              </div>

              <div className="p-6 bg-surface border border-primary/20 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h4 className="font-bold text-lg mb-1">PRO PLAN - Early Access</h4>
                    <p className="text-xs text-text-muted">Gratis video-generering aktivert (Beta)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">0 NOK <span className="text-[10px] text-text-muted">/ mnd</span></p>
                    <p className="text-[9px] mono uppercase text-primary animate-pulse">Alpha-bonus</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest border-l-2 border-primary pl-3">Siste Transaksjoner (Kunder)</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-outline/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <CreditCard size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">Ordre #VK-202{i}</p>
                          <p className="text-[9px] mono text-text-muted uppercase">Betalt av Kunde_{i}@email.com</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold">149 NOK</p>
                        <p className="text-[9px] mono text-emerald-500 uppercase">Gjennomført</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-12">
            <button className="px-8 py-3 rounded-lg border border-outline hover:border-text-muted text-text-muted hover:text-white transition-all font-display uppercase tracking-widest text-xs">
              Forkast Endringer
            </button>
            <button 
              id="global-save-btn"
              onClick={() => {
                const btn = document.getElementById('global-save-btn');
                if (btn) {
                  const original = btn.innerText;
                  btn.innerText = 'PARAMETRE LAGRET!';
                  btn.classList.add('bg-emerald-500');
                  setTimeout(() => {
                    btn.innerText = original;
                    btn.classList.remove('bg-emerald-500');
                  }, 2000);
                }
              }}
              className="px-12 py-3 bg-primary text-background font-bold rounded-lg neon-glow transition-all active:scale-95 font-display uppercase tracking-widest text-xs"
            >
              Lagre Alle Parametere
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
