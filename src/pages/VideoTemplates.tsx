import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Type, 
  Video, 
  Layers, 
  Search, 
  Filter, 
  Zap, 
  Star,
  Play,
  Heart,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

const TEMPLATES = [
  { id: '1', name: 'Viral News Breakdown', category: 'Informative', rating: 4.9, active: true, createdAt: '2024-03-15' },
  { id: '2', name: 'Cyber-Punk Product Reveal', category: 'Marketing', rating: 5.0, active: true, createdAt: '2024-04-02' },
  { id: '3', name: 'Neural Mood Board', category: 'Creative', rating: 4.7, active: false, createdAt: '2023-11-20' },
  { id: '4', name: 'Minimalist Tech Review', category: 'Tech', rating: 4.8, active: true, createdAt: '2024-01-10' },
  { id: '5', name: 'Nordic Winter Vibes', category: 'Lifestyle', rating: 4.5, active: true, createdAt: '2023-12-05' },
  { id: '6', name: 'Neon City Nightloop', category: 'Abstract', rating: 4.9, active: true, createdAt: '2024-02-28' },
];

export const VideoTemplates = () => {
  const { t } = useTranslation();
  const [previewTemplate, setPreviewTemplate] = React.useState<any>(null);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.tmplt';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`${file.name} er lastet opp som en ny system-mal!`);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left duration-700">
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-surface border border-primary/20 w-full max-w-4xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="aspect-video bg-background relative">
              <img src={`https://picsum.photos/seed/temp${previewTemplate.id}/1200/675`} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40 animate-pulse text-primary pointer-events-none">
                  <Play size={40} fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="p-8 flex justify-between items-center bg-[#050505]">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{previewTemplate.name}</h2>
                <p className="mono text-[10px] uppercase tracking-widest text-primary italic">High-Retention AI Framework v2.4</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="px-8 py-3 border border-outline rounded-xl text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-all"
                >
                  Lukk
                </button>
                <button className="px-12 py-3 bg-primary text-background rounded-xl font-bold text-xs uppercase tracking-widest neon-glow hover:scale-105 transition-all">
                  Bruk Mal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('templates.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('templates.subtitle')}</p>
        </div>
        <button 
          onClick={handleUpload}
          className="bg-primary hover:neon-glow text-background font-bold px-8 py-2 rounded-lg font-display uppercase tracking-widest text-xs transition-all"
        >
          Last Opp Mal
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Søk i mal-biblioteket..." 
            className="w-full bg-surface border border-outline rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-all font-mono text-sm"
          />
        </div>
        <button className="bg-surface border border-outline px-6 py-3 rounded-xl flex items-center gap-2 hover:border-primary transition-all text-sm mono uppercase">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map(template => (
          <motion.div 
            key={template.id}
            onClick={() => setPreviewTemplate(template)}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass rounded-xl overflow-hidden border border-white/5 relative group cursor-pointer"
          >
            <div className="relative aspect-video bg-surface overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-40 group-hover:opacity-60 transition-opacity" />
               <img src={`https://picsum.photos/seed/temp${template.id}/400/225`} alt={template.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
               
               <div className="absolute top-3 left-3 flex gap-2">
                 <span className="bg-background/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] mono uppercase text-primary border border-primary/20">
                   {template.category}
                 </span>
                 {template.rating > 4.8 && (
                   <span className="bg-accent/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] mono uppercase text-background font-black flex items-center gap-1">
                     <Star size={8} fill="currentColor" /> Featured
                   </span>
                 )}
               </div>

               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play size={40} className="text-primary bg-background/50 p-2 rounded-full border border-primary/30" />
               </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-bold font-display uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">{template.name}</h3>
                  <div className="flex items-center gap-2 text-text-muted mono text-[8px] uppercase tracking-widest">
                    <Calendar size={10} className="text-primary" />
                    Opprettet: {new Date(template.createdAt).toLocaleDateString('nb-NO')}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 mono text-[10px] bg-yellow-400/5 px-2 py-1 rounded border border-yellow-400/10">
                  <Star size={10} fill="currentColor" /> {template.rating}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="flex flex-col items-center p-2 bg-surface rounded hover:bg-primary/5 border border-outline/30 transition-all">
                  <Layers size={14} className="text-primary mb-1" />
                  <span className="mono text-[8px] uppercase opacity-60">Layers</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-surface rounded hover:bg-primary/5 border border-outline/30 transition-all">
                  <Video size={14} className="text-secondary mb-1" />
                  <span className="mono text-[8px] uppercase opacity-60">Scene</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-surface rounded hover:bg-primary/5 border border-outline/30 transition-all">
                  <Type size={14} className="text-accent mb-1" />
                  <span className="mono text-[8px] uppercase opacity-60">Fonts</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-surface overflow-hidden">
                       <img src={`https://i.pravatar.cc/50?u=${i + template.id}`} alt="User" />
                     </div>
                   ))}
                   <div className="w-6 h-6 rounded-full border-2 border-background bg-surface flex items-center justify-center text-[8px] mono text-text-muted">+12</div>
                 </div>
                 <button className="text-text-muted hover:text-red-400 transition-colors">
                   <Heart size={16} />
                 </button>
              </div>
            </div>

            {!template.active && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                 <div className="bg-background border border-outline py-2 px-6 rounded-full flex items-center gap-2">
                   <Zap size={14} className="text-text-muted" />
                   <span className="mono text-[10px] uppercase tracking-widest text-text-muted">Utgått Versjon</span>
                 </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
