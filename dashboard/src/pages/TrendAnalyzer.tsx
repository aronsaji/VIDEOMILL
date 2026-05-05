import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';

const VISUAL_PATTERNS = [
  { tag: '#FAST_TRANSITION', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsOtmbvux2LJD5-xafcqdfqHVxc6GHDWf4Mj3651t3j0trVcmabLOnV92dqxV9F94ZYIccbII3jYZfPhAOVePGrAzdh6WHLW719ZYNxfwK7q67EJP8ONxvpFIBSoWoxqlP1fiMktS8T6fxCjIPlALshFtuYBs72UOUv-DAtg9jtjS-Kl3VRRWNAgo7r-ZgIoNqwPGL-tJ4erilE6ejBQTi88ZnuKDMnOJszB2YYHyfowT_eIiQDgE8kZobf8x2d4Z2e8ffPUKajNY' },
  { tag: '#CYBER_GLITCH', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oJtsGfNuYkrpb9J5UIl2nO7mHED7tf-8dNnsUbgShTOU_qt6MElfzMbB_jRTSNa0z11E-yS7uH6e4KazgHIqmvExfZKU6VRjhEeFjTHyuYKZlZGq69enyi0-tk5btbvmcYn-1V454t_9kPreTTOFD3643xSVs1cTElnmRUjns6UUJ5BITCdf0xDUXWP0CrHja19WxdkIe9hIkODIOzsiVGS2t17XXrGVJFwANuGN2G8-KsSV1n3n5wGoT-OkpN04s_Cuk0bJvic' },
  { tag: '#RETRO_CORE', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJL8rrmI39KdOJLlBHJLSponIRvf5ptYDvKegyyvlROqu1zJ2Fr7doTILuQTEsAws7fVns1t87eUbALXHKVUUzLxDG4jJdgNOS2yCJnngucYdovOuk8E-6_qbtgrSXn7Orp4xCJjUVMBnt2wshix64qzMWe5DX0PtotwlFhRVNvsZfQzvqHCRCR9gmvoaF6LFIVZ4pf7b_u-6__bYE_kLUnijy1_uiNMUaoYcY8-tP7_-MJZdcKuy7G--9ITPa32KDqbiFevtsxLY' },
  { tag: '#GLASS_FLUX', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGExvovo_tSko458BiE2KbSWzZhxmv-wVJcCyPOc0VmcMMXAfyQXP1kNRjOZ6TugtQs7LNGvJ1L9hTatN6Tc-msUNgFh-zLZ5wnqH6szwPAIq_PcPpIdT-Qw4GgChIWof6f_IBv7CZt9F1JLAq6bdgmpcuIelVlYvEptILqgIo2ATHgoAp2xbD_8drzhlkS1CO3meIkqtElXO6KYEFJiFxR9-jglE-5zK8FIagexGESVxbO0KzJHca2DFHCgcCVbW8LYmzRCxrI-c' },
  { tag: '#GLOBAL_PULSE', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzEST40rFayP4vRKa0ITO9wnV6WCtgL3M15PcBwFi99uxuHl8bqAQ7TtViDXBoyZQcz8GXfOPTcLBV1x4a_pfBMe6bPRS4uciSLAsIrk906IUC4guPYaIMj2f81EAIWb2R37wRVvoTAFOPPnTo-C-CFw0cvAuf__plJziwO7yIhR7J5oV3BfShMkNBrQAJnb6xX9a8ItX52UW4cKIwU_ch-KzFRttHMlEFCZoOtDIqd5X6IYPU0Jl5iMgyPWp2AU8q15h8c4YAZlE' },
  { tag: '#COMPUTE_CORE', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoRRzCB-qqyYgcjK9l7IoxSVMe6D94EPMRvKzEEnNMNS65V2320RSsR8LTX49AJZwmnke932hEs9s4vi9RZzNyxIG10oQ7Uy-T-miBPCW9AyAYbKNYvOIUlPedpwloGTBlNCBtOWBiFM8ixeqyHnDYLPqST2z_uhDrsfFnwkNBiTFJEHuIBG-vZh57RqnVP91OiftlbMaiLLcx0mVzScF6FJyZLo6PSqz3zucZ8F_7Z6DQtnb14-slVa3ODGeUtpDZsGybJIadac' },
];

export default function TrendAnalyzer() {
  const { trends = [], fetchTrends, subscribeToChanges } = usePipelineStore();

  useEffect(() => {
    fetchTrends();
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
  }, []);

  const safeTrends = Array.isArray(trends) ? trends : [];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">Trend Radar</h1>
          <p className="font-data-mono text-xs text-zinc-500 tracking-[0.2em] uppercase mt-1">Real-time engagement pulse • Global scan active</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#0A0A0B] border border-white/10 px-4 py-2 flex flex-col items-end">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">Live Signals</span>
            <span className="font-data-mono text-[#6bff83] text-lg">{safeTrends.length * 124 || 1204551}</span>
          </div>
          <div className="bg-[#0A0A0B] border border-white/10 px-4 py-2 flex flex-col items-end">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">Scan Velocity</span>
            <span className="font-data-mono text-[#ecb2ff] text-lg">42.8 GB/S</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Global Trend Heatmap */}
        <div className="col-span-12 lg:col-span-8 bg-[#0A0A0B] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-8 flex items-center px-4 bg-white/5 border-b border-white/5 z-10">
            <span className="material-symbols-outlined text-xs text-[#ecb2ff] mr-2">public</span>
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-400 uppercase">Global Trend Heatmap // Signal Density</span>
            <div className="ml-auto flex gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>
          <div className="p-4 pt-12 min-h-[400px] flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(rgba(189,0,255,0.05) 50%, transparent 50%)', backgroundSize: '100% 4px' }} />
            <img
              alt="Global Heatmap"
              className="w-full h-full object-cover opacity-40 mix-blend-screen"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmIbWqP787A0kcq9TjPbS7Ynfs_JMfUtaQTSKtWkbVh5xzWAkB_W9Erxi8iIUm_WpmmeXtqD45CSnxi8jaTjwsQ8C4ObzUUil2nJTTJvL5cfAidEQJV5ZpQm8LkhkRKNPhzfmIUEM7diLj3cwc1vxBM10H7SlTl6vdX1DFod1Pq28dyhGw7ACBAnftWFkUEn0GqK31H_sxzEndnPX8j7cuxlvF1Add7HFKdBSs-OphIIpQLcWhMfI3WIYMW_xEXdypp9pGDDub5Sw"
            />
            {/* Data Points */}
            <div className="absolute inset-0 p-8 pointer-events-none">
              <div className="absolute top-[30%] left-[25%] flex flex-col items-center">
                <div className="w-4 h-4 bg-[#BD00FF] rounded-full animate-ping opacity-75" />
                <div className="bg-black/80 backdrop-blur-md border border-[#BD00FF] px-2 py-1 mt-2 font-data-mono text-[10px] text-white">TOKYO_CORE: +88%</div>
              </div>
              <div className="absolute top-[45%] left-[60%] flex flex-col items-center">
                <div className="w-6 h-6 bg-[#00fe66] rounded-full animate-ping opacity-75" />
                <div className="bg-black/80 backdrop-blur-md border border-[#00fe66] px-2 py-1 mt-2 font-data-mono text-[10px] text-white">LONDON_HUB: +124%</div>
              </div>
              <div className="absolute bottom-[20%] left-[15%] flex flex-col items-center">
                <div className="w-3 h-3 bg-[#e90053] rounded-full animate-ping opacity-75" />
                <div className="bg-black/80 backdrop-blur-md border border-[#e90053] px-2 py-1 mt-2 font-data-mono text-[10px] text-white">NY_SECTOR: +42%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {/* Engagement Peak */}
          <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase mb-2">Engagement Peak</span>
            <div className="flex items-baseline gap-2">
              <h2 className="font-headline text-[72px] font-[900] tracking-[-0.04em] leading-[1.1] text-[#ffb2ba]">94.2M</h2>
              <span className="material-symbols-outlined text-[#ffb2ba] animate-bounce">trending_up</span>
            </div>
            <div className="mt-4 h-16 w-full flex items-end gap-1">
              {[20, 35, 25, 60, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 transition-all" style={{ height: `${h}%`, background: i === 5 ? '#e90053' : `rgba(255,178,186,${0.1 + i * 0.1})` }} />
              ))}
            </div>
            <p className="font-data-mono text-[10px] text-zinc-500 mt-4 uppercase tracking-widest">Global cross-platform surge detected in &apos;Hyper-Casual&apos; category.</p>
          </div>

          {/* AI Recommendation CTA */}
          <div className="bg-[#BD00FF] p-6 clipped-corner group cursor-pointer overflow-hidden relative">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="material-symbols-outlined text-white text-4xl mb-4">auto_awesome</span>
            <h3 className="font-headline text-[24px] font-bold text-white leading-tight uppercase">THE NEXT VIRAL WAVE IS PREDICTED.</h3>
            <p className="text-white/80 mt-2 text-sm">Deploy &apos;Cyber-Y2K&apos; aesthetic across all short-form series for 4.2x reach.</p>
            <div className="mt-4 flex justify-end">
              <span className="material-symbols-outlined text-white">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* Trending Topics Table */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-[#0A0A0B] border border-white/10 h-full">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-400 uppercase">Top Trending Topics</span>
                <span className="font-data-mono text-[10px] text-[#ecb2ff]">SCAN_INTERVAL: 0.5s</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-data-mono text-sm">
                  <thead className="bg-white/5 text-zinc-500 uppercase text-[10px]">
                    <tr>
                      <th className="px-6 py-3">Topic / Hashtag</th>
                      <th className="px-6 py-3">Growth</th>
                      <th className="px-6 py-3">Sentiment</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(safeTrends.length > 0 ? safeTrends : [
                      { title: '#AIGENERATED_CHALLENGE', growth_stat: '+422%', viral_score: 95 },
                      { title: '#VAPORWAVE_LUMINAL', growth_stat: '+318%', viral_score: 82 },
                      { title: '#MAX_VELOCITY_EDIT', growth_stat: '+155%', viral_score: 75 },
                    ]).map(t => (
                      <tr key={t.title} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#e5e2e3] truncate max-w-[200px]">{t.title}</td>
                        <td className="px-6 py-4 text-[#6bff83]">{t.growth_stat || '+50%'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map(i => (
                              <span key={i} className="w-2 h-1" style={{ background: i < (t.viral_score / 25) ? '#6bff83' : '#27272a' }} />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="border border-[#6bff83] text-[#6bff83] text-[10px] px-2 py-1 uppercase hover:bg-[#6bff83] hover:text-black transition-all">FACTORY_READY</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Agent Recommendation */}
          <div className="col-span-1 bg-[#0A0A0B] border border-white/10 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="w-3 h-3 bg-[#00fe66] rounded-full animate-pulse inline-block" style={{ boxShadow: '0 0 10px #00fe66' }} />
            </div>
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase mb-4">AI AGENT RECOMMENDATION</span>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-[#ecb2ff] overflow-hidden">
                <img
                  alt="AI Agent"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSnZuXxAy5ICwztpDs95LokFbo_csIiN_ZL_Nn4ErDP_OSFtQM6_2QYYI0FNFEXWYw68gfkSIAApWJ6NhAemY0ZoAEFCzc7D7PcHcKYPdGZ764M3L_1xfgcNZVnkZo28P9Na1vFLqOOXJa72V08PdfPTZaP-raJMj5tF5KORXNUe7SfZiU-MZQ6iNpNlylpwl-ndjXebgUcJQ9ARNA2MUsJ9GjRx-s3cI_jEinn1GWwMQNVQcpRrAjZ6CRnBIIfI9ENhigUc8njAo"
                />
              </div>
              <div>
                <h4 className="font-headline text-sm text-[#ecb2ff] uppercase font-bold">Agent &apos;Nexus&apos;</h4>
                <span className="font-data-mono text-[10px] text-zinc-500">VIRAL PREDICTOR ACTIVE</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 border-l-2 border-[#BD00FF]">
              <p className="text-xs italic text-zinc-300">&quot;Trend &apos;Neo-Noir Retro&apos; is peaking in the US East Coast. Recommend immediate generation of 3 content nodes with high-contrast shadows and 80s synth scores.&quot;</p>
            </div>
            <div className="mt-auto space-y-4 pt-4">
              <div className="flex justify-between items-center text-[10px] font-data-mono">
                <span className="text-zinc-500 uppercase">Confidence Score</span>
                <span className="text-[#6bff83]">98.4%</span>
              </div>
              <div className="w-full bg-white/10 h-1">
                <div className="bg-[#6bff83] h-full" style={{ width: '98%' }} />
              </div>
              <button className="w-full py-2 bg-transparent border border-[#6bff83] text-[#6bff83] font-label-caps text-[10px] uppercase tracking-widest hover:bg-[#6bff83] hover:text-black transition-all duration-300">
                EXECUTE FACTORY BATCH
              </button>
            </div>
          </div>
        </div>

        {/* Emerging Visual Patterns */}
        <div className="col-span-12 mt-4">
          <h3 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase mb-4">Emerging Visual Patterns</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {VISUAL_PATTERNS.map(p => (
              <div key={p.tag} className="aspect-[9/16] bg-[#0A0A0B] border border-white/10 overflow-hidden relative group">
                <img alt={p.tag} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={p.img} />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <span className="font-data-mono text-[10px] text-white">{p.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
