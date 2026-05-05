import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Globe, ArrowLeft, Mail, Shield, Lock, Cpu, Zap, Sparkles, ChevronRight, Activity, Terminal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AnimatedLogo from '../components/AnimatedLogo';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

type Mode = 'login' | 'register' | 'forgot';

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });
        if (error) throw error;
        alert('Verification link sent! Check your inbox.');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        alert('Reset link sent! Check your inbox.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data?.session) throw new Error('Authentication failed.');
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: any) {
      alert(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-6">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-[480px] space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8"
        >
          <AnimatedLogo size="lg" />
          <div className="flex items-center gap-3 bg-surface/50 px-5 py-2 rounded-full border border-outline backdrop-blur-3xl">
             <Shield size={14} className="text-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant italic font-mono">Secure Node Access</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-outline rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-50" />
          <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {mode === 'forgot' ? (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-black text-on-surface italic uppercase tracking-tighter font-headline-md leading-none">Restore_<span className="text-primary">Access</span></h1>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em] leading-relaxed font-mono">Neural link restoration protocol</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-6 font-mono">Identifier</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="ID@VIDEOMILL.AI"
                        className="w-full bg-surface-container border border-outline rounded-3xl px-16 py-6 text-sm text-on-surface placeholder-on-surface-variant/30 focus:border-primary/40 outline-none transition-all italic font-black uppercase font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-primary text-white hover:brightness-110 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-4 group"
                  >
                    {loading ? 'Processing...' : 'Transmit Link'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-[10px] font-black text-on-surface-variant hover:text-on-surface uppercase tracking-[0.4em] transition-colors pt-4 font-mono italic"
                  >
                    Return to Login
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-5xl font-black text-on-surface italic uppercase tracking-tighter font-headline-md leading-none">
                    {mode === 'login' ? 'System_' : 'Node_'} 
                    <span className="text-primary">{mode === 'login' ? 'Uplink' : 'Genesis'}</span>
                  </h1>
                  <p className="text-[10px] text-on-surface-variant font-black italic uppercase tracking-[0.3em] font-mono">Authorized Personnel Only</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-2 bg-surface-container rounded-[2.5rem] border border-outline">
                  {(['login', 'register'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                        mode === m 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'register' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-6 font-mono">Operator_Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="NAME_REQUIRED"
                        className="w-full bg-surface-container border border-outline rounded-3xl px-8 py-5 text-sm text-on-surface placeholder-on-surface-variant/30 focus:border-primary/40 outline-none transition-all italic font-black uppercase font-mono tracking-widest"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-6 font-mono">Identifier</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="ID@VIDEOMILL.AI"
                      className="w-full bg-surface-container border border-outline rounded-3xl px-8 py-5 text-sm text-on-surface placeholder-on-surface-variant/30 focus:border-primary/40 outline-none transition-all italic font-black uppercase font-mono tracking-widest"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-6">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] font-mono">Pass-Key</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[9px] font-black text-primary hover:text-on-surface transition-colors uppercase tracking-widest italic font-mono"
                        >
                          Recover Key
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-surface-container border border-outline rounded-3xl px-8 py-5 pr-14 text-sm text-on-surface placeholder-on-surface-variant/30 focus:border-primary/40 outline-none transition-all italic font-black uppercase font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-6 font-mono">Confirm_Key</label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-surface-container border border-outline rounded-3xl px-8 py-5 text-sm text-on-surface placeholder-on-surface-variant/30 focus:border-primary/40 outline-none transition-all italic font-black uppercase font-mono tracking-widest"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-6 bg-primary text-white hover:brightness-110 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-4 group mt-6"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Initialize Uplink' : 'Forge Access'}
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1 h-[1px] bg-outline" />
                  <span className="text-[8px] text-on-surface-variant/40 font-black uppercase tracking-[0.4em] font-mono">External_Gateway</span>
                  <div className="flex-1 h-[1px] bg-outline" />
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-surface-container hover:bg-surface-container/80 border border-outline text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] rounded-[2.5rem] transition-all disabled:opacity-50 font-mono"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-on-surface-variant/30 border-t-on-surface-variant/70 rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Link Global Account
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-10 text-on-surface-variant/40">
             <div className="flex items-center gap-3">
                <Shield size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest font-mono">AES-512</span>
             </div>
             <div className="flex items-center gap-3">
                <Terminal size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest font-mono">TLS-V3</span>
             </div>
          </div>
          <p className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.6em] italic font-mono">
            VideoMill_Operations_Core_&copy;_2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
