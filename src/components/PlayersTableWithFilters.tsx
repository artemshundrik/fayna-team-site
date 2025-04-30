import React from 'react';

import { useState, useMemo, useEffect } from 'react';
import { Box, Select, MenuItem, Typography, Chip, Skeleton, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PlayersTable from './PlayersTable';
import { Player } from '@/types/player'; // або адаптуй свій тип якщо в тебя інший
import { Tournament } from '@/types/tournament'; // якщо є типи для турнірів

// Map tournament titles to their active chip colors
const tournamentColors: Record<string, string> = {
  'R-CUP': '#603CB6',          // Red for R-CUP
  'SFCK AUTUMN': '#FF2180',    // Pink for SFCK Autumn
  'SFCK SPRING': '#FF2180',    // Purple for SFCK Spring
  'V9KY': '#1B8B37',           // Green for V9KY
  // Add more mappings as needed
};

interface PlayersTableWithFiltersProps {
  players: Player[];
  tournaments: Tournament[];
}

export default function PlayersTableWithFilters({ players, tournaments }: PlayersTableWithFiltersProps) {
  const theme = useTheme();
  const [selectedTournament, setSelectedTournament] = useState<string>('');

  // Мемоізуємо доступні турніри для вибраного року або всі турніри якщо рік не вибрано
  const availableTournaments = useMemo(() => {
    if (!players || players.length === 0) return [];

    // Всі турніри за всі роки
    const allTournaments = new Set<string>();
    players.forEach(player => {
      Object.values(player.statistics || {}).forEach(yearData => {
        Object.keys(yearData).forEach(tournament => allTournaments.add(tournament));
      });
    });
    return Array.from(allTournaments).sort();
  }, [players]);

  const filteredPlayers = useMemo(() => {
    return players.map(player => {
      let statsArray: any[] = [];
      if (selectedTournament) {
        // Sum only the selected tournament across all years
        statsArray = Object.values(player.statistics || {}).flatMap(
          yearData => {
            const t = (yearData as Record<string, any>)[selectedTournament];
            return t && typeof t === 'object' ? [t] : [];
          }
        );
      } else {
        // Aggregate all tournaments across all years
        statsArray = Object.values(player.statistics || {}).flatMap(
          yearData =>
            // yearData is Record<tournamentName, statsObject>
            Object.values(yearData)
        );
      }
      const agg = statsArray.reduce((acc, stats) => ({
        matches: acc.matches + (stats.matches || 0),
        goals: acc.goals + (stats.goals || 0),
        assists: acc.assists + (stats.assists || 0),
        saves: acc.saves + (stats.saves || 0),
        yellowCards: acc.yellowCards + (stats.yellow_cards || 0),
        redCards: acc.redCards + (stats.red_cards || 0),
      }), { matches: 0, goals: 0, assists: 0, saves: 0, yellowCards: 0, redCards: 0 });
      return {
        ...player,
        name: `${player.first_name} ${player.last_name}`.trim(),
        matches: agg.matches,
        goals: agg.goals,
        assists: agg.assists,
        saves: agg.saves,
        yellowCards: agg.yellowCards,
        redCards: agg.redCards,
        photoUrl: player.photo ? `/${player.photo}` : '',
      };
    });
  }, [players, selectedTournament]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 секунда затримки

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          px: { xs: 0, md: 0 },
          mt: 0,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {availableTournaments.length > 0 && (
          <Box>
            <Box sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              py: 0,
              px: 0,
              '&::-webkit-scrollbar': { display: 'none' },
              touchAction: 'manipulation',
            }}>
              {availableTournaments.map(tournamentName => {
                const tournamentObj = tournaments.find(
                  t => t.title.trim().toUpperCase() === tournamentName.trim().toUpperCase()
                );
                const logoSrc = tournamentObj?.logo_url || tournamentObj?.logoUrl || tournamentObj?.iconUrl || tournamentObj?.icon;
                return (
                  <Chip
                    key={tournamentObj?.id || tournamentName}
                    avatar={logoSrc ? (
                      <Avatar
                        src={logoSrc}
                        alt={tournamentName}
                        sx={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    ) : undefined}
                    label={tournamentName}
                    variant="outlined"
                    size="medium"
                    disableRipple
                    disableTouchRipple
                    sx={{
                      borderRadius: '24px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      px: 1.5,
                      height: 40,
                      textTransform: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      backgroundColor: selectedTournament === tournamentName
                        ? `${theme.palette.common.white} !important`
                        : undefined,
                      border: selectedTournament === tournamentName
                        ? `1px solid ${tournamentColors[tournamentName]} !important`
                        : undefined,
                      color: selectedTournament === tournamentName
                        ? `${theme.palette.text.primary} !important`
                        : theme.palette.text.secondary,
                    }}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      setSelectedTournament(prev =>
                        prev === tournamentName ? '' : tournamentName
                      );
                      // remove hover/focus state
                      (e.currentTarget as HTMLDivElement).blur();
                    }}
                    onTouchEnd={(e: React.TouchEvent<HTMLDivElement>) => {
                      // remove hover/focus state on mobile
                      (e.currentTarget as HTMLDivElement).blur();
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', mt: 4 }}>
          {[...Array(5)].map((_, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="20%" height={30} />
              <Skeleton variant="text" width="10%" height={30} />
              <Skeleton variant="text" width="10%" height={30} />
              <Skeleton variant="text" width="10%" height={30} />
              <Skeleton variant="text" width="10%" height={30} />
              <Skeleton variant="text" width="10%" height={30} />
            </Box>
          ))}
        </Box>
      ) : (
        <PlayersTable players={filteredPlayers} />
      )}
    </Box>
  );
}