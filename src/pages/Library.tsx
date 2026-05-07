import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Library as LibraryIcon, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Play, 
  Download, 
  Trash2, 
  Share2,
  Clock,
  Video,
  FileVideo,
  CheckCircle2,
  X,
  FileCheck2,
  Settings2,
  Layers,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import { Production } from '../types';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export const Library = () => {
  const { t } = useTranslation();
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSettings, setExportSettings] = useState({
    format: 'mp4',
    quality: '4k',
    template: 'custom'
  });

  useEffect(() => {
    const fetchProductions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('productions')
        .select('id, title, status, progress, duration, created_at, error')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching productions:', error);
      } else {
        setProductions(data || []);
      }
      setLoading(false);
    };

    fetchProductions();

    // Set up real-time subscription
    const subscription = supabase
      .channel('productions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productions' }, (payload) => {
        fetchProductions(); // Refresh on changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // ... rest of component using productions instead of LIBRARY ...

  const EXPORT_TEMPLATES = {
    social: { format: 'mp4', quality: '1080p' },
    story: { format: 'mp4', quality: '1080p' },
    webinar: { format: 'mp4', quality: '1080p' },
    web: { format: 'mov', quality: '1080p' },
    high: { format: 'mp4', quality: '4k' },
    master: { format: 'mov', quality: '4k' }
  };

  const applyTemplate = (templateKey: string) => {
    if (templateKey === 'custom') {
      setExportSettings(prev => ({ ...prev, template: 'custom' }));
      return;
    }
    const settings = EXPORT_TEMPLATES[templateKey as keyof typeof EXPORT_TEMPLATES];
    if (settings) {
      setExportSettings({ ...settings, template: templateKey });
    }
  };

  const updateFormat = (format: string) => {
    setExportSettings(prev => ({ ...prev, format, template: 'custom' }));
  };

  const updateQuality = (quality: string) => {
    setExportSettings(prev => ({ ...prev, quality, template: 'custom' }));
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    // In a real app, this would trigger the actual download process
    console.log('Exporting videos:', selectedIds, 'Settings:', exportSettings);
    setIsExporting(false);
    setSelectedIds([]);
  };

  const handleRetry = async (production: Production) => {
    try {
      // 1. Update status in Supabase
      await supabase
        .from('productions')
        .update({ status: 'processing', progress: 0 })
        .eq('id', production.id);
      
      // 2. Trigger n8n retry
      await fetch('/api/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...production,
          video_id: production.id,
          retry: true
        }),
      });
    } catch (err) {
      console.error("Retry error:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('library.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('library.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-surface px-1 py-1 rounded-lg border border-outline">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded transition-all", viewMode === 'grid' ? "bg-primary/20 text-primary" : "text-text-muted hover:text-white")}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded transition-all", viewMode === 'list' ? "bg-primary/20 text-primary" : "text-text-muted hover:text-white")}
            >
              <List size={18} />
            </button>
          </div>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setIsExporting(true)}
              className="bg-primary text-background font-bold px-6 py-2 rounded-lg neon-glow uppercase tracking-tighter transition-all hover:scale-105"
            >
              {t('library.exportSelected')} ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder={t('library.search')} 
            className="w-full bg-surface border border-outline rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-all font-mono text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['Alle', 'Fullførte', 'Under Behandling', 'Feilede'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={cn(
                "px-4 py-3 rounded-xl border mono text-[10px] uppercase tracking-widest transition-all",
                filter === f.toLowerCase() ? "bg-primary/10 border-primary text-primary" : "bg-surface border-outline text-text-muted hover:border-text-muted"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productions.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              onClick={() => toggleSelection(item.id)}
              className={cn(
                "glass rounded-xl overflow-hidden border transition-all cursor-pointer group relative",
                selectedIds.includes(item.id) ? "border-primary ring-1 ring-primary/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]" : "border-white/5"
              )}
            >
              {selectedIds.includes(item.id) && (
                <div className="absolute top-3 right-3 z-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-background shadow-lg">
                   <CheckCircle2 size={16} />
                </div>
              )}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${item.id}/400/225`} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-background hover:scale-110 transition-transform"
                  >
                    <Play size={20} fill="currentColor" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIds([item.id]);
                      setIsExporting(true);
                    }}
                    className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                  >
                    <Download size={18} />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] mono text-white">
                  {item.duration}
                </div>
                {item.status === 'processing' && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center p-6">
                    <div className="w-full text-center space-y-3">
                      <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className="mono text-[8px] uppercase font-black text-primary tracking-[0.2em] animate-pulse">
                          {t('library.status.processing')}...
                        </span>
                        <span className="mono text-[8px] text-white/50">{item.progress}%</span>
                      </div>
                    </div>
                  </div>
                )}
                {item.status === 'failed' && (
                  <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[4px] flex items-center justify-center p-4">
                    <div className="text-center space-y-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                         <AlertCircle size={20} />
                      </div>
                      <div>
                        <p className="mono text-[8px] uppercase font-bold text-red-400 tracking-wider mb-1">
                          {t('library.status.failed')}
                        </p>
                        <p className="text-[7px] text-red-300/70 max-w-[120px] mx-auto leading-tight italic">
                          {item.error}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(item);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white mono text-[8px] px-3 py-1.5 rounded uppercase tracking-widest transition-all inline-flex items-center gap-1 border border-white/10"
                      >
                         <RefreshCcw size={10} /> {t('library.status.retry')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors mb-4">{item.title}</h3>
                <div className="grid grid-cols-2 gap-4 border-t border-outline/30 pt-4">
                  <div className="space-y-1">
                    <p className="mono text-[8px] text-text-muted uppercase tracking-widest">Kvalitet / Agent</p>
                    <p className="text-[10px] font-bold text-text">4K • ATLAS</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="mono text-[8px] text-text-muted uppercase tracking-widest">Opprettet</p>
                    <p className="text-[10px] font-bold text-text flex items-center justify-end gap-1"><Clock size={10} className="text-primary" /> {item.created_at}</p>
                  </div>
                </div>
              </div>

              <div className="flex bg-surface-bright/50 border-t border-outline/30">
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-3 flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/5 transition-all outline-none"
                >
                  <Share2 size={14} />
                </button>
                <div className="w-[1px] bg-outline/20" />
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-3 flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/5 transition-all outline-none"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-outline">
                <th className="p-4 w-10">
                  <div 
                    onClick={() => {
                      if (selectedIds.length === productions.length) setSelectedIds([]);
                      else setSelectedIds(productions.map(item => item.id));
                    }}
                    className={cn(
                      "w-4 h-4 rounded border transition-colors flex items-center justify-center cursor-pointer",
                      selectedIds.length === productions.length ? "bg-primary border-primary" : "border-text-muted"
                    )}
                  >
                    {selectedIds.length === productions.length && <CheckCircle2 size={10} className="text-background" />}
                  </div>
                </th>
                <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Video Info</th>
                <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Kvalitet</th>
                <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Status</th>
                <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Agent</th>
                <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Tid</th>
                <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {productions.map(item => (
                <tr 
                  key={item.id} 
                  onClick={() => toggleSelection(item.id)}
                  className={cn(
                    "hover:bg-white/5 transition-colors group cursor-pointer",
                    selectedIds.includes(item.id) ? "bg-primary/5" : ""
                  )}
                >
                  <td className="p-4">
                    <div className={cn(
                      "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                      selectedIds.includes(item.id) ? "bg-primary border-primary" : "border-text-muted"
                    )}>
                      {selectedIds.includes(item.id) && <CheckCircle2 size={10} className="text-background" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-10 rounded border border-outline overflow-hidden flex-shrink-0">
                         <img src={`https://picsum.photos/seed/${item.id}/160/100`} alt={item.title} className="w-full h-full object-cover" />
                         {item.status === 'processing' && <div className="absolute inset-0 bg-primary/40 animate-pulse" />}
                         {item.status === 'failed' && <div className="absolute inset-0 bg-red-500/40" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-[10px] mono text-text-muted uppercase tracking-widest">{item.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded mono text-[10px] font-bold">4K</span>
                  </td>
                  <td className="p-4">
                    {item.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-400 mono text-[9px] uppercase font-bold tracking-tighter">
                        <CheckCircle2 size={12} /> Fullført
                      </div>
                    )}
                    {item.status === 'processing' && (
                      <div className="space-y-1 w-24">
                        <div className="flex justify-between items-center mono text-[8px] uppercase text-primary font-bold">
                          <span>{t('library.status.processing')}</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                           <motion.div 
                              className="h-full bg-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                           />
                        </div>
                      </div>
                    )}
                    {item.status === 'failed' && (
                      <div className="flex items-center gap-1 text-red-500 mono text-[9px] uppercase font-bold tracking-tighter group/err relative">
                        <AlertCircle size={12} /> {t('library.status.failed')}
                        <div className="hidden group-hover/err:block absolute left-0 top-full mt-2 p-2 bg-surface border border-outline rounded shadow-xl z-30 min-w-[200px] text-[8px] normal-case font-normal text-text-muted">
                           {item.error}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    ATLAS
                  </td>
                  <td className="p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    {item.created_at}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.status === 'completed' ? (
                        <>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="text-text-muted hover:text-primary transition-colors"
                          >
                            <Play size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIds([item.id]);
                              setIsExporting(true);
                            }}
                            className="text-text-muted hover:text-primary transition-colors"
                          >
                            <Download size={16} />
                          </button>
                        </>
                      ) : item.status === 'failed' ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetry(item);
                          }}
                          className="text-primary hover:scale-110 transition-all flex items-center gap-1 mono text-[9px] uppercase font-bold border border-primary/30 px-2 py-1 rounded bg-primary/5"
                        >
                          <RefreshCcw size={12} /> {t('library.status.retry')}
                        </button>
                      ) : (
                        <div className="w-16 h-1 bg-white/5 rounded-full" /> // Placeholder while processing
                      )}
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-text-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Export Modal */}
      <AnimatePresence>
        {isExporting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExporting(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a1c1e] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary/50" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Download size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t('library.export.title')}</h3>
                    <p className="text-xs text-text-muted uppercase font-mono tracking-tighter">{t('library.export.subtitle')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsExporting(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Selected Count Badge */}
                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <FileCheck2 size={24} className="text-primary" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">{selectedIds.length} videoer valgt</p>
                    <p className="text-[10px] mono text-text-muted">Total estimert størrelse: {selectedIds.length * 450} MB</p>
                  </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-4">
                  <label className="mono text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                     <Layers size={12} className="text-primary" /> {t('library.export.template')}
                  </label>
                  <select 
                    value={exportSettings.template}
                    onChange={(e) => applyTemplate(e.target.value)}
                    className="w-full bg-surface border border-outline focus:border-primary px-4 py-3 rounded-lg outline-none transition-all text-xs uppercase mono"
                  >
                    <option value="custom">{t('library.export.templates.custom')}</option>
                    <option value="social">{t('library.export.templates.social')}</option>
                    <option value="story">{t('library.export.templates.story')}</option>
                    <option value="webinar">{t('library.export.templates.webinar')}</option>
                    <option value="web">{t('library.export.templates.web')}</option>
                    <option value="high">{t('library.export.templates.high')}</option>
                    <option value="master">{t('library.export.templates.master')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Format Selection */}
                  <div className="space-y-4">
                    <label className="mono text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                       <FileVideo size={12} className="text-primary" /> {t('library.export.format')}
                    </label>
                    <div className="space-y-2">
                      {['mp4', 'mov', 'avi'].map(f => (
                        <button
                          key={f}
                          onClick={() => updateFormat(f)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm uppercase mono",
                            exportSettings.format === f ? "bg-primary text-background border-primary" : "bg-surface border-outline hover:border-primary/50"
                          )}
                        >
                          {f}
                          {exportSettings.format === f && <CheckCircle2 size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Selection */}
                  <div className="space-y-4">
                    <label className="mono text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                       <Settings2 size={12} className="text-primary" /> {t('library.export.quality')}
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: '4k', label: '4K Ultra HD', sub: 'Neural Enhanced' },
                        { id: '1440p', label: '1440p (2K)', sub: 'High Bitrate' },
                        { id: '1080p', label: '1080p Full HD', sub: 'Standard Quality' },
                        { id: '720p', label: '720p HD', sub: 'Small File Size' }
                      ].map(q => (
                        <button
                          key={q.id}
                          onClick={() => updateQuality(q.id)}
                          className={cn(
                            "w-full flex flex-col items-start p-3 rounded-lg border transition-all text-left",
                            exportSettings.quality === q.id ? "bg-primary text-background border-primary" : "bg-surface border-outline hover:border-primary/50"
                          )}
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">{q.label}</span>
                          <span className={cn("text-[8px] mono uppercase tracking-tighter", exportSettings.quality === q.id ? "text-background/70" : "text-text-muted")}>{q.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-outline/30">
                  <button 
                    onClick={() => setIsExporting(false)}
                    className="flex-1 py-4 border border-outline rounded-lg font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all outline-none"
                  >
                    {t('library.export.close')}
                  </button>
                  <button 
                    onClick={handleExport}
                    className="flex-1 py-4 bg-primary text-background rounded-lg font-bold uppercase tracking-[0.2em] text-[10px] neon-glow hover:scale-105 transition-all outline-none"
                  >
                    {t('library.export.confirm')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Empty State Suggestion */}
      <div className="py-12 border-2 border-dashed border-outline rounded-3xl flex flex-col items-center justify-center opacity-40">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-text-muted mb-4 border border-outline">
          <FileVideo size={28} />
        </div>
        <p className="mono text-[10px] uppercase tracking-widest text-center">
          Ingen flere videoer funnet i arkivet.<br/>
          <span className="text-primary cursor-pointer hover:underline">Start en ny produksjon</span> for å fylle biblioteket.
        </p>
      </div>
    </div>
  );
};
