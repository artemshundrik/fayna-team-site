import React, { useEffect, useMemo } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Box, Chip, Tabs, Tab, Avatar, Typography, useTheme, Badge, Tooltip } from '@mui/material';

const TournamentSwitcher: React.FC = () => {
  const theme = useTheme();

  // color mapping similar to PlayersTableWithFilters
  const tournamentColors: Record<string, string> = {
    'R-CUP': '#603CB6',
    'SFCK AUTUMN': '#FF2180',
    'SFCK SPRING': '#FF2180',
    'V9KY': '#1B8B37',
  };

  const {
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
  } = useTournament();

  // Helper: parse season start year, e.g. '2025/2026' -> 2025, '2025' -> 2025
  const seasonStartYear = (s?: string | null): number | null => {
    if (!s) return null;
    const str = String(s).trim();
    if (/^\d{4}\s*\/\s*\d{4}$/.test(str)) {
      const [start] = str.split('/');
      return parseInt(start, 10) || null;
    }
    const y = parseInt(str, 10);
    return Number.isFinite(y) ? y : null;
  };
  const currentYear = new Date().getFullYear();

  const today = new Date();
  const hasStarted = (t: { start_date?: string | null; season?: string | null; status?: string | null }) => {
    // Explicit status takes precedence
    if (t.status === 'upcoming') return false;
    if (t.start_date) {
      const d = new Date(t.start_date);
      if (!isNaN(d.getTime())) return d <= today;
    }
    // Fallback: season start year <= current year considered started
    const sy = seasonStartYear(t.season);
    return sy != null ? sy <= today.getFullYear() : true;
  };

  const archiveList = tournaments.filter((t) =>
    // not "current"
    !t.is_current && (t.status !== 'current') &&
    // match season filter if set
    (selectedSeason ? String(t.season) === selectedSeason : true) &&
    // exclude tournaments that haven't started yet
    hasStarted(t)
  );

  // Upcoming tournaments to show under "ПОТОЧНИЙ"
  const currentTournament = tournaments.find(t => t.id === currentTournamentId) || null;
  const currentTitleKey = ((currentTournament?.title || '').trim().toUpperCase());
  const upcoming = tournaments.filter((t) => {
    const titleKey = (t.title || '').trim().toUpperCase();
    const byStatus = t.status === 'upcoming';
    const bySeason = (seasonStartYear(t.season) ?? 0) >= currentYear;
    return (
      t.id !== currentTournamentId &&
      titleKey !== currentTitleKey &&
      (byStatus || (!t.is_current && bySeason))
    );
  });

  const formatUaDate = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  };

  // Seasons that already started (hide seasons with only future tournaments)
  const startedSeasons = useMemo(() => {
    const set = new Set<string>();
    tournaments.forEach((t) => {
      const s = (t.season || '').toString();
      if (!s) return;
      if (hasStarted(t)) set.add(s);
    });
    return Array.from(set).sort().reverse();
  }, [tournaments]);

  // If a not-started season was selected earlier, reset selection
  useEffect(() => {
    if (selectedSeason && !startedSeasons.includes(selectedSeason)) {
      setSelectedSeason(null);
    }
  }, [selectedSeason, startedSeasons, setSelectedSeason]);

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Tabs
        value={mode}
        onChange={(_, v) => setMode(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 1 }}
      >
        <Tab value="current" label="ПОТОЧНИЙ" sx={{ fontWeight: 600 }} />
        <Tab value="archive" label="АРХІВ" sx={{ fontWeight: 600 }} />
      </Tabs>

      {mode === 'current' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5, flexWrap: 'wrap' }}>
            {loading ? (
              <Typography variant="body2" color="text.secondary">Завантаження турнірів…</Typography>
            ) : (
              (() => {
                const t = tournaments.find((x) => x.id === currentTournamentId);
                if (!t) return <Typography variant="body2" color="text.secondary">Поточний турнір не знайдено</Typography>;
                const key = (t.title || '').trim().toUpperCase();
                const color = tournamentColors[key] || theme.palette.primary.main;
                return (
                  <Chip
                    avatar={t.logo_url ? <Avatar src={t.logo_url} alt={t.title || ''} /> : undefined}
                    label={t.title || 'Поточний турнір'}
                    variant="outlined"
                    size="medium"
                    disableRipple
                    sx={{
                      borderRadius: '24px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      px: 1.5,
                      height: 40,
                      textTransform: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      backgroundColor: theme.palette.common.white,
                      border: `1px solid ${color}`,
                      color: theme.palette.text.primary,
                      '&:hover': { borderColor: color },
                      '& .MuiChip-avatar': { width: 24, height: 24 },
                    }}
                  />
                );
              })()
            )}
          {upcoming.length > 0 && upcoming.map((t) => {
            const key = (t.title || '').trim().toUpperCase();
            const color = tournamentColors[key] || theme.palette.primary.main;
            const startText = formatUaDate(t.start_date);
            const tooltip = startText ? `Початок: ${startText}` : (t.season ? `Сезон: ${t.season}` : 'Скоро старт');
            return (
              <Tooltip key={t.id} title={tooltip} arrow>
              <Badge
                overlap="rectangular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      backgroundColor: theme.palette.warning.main,
                      color: theme.palette.getContrastText(theme.palette.warning.main),
                      fontSize: '0.625rem',
                      fontWeight: 900,
                      letterSpacing: '0.06em',
                      px: 0.75,
                      py: 0.25,
                      borderRadius: '6px',
                      boxShadow: `0 0 0 2px ${theme.palette.common.white}`,
                    }}
                  >
                    СКОРО
                  </Box>
                }
                sx={{ '& .MuiBadge-badge': { transform: 'translate(6px, -6px)' } }}
              >
                <Chip
                  avatar={t.logo_url ? <Avatar src={t.logo_url} alt={t.title || ''} /> : undefined}
                  label={t.title || 'Турнір'}
                  variant="outlined"
                  size="medium"
                  disabled
                  sx={{
                    borderRadius: '24px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    px: 1.5,
                    height: 40,
                    textTransform: 'none',
                    backgroundColor: theme.palette.common.white,
                    border: `1px dashed ${color}`,
                    color: theme.palette.text.secondary,
                    opacity: 0.95,
                    '& .MuiChip-avatar': { width: 24, height: 24 },
                  }}
                />
              </Badge>
              </Tooltip>
            );
          })}
        </Box>
      )}

      {mode === 'archive' && (
        <>
          {/* Years filter */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            py: 0.5,
            px: 1,
            mb: 1,
            '&::-webkit-scrollbar': { display: 'none' },
          }}>
            <Chip
              label="Всі сезони"
              variant="outlined"
              size="medium"
              disableRipple
              onClick={() => setSelectedSeason(null)}
              sx={{
                borderRadius: '24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                px: 1.5,
                height: 40,
                textTransform: 'none',
                WebkitTapHighlightColor: 'transparent',
                backgroundColor: selectedSeason == null ? theme.palette.common.white : undefined,
                border: selectedSeason == null ? `1px solid ${theme.palette.primary.main}` : undefined,
                color: selectedSeason == null ? theme.palette.text.primary : theme.palette.text.secondary,
                '&:hover': { borderColor: theme.palette.primary.main },
              }}
            />
            {startedSeasons.map((s) => (
              <Chip
                key={s}
                label={s}
                variant="outlined"
                size="medium"
                disableRipple
                onClick={() => setSelectedSeason(selectedSeason === s ? null : s)}
                sx={{
                  borderRadius: '24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  px: 1.5,
                  height: 40,
                  textTransform: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  backgroundColor: selectedSeason === s ? theme.palette.common.white : undefined,
                  border: selectedSeason === s ? `1px solid ${theme.palette.primary.main}` : undefined,
                  color: selectedSeason === s ? theme.palette.text.primary : theme.palette.text.secondary,
                  '&:hover': { borderColor: theme.palette.primary.main },
                }}
              />
            ))}
          </Box>

          {/* Tournaments list (filtered by selected year) */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            py: 0.5,
            px: 1,
            '&::-webkit-scrollbar': { display: 'none' },
          }}>
            {loading && (
              <Typography variant="body2" color="text.secondary">Завантаження турнірів…</Typography>
            )}
            {!loading && archiveList.length === 0 && (
              <Typography variant="body2" color="text.secondary">Архів порожній</Typography>
            )}
            {archiveList.map((t) => {
              const key = (t.title || '').trim().toUpperCase();
              const color = tournamentColors[key] || theme.palette.primary.main;
              const selected = selectedTournamentId === t.id;
              return (
                <Chip
                  key={t.id}
                  avatar={t.logo_url ? <Avatar src={t.logo_url} alt={t.title || ''} /> : undefined}
                  label={t.title || 'Турнір'}
                  variant="outlined"
                  size="medium"
                  disableRipple
                  onClick={(e) => {
                    setSelectedTournamentId(selected ? null : t.id);
                    (e.currentTarget as HTMLDivElement).blur();
                  }}
                  onTouchEnd={(e) => { (e.currentTarget as HTMLDivElement).blur(); }}
                  sx={{
                    borderRadius: '24px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    px: 1.5,
                    height: 40,
                    textTransform: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    backgroundColor: selected ? `${theme.palette.common.white} !important` : undefined,
                    border: selected ? `1px solid ${color} !important` : undefined,
                    color: selected ? `${theme.palette.text.primary} !important` : theme.palette.text.secondary,
                    '&:hover': { borderColor: color },
                    '& .MuiChip-avatar': { width: 24, height: 24 },
                  }}
                />
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TournamentSwitcher;
