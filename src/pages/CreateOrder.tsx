import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Settings2, 
  Video, 
  Type, 
  Music, 
  Target, 
  Zap,
  Info,
  ChevronRight,
  FileText,
  CheckCheck,
  Plus,
  Trash2,
  Check,
  Globe,
  Users,
  Mic,
  Volume2,
  Share2,
  Layers,
  Search,
  Youtube,
  Instagram,
  Facebook
} from 'lucide-react';
import { cn } from '../lib/utils';
import { VoiceSelector } from '../components/VoiceSelector';

const TOP_TOPICS = [
  { id: 't1', title: 'AI Automation Agency', platform: 'tiktok', language: 'English', targetAudience: 'Entrepreneurs', description: 'Deep dive into how to build an AI automation agency in 2026.' },
  { id: 't2', title: 'Kvantefysikk for Nybegynnere', platform: 'shorts', language: 'Norsk', targetAudience: 'Students', description: 'En enkel forklaring på kvantefysikkens mysterier.' },
  { id: 't3', title: 'Top 5 Tech Gadgets', platform: 'reels', language: 'English', targetAudience: 'Techies', description: 'Reviewing the coolest tech gadgets under $50.' },
  { id: 't4', title: 'Hvordan bli Rik på TikTok', platform: 'tiktok', language: 'Norsk', targetAudience: 'Content Creators', description: 'Strategier for å vokse raskt og tjene penger på TikTok.' },
  { id: 't5', title: 'Minimalist Lifestyle', platform: 'shorts', language: 'English', targetAudience: 'Productivity seekers', description: 'Why owning less will lead to a better life.' },
];

const COUNTRIES = [
  'Norge', 'USA', 'UK', 'Tyskland', 'Frankrike', 'Sverige', 'Danmark', 'Finland', 'Spania', 'Italia', 'Japan', 'Kina', 'Brasil', 'India'
];

const LANGUAGES = [
  'Norsk', 'English', 'German', 'French', 'Swedish', 'Danish', 'Finnish', 'Spanish', 'Italian', 'Japanese', 'Chinese', 'Portuguese'
];

const AUDIENCES = [
  'General', 'Tech Enthusiasts', 'Entrepreneurs', 'Students', 'Gen Z', 'Millennials', 'Families', 'Content Creators', 'Gamers', 'Business Professionals', 'Productivity seekers'
];

const MOCK_CHANNELS = [
  { id: 'c1', platform: 'tiktok', name: '@videomill_main', subscribers: '125K', status: 'connected' },
  { id: 'c2', platform: 'tiktok', name: '@videomill_shorts', subscribers: '12K', status: 'connected' },
  { id: 'c3', platform: 'youtube', name: 'VideoMill AI', subscribers: '450K', status: 'connected' },
  { id: 'c4', platform: 'youtube', name: 'TechLabs Beta', subscribers: '5K', status: 'disconnected' },
  { id: 'c5', platform: 'instagram', name: 'videomill.official', subscribers: '89K', status: 'connected' },
  { id: 'c6', platform: 'instagram', name: 'tech.vid.mill', subscribers: '34K', status: 'connected' },
  { id: 'c7', platform: 'facebook', name: 'VideoMill Community', subscribers: '250K', status: 'connected' },
];

import { supabase } from '../lib/supabase';

export const CreateOrder = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [productionMode, setProductionMode] = useState<'single' | 'series'>('single');
  const [seriesConfig, setSeriesConfig] = useState({
    seasons: 1,
    episodes: 5
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'tiktok',
    format: '9:16',
    language: 'Norsk',
    country: 'Norge',
    targetAudience: 'General',
    voices: [{ id: '1', name: 'Neural Adam', type: 'standard', label: 'Hovedstemme' }],
    quality: '4k',
    engine: 'llama-3.3-70b',
    music_mood: 'Viral/Upbeat',
    caption_style: 'Animated/Viral',
    transition_style: 'Cinematic Zoom',
    enableCloning: false,
    cloningSettings: {
      tone: 50,
      tempo: 50,
      quality: 'high'
    },
    selectedChannels: [] as string[]
  });

  const [channelSearch, setChannelSearch] = useState('');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [userChannels, setUserChannels] = useState(MOCK_CHANNELS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const toggleChannel = (channelId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedChannels: prev.selectedChannels.includes(channelId)
        ? prev.selectedChannels.filter(id => id !== channelId)
        : [...prev.selectedChannels, channelId]
    }));
  };

  const connectNewChannel = (platform: string) => {
    const newId = `c${userChannels.length + 1}`;
    const newChannel = {
      id: newId,
      platform,
      name: `@new_${platform}_account`,
      subscribers: '0'
    };
    setUserChannels([...userChannels, newChannel]);
    setIsConnectModalOpen(false);
  };

  const handlePlatformChange = (platform: string) => {
    let newFormat = formData.format;
    if (['tiktok', 'shorts', 'reels'].includes(platform)) {
      newFormat = '9:16';
    } else if (platform === 'landscape' || platform === 'youtube') {
      newFormat = '16:9';
    }
    setFormData(prev => ({ ...prev, platform, format: newFormat }));
  };

  const selectTopic = (topic: typeof TOP_TOPICS[0]) => {
    let newFormat = formData.format;
    if (['tiktok', 'shorts', 'reels'].includes(topic.platform)) {
      newFormat = '9:16';
    } else if (topic.platform === 'youtube' || topic.platform === 'landscape') {
      newFormat = '16:9';
    }

    setFormData(prev => ({
      ...prev,
      title: topic.title,
      platform: topic.platform,
      format: newFormat,
      language: topic.language,
      targetAudience: topic.targetAudience,
      description: topic.description
    }));
  };

  useEffect(() => {
    if (location.state) {
      const p = location.state.platform?.toLowerCase() || formData.platform;
      let f = location.state.format || formData.format;
      
      // Sync format if not explicitly provided in state but platform is
      if (!location.state.format && location.state.platform) {
        if (['tiktok', 'shorts', 'reels'].includes(p)) f = '9:16';
        if (p === 'landscape' || p === 'youtube') f = '16:9';
      }

      setFormData(prev => ({
        ...prev,
        title: location.state.trendTitle || prev.title,
        description: location.state.category ? `Fokusområde: ${location.state.category}\n` : prev.description,
        language: location.state.language || prev.language,
        country: location.state.country || prev.country,
        targetAudience: location.state.target_audience || prev.targetAudience,
        platform: p,
        format: f,
        music_mood: location.state.music_mood || prev.music_mood,
        caption_style: location.state.caption_style || prev.caption_style,
        transition_style: location.state.transition_style || prev.transition_style
      }));
    }
  }, [location.state]);

  const addVoice = () => {
    if (formData.voices.length < 5) {
      setFormData(prev => ({
        ...prev,
        voices: [...prev.voices, { 
          id: Date.now().toString(), 
          name: 'Neural Pernille', 
          type: 'standard',
          label: `Stemme ${prev.voices.length + 1}`
        }]
      }));
    }
  };

  const removeVoice = (id: string) => {
    if (formData.voices.length > 1) {
      setFormData(prev => ({
        ...prev,
        voices: prev.voices.filter(v => v.id !== id)
      }));
    }
  };

  const updateVoice = (id: string, updates: Partial<typeof formData.voices[0]>) => {
    setFormData(prev => ({
      ...prev,
      voices: prev.voices.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title.trim() || !formData.description.trim())) return;
    setStep(s => Math.min(s + 1, 3));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isFormValid = 
    formData.title.trim() !== '' && 
    formData.description.trim() !== '' && 
    formData.selectedChannels.length > 0 &&
    formData.voices.length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    const videoId = `v-${Date.now()}`;
    const productionDataPayload = {
      id: videoId,
      title: formData.title || 'Generell Trend',
      status: 'processing',
      progress: 0,
      duration: 'Pending',
      created_at: new Date().toISOString()
    };

    try {
      // 1. Save to Supabase
      const { error: dbError } = await supabase
        .from('productions')
        .insert([productionDataPayload]);

      if (dbError) throw dbError;

      // 2. Trigger n8n via our backend
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productionDataPayload,
          video_id: videoId,
          platform: formData.platform,
          format: formData.format,
          music_mood: formData.music_mood,
          caption_style: formData.caption_style,
          transition_style: formData.transition_style,
          voices: formData.voices.map(v => ({ name: v.name, label: v.label })),
          ai_voice: formData.voices[0]?.name || 'nb-NO-PernilleNeural', // Fallback for legacy systems
          production_mode: productionMode,
          series_config: productionMode === 'series' ? seriesConfig : null,
          channels: formData.selectedChannels,
        }),
      });

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Videoen din er nå i produksjon! Supabase har lagret ordren og n8n er varslet.' 
        });
      } else {
        throw new Error('Kunne ikke kontakte backend/n8n');
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitStatus({ 
        type: 'error', 
        message: `Det oppstod en feil: ${err.message || 'Ukjent feil'}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-700">
      <div className="text-center mb-16">
        <h1 className="text-5xl uppercase tracking-tighter mb-4">{t('createOrder.title')}</h1>
        <p className="text-text-muted font-mono text-base tracking-widest uppercase">{t('createOrder.subtitle')}</p>
      </div>

      {/* Progress Stepper */}
      <div className="relative mb-16">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline -translate-y-1/2" />
        <div className="relative flex justify-between">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 z-10 text-base",
                step === i ? "bg-primary border-primary text-background shadow-[0_0_15px_#22d3ee]" : 
                step > i ? "bg-surface border-primary text-primary" : "bg-surface border-outline text-text-muted"
              )}>
                {step > i ? <Zap size={20} fill="currentColor" /> : i}
              </div>
              <span className={cn(
                "absolute -bottom-8 mono text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap",
                step === i ? "text-primary font-bold" : "text-text-muted"
              )}>
                {i === 1 ? t('createOrder.steps.concept') : i === 2 ? t('createOrder.steps.creative') : t('createOrder.steps.review')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-10 rounded-2xl border border-white/5 relative overflow-hidden min-h-[600px] flex flex-col">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="flex-1">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              {/* Production Mode Toggle */}
              <div className="flex gap-4 p-1.5 bg-background border border-outline rounded-xl w-fit mb-10">
                <button
                  onClick={() => setProductionMode('single')}
                  className={cn(
                    "px-8 py-3 rounded-lg text-xs mono uppercase tracking-widest font-bold transition-all",
                    productionMode === 'single' ? "bg-primary text-background shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-text-muted hover:text-text"
                  )}
                >
                  {t('createOrder.productionType.single')}
                </button>
                <button
                  onClick={() => setProductionMode('series')}
                  className={cn(
                    "px-8 py-3 rounded-lg text-xs mono uppercase tracking-widest font-bold transition-all",
                    productionMode === 'series' ? "bg-primary text-background shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-text-muted hover:text-text"
                  )}
                >
                  {t('createOrder.productionType.series')}
                </button>
              </div>

              {productionMode === 'series' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl mb-8"
                >
                  <div className="space-y-2">
                    <label className="mono text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Layers size={12} className="text-primary" /> {t('createOrder.productionType.seasons')}
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="10"
                      className="w-full bg-surface border border-outline focus:border-primary px-4 py-3 rounded-lg outline-none transition-all text-xs"
                      value={seriesConfig.seasons}
                      onChange={e => setSeriesConfig({...seriesConfig, seasons: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="mono text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Video size={12} className="text-primary" /> {t('createOrder.productionType.episodes')}
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="30"
                      className="w-full bg-surface border border-outline focus:border-primary px-4 py-3 rounded-lg outline-none transition-all text-xs"
                      value={seriesConfig.episodes}
                      onChange={e => setSeriesConfig({...seriesConfig, episodes: parseInt(e.target.value) || 5})}
                    />
                  </div>
                </motion.div>
              )}

              {/* Topics Selection */}
              <div className="space-y-4 mb-10">
                <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-primary animate-pulse" /> {t('createOrder.topics.title')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {TOP_TOPICS.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(topic)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all group",
                        formData.title === topic.title ? "bg-primary/10 border-primary" : "bg-surface border-outline hover:border-primary/50"
                      )}
                    >
                      <p className="text-[12px] font-bold truncate group-hover:text-primary transition-colors">{topic.title}</p>
                      <p className="text-[10px] mono text-text-muted mt-1 uppercase tracking-tighter">{topic.language}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => setFormData({ ...formData, title: '', description: '' })}
                    className="p-4 rounded-xl border border-dashed border-outline bg-transparent hover:bg-white/5 transition-all text-center flex flex-col items-center justify-center gap-1"
                  >
                    <p className="text-[12px] font-bold text-text-muted">{t('createOrder.topics.custom')}</p>
                    <p className="text-[10px] mono text-text-muted/60 uppercase tracking-tighter">{t('createOrder.topics.customDesc')}</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-3">
                    <Type size={14} className="text-primary" /> {t('createOrder.fields.title')}
                  </label>
                  <input 
                    type="text" 
                    placeholder={t('createOrder.fields.titlePlaceholder')} 
                    className="w-full bg-surface border border-outline focus:border-primary px-5 py-4 rounded-xl outline-none transition-all placeholder:text-text-muted/30 text-base"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-3">
                      <Target size={14} className="text-primary" /> {t('createOrder.fields.platform')}
                    </label>
                    <select 
                      className="w-full bg-surface border border-outline focus:border-primary px-5 py-4 rounded-xl outline-none transition-all text-base"
                      value={formData.platform}
                      onChange={e => handlePlatformChange(e.target.value)}
                    >
                      <option value="tiktok">TikTok</option>
                      <option value="shorts">YouTube Shorts</option>
                      <option value="reels">Instagram Reels</option>
                      <option value="youtube">YouTube (Long-form)</option>
                      <option value="landscape">Full HD Landscape</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-3">
                      <Video size={14} className="text-primary" /> {t('createOrder.fields.format')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { id: '9:16', label: t('createOrder.fields.formats.v916'), icon: 'aspect-[9/16] w-5' },
                        { id: '16:9', label: t('createOrder.fields.formats.v169'), icon: 'aspect-[16/9] w-10' },
                        { id: '1:1', label: t('createOrder.fields.formats.v11'), icon: 'aspect-square w-8' },
                        { id: '4:5', label: t('createOrder.fields.formats.v45'), icon: 'aspect-[4/5] w-6' }
                      ].map(format => (
                        <button
                          key={format.id}
                          type="button"
                          onClick={() => setFormData({...formData, format: format.id})}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 group relative overflow-hidden h-28",
                            formData.format === format.id 
                              ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                              : "bg-surface border-outline hover:border-primary/30"
                          )}
                        >
                          <div className={cn(
                            "border flex items-center justify-center overflow-hidden bg-background transition-colors p-1.5",
                            formData.format === format.id ? "border-primary" : "border-text-muted group-hover:border-primary/50"
                          )}>
                             <div className={cn("bg-primary/30", format.icon)} />
                          </div>
                          <span className={cn(
                            "text-[10px] mono uppercase tracking-tighter text-center line-clamp-1",
                            formData.format === format.id ? "text-primary font-bold" : "text-text-muted"
                          )}>{format.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribution Channels */}
              <div className="space-y-6 p-8 bg-surface border border-outline rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Share2 size={100} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 mb-4">
                  <div className="space-y-1">
                    <label className="mono text-[12px] text-primary uppercase tracking-widest flex items-center gap-3">
                      <Share2 size={16} /> {t('createOrder.fields.distribution')}
                    </label>
                    <p className="text-[12px] text-text-muted">{formData.selectedChannels.length} {t('createOrder.fields.channels')} valgt</p>
                  </div>
                  
                  <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text" 
                      placeholder="Søk i dine kanaler..." 
                      className="w-full bg-background/50 border border-outline focus:border-primary/50 pl-11 pr-4 py-3 rounded-xl outline-none text-sm transition-all"
                      value={channelSearch}
                      onChange={(e) => setChannelSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-8 relative z-10">
                  {[
                    { key: 'tiktok', label: 'TikTok', icon: Music },
                    { key: 'youtube', label: 'YouTube', icon: Youtube },
                    { key: 'instagram', label: 'Instagram', icon: Instagram },
                    { key: 'facebook', label: 'Facebook', icon: Facebook }
                  ].map(platform => {
                    const platformChannels = userChannels.filter(c => 
                      c.platform === platform.key && 
                      c.name.toLowerCase().includes(channelSearch.toLowerCase())
                    );
                    
                    if (platformChannels.length === 0 && !channelSearch) return null;
                    if (platformChannels.length === 0 && channelSearch) return null; // Or show empty state for this platform
                    
                    const allSelected = platformChannels.length > 0 && platformChannels.every(c => formData.selectedChannels.includes(c.id));
                    const selectedCount = platformChannels.filter(c => formData.selectedChannels.includes(c.id)).length;
                    
                    const PlatformIcon = platform.icon;

                    return (
                      <div key={platform.key} className="space-y-3">
                        <div className="flex items-center justify-between mb-1">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary border border-outline">
                                <PlatformIcon size={18} />
                              </div>
                              <div>
                                <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-text">{platform.label}</span>
                                {selectedCount > 0 && (
                                  <span className="text-[10px] mono text-primary ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{selectedCount} {t('createOrder.fields.channels')}</span>
                                )}
                              </div>
                           </div>
                           <button 
                             onClick={() => {
                               if (allSelected) {
                                 setFormData(prev => ({
                                   ...prev,
                                   selectedChannels: prev.selectedChannels.filter(id => !platformChannels.map(pc => pc.id).includes(id))
                                 }));
                               } else {
                                 setFormData(prev => ({
                                   ...prev,
                                   selectedChannels: Array.from(new Set([...prev.selectedChannels, ...platformChannels.map(pc => pc.id)]))
                                 }));
                               }
                             }}
                             className="text-[10px] mono text-primary uppercase tracking-widest hover:underline"
                           >
                             {allSelected ? 'Fjern alle' : 'Velg alle'}
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {platformChannels.map(channel => (
                            <button
                              key={channel.id}
                              onClick={() => toggleChannel(channel.id)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all text-left group/btn relative overflow-hidden",
                                formData.selectedChannels.includes(channel.id) 
                                  ? "bg-primary/5 border-primary/50 shadow-[0_0_20px_rgba(34,211,238,0.05)]" 
                                  : "bg-background/20 border-outline hover:border-primary/30"
                              )}
                            >
                              {formData.selectedChannels.includes(channel.id) && (
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/30" />
                              )}
                              <div className="flex items-center gap-4 relative z-10">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                                  formData.selectedChannels.includes(channel.id) ? "bg-primary text-background border-primary" : "bg-surface border-outline group-hover/btn:border-primary/30"
                                )}>
                                  <Users size={18} />
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-3">
                                    <span className={cn(
                                      "text-[12px] font-bold transition-colors",
                                      formData.selectedChannels.includes(channel.id) ? "text-primary" : "text-text"
                                    )}>{channel.name}</span>
                                    <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      channel.status === 'connected' ? "bg-emerald-500 shadow-[0_0_5px_#10b981]" : "bg-red-500 animate-pulse"
                                    )} />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] mono text-text-muted uppercase tracking-tighter opacity-70">{channel.subscribers} followers</span>
                                    <span className={cn(
                                      "text-[9px] mono uppercase px-1.5 rounded-sm border",
                                      channel.status === 'connected' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : "text-red-500 border-red-500/20 bg-red-500/5"
                                    )}>
                                      {channel.status === 'connected' ? 'Active' : 'Error'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className={cn(
                                "w-6 h-6 rounded border flex items-center justify-center transition-all relative z-10",
                                formData.selectedChannels.includes(channel.id) 
                                  ? "bg-primary border-primary" 
                                  : "border-outline group-hover/btn:border-primary/50"
                              )}>
                                {formData.selectedChannels.includes(channel.id) && <Check size={14} className="text-background" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {userChannels.filter(c => c.name.toLowerCase().includes(channelSearch.toLowerCase())).length === 0 && (
                    <div className="py-8 text-center bg-background/20 rounded-xl border border-dashed border-outline">
                       <p className="text-[10px] mono text-text-muted uppercase tracking-widest">Ingen kanaler samsvarer med søket ditt</p>
                    </div>
                  )}

                  <button 
                    onClick={() => setIsConnectModalOpen(true)}
                    className="w-full py-6 border border-dashed border-outline rounded-xl flex items-center justify-center gap-4 group hover:bg-primary/5 hover:border-primary/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface border border-outline flex items-center justify-center text-text-muted group-hover:text-primary group-hover:border-primary/30 transition-all">
                      <Plus size={18} />
                    </div>
                    <span className="text-[12px] mono text-text-muted uppercase tracking-widest group-hover:text-primary transition-colors">Koble til ny kanal eller plattform</span>
                  </button>
                </div>
              </div>

              {/* Connect Channel Modal */}
              <AnimatePresence>
                {isConnectModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsConnectModalOpen(false)}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="relative w-full max-w-md bg-[#1a1c1e] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary/50" />
                      
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-lg font-bold">Koble til Plattform</h3>
                          <p className="text-xs text-text-muted mono uppercase tracking-tight">Velg sosiale medier-tjeneste</p>
                        </div>
                        <button 
                          onClick={() => setIsConnectModalOpen(false)}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <span className="text-xs">✕</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {[
                          { id: 'tiktok', name: 'TikTok Business', icon: Music, color: '#00F2EA' },
                          { id: 'youtube', name: 'YouTube Shorts', icon: Youtube, color: '#FF0000' },
                          { id: 'instagram', name: 'Instagram Reels', icon: Instagram, color: '#E4405F' }
                        ].map(p => (
                          <button
                            key={p.id}
                            onClick={() => connectNewChannel(p.id)}
                            className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-outline hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-background border border-outline group-hover:border-primary/30">
                                <p.icon size={20} style={{ color: p.color }} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold">{p.name}</p>
                                <p className="text-[10px] mono text-text-muted uppercase tracking-tighter">Klikk for å starte integrasjon</p>
                              </div>
                            </div>
                            <Plus size={16} className="text-text-muted group-hover:text-primary" />
                          </button>
                        ))}
                      </div>

                      <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                         <p className="text-[9px] mono text-text-muted leading-relaxed">
                           Vi bruker offisielle API-er for sikker tilkobling. Dine påloggingsdetaljer lagres aldri hos oss.
                         </p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} className="text-primary" /> {t('createOrder.fields.country')}
                  </label>
                  <select 
                    className="w-full bg-surface border border-outline focus:border-primary px-5 py-4 rounded-xl outline-none transition-all text-base"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} className="text-primary" /> {t('createOrder.fields.language')}
                  </label>
                  <select 
                    className="w-full bg-surface border border-outline focus:border-primary px-5 py-4 rounded-xl outline-none transition-all text-base"
                    value={formData.language}
                    onChange={e => setFormData({...formData, language: e.target.value})}
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Users size={14} className="text-primary" /> {t('createOrder.fields.audience')}
                  </label>
                  <select 
                    className="w-full bg-surface border border-outline focus:border-primary px-5 py-4 rounded-xl outline-none transition-all text-base"
                    value={formData.targetAudience}
                    onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                  >
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <FileText size={14} className="text-primary" /> {t('createOrder.fields.description')}
                </label>
                <textarea 
                  rows={6}
                  placeholder={t('createOrder.fields.descriptionPlaceholder')} 
                  className="w-full bg-surface border border-outline focus:border-primary px-5 py-4 rounded-xl outline-none transition-all placeholder:text-text-muted/30 resize-none font-sans text-base leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="mono text-[12px] text-text-muted uppercase tracking-widest flex items-center gap-3">
                      <Mic size={14} className="text-secondary" /> {t('createOrder.fields.voices')}
                    </label>
                    <button 
                      onClick={addVoice}
                      className="text-[12px] mono text-primary hover:underline uppercase flex items-center gap-2"
                    >
                      <Plus size={12} /> {t('createOrder.fields.addVoice')}
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {formData.voices.map((voice, idx) => (
                      <div key={voice.id} className="p-5 bg-surface-dark border border-outline rounded-2xl space-y-5 relative group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-[12px] font-bold text-primary mono">
                              {idx + 1}
                            </div>
                            <span className="mono text-[12px] uppercase tracking-widest text-text-muted">Stemme-Konfigurasjon</span>
                          </div>
                          {formData.voices.length > 1 && (
                            <button 
                               onClick={() => removeVoice(voice.id)}
                               className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-[10px] mono uppercase tracking-widest text-text-muted ml-1">Navn / Rolle</label>
                            <input 
                              type="text"
                              value={voice.label}
                              onChange={(e) => updateVoice(voice.id, { label: e.target.value })}
                              placeholder="f.eks. Forteller"
                              className="w-full bg-surface border border-outline focus:border-primary px-4 py-3 rounded-xl text-sm outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] mono uppercase tracking-widest text-text-muted ml-1">Velg Stemmekarakter</label>
                             <VoiceSelector 
                               value={voice.name}
                               onChange={(name) => updateVoice(voice.id, { name })}
                               enableCloning={formData.enableCloning}
                             />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 pt-10 mt-10 border-t border-primary/10">
                    <label className="mono text-[12px] text-primary uppercase tracking-widest flex items-center gap-3">
                      <Zap size={16} className="animate-pulse" /> AI Script Engine [ Viranode ]
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, engine: 'llama-3.3-70b' })}
                        className={cn(
                          "p-6 rounded-2xl border text-left transition-all relative overflow-hidden group",
                          formData.engine === 'llama-3.3-70b' ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(34,211,238,0.1)]" : "bg-surface border-outline"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-black uppercase tracking-tight">Llama 3.3 70B</span>
                          <span className="text-[10px] mono text-primary px-2 py-1 bg-primary/20 rounded">GROQ</span>
                        </div>
                        <p className="text-[10px] text-text-muted mono uppercase">Viralitet & Hastighet</p>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, engine: 'gpt-4o' })}
                        className={cn(
                          "p-6 rounded-2xl border text-left transition-all relative overflow-hidden group",
                          formData.engine === 'gpt-4o' ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(34,211,238,0.1)]" : "bg-surface border-outline opacity-60"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-black uppercase tracking-tight">GPT-4o</span>
                          <span className="text-[10px] mono text-text-muted px-2 py-1 bg-white/5 rounded">OPENAI</span>
                        </div>
                        <p className="text-[10px] text-text-muted mono uppercase">Standard Kreativitet</p>
                      </button>
                    </div>
                  </div>

                  <div className={cn(
                    "p-6 rounded-2xl border transition-all duration-500",
                    formData.enableCloning ? "bg-primary/[0.03] border-primary/30 shadow-[0_0_40px_rgba(34,211,238,0.05)]" : "bg-primary/5 border-primary/10"
                  )}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          formData.enableCloning ? "bg-primary text-background" : "bg-surface border border-outline text-text-muted"
                        )}>
                          <Mic size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{t('createOrder.fields.cloning.title')}</p>
                          <p className="text-[10px] text-text-muted uppercase font-mono tracking-tighter">{t('createOrder.fields.cloning.enable')}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.enableCloning}
                          onChange={e => setFormData({...formData, enableCloning: e.target.checked})}
                        />
                        <div className="w-10 h-5 bg-background border border-outline peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted peer-checked:after:bg-primary after:border-gray-300 after:border after:rounded-full after:h-4 after:w-5 after:transition-all peer-checked:bg-primary/20 peer-checked:border-primary/50"></div>
                      </label>
                    </div>

                    <AnimatePresence>
                      {formData.enableCloning && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6 overflow-hidden"
                        >
                          {/* Upload Area */}
                          <div className="group/upload relative border-2 border-dashed border-primary/20 rounded-xl p-8 transition-all hover:border-primary/40 hover:bg-primary/5 cursor-pointer">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="audio/*" />
                            <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover/upload:scale-110 transition-transform">
                                <Plus size={24} />
                              </div>
                              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{t('createOrder.fields.cloning.upload')}</p>
                              <p className="text-[9px] mono text-text-muted uppercase tracking-tighter">{t('createOrder.fields.cloning.uploadSub')}</p>
                            </div>
                          </div>

                          {/* Characteristics Sliders */}
                          <div className="space-y-4 pt-2">
                             <div className="flex items-center gap-2 mb-2">
                               <Settings2 size={12} className="text-primary" />
                               <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('createOrder.fields.cloning.characteristics')}</span>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] mono uppercase text-text">{t('createOrder.fields.cloning.tone')}</span>
                                    <span className="text-[10px] mono text-primary font-bold">{formData.cloningSettings.tone}%</span>
                                  </div>
                                  <input 
                                    type="range"
                                    className="w-full h-1 bg-surface-bright rounded-lg appearance-none cursor-pointer accent-primary"
                                    value={formData.cloningSettings.tone}
                                    onChange={e => setFormData({
                                      ...formData, 
                                      cloningSettings: { ...formData.cloningSettings, tone: parseInt(e.target.value) }
                                    })}
                                  />
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] mono uppercase text-text">{t('createOrder.fields.cloning.tempo')}</span>
                                    <span className="text-[10px] mono text-primary font-bold">{formData.cloningSettings.tempo}%</span>
                                  </div>
                                  <input 
                                    type="range"
                                    className="w-full h-1 bg-surface-bright rounded-lg appearance-none cursor-pointer accent-primary"
                                    value={formData.cloningSettings.tempo}
                                    onChange={e => setFormData({
                                      ...formData, 
                                      cloningSettings: { ...formData.cloningSettings, tempo: parseInt(e.target.value) }
                                    })}
                                  />
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                             <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                             <span className="text-[9px] mono uppercase tracking-widest text-secondary">{t('createOrder.fields.cloning.cloningActive')}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                  <div className="p-8 bg-surface border border-outline rounded-3xl space-y-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Video size={100} />
                     </div>
                     <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                           <Video size={24} />
                        </div>
                        <div>
                           <h4 className="text-[12px] mono uppercase tracking-widest text-primary font-bold">Avansert Produksjon</h4>
                           <p className="text-[10px] mono text-text-muted uppercase">Alt for en viral hit</p>
                        </div>
                     </div>

                     <div className="space-y-6 relative z-10">
                        <div className="space-y-3">
                           <label className="text-[10px] mono uppercase tracking-widest text-text-muted flex items-center gap-3">
                              <Music size={14} className="text-secondary" /> Bakgrunnsmusikk Mood
                           </label>
                           <select 
                             className="w-full bg-background border border-outline focus:border-primary px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                             value={formData.music_mood}
                             onChange={e => setFormData({...formData, music_mood: e.target.value})}
                           >
                             <option value="Viral/Upbeat">Viral / Upbeat (Trendy)</option>
                             <option value="Cinematic/Epic">Cinematic / Epic</option>
                             <option value="Lo-Fi/Chill">Lo-Fi / Chill</option>
                             <option value="Techno/Hype">Techno / Hype</option>
                             <option value="Sad/Emotional">Sad / Emotional</option>
                             <option value="None">Ingen Musikk</option>
                           </select>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] mono uppercase tracking-widest text-text-muted flex items-center gap-3">
                              <Type size={14} className="text-secondary" /> Tekst-Stil (Undertekster)
                           </label>
                           <div className="grid grid-cols-2 gap-3">
                             {[
                               { id: 'Animated/Viral', label: 'Viral Animasjon' },
                               { id: 'Minimalist', label: 'Minimalistisk' },
                               { id: 'Bold/Shadow', label: 'Fet / Skygge' },
                               { id: 'Typewriter', label: 'Skrivemaskin' }
                             ].map(style => (
                               <button
                                 key={style.id}
                                 onClick={() => setFormData({...formData, caption_style: style.id})}
                                 className={cn(
                                   "p-4 rounded-xl border text-[10px] mono uppercase tracking-widest h-16 transition-all text-center flex items-center justify-center",
                                   formData.caption_style === style.id ? "bg-primary/10 border-primary text-primary font-bold" : "bg-background border-outline hover:border-primary/30"
                                 )}
                               >
                                 {style.label}
                               </button>
                             ))}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] mono uppercase tracking-widest text-text-muted flex items-center gap-3">
                              <Layers size={14} className="text-secondary" /> Overlapping / Overganger
                           </label>
                           <select 
                             className="w-full bg-background border border-outline focus:border-primary px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                             value={formData.transition_style}
                             onChange={e => setFormData({...formData, transition_style: e.target.value})}
                           >
                             <option value="Cinematic Zoom">Cinematic Zoom</option>
                             <option value="Fast Cut">Raske Klipp (Viral Style)</option>
                             <option value="Dissolve">Myk Overgang</option>
                             <option value="None">Rå Klipp</option>
                           </select>
                        </div>
                     </div>
                  </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-12"
            >
              {submitStatus ? (
                <div className={cn(
                  "p-8 rounded-3xl border flex flex-col items-center gap-6 max-w-lg",
                  submitStatus.type === 'success' ? "bg-primary/10 border-primary text-primary" : "bg-red-500/10 border-red-500 text-red-500"
                )}>
                  {submitStatus.type === 'success' ? <CheckCheck size={60} /> : <Info size={60} />}
                  <p className="text-xl font-bold uppercase tracking-wider">{submitStatus.message}</p>
                </div>
              ) : (
                <>
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center relative mb-6">
                     <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                     <CheckCheck size={64} className="text-primary" />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-5xl font-display font-black tracking-tighter uppercase">{t('createOrder.review.title')}</h3>
                    <p className="text-text-muted max-w-xl mx-auto leading-relaxed text-lg">
                      {t('createOrder.review.subtitle')} <span className="text-primary">"{formData.title || t('createOrder.review.noTitle')}"</span>. 
                      {t('createOrder.review.description')}
                    </p>
                  </div>
                </>
              )}
              <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
                <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-text-muted">{t('createOrder.productionType.label')}: {productionMode === 'single' ? t('createOrder.productionType.single') : t('createOrder.productionType.series')}</div>
                {productionMode === 'series' && (
                  <>
                    <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-primary font-bold">{t('createOrder.productionType.seasons')}: {seriesConfig.seasons}</div>
                    <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-primary font-bold">{t('createOrder.productionType.episodes')}: {seriesConfig.episodes}</div>
                  </>
                )}
                <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-text-muted">{t('createOrder.review.summary.voices')}: {formData.voices.length}</div>
                <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-text-muted">{t('createOrder.review.summary.language')}: {formData.language}</div>
                <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-text-muted">{t('createOrder.fields.format')}: {formData.format}</div>
                <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-text-muted">{t('createOrder.review.summary.platform')}: {formData.platform}</div>
                <div className="px-6 py-3 glass rounded-full border border-outline text-[12px] mono uppercase tracking-widest text-primary font-bold">{t('createOrder.fields.channels')}: {formData.selectedChannels.length}</div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-16 flex justify-between pt-10 border-t border-outline/30">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="px-10 py-4 rounded-xl border border-outline hover:border-text-muted text-text-muted hover:text-white transition-all disabled:opacity-0 text-base"
          >
            {t('createOrder.buttons.back')}
          </button>
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              disabled={step === 1 && !isFormValid}
              className={cn(
                "px-12 py-4 bg-surface border border-primary text-primary hover:bg-primary hover:text-background rounded-xl font-bold flex items-center gap-3 group transition-all text-base",
                step === 1 && !isFormValid && "opacity-50 cursor-not-allowed border-outline text-text-muted hover:bg-transparent hover:text-text-muted"
              )}
            >
              {t('createOrder.buttons.next')}
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className="px-14 py-5 bg-primary text-background font-bold rounded-xl flex items-center gap-4 neon-glow uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={20} className="group-hover:rotate-12 transition-transform" />
              )}
              {isSubmitting ? 'Sender...' : t('createOrder.buttons.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
