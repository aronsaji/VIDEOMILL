import React, { useEffect, useState } from 'react';
import { Bell, Search, User, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { User as UserType } from '@supabase/supabase-js';

export const TopBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const nodeID = user?.id ? `PRO_NODE_${user.id.substring(0, 4).toUpperCase()}` : 'PRO_NODE_04';

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-20rem)] h-16 border-b border-primary/20 bg-background flex justify-end items-center px-8 z-30">
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => navigate('/create')}
            className="px-4 py-1.5 bg-primary text-background rounded text-[10px] font-bold uppercase tracking-widest hover:neon-glow transition-all active:scale-95"
          >
            + CREATE NEW ORDER
          </button>
        </div>

        <div className="flex items-center gap-4 border-l border-primary/10 pl-6 h-10">
          <div 
            onClick={() => alert('Synkroniserer nevrale parametre for bruker...')}
            className="text-right hidden sm:block cursor-pointer hover:opacity-80 transition-opacity"
          >
            <p className="text-xs font-bold text-text truncate max-w-[150px]">{user?.email || 'Admin User'}</p>
            <p className="text-[10px] font-mono text-accent uppercase">{nodeID}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent border border-primary/20 flex items-center justify-center text-background font-bold text-xs uppercase">
            {user?.email?.[0] || <User size={16} />}
          </div>
        </div>
      </div>
    </header>
  );
};
