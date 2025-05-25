import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import PlayerCard from './PlayerCard';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

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

const fadeSlideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

  if (loading) {
    return <Box sx={{ minHeight: '100vh' }} />;
  }

  if (players.length === 0) {
    return null;
  }

  const animationDuration = '0.5s';
  const animationEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const getAnimationDelay = (index: number) => `${index * 80}ms`;

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'grid' },
        flexDirection: { xs: 'column', sm: 'initial' },
        px: { xs: 0, sm: 'initial' },
        gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        rowGap: { sm: theme.spacing(2.5) },
        justifyItems: { sm: 'center' },
        gap: 0,
      }}
    >
      {players.map((player: Player, index: number) => (
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
          sx={{
            mb: { xs: index < players.length - 1 ? 2 : 0, sm: 0 },
            animation: `${fadeSlideUp} ${animationDuration} ${animationEasing}`,
            animationDelay: getAnimationDelay(index),
            animationFillMode: 'both',
          }}
        />
      ))}
    </Box>
  );
};

export default PlayersList;