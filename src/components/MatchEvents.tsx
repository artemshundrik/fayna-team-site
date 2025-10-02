import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Box, Collapse, Stack, Typography, Fade, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StarIcon from '@mui/icons-material/Star';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BlockIcon from '@mui/icons-material/Block';

type MatchEventsProps = {
  matchId: string;
  open: boolean;
  side?: 'full' | 'left' | 'right';
  compact?: boolean;
};

type EventRow = {
  id?: string;
  match_id: string;
  player?: string | null;        // optional text name
  player_id?: string | null;     // in your schema this holds the text name
  assist_player_id?: string | null; // can contain name as text per current schema
  type?: string | null; // 'goal' | 'yellow' | 'red' | 'mvp' | ...
  minute?: number | null;
  date?: string | null;
  time?: string | null;
  team_side?: 'home' | 'away' | null; // optional, not used now
};

const badgeColor = (type?: string | null) => {
  switch ((type || '').toLowerCase()) {
    case 'yellow':
      return '#fbc02d';
    case 'red':
      return '#f44336';
    case 'goal':
      return '#2e7d32';
    case 'mvp':
      return '#ff6f00';
    default:
      return '#9e9e9e';
  }
};

const typeLabel = (type?: string | null) => {
  switch ((type || '').toLowerCase()) {
    case 'goal':
      return 'ГОЛ';
    case 'yellow':
      return 'ЖК';
    case 'red':
      return 'ЧК';
    case 'mvp':
      return 'MVP';
    default:
      return (type || '').toUpperCase();
  }
};

export default function MatchEvents({ matchId, open, side = 'full', compact = false }: MatchEventsProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<EventRow[]>([]);
  const [nameToNumber, setNameToNumber] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const run = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('match_events')
        .select('*')
        .eq('match_id', matchId)
        .order('minute', { ascending: true })
        .order('date_created', { ascending: true });
      if (!mounted) return;
      if (!error && data) setRows(data as any);
      setLoading(false);
    };
    run();
    return () => {
      mounted = false;
    };
  }, [matchId, open]);

  // Load players to map names -> numbers for profile navigation
  useEffect(() => {
    if (!open) return;
    let active = true;
    const loadPlayers = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('first_name, last_name, number');
      if (error || !data) return;
      if (!active) return;
      const map: Record<string, number> = {};
      const lnCount: Record<string, number> = {};
      data.forEach((p: any) => {
        const fn = String(p.first_name || '').trim();
        const ln = String(p.last_name || '').trim();
        const num = Number(p.number);
        if (!Number.isFinite(num)) return;
        const lnKey = ln.toLowerCase();
        if (lnKey) lnCount[lnKey] = (lnCount[lnKey] || 0) + 1;
        const variants = [
          `${fn} ${ln}`,
          `${ln} ${fn}`,
          `${fn} ${ln}`.toUpperCase(),
          `${ln} ${fn}`.toUpperCase(),
        ];
        variants.forEach(v => {
          const key = v.trim().toLowerCase();
          if (key) map[key] = num;
        });
      });
      // Add last-name-only mapping if unique
      data.forEach((p: any) => {
        const ln = String(p.last_name || '').trim();
        const num = Number(p.number);
        const key = ln.toLowerCase();
        if (key && Number.isFinite(num) && lnCount[key] === 1) {
          map[key] = num;
        }
      });
      setNameToNumber(map);
    };
    loadPlayers();
    return () => { active = false; };
  }, [open]);

  // We keep it simple: a compact, seamless list that merges into the match card
  const filtered = rows;

  if (compact && open && !loading && rows.length === 0) return null;
  const showContent = open && !loading && rows.length > 0;

  const invert = isSmUp ? side === 'left' : side === 'right';

  return (
    <Collapse in={open} timeout={200} unmountOnExit>
      <Box sx={{ mt: compact ? 0 : 0.5, pt: compact ? 0 : 0.5, pb: compact ? 0 : 0.25, px: { xs: compact ? 0.5 : 1, sm: compact ? 0.5 : 0 }, width: '100%' }}>
        <Fade in={showContent} timeout={220} mountOnEnter unmountOnExit>
          <Stack spacing={compact ? 0.25 : 0.5} sx={{ width: '100%' }}>
            {filtered.map((ev, idx) => {
              const color = badgeColor(ev.type);
              const type = (ev.type || '').toLowerCase();
              const isGoal = type === 'goal';
              const isYellow = type === 'yellow';
              const isRed = type === 'red';
              const minuteText = ev.minute != null ? `${ev.minute}'` : (ev.time ? ev.time.slice(0,5) : '');
              const playerName = (ev.player && String(ev.player).trim()) || (ev.player_id && String(ev.player_id).trim()) || '';
              const assistName = ev.assist_player_id ? String(ev.assist_player_id).trim() : '';

              const toNumber = (name: string) => {
                const key = name.trim().toLowerCase();
                return nameToNumber[key];
              };

              const minuteEl = (
                <Typography key="m" sx={{ color: 'text.secondary', fontWeight: 700, textAlign: invert ? 'right' : 'left', width: '100%', fontSize: compact ? '0.9rem' : undefined }}>
                  {minuteText}
                </Typography>
              );
              const iconEl = (
                <Box key="i" sx={{ display:'flex', alignItems:'center', justifyContent:'center', width: compact ? 10 : 12 }}>
                  {isGoal && <SportsSoccerIcon sx={{ fontSize: compact ? 13 : 15, color: '#111' }} />}
                  {isYellow && <Box sx={{ width: compact ? 7 : 9, height: compact ? 10 : 12, borderRadius: '2px', backgroundColor: '#fbc02d' }} />}
                  {isRed && <Box sx={{ width: compact ? 7 : 9, height: compact ? 10 : 12, borderRadius: '2px', backgroundColor: '#f44336' }} />}
                  {!isGoal && !isYellow && !isRed && <StarIcon sx={{ fontSize: compact ? 13 : 15, color }} />}
                </Box>
              );
              const textEl = (
                <Box key="t" sx={{ display:'flex', alignItems:'center', gap: compact ? 0.25 : 0.5, minWidth: 0, justifyContent: invert ? 'flex-end' : 'flex-start' }}>
                  {playerName && (
                    <Typography
                      onClick={() => {
                        const n = toNumber(playerName);
                        if (n) navigate(`/player/${n}`);
                      }}
                      sx={{
                        fontWeight: 600,
                        whiteSpace:'nowrap',
                        overflow:'hidden',
                        textOverflow:'ellipsis',
                        fontSize: compact ? '0.95rem' : undefined,
                        textAlign: invert ? 'right' : 'left',
                        cursor: toNumber(playerName) ? 'pointer' : 'default',
                        '&:hover': toNumber(playerName) ? { color: 'primary.main' } : undefined,
                      }}
                    >
                      {playerName}
                    </Typography>
                  )}
                  {isGoal && assistName && (
                    <Typography
                      variant="body2"
                      onClick={() => {
                        const n = toNumber(assistName);
                        if (n) navigate(`/player/${n}`);
                      }}
                      sx={{
                        color: 'text.secondary',
                        whiteSpace:'nowrap',
                        overflow:'hidden',
                        textOverflow:'ellipsis',
                        fontSize: compact ? '0.85rem' : undefined,
                        textAlign: invert ? 'right' : 'left',
                        cursor: toNumber(assistName) ? 'pointer' : 'default',
                        '&:hover': toNumber(assistName) ? { color: 'primary.main' } : undefined,
                      }}
                    >
                      ({assistName})
                    </Typography>
                  )}
                </Box>
              );

              return (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: invert
                      ? (compact ? '1fr 10px 28px' : '1fr 12px 34px')
                      : (compact ? '28px 10px 1fr' : '34px 12px 1fr'),
                    alignItems: 'center',
                    gap: compact ? '1px' : '3px',
                    px: { xs: compact ? 0 : 1, sm: compact ? 0 : 1 },
                  }}
                >
                  {invert ? (
                    <>
                      {textEl}
                      {iconEl}
                      {minuteEl}
                    </>
                  ) : (
                    <>
                      {minuteEl}
                      {iconEl}
                      {textEl}
                    </>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Fade>
      </Box>
    </Collapse>
  );
}
