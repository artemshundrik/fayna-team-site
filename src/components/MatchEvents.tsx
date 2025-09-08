import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Box, Collapse, Stack, Typography } from '@mui/material';
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

  // We keep it simple: a compact, seamless list that merges into the match card
  const filtered = rows;

  if (compact && open && !loading && rows.length === 0) return null;

  const invert = side === 'left';

  return (
    <Collapse in={open} timeout={200} unmountOnExit>
      <Box sx={{ mt: compact ? 0 : 0.5, pt: compact ? 0 : 0.5, pb: compact ? 0 : 0.25, px: { xs: compact ? 0.5 : 1, sm: compact ? 0.5 : 0 }, width: '100%' }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">Завантаження подій…</Typography>
        ) : rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Подій не знайдено</Typography>
        ) : (
          <Stack spacing={compact ? 0.25 : 0.5} sx={{ width: '100%' }}>
            {filtered.map((ev, idx) => {
              const color = badgeColor(ev.type);
              const type = (ev.type || '').toLowerCase();
              const isGoal = type === 'goal';
              const isYellow = type === 'yellow';
              const isRed = type === 'red';
              const minuteText = ev.minute != null ? `${ev.minute}'` : (ev.time ? ev.time.slice(0,5) : '');
              const playerName = (ev.player && String(ev.player).trim()) || (ev.player_id && String(ev.player_id).trim()) || '';

              return (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: invert
                      ? (compact ? '1fr 12px 32px' : '1fr 16px 40px')
                      : (compact ? '32px 12px 1fr' : '40px 16px 1fr'),
                    alignItems: 'center',
                    gap: compact ? '2px' : '4px',
                    px: { xs: compact ? 0 : 1, sm: compact ? 0 : 1 },
                  }}
                >
                  {/* minute (inside edge) */}
                  <Typography sx={{ color: 'text.secondary', fontWeight: 700, textAlign: invert ? 'right' : 'left', width: '100%', fontSize: compact ? '0.9rem' : undefined }}>
                    {minuteText}
                  </Typography>
                  {/* icon */}
                  <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', width: compact ? 12 : 16 }}>
                    {isGoal && <SportsSoccerIcon sx={{ fontSize: compact ? 14 : 16, color: '#111' }} />}
                    {isYellow && <Box sx={{ width: compact ? 8 : 10, height: compact ? 12 : 14, borderRadius: '2px', backgroundColor: '#fbc02d' }} />}
                    {isRed && <Box sx={{ width: compact ? 8 : 10, height: compact ? 12 : 14, borderRadius: '2px', backgroundColor: '#f44336' }} />}
                    {!isGoal && !isYellow && !isRed && <StarIcon sx={{ fontSize: compact ? 14 : 16, color }} />}
                  </Box>
                  {/* text (to the outside) */}
                  <Box sx={{ display:'flex', alignItems:'center', gap: compact ? 0.25 : 0.5, minWidth: 0, justifyContent: invert ? 'flex-end' : 'flex-start' }}>
                    {playerName && (
                      <Typography sx={{ fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontSize: compact ? '0.95rem' : undefined, textAlign: invert ? 'right' : 'left' }}>
                        {playerName}
                      </Typography>
                    )}
                    {isGoal && ev.assist_player_id && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontSize: compact ? '0.85rem' : undefined }}>
                        ({ev.assist_player_id})
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Collapse>
  );
}
