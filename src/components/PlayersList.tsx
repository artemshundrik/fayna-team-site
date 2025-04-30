import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import PlayerCard from './PlayerCard';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';

type Player = {
  first_name: string;
  last_name: string;
  position: string;
  number: number;
  photo: string;
  birth_date: string;
  matches: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
};

type PlayersListProps = {
  position?: string;
};

const PlayersList: React.FC<PlayersListProps> = ({ position }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('players').select('*');
      if (error) {
        console.error('Помилка завантаження гравців:', error);
      } else {
        console.log('📦 Отримані гравці:', data);
        setPlayers(
          (position ? data.filter((player: Player) => player.position === position) : data)
            .sort((a: Player, b: Player) => {
              if (a.position === 'Воротар' && b.position !== 'Воротар') return -1;
              if (a.position !== 'Воротар' && b.position === 'Воротар') return 1;
              return a.number - b.number;
            })
        );
      }
      setLoading(false);
    };

    fetchPlayers();
  }, [position]);

  if (players.length === 0) {
    if (loading) {
      // show grid of skeletons
      return (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            columnGap: theme.spacing(2),
            rowGap: theme.spacing(2.5),
            justifyItems: 'center',
            width: '100%',
            maxWidth: '100%',
            m: 0,
            p: 0,
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <Box key={idx} sx={{ width: '100%', maxWidth: 280 }}>
              <Skeleton variant="rectangular" width="100%" height={160} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))}
        </Box>
      );
    }
    return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Немає гравців 😕</div>;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        columnGap: theme.spacing(2),
        rowGap: theme.spacing(2.5),
        justifyItems: 'center',
        width: '100%',
        maxWidth: '100%',
        m: 0,
        p: 0,
      }}
    >
      {players.map((player: Player) => (
        <PlayerCard
          key={player.number}
          name={`${player.first_name} ${player.last_name}`}
          position={player.position}
          number={player.number}
          photoUrl={player.photo.replace('images/players/', '')}
          birthDate={player.birth_date}
          matches={player.matches}
          goals={player.goals}
          assists={player.assists}
          yellowCards={player.yellow_cards}
          redCards={player.red_cards}
          saves={player.saves}
        />
      ))}
    </Box>
  );
};

export default PlayersList;