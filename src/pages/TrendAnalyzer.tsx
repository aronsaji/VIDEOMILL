import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Globe, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Hash, 
  MessageSquare,
  Share2,
  Calendar,
  Zap
} from 'lucide-react';
import { TrendTopic } from '../types';
import { cn } from '../lib/utils';

const TRENDS: TrendTopic[] = [
  { id: '1', topic: 'AI Productivity Hacks', viral_score: 98, country: 'USA', language: 'English', growth: 240 },
  { id: '2', topic: 'Minimalist Workspace 2026', viral_score: 85, country: 'Norway', language: 'Norwegian', growth: 120 },
  { id: '3', topic: 'Future of Neural Networks', viral_score: 92, country: 'Germany', language: 'German', growth: 450 },
  { id: '4', topic: 'Eco-Friendly Tech Gadgets', viral_score: 78, country: 'UK', language: 'English', growth: 45 },
  { id: '5', topic: 'AI Aesthetic Trends', viral_score: 100, country: 'Global', language: 'Multi', growth: 1200 },
];

export const TrendAnalyzer = () => {
  const { t } = useTranslation();
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      alert('Analyse fullført! Nevrale mønstre er identifisert.');
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      {analyzing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 border-8 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Analyserer Dataklynger</h2>
            <p className="mono text-[10px] uppercase tracking-widest text-primary animate-pulse">Sjekker 4.2 millioner sosiale signaler...</p>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('analyzer.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('analyzer.subtitle')}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Søk i emner..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg pl-10 pr-4 py-2 outline-none focus:border-primary text-sm font-mono transition-all"
            />
          </div>
          <button className="bg-surface border border-outline px-4 py-2 rounded-lg flex items-center gap-2 hover:border-primary transition-all text-sm mono uppercase">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-primary text-background font-bold px-6 py-2 rounded-lg neon-glow uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            Analyser Nå
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass rounded-xl overflow-hidden border border-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-outline">
                  <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">{t('analyzer.analyzing')}</th>
                  <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">{t('analyzer.prediction')}</th>
                  <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">{t('trending.relevance')}</th>
                  <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">{t('trending.momentum')}</th>
                  <th className="p-4 mono text-[10px] uppercase text-text-muted tracking-widest">{t('common.save')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {TRENDS.map((trend) => (
                  <tr key={trend.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Hash size={16} />
                        </div>
                        <span className="font-bold group-hover:text-primary transition-colors">{trend.topic}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-surface rounded-full max-w-[100px] overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full shadow-[0_0_8px_currentColor]",
                            trend.viral_score > 90 ? "bg-primary text-primary" : "bg-secondary text-secondary"
                          )} style={{ width: `${trend.viral_score}%` }} />
                        </div>
                        <span className="mono text-xs font-bold">{trend.viral_score}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[10px] uppercase text-text-muted">
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="text-secondary" />
                        {trend.country} / {trend.language}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                        <ArrowUpRight size={14} />
                        +{trend.growth}%
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => alert(`Lagret emnet: ${trend.topic} til overvåkingslisten.`)}
                        className="bg-primary/20 hover:bg-primary text-primary hover:text-background p-2 rounded transition-all active:scale-95"
                      >
                        <TrendingUp size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => alert('Dyp sentimentanalyse aktivert for valgte klynger.')}
              className="glass p-6 rounded-xl border-t-2 border-primary cursor-pointer"
            >
              <MessageSquare className="text-primary mb-4" size={24} />
              <h4 className="mono text-[10px] uppercase tracking-widest text-text-muted mb-2">Sentiment Analyse</h4>
              <p className="text-2xl font-black italic">POSITIV</p>
              <div className="mt-4 pt-4 border-t border-outline/30 text-xs text-text-muted">
                92% av globale samtaler er positive til dette emnet.
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => alert('Viralitetsprediksjoner oppdatert med sanntidsdata.')}
              className="glass p-6 rounded-xl border-t-2 border-secondary cursor-pointer"
            >
              <Share2 className="text-secondary mb-4" size={24} />
              <h4 className="mono text-[10px] uppercase tracking-widest text-text-muted mb-2">Delingspotensiale</h4>
              <p className="text-2xl font-black italic">EKSTREMT HØYT</p>
              <div className="mt-4 pt-4 border-t border-outline/30 text-xs text-text-muted">
                Estimasjon: 2.4M organiske delinger på TikTok.
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => alert('Temporal prediksjon synkronisert med UTC-noder.')}
              className="glass p-6 rounded-xl border-t-2 border-accent cursor-pointer"
            >
              <Calendar className="text-accent mb-4" size={24} />
              <h4 className="mono text-[10px] uppercase tracking-widest text-text-muted mb-2">Prediksjon</h4>
              <p className="text-2xl font-black italic">3 DAGER</p>
              <div className="mt-4 pt-4 border-t border-outline/30 text-xs text-text-muted">
                Trend-toppen forventes innen 72 timer.
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-6">
          <div 
            onClick={() => alert('Regional intelligens lastes inn...')}
            className="glass p-6 rounded-xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={120} />
            </div>
            <h3 className="text-lg font-display uppercase tracking-widest mb-6 border-b border-outline pb-4">Top Regions</h3>
            <div className="space-y-4">
              {[
                { name: 'USA', val: 84 },
                { name: 'Norge', val: 72 },
                { name: 'Japan', val: 65 },
                { name: 'Brasil', val: 58 },
                { name: 'Tyskland', val: 52 },
              ].map(r => (
                <div key={r.name} className="flex items-center gap-4">
                  <span className="w-16 mono text-[10px] uppercase text-text-muted">{r.name}</span>
                  <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-[0_0_10px_#22d3ee]" style={{ width: `${r.val}%` }} />
                  </div>
                  <span className="mono text-[10px] text-primary">{r.val}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-xl border border-primary/20 text-center relative group">
             <div className="absolute inset-0 bg-primary opacity-[0.02] animate-pulse pointer-events-none" />
             <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
               <Zap className="text-primary" size={32} />
             </div>
             <h3 className="text-xl font-display font-black tracking-tight mb-2">SnoStorm AI</h3>
             <p className="text-xs text-text-muted leading-relaxed mb-6">
               Vår prediktive algoritme har identifisert en dyp trend i "Cyber-Noir" videoer.
             </p>
             <button className="w-full bg-primary text-background font-bold py-3 rounded-lg uppercase tracking-widest text-xs hover:neon-glow transition-all">
               Start Produksjon
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
