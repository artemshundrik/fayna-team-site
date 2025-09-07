import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase';

type Tournament = {
  id: string;
  title?: string | null;
  logo_url?: string | null;
  season?: string | null; // e.g., '2024/2025' or '2025'
  is_current?: boolean | null;
  status?: 'current' | 'upcoming' | 'archived' | null;
  start_date?: string | null;
  end_date?: string | null;
};

type TournamentContextValue = {
  tournaments: Tournament[];
  loading: boolean;
  mode: 'current' | 'archive';
  setMode: (m: 'current' | 'archive') => void;
  seasons: string[];
  selectedSeason: string | null;
  setSelectedSeason: (s: string | null) => void;
  selectedTournamentId: string | null;
  setSelectedTournamentId: (id: string | null) => void;
  currentTournamentId: string | null;
  effectiveTournamentId: string | null;
};

const TournamentContext = createContext<TournamentContextValue | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'current' | 'archive'>('current');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchTournaments = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('tournaments').select('*');
      if (mounted) {
        if (!error && data) {
          setTournaments(data as unknown as Tournament[]);
        }
        setLoading(false);
      }
    };
    fetchTournaments();
    return () => {
      mounted = false;
    };
  }, []);

  const currentTournamentId = useMemo(() => {
    // Prefer explicit status, fall back to is_current
    const current = tournaments.find((t) => t.status === 'current' || t.is_current);
    if (current) return current.id;
    // fallback: first one (or most recent by created_at if you add it)
    return tournaments[0]?.id ?? null;
  }, [tournaments]);

  const seasons = useMemo(() => {
    const ss = new Set<string>();
    tournaments.forEach((t) => {
      if (t.season && String(t.season).trim().length > 0) ss.add(String(t.season));
    });
    return Array.from(ss).sort().reverse();
  }, [tournaments]);

  const effectiveTournamentId = useMemo(() => {
    if (mode === 'archive') return selectedTournamentId;
    return currentTournamentId;
  }, [mode, selectedTournamentId, currentTournamentId]);

  const value: TournamentContextValue = {
    tournaments,
    loading,
    mode,
    setMode,
     seasons,
     selectedSeason,
     setSelectedSeason,
    selectedTournamentId,
    setSelectedTournamentId,
    currentTournamentId,
    effectiveTournamentId,
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export const useTournament = () => {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error('useTournament must be used within TournamentProvider');
  return ctx;
};
