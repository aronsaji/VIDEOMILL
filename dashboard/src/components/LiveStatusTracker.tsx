import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, CheckCircle2, AlertCircle, Loader2, Play, Video } from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';

export default function LiveStatusTracker() {
  const { orders, isLoading } = usePipelineStore();
  
  // Filter for active (non-completed/non-failed) orders
  const activeOrders = orders.filter(o => o.status === 'rendering' || o.status === 'pending').slice(0, 3);
  const completedToday = orders.filter(o => o.status === 'completed' && new Date(o.updated_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
           <Activity size={14} className="text-primary-container animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 font-mono">Live_Engine_Status</span>
        </div>
        <span className="text-[9px] font-mono text-zinc-800 font-black">
          {activeOrders.length} ACTIVE / {completedToday} DONE
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activeOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-surface-container-low/50 border border-white/5 rounded-2xl p-4 hover:border-primary-container/30 transition-all relative overflow-hidden"
            >
              {/* Progress Bar Background */}
              {order.status === 'rendering' && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-primary-container/20 w-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 30, repeat: Infinity }}
                />
              )}

              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    order.status === 'rendering' ? 'bg-primary-container/10' : 'bg-white/5'
                  }`}>
                    {order.status === 'rendering' ? (
                      <Loader2 size={16} className="text-primary-container animate-spin" />
                    ) : (
                      <Clock size={16} className="text-zinc-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase italic tracking-tight line-clamp-1 w-32">
                      {order.title || 'Untitled_Production'}
                    </h4>
                    <p className="text-[8px] font-mono font-black text-zinc-700 uppercase tracking-widest mt-0.5">
                      {order.status === 'rendering' ? 'NEURAL_ENCODING_IN_PROGRESS' : 'QUEUED_FOR_DISPATCH'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                   <div className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                     order.status === 'rendering' ? 'text-primary-container' : 'text-zinc-600'
                   }`}>
                     {order.status === 'rendering' ? 'SYNCING' : 'IDLE'}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeOrders.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]"
          >
             <CheckCircle2 size={24} className="text-zinc-800 mb-3" />
             <p className="text-[9px] font-mono font-black text-zinc-800 uppercase tracking-widest">Pipeline_Nominal_Wait_Active</p>
          </motion.div>
        )}
      </div>

      {/* Global Progress Pulse */}
      {activeOrders.length > 0 && (
        <div className="pt-4 border-t border-white/5">
           <div className="flex justify-between text-[8px] font-mono font-black text-zinc-700 uppercase mb-2">
              <span>Overall_Efficiency</span>
              <span>98.4%</span>
           </div>
           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary-container via-[#00f5ff] to-primary-container"
                animate={{ 
                  x: ['-100%', '100%'],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ width: '50%' }}
              />
           </div>
        </div>
      )}
    </div>
  );
}
