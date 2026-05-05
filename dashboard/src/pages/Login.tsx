import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Globe, ArrowLeft, Mail, Shield, Lock, Cpu, Zap, Sparkles, ChevronRight, Activity, Terminal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AnimatedLogo from '../components/AnimatedLogo';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#b1cdb7"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#97b29d"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#bec9bf"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#b1cdb7"/>
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
    <div className="min-h-screen bg-[#131412] flex items-center justify-center relative overflow-hidden p-6">
      {/* Cinematic Background - The Naturalist Studio */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#b1cdb7]/5 rounded-full blur-[150px] animate-mist" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#b1cdb7]/5 rounded-full blur-[150px] animate-mist" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#b1cdb7 1px, transparent 1px), linear-gradient(90deg, #b1cdb7 1px, transparent 1px)', backgroundSize: '80px 80px' }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-[480px] space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-10"
        >
          <AnimatedLogo size="lg" />
          <div className="flex items-center gap-4 bg-[#1b1c1a]/50 px-6 py-2.5 rounded-full border border-[#424843] backdrop-blur-3xl shadow-2xl">
             <Shield size={16} className="text-[#b1cdb7] animate-pulse" />
             <span className="font-label-sm text-[10px] font-bold uppercase tracking-[0.4em] text-[#8c928c] italic">Secure_Node_Access</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1b1c1a] border border-[#424843] rounded-soft-xl p-12 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#b1cdb7]/20 via-[#b1cdb7] to-[#b1cdb7]/20 opacity-40" />
          
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
                  <h1 className="text-4xl font-bold text-[#e4e2e0] italic uppercase tracking-tighter font-headline-md leading-none">Restore_<span className="text-[#b1cdb7]">Access</span></h1>
                  <p className="font-label-sm text-[10px] text-[#8c928c] font-bold uppercase tracking-[0.3em] leading-relaxed italic opacity-40">Neural link restoration protocol</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-4">
                    <label className="font-label-sm text-[10px] font-bold text-[#8c928c] uppercase tracking-[0.3em] ml-6 italic opacity-40">Identifier</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8c928c]/40" size={20} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="ID@VIDEOMILL.AI"
                        className="w-full bg-[#131412] border border-[#424843] rounded-soft-lg px-16 py-6 text-sm text-[#e4e2e0] placeholder-[#8c928c]/20 focus:border-[#b1cdb7]/40 outline-none transition-all italic font-bold uppercase font-label-sm tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-[#b1cdb7] text-[#1d3526] hover:brightness-110 rounded-soft-lg font-bold text-xs uppercase tracking-[0.4em] transition-all shadow-xl flex items-center justify-center gap-4 group italic font-label-sm"
                  >
                    {loading ? 'Processing...' : 'Transmit Link'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full font-label-sm text-[10px] font-bold text-[#8c928c] hover:text-[#b1cdb7] uppercase tracking-[0.4em] transition-colors pt-6 italic opacity-60"
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
                  <h1 className="text-5xl font-bold text-[#e4e2e0] italic uppercase tracking-tighter font-headline-md leading-none">
                    {mode === 'login' ? 'System_' : 'Node_'} 
                    <span className="text-[#b1cdb7]">{mode === 'login' ? 'Uplink' : 'Genesis'}</span>
                  </h1>
                  <p className="font-label-sm text-[10px] text-[#8c928c] font-bold italic uppercase tracking-[0.3em] opacity-40">Authorized Personnel Only</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-2 bg-[#131412] rounded-soft-xl border border-[#424843]">
                  {(['login', 'register'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-4 rounded-soft-lg font-label-sm text-[10px] font-bold uppercase tracking-[0.3em] transition-all italic ${
                        mode === m 
                          ? 'bg-[#2d4535] text-[#b1cdb7] shadow-lg' 
                          : 'text-[#8c928c] hover:text-[#e4e2e0]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'register' && (
                    <div className="space-y-4">
                      <label className="font-label-sm text-[10px] font-bold text-[#8c928c] uppercase tracking-[0.3em] ml-6 italic opacity-40">Operator_Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="NAME_REQUIRED"
                        className="w-full bg-[#131412] border border-[#424843] rounded-soft-lg px-8 py-5 text-sm text-[#e4e2e0] placeholder-[#8c928c]/20 focus:border-[#b1cdb7]/40 outline-none transition-all italic font-bold uppercase font-label-sm tracking-widest"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="font-label-sm text-[10px] font-bold text-[#8c928c] uppercase tracking-[0.3em] ml-6 italic opacity-40">Identifier</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="ID@VIDEOMILL.AI"
                      className="w-full bg-[#131412] border border-[#424843] rounded-soft-lg px-8 py-5 text-sm text-[#e4e2e0] placeholder-[#8c928c]/20 focus:border-[#b1cdb7]/40 outline-none transition-all italic font-bold uppercase font-label-sm tracking-widest"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-6">
                      <label className="font-label-sm text-[10px] font-bold text-[#8c928c] uppercase tracking-[0.3em] italic opacity-40">Pass-Key</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="font-label-sm text-[9px] font-bold text-[#b1cdb7] hover:text-[#e4e2e0] transition-colors uppercase tracking-widest italic"
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
                        className="w-full bg-[#131412] border border-[#424843] rounded-soft-lg px-8 py-5 pr-14 text-sm text-[#e4e2e0] placeholder-[#8c928c]/20 focus:border-[#b1cdb7]/40 outline-none transition-all italic font-bold uppercase font-label-sm tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-[#8c928c]/30 hover:text-[#b1cdb7] transition-colors"
                      >
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="space-y-4">
                      <label className="font-label-sm text-[10px] font-bold text-[#8c928c] uppercase tracking-[0.3em] ml-6 italic opacity-40">Confirm_Key</label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-[#131412] border border-[#424843] rounded-soft-lg px-8 py-5 text-sm text-[#e4e2e0] placeholder-[#8c928c]/20 focus:border-[#b1cdb7]/40 outline-none transition-all italic font-bold uppercase font-label-sm tracking-widest"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-6 bg-[#b1cdb7] text-[#1d3526] hover:brightness-110 rounded-soft-lg font-bold text-xs uppercase tracking-[0.4em] transition-all shadow-xl flex items-center justify-center gap-4 group mt-10 italic font-label-sm"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#1d3526]/30 border-t-[#1d3526] rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Initialize Uplink' : 'Forge Access'}
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-6 py-4">
                  <div className="flex-1 h-[1px] bg-[#424843]" />
                  <span className="font-label-sm text-[9px] text-[#8c928c] font-bold uppercase tracking-[0.4em] italic opacity-30">External_Gateway</span>
                  <div className="flex-1 h-[1px] bg-[#424843]" />
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-5 py-5 bg-[#131412] hover:bg-[#1b1c1a] border border-[#424843] text-[#8c928c] font-label-sm text-[11px] font-bold uppercase tracking-[0.2em] rounded-soft-lg transition-all disabled:opacity-50 italic"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-[#8c928c]/30 border-t-[#8c928c] rounded-full animate-spin" />
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
          className="flex flex-col items-center gap-10"
        >
          <div className="flex items-center gap-12 text-[#8c928c]/20">
             <div className="flex items-center gap-4">
                <Shield size={16} />
                <span className="font-label-sm text-[10px] font-bold uppercase tracking-widest italic">AES-512</span>
             </div>
             <div className="flex items-center gap-4">
                <Terminal size={16} />
                <span className="font-label-sm text-[10px] font-bold uppercase tracking-widest italic">TLS-V3</span>
             </div>
          </div>
          <p className="font-label-sm text-[10px] font-bold text-[#8c928c] uppercase tracking-[0.6em] italic opacity-20">
            VideoMill_Operations_Core_&copy;_2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
