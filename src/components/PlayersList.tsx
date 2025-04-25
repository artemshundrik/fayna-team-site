import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import PlayerCard from './PlayerCard';

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
  position: string;
};

const PlayersList: React.FC<PlayersListProps> = ({ position }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*');
      if (error) {
        console.error('Помилка завантаження гравців:', error);
      } else {
        console.log('📦 Отримані гравці:', data);
        setPlayers(
          data
            .filter((player: Player) => player.position === position)
            .sort((a: Player, b: Player) => a.number - b.number)
        );
      }
    };

    fetchPlayers();
  }, [position]);

  if (players.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Немає гравців 😕</div>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        columnGap: '2rem',
        rowGap: '2.5rem',
        justifyItems: { xs: 'center', md: 'start' },
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: 0,
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
    </div>
  );
};

export default PlayersList;