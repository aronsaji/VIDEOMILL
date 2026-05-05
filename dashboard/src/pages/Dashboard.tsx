import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, Clock, Zap, Bot, Plus, Play, MoreVertical, Radar 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useI18nStore } from '../store/i18nStore';

export default function Dashboard() {
  const { t } = useI18nStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Dashboard Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-4xl font-black text-white tracking-tighter mb-2 uppercase italic">
            WELCOME BACK, OPERATOR
          </h1>
          <p className="font-headline-md text-sm text-zinc-500 uppercase tracking-widest">
            System status: <span className="text-[#22D3EE]">All systems operational</span>
          </p>
        </div>
        <Link 
          to="/factory" 
          className="px-8 py-4 bg-white/5 border border-white/10 hover:border-[#22D3EE] text-white font-headline-md text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 rounded"
        >
          <Plus size={16} />
          Create New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: projects.length, icon: Video, color: 'text-[#22D3EE]' },
          { label: 'Generation Time', value: '12.4h', icon: Clock, color: 'text-zinc-400' },
          { label: 'AI Agents', value: '08', icon: Bot, color: 'text-[#22D3EE]' },
          { label: 'Credits', value: '1.2k', icon: Zap, color: 'text-[#22D3EE]' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 p-6 rounded-lg relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="relative z-10 flex flex-col">
              <span className="font-headline-md text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">{stat.label}</span>
              <div className="flex items-center justify-between">
                <span className="font-headline-lg text-3xl font-black text-white tracking-tighter">{stat.value}</span>
                <stat.icon size={24} className={`${stat.color} opacity-50`} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22D3EE]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="font-headline-md text-xs font-bold tracking-[0.3em] text-white uppercase">Recent Projects</h2>
          <Link to="/archive" className="text-[10px] font-black text-[#22D3EE] uppercase tracking-widest hover:underline">View All Projects</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-lg border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.slice(0, 6).map((project) => (
                <div key={project.id} className="group flex flex-col bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden hover:border-white/20 transition-all shadow-xl">
                  {/* Thumbnail Container */}
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    {project.thumbnail_url ? (
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-800">
                        <Video size={48} />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 ${
                        project.status === 'completed' ? 'bg-[#22D3EE] text-black' : 'bg-black/80 text-white border border-white/20'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${project.status === 'completed' ? 'bg-black' : 'bg-[#22D3EE] animate-pulse'}`} />
                        {project.status}
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <Play size={20} fill="currentColor" />
                      </button>
                      <Link to={`/factory/${project.id}`} className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md">
                        <MoreVertical size={20} />
                      </Link>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-headline-md text-lg font-black text-white tracking-tight group-hover:text-[#22D3EE] transition-colors line-clamp-1 uppercase italic">
                        {project.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-zinc-500" />
                        <span className="font-label-sm text-[10px] text-zinc-500 uppercase tracking-widest">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="font-label-sm text-[10px] text-zinc-500 uppercase tracking-widest">v1.2.4</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <div className="inline-flex w-16 h-16 bg-white/5 rounded-full items-center justify-center mb-6 text-zinc-600">
                  <Radar size={32} />
                </div>
                <h3 className="font-headline-md text-lg font-black text-white mb-2 uppercase">NO ACTIVE PROJECTS FOUND</h3>
                <p className="text-zinc-500 text-sm mb-8 font-body-md">Your production queue is empty. Ready to start the engine?</p>
                <Link to="/factory" className="px-8 py-3 bg-[#22D3EE] text-black font-headline-md text-[11px] font-black uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all inline-block">
                  Launch Factory
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
