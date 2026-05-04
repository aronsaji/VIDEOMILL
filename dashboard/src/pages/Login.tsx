import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Globe, ArrowLeft, Mail, Shield, Lock, Cpu, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';

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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden p-6 font-['Space_Grotesk']">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-neon-purple/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-neon-cyan/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-[480px] space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <Logo size="lg" />
          <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
             <Shield size={14} className="text-neon-purple" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Secure Node Access</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-ultra rounded-[48px] p-10 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple opacity-50" />
          
          <AnimatePresence mode="wait">
            {mode === 'forgot' ? (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Restore <span className="text-neon-purple">Access</span></h1>
                  <p className="text-xs text-gray-500 font-medium italic uppercase tracking-widest leading-relaxed">Neural link restoration protocol</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Identifier (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="ID@VIDEOMILL.AI"
                        className="w-full bg-black/40 border border-white/5 rounded-3xl px-16 py-5 text-sm text-white placeholder-gray-700 focus:border-neon-purple/40 outline-none transition-all italic font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-white text-black hover:bg-neon-purple hover:text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-3 group"
                  >
                    {loading ? 'Processing...' : 'Transmit Link'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors pt-2"
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
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {mode === 'login' ? 'System ' : 'Node '} 
                    <span className="text-neon-purple">{mode === 'login' ? 'Uplink' : 'Creation'}</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 font-black italic uppercase tracking-[0.2em]">Authorized Personnel Only</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/40 rounded-[24px] border border-white/5">
                  {(['login', 'register'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-3 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                        mode === m 
                          ? 'bg-white text-black shadow-lg' 
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'register' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="OPERATOR NAME"
                        className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 text-sm text-white placeholder-gray-700 focus:border-neon-purple/40 outline-none transition-all italic font-bold"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Identifier</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="ID@VIDEOMILL.AI"
                      className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 text-sm text-white placeholder-gray-700 focus:border-neon-purple/40 outline-none transition-all italic font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Pass-Key</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[10px] font-bold text-neon-purple hover:text-white transition-colors uppercase tracking-widest italic"
                        >
                          Lost Key?
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
                        className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 pr-14 text-sm text-white placeholder-gray-700 focus:border-neon-purple/40 outline-none transition-all italic font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Confirm Pass-Key</label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 text-sm text-white placeholder-gray-700 focus:border-neon-purple/40 outline-none transition-all italic font-bold"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-5 bg-white text-black hover:bg-neon-purple hover:text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-3 group mt-4"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Initialize Uplink' : 'Secure Registration'}
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[8px] text-gray-700 font-black uppercase tracking-[0.4em]">External Gateway</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[24px] transition-all disabled:opacity-50"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Authenticate with Google
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-8 text-gray-600">
             <div className="flex items-center gap-2">
                <Shield size={12} />
                <span className="text-[9px] font-bold uppercase tracking-widest">AES-256</span>
             </div>
             <div className="flex items-center gap-2">
                <Lock size={12} />
                <span className="text-[9px] font-bold uppercase tracking-widest">SSL-Secure</span>
             </div>
          </div>
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
            VideoMill Operations Core &copy; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
