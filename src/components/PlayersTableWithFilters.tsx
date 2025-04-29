import React from 'react';

import { useState, useMemo, useEffect } from 'react';
import { Box, Select, MenuItem, Typography, Chip, Skeleton } from '@mui/material';
import PlayersTable from './PlayersTable';
import { Player } from '@/types/player'; // або адаптуй свій тип якщо в тебе інший
import { Tournament } from '@/types/tournament'; // якщо є типи для турнірів

interface PlayersTableWithFiltersProps {
  players: Player[];
  tournaments: Tournament[];
}

export default function PlayersTableWithFilters({ players, tournaments }: PlayersTableWithFiltersProps) {
  const years = useMemo(() => {
    const allYears = new Set<string>();
    players.forEach(player => {
      if (player.statistics) {
        Object.keys(player.statistics).forEach(year => allYears.add(year));
      }
    });
    return Array.from(allYears).sort();
  }, [players]);

  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedTournament, setSelectedTournament] = useState<string>('');

  // Мемоізуємо доступні турніри для вибраного року або всі турніри якщо рік не вибрано
  const availableTournaments = useMemo(() => {
    if (!players || players.length === 0) return [];

    if (selectedYear === '') {
      // Всі турніри за всі роки
      const allTournaments = new Set<string>();
      players.forEach(player => {
        Object.values(player.statistics || {}).forEach(yearData => {
          Object.keys(yearData).forEach(tournament => allTournaments.add(tournament));
        });
      });
      return Array.from(allTournaments).sort();
    } else {
      // Турніри конкретного року
      return Array.from(
        new Set(
          players.flatMap(player => Object.keys(player.statistics?.[selectedYear] || {}))
        )
      ).sort();
    }
  }, [players, selectedYear]);

  // Прибрати цей useEffect:
  // useEffect(() => {
  //   if (years.length > 0 && !selectedYear) {
  //     setSelectedYear(years[0]);
  //   }
  // }, [years, selectedYear]);

  // Оновлений useEffect автоселекту турніру
  useEffect(() => {
    if (selectedYear !== '' && availableTournaments.length > 0 && !availableTournaments.includes(selectedTournament)) {
      setSelectedTournament('');
    }
  }, [availableTournaments, selectedTournament, selectedYear]);

  const filteredPlayers = useMemo(() => {
    return players.map(player => {
      let playerStats = null;

      if (selectedYear !== '' && selectedTournament !== '') {
        // Конкретний рік + конкретний турнір
        playerStats = player.statistics?.[selectedYear]?.[selectedTournament];
      } else if (selectedYear !== '' && selectedTournament === '') {
        // Конкретний рік + усі турніри
        const allTournamentStats = Object.values(player.statistics?.[selectedYear] || {});
        playerStats = allTournamentStats.reduce((acc: any, stats: any) => {
          acc.goals = (acc.goals || 0) + (stats.goals || 0);
          acc.matches = (acc.matches || 0) + (stats.matches || 0);
          acc.assists = (acc.assists || 0) + (stats.assists || 0);
          acc.saves = (acc.saves || 0) + (stats.saves || 0);
          acc.yellow_cards = (acc.yellow_cards || 0) + (stats.yellow_cards || 0);
          acc.red_cards = (acc.red_cards || 0) + (stats.red_cards || 0);
          return acc;
        }, {});
      } else if (selectedYear === '' && selectedTournament !== '') {
        // Усі роки + конкретний турнір
        const allYears = Object.values(player.statistics || {});
        const allTournamentsStats = allYears.flatMap(yearData => Object.entries(yearData))
          .filter(([tournamentName]) => tournamentName === selectedTournament)
          .map(([_, stats]) => stats);
        playerStats = allTournamentsStats.reduce((acc: any, stats: any) => {
          acc.goals = (acc.goals || 0) + (stats.goals || 0);
          acc.matches = (acc.matches || 0) + (stats.matches || 0);
          acc.assists = (acc.assists || 0) + (stats.assists || 0);
          acc.saves = (acc.saves || 0) + (stats.saves || 0);
          acc.yellow_cards = (acc.yellow_cards || 0) + (stats.yellow_cards || 0);
          acc.red_cards = (acc.red_cards || 0) + (stats.red_cards || 0);
          return acc;
        }, {});
      } else if (selectedYear === '' && selectedTournament === '') {
        // Усі роки + усі турніри
        const allYears = Object.values(player.statistics || {});
        const allTournamentStats = allYears.flatMap(yearData => Object.values(yearData));
        playerStats = allTournamentStats.reduce((acc: any, stats: any) => {
          acc.goals = (acc.goals || 0) + (stats.goals || 0);
          acc.matches = (acc.matches || 0) + (stats.matches || 0);
          acc.assists = (acc.assists || 0) + (stats.assists || 0);
          acc.saves = (acc.saves || 0) + (stats.saves || 0);
          acc.yellow_cards = (acc.yellow_cards || 0) + (stats.yellow_cards || 0);
          acc.red_cards = (acc.red_cards || 0) + (stats.red_cards || 0);
          return acc;
        }, {});
      }

      return {
        ...player,
        name: `${player.first_name} ${player.last_name}`.trim(),
        matches: playerStats?.matches || 0,
        goals: playerStats?.goals || 0,
        assists: playerStats?.assists || 0,
        saves: playerStats?.saves || 0,
        yellowCards: playerStats?.yellow_cards || 0,
        redCards: playerStats?.red_cards || 0,
        photoUrl: player.photo ? `/${player.photo}` : '',
      };
    });
  }, [players, selectedYear, selectedTournament]);

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
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="subtitle2" mb={0.5}>Рік</Typography>
          <Select
            size="small"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedTournament('');
            }}
            fullWidth
            variant="outlined"
            displayEmpty
            renderValue={(selected) => {
              if (selected === '') {
                return <span style={{ color: '#9e9e9e' }}>Усі роки</span>;
              }
              return selected;
            }}
          >
            <MenuItem value="">Усі роки</MenuItem>
            {years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </Box>

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
              <Chip
                label="Усі турніри"
                variant={selectedTournament === '' ? 'filled' : 'outlined'}
                color={selectedTournament === '' ? 'primary' : 'default'}
                size="medium"
                sx={{
                  borderRadius: '24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  px: 1.5,
                  height: 40,
                  textTransform: 'none',
                  backgroundColor: (theme) =>
                    selectedTournament === '' ? theme.palette.primary.main : theme.palette.common.white,
                }}
                onClick={() => setSelectedTournament('')}
              />
              {availableTournaments.map(tournament => (
                <Chip
                  key={tournament}
                  label={tournament}
                  variant={selectedTournament === tournament ? 'filled' : 'outlined'}
                  color={selectedTournament === tournament ? 'primary' : 'default'}
                  size="medium"
                  sx={{
                    borderRadius: '24px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    px: 1.5,
                    height: 40,
                    textTransform: 'none',
                    backgroundColor: (theme) =>
                      selectedTournament === tournament ? theme.palette.primary.main : theme.palette.common.white,
                  }}
                  onClick={() => setSelectedTournament(tournament)}
                />
              ))}
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