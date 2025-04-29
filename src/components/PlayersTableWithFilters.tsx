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
      // Aggregate stats across all years for the selected tournament, or all if none selected
      const yearMaps = Object.values(player.statistics || {});
      let statsArray: any[] = [];
      if (selectedTournament) {
        // Specific tournament across all years
        statsArray = yearMaps.flatMap(yearData =>
          Object.entries(yearData)
            .filter(([t]) => t === selectedTournament)
            .map(([, stats]) => stats)
        );
      } else {
        // All tournaments, all years
        statsArray = yearMaps.flatMap(yearData =>
          Object.values(yearData).flatMap(sub =>
            typeof sub === 'object' ? Object.values(sub as Record<string, any>) : []
          )
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
          px: { xs: 2, md: 0 },
          mt: 0,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {availableTournaments.length > 0 && (
          <Box>
            <Typography variant="subtitle2" mb={0.5}>Турнір</Typography>
            <Box sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              py: 1,
              px: 0.5,
              '&::-webkit-scrollbar': { display: 'none' },
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
                    sx={{
                      borderRadius: '24px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      px: 1.5,
                      height: 40,
                      textTransform: 'none',
                      border: selectedTournament === tournamentName
                        ? `1px solid ${tournamentColors[tournamentName]}`
                        : undefined,
                      backgroundColor: selectedTournament === tournamentName
                        ? tournamentColors[tournamentName]
                        : undefined,
                      color: selectedTournament === tournamentName
                        ? '#FFFFFF'
                        : undefined,
                      '&:hover': {
                        backgroundColor: selectedTournament === tournamentName
                          ? tournamentColors[tournamentName]
                          : theme.palette.action.hover,
                      },
                    }}
                    onClick={() =>
                      setSelectedTournament(prev =>
                        prev === tournamentName ? '' : tournamentName
                      )
                    }
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