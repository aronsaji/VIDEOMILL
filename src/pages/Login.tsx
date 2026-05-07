import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Github, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { Logo } from '../components/ui/Logo';

export const Login = () => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setError("Check your email for confirmation!");
      } else {
        // demo login if placeholders are used
        const isPlaceholderUrl = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
        if (isPlaceholderUrl) {
          // This is a hack to allow testing without real supabase keys
          if (email === 'admin@admin.com' && password === 'admin123') {
            console.log('Demo login success');
            // We'll use a localStorage hack to simulate a session for the demo
            localStorage.setItem('videomill_demo_mode', 'true');
            window.location.href = '/';
            return;
          }
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Failed to login with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-primary selection:text-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-mist" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-mist delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-8 md:p-12 rounded-3xl border border-primary/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ShieldCheck size={160} />
          </div>

          <div className="flex flex-col items-center mb-10">
            <Logo size="xl" className="mb-8" />
            <h1 className="text-3xl font-display font-black tracking-tighter uppercase text-center mb-2">VideoMill</h1>
            <p className="mono text-[10px] text-primary font-bold uppercase tracking-[0.2em] text-center mb-1">The Non-Stop Viral Engine</p>
            <p className="mono text-[8px] text-text-muted uppercase tracking-[0.3em] text-center">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={cn(
                "p-3 border rounded-xl text-[10px] mono uppercase text-center animate-shake",
                error.includes("confirmation") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
              )}>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="mono text-[10px] text-text-muted uppercase tracking-widest px-1">{t('login.email')}</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-primary/10 py-3 pl-10 pr-4 rounded-xl outline-none focus:border-primary/50 transition-all text-sm disabled:opacity-50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="mono text-[10px] text-text-muted uppercase tracking-widest">{t('login.password')}</label>
                <button type="button" className="text-[10px] mono text-primary hover:underline uppercase">{t('login.forgot')}</button>
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-primary/10 py-3 pl-10 pr-4 rounded-xl outline-none focus:border-primary/50 transition-all text-sm disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:neon-glow text-background font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all active:scale-[0.98] uppercase tracking-widest text-xs disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>{isSignUp ? t('login.signUp') : t('login.signIn')} <LogIn size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            {(!import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                 <p className="text-[10px] text-orange-400 mono uppercase mb-2 text-center font-bold">⚠️ Supabase Nøkler Mangler</p>
                 <p className="text-[9px] text-text-muted text-center mb-4 leading-relaxed">
                   Vennligst legg til VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i dine miljøvariabler for å aktivere full innlogging.
                 </p>
                 <button 
                   type="button"
                   onClick={() => {
                     localStorage.setItem('videomill_demo_mode', 'true');
                     window.location.href = '/';
                   }} 
                   className="w-full py-2 bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-background rounded-lg text-[9px] font-bold uppercase transition-all"
                 >
                   Fortsett som Demo (Ingen Database)
                 </button>
              </div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-primary/5">
            <p className="text-center text-[10px] mono text-text-muted uppercase tracking-widest mb-6">{t('login.orContinueWith')}</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOAuth('github')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-medium disabled:opacity-50"
              >
                <Github size={16} /> GitHub
              </button>
              <button 
                onClick={() => handleOAuth('google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-medium disabled:opacity-50"
              >
                <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center text-[8px] font-black italic">G</div> Google
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-text-muted text-xs">
          {isSignUp ? t('login.hasAccount') : t('login.noAccount')}{" "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-bold hover:underline"
          >
            {isSignUp ? t('login.signIn') : t('login.signUp')}
          </button>
        </p>

        <p className="text-center mt-4 text-text-muted text-[10px] uppercase mono opacity-50">
          <button className="hover:text-primary transition-colors">{t('login.contactAdmin')}</button>
        </p>
      </motion.div>
    </div>
  );
};
