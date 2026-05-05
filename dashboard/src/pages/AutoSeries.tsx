import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';

const SERIES = [
  {
    name: 'CYBER_CHRONICLES', agent: 'NOIR_V3', platforms: 'YouTube, TikTok', status: 'ACTIVE',
    schedule: 'Daily @ 18:00 UTC', nextOutput: 'Rendering (42%)', nextColor: 'text-[#6bff83]',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUH8gVLj5WCXSmT1QUNwYb5jOemZKOhTRD3IfBEw_gy69RTl0ZMomQI3V6elgn8ItaLvi2Tzg208xq45FtI8yno_dcT_m6mN8Z3xHhJstGHTEzkjpFnUdo5fOCwGVcxRsmAxbVwdODMm5_Dm6zrbnuflPGjE4pIXL_BNl5WDN1XnoczzolKDkiEq8BAOxG25hgMwiM8kNrCqr2PhPzOC04zpPqXHhpMsF0f_gBX82I54BE1YNUZAVMi6OXKd-kJOIHSKChJeOnmZM',
  },
  {
    name: 'TECH_STRIKE_LITE', agent: 'NEXUS_CORE', platforms: 'Reels, Shorts', status: 'ACTIVE',
    schedule: 'Mon, Wed, Fri', nextOutput: 'Queue: 14h 22m', nextColor: 'text-zinc-400',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOksxWk7V7O-S2fRvuasB-WDUk90yAImdMYuy7IvVlSLw_bj2h-yPtjMbzEK531_SEl-94r7sIykNn0Rlm0FrTbgBj_NbYGBP25xmDcadfD9LEoqZC9xSln6hWEwVXNUxcKRVAy41AmF_21k0kjAoIEFfLhPgk6ch0wsq2Se8zNrLRrAr8J-zs5NCPx9PRws2WmIf-2lRnD2kXyzErHSBKy_B6Ipcm69zjPgKJ63PeRXN_JbHSbgaXuJ7GPZL56wMmrZg2L2s6kr8',
  },
];

const LOG_ENTRIES = [
  { time: '2024-05-18 14:22:01', task: 'Semantic Analysis & Script Gen', series: 'CYBER_CHRONICLES', status: 'SUCCESS', statusColor: 'text-[#6bff83]', dotColor: 'bg-[#00fe66]' },
  { time: '2024-05-18 14:15:33', task: 'Multi-Platform Asset Assembly', series: 'TECH_STRIKE_LITE', status: 'PROCESSING', statusColor: 'text-[#BD00FF]', dotColor: 'bg-[#BD00FF]', pulse: true },
  { time: '2024-05-18 13:58:12', task: 'Trend Pulse Data Ingestion', series: 'GLOBAL_SYNC', status: 'SUCCESS', statusColor: 'text-[#6bff83]', dotColor: 'bg-[#00fe66]' },
  { time: '2024-05-18 13:45:00', task: 'Video Post-Processing Layer 2', series: 'CYBER_CHRONICLES', status: 'RETRYING', statusColor: 'text-[#ffb4ab]', dotColor: 'bg-[#ffb4ab]' },
];

export default function AutoSeries() {
  const { fetchOrders } = usePipelineStore();
  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="max-w-[1440px] mx-auto space-y-8">
      {/* Header & Metrics */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">AUTO SERIES TERMINAL</h1>
            <p className="font-data-mono text-[14px] text-zinc-500 uppercase tracking-widest">Autonomous Content Production &amp; Distribution Pipeline</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-[#1c1b1c] px-4 py-2 border border-white/10">
              <span className="w-2 h-2 bg-[#00fe66] rounded-full animate-pulse" style={{ boxShadow: '0 0 8px #00fe66' }} />
              <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#e5e2e3] uppercase">System Status: Optimal</span>
            </div>
          </div>
        </div>

        {/* Health Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Engagement Velocity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-4 bg-[#0A0A0B] border border-white/10 p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{ background: 'linear-gradient(rgba(189,0,255,0.05) 50%, transparent 50%)', backgroundSize: '100% 4px' }} />
            <div className="flex justify-between items-start mb-6">
              <p className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">ENGAGEMENT VELOCITY</p>
              <span className="material-symbols-outlined text-[#BD00FF]">insights</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-[72px] font-[900] tracking-[-0.04em] leading-[1.1] text-[#e5e2e3]">148.2</span>
              <span className="font-data-mono text-[#6bff83] text-lg">K/HR</span>
            </div>
            <div className="mt-4 h-12 w-full flex items-end gap-1">
              {[40, 60, 55, 80, 100].map((h, i) => (
                <div key={i} className="w-full" style={{ height: `${h}%`, background: '#e90053', opacity: 0.3 + i * 0.17 }} />
              ))}
            </div>
          </motion.div>

          {/* Render Stack Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-3 bg-[#0A0A0B] border border-white/10 p-6"
          >
            <p className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase mb-6">RENDER STACK HEALTH</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-data-mono text-xs uppercase text-zinc-300">Blade Cluster-A</span>
                  <span className="font-data-mono text-xs text-[#6bff83]">92%</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-[#00fe66] h-full" style={{ width: '92%', boxShadow: '0 0 8px #00fe66' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-data-mono text-xs uppercase text-zinc-300">AI Compute Node</span>
                  <span className="font-data-mono text-xs text-[#6bff83]">87%</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-[#00fe66] h-full" style={{ width: '87%', boxShadow: '0 0 8px #00fe66' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pipeline Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-5 bg-[#0A0A0B] border border-white/10 p-6 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">Automated Pipeline Queue</p>
              <span className="font-data-mono text-xs text-zinc-500 uppercase">Next Sync: 02:14:00</span>
            </div>
            <div className="flex gap-4">
              {[
                { label: 'Active Agents', value: '14', borderColor: '#BD00FF' },
                { label: 'Series Live', value: '08', borderColor: '#00fe66' },
                { label: 'Fail Rate', value: '0.02%', borderColor: '#e90053' },
              ].map(m => (
                <div key={m.label} className="flex-1 bg-[#2a2a2b] p-4 flex flex-col gap-1" style={{ borderLeft: `2px solid ${m.borderColor}` }}>
                  <span className="font-data-mono text-[10px] text-zinc-500 uppercase">{m.label}</span>
                  <span className="font-headline text-[24px] font-bold text-[#e5e2e3]">{m.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Series Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERIES.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0A0A0B] border border-white/10 overflow-hidden flex flex-col group hover:border-[#BD00FF]/40 transition-all duration-300"
          >
            <div className="relative h-48">
              <img className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" src={s.img} alt={s.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[#00fe66] text-black font-label-caps text-[10px] px-2 py-1 rounded-sm uppercase font-bold">{s.status}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-headline text-[24px] font-bold text-[#e5e2e3] uppercase mb-1">{s.name}</h3>
                  <p className="font-data-mono text-[10px] text-zinc-500 uppercase">Agent: {s.agent} | {s.platforms}</p>
                </div>
                <button className="text-zinc-500 hover:text-[#BD00FF]">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <div className="bg-black/40 p-4 mb-6 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-500 uppercase">SCHEDULE</span>
                  <span className="font-data-mono text-xs uppercase text-zinc-300">{s.schedule}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-500 uppercase">NEXT OUTPUT</span>
                  <span className={`font-data-mono text-xs uppercase ${s.nextColor}`}>{s.nextOutput}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-white/5 border border-white/10 text-[#e5e2e3] font-label-caps text-[10px] uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2 tracking-[0.1em]">
                  <span className="material-symbols-outlined text-sm">pause</span> PAUSE
                </button>
                <button className="flex-1 py-2 bg-[#BD00FF] text-black font-label-caps text-[10px] uppercase hover:shadow-[0_0_10px_rgba(189,0,255,0.4)] transition-all flex items-center justify-center gap-2 tracking-[0.1em] font-bold">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span> DEPLOY
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* New Series Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0A0A0B] border border-white/10 border-dashed overflow-hidden flex flex-col group hover:border-zinc-500 transition-all duration-300 opacity-70 hover:opacity-100"
        >
          <div className="relative h-48 bg-zinc-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-zinc-800">add_circle</span>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-headline text-[24px] font-bold text-zinc-500 uppercase mb-2">INITIALIZE NEW SERIES</h3>
            <p className="text-zinc-600 mb-6 text-sm">Create an autonomous content stream with custom AI agent behaviors and scheduled distribution.</p>
            <button className="w-full py-3 border border-zinc-700 text-zinc-500 font-label-caps text-[10px] uppercase hover:border-[#BD00FF] hover:text-[#BD00FF] transition-all tracking-[0.1em]">
              CONFIGURE PIPELINE
            </button>
          </div>
        </motion.div>
      </div>

      {/* Agent Logs Table */}
      <div className="bg-[#0A0A0B] border border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-headline text-[24px] font-bold uppercase text-[#e5e2e3]">RECURRING AGENT LOGS</h3>
          <select className="bg-black border border-white/10 font-label-caps text-[10px] text-zinc-400 uppercase px-4 py-2 focus:ring-0 focus:border-[#BD00FF] tracking-[0.1em]">
            <option>ALL AGENTS</option>
            <option>NOIR_V3</option>
            <option>NEXUS_CORE</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                {['Timestamp', 'Agent Task', 'Series Link', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-6 py-4 font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-data-mono text-xs">
              {LOG_ENTRIES.map((entry, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-zinc-500">{entry.time}</td>
                  <td className="px-6 py-4 text-[#e5e2e3]">{entry.task}</td>
                  <td className={`px-6 py-4 ${entry.series === 'GLOBAL_SYNC' ? 'text-zinc-400' : 'text-[#BD00FF]'}`}>{entry.series}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 ${entry.statusColor} ${entry.pulse ? 'animate-pulse' : ''}`}>
                      <span className={`w-1.5 h-1.5 ${entry.dotColor} rounded-full`} />
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-zinc-500 hover:text-[#e5e2e3] underline decoration-zinc-700">
                      {entry.status === 'RETRYING' ? 'MANUAL OVERRIDE' : 'DETAILS'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
