import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, CheckCircle2, AlertCircle, Loader2, Play, Video } from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';

export default function LiveStatusTracker() {
  const { orders, isLoading } = usePipelineStore();
  
  // Filter for active (non-completed/non-failed) orders
  const activeOrders = (orders || []).filter(o => o.status === 'rendering' || o.status === 'pending').slice(0, 3);
  const completedToday = (orders || []).filter(o => o.status === 'completed' && new Date(o.updated_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
           <Activity size={14} className="text-primary animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant font-mono">Live_Engine_Status</span>
        </div>
        <span className="text-[10px] font-mono text-on-surface font-black uppercase italic">
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
              className="group bg-surface-container/50 border border-outline rounded-2xl p-4 hover:border-primary/30 transition-all relative overflow-hidden shadow-sm"
            >
              {/* Progress Bar Background */}
              {order.status === 'rendering' && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 30, repeat: Infinity }}
                />
              )}

              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    order.status === 'rendering' ? 'bg-primary/10 border-primary/20' : 'bg-surface-container border-outline'
                  }`}>
                    {order.status === 'rendering' ? (
                      <Loader2 size={18} className="text-primary animate-spin" />
                    ) : (
                      <Clock size={18} className="text-on-surface-variant/40" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-on-surface uppercase italic tracking-tight line-clamp-1 w-32">
                      {order.title || order.topic || 'Untitled_Production'}
                    </h4>
                    <p className="text-[9px] font-mono font-black text-on-surface-variant uppercase tracking-widest mt-1">
                      {order.status === 'rendering' ? 'NEURAL_ENCODING' : 'DISPATCH_QUEUED'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                   <div className={`text-[10px] font-mono font-black px-3 py-1 rounded-full border ${
                     order.status === 'rendering' ? 'text-primary bg-primary/5 border-primary/20 animate-pulse' : 'text-on-surface-variant bg-surface-container border-outline'
                   }`}>
                     {order.status === 'rendering' ? 'SYNC' : 'READY'}
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
            className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-outline rounded-[2rem] bg-surface-container/20"
          >
             <CheckCircle2 size={28} className="text-on-surface-variant/20 mb-4" />
             <p className="text-[10px] font-mono font-black text-on-surface-variant uppercase tracking-widest italic">Pipeline_Wait_Protocol_Active</p>
          </motion.div>
        )}
      </div>

      {/* Global Progress Pulse */}
      {activeOrders.length > 0 && (
        <div className="pt-6 border-t border-outline">
           <div className="flex justify-between text-[10px] font-mono font-black text-on-surface-variant uppercase mb-3 tracking-widest italic">
              <span>Overall_Efficiency</span>
              <span className="text-primary">98.4%</span>
           </div>
           <div className="h-1.5 bg-surface-container border border-outline rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                animate={{ 
                  x: ['-100%', '100%'],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ width: '60%' }}
              />
           </div>
        </div>
      )}
    </div>
  );
}
