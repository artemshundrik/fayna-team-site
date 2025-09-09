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

  // Helper to parse season string and get a comparable numeric start year
  const seasonStartYear = (s?: string | null): number | null => {
    if (!s) return null;
    const str = String(s).trim();
    if (/^\d{4}\s*\/\s*\d{4}$/.test(str)) {
      const [start] = str.split('/');
      const n = parseInt(start, 10);
      return Number.isFinite(n) ? n : null;
    }
    const n = parseInt(str, 10);
    return Number.isFinite(n) ? n : null;
  };

  // 1) Read initial state from URL or localStorage (deep-linkable archive)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode');
    const urlSeason = params.get('season');
    const urlTournament = params.get('tournament');

    const lsSeason = localStorage.getItem('archiveSeason');
    const lsTournament = localStorage.getItem('archiveTournament');

    if (urlMode === 'archive') setMode('archive');

    if (urlSeason) setSelectedSeason(urlSeason);
    else if (lsSeason) setSelectedSeason(lsSeason);

    if (urlTournament) setSelectedTournamentId(urlTournament);
    else if (lsTournament) setSelectedTournamentId(lsTournament);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Keep URL and localStorage in sync with archive choices (no page reload)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (mode === 'archive') params.set('mode', 'archive');
    else params.delete('mode');

    if (selectedSeason) {
      params.set('season', selectedSeason);
      localStorage.setItem('archiveSeason', selectedSeason);
    } else {
      params.delete('season');
      localStorage.removeItem('archiveSeason');
    }

    if (selectedTournamentId) {
      params.set('tournament', selectedTournamentId);
      localStorage.setItem('archiveTournament', selectedTournamentId);
    } else {
      params.delete('tournament');
      localStorage.removeItem('archiveTournament');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [mode, selectedSeason, selectedTournamentId]);

  const isArchivedTournament = (t: Tournament) => {
    const now = new Date();
    if (t.status === 'archived') return true;
    if (t.status === 'current' || t.is_current) return false;
    if (t.end_date) {
      const d = new Date(t.end_date);
      if (!isNaN(d.getTime())) return d < now;
    }
    // if no end_date — treat as not archived to avoid false positives
    return false;
  };

  // Auto-select default season (latest with archived tournaments) and latest archived tournament within it
  useEffect(() => {
    if (loading) return;
    if (mode !== 'archive') return;

    // Determine latest season that has archived tournaments
    const seasonsWithArchived = Array.from(
      new Set(
        tournaments.filter(isArchivedTournament).map(t => String(t.season || ''))
      )
    ).filter(Boolean) as string[];

    let latestSeason: string | null = null;
    if (seasonsWithArchived.length > 0) {
      latestSeason = seasonsWithArchived
        .slice()
        .sort((a, b) => (seasonStartYear(b) ?? -Infinity) - (seasonStartYear(a) ?? -Infinity))[0] || null;
    }

    // If no season explicitly selected, pick the latest archived season
    if (!selectedSeason && latestSeason) {
      setSelectedSeason(latestSeason);
    }

    // If no tournament explicitly selected, pick the latest archived tournament in the chosen season
    const seasonToUse = selectedSeason || latestSeason;
    if (seasonToUse && !selectedTournamentId) {
      const candidates = tournaments.filter(
        t => String(t.season) === seasonToUse && isArchivedTournament(t)
      );
      if (candidates.length > 0) {
        const sorted = candidates.slice().sort((a, b) => {
          const ae = a.end_date ? new Date(a.end_date).getTime() : (a.start_date ? new Date(a.start_date).getTime() : -Infinity);
          const be = b.end_date ? new Date(b.end_date).getTime() : (b.start_date ? new Date(b.start_date).getTime() : -Infinity);
          return be - ae;
        });
        setSelectedTournamentId(sorted[0].id);
      }
    }
  }, [mode, seasons, selectedSeason, selectedTournamentId, tournaments, loading]);

  // When user changes season, preselect the latest tournament within that season
  useEffect(() => {
    if (!selectedSeason) return;
    if (mode !== 'archive') return;
    // If current selected tournament is not from this season, or none selected, choose latest archived in that season
    const currentSel = tournaments.find(t => t.id === selectedTournamentId);
    if (!currentSel || String(currentSel.season) !== String(selectedSeason) || !isArchivedTournament(currentSel)) {
      const candidates = tournaments.filter(t => String(t.season) === String(selectedSeason) && isArchivedTournament(t));
      if (candidates.length > 0) {
        const sorted = candidates.slice().sort((a, b) => {
          const ae = a.end_date ? new Date(a.end_date).getTime() : (a.start_date ? new Date(a.start_date).getTime() : -Infinity);
          const be = b.end_date ? new Date(b.end_date).getTime() : (b.start_date ? new Date(b.start_date).getTime() : -Infinity);
          return be - ae;
        });
        setSelectedTournamentId(sorted[0].id);
      } else {
        // No archived tournaments for this season — clear selection
        setSelectedTournamentId(null);
      }
    }
  }, [selectedSeason, mode, tournaments]);

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
