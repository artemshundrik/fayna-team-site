import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import PlayersTable from './PlayersTable';
import { supabase } from '../supabase';

type Player = {
  id: string;
  first_name: string;
  last_name: string;
  number?: number;
  matches?: number;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  saves?: number;
  photo_url?: string;
};

const PlayerStatistics: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*');
      if (data) {
        setPlayers(data);
      } else {
        console.error(error);
      }
    };

    fetchPlayers();
  }, []);

  const playerStats = players.map((p: any) => ({
    id: p.id,
    number: p.number,
    name: `${p.first_name} ${p.last_name}`,
    matches: p.matches ?? 0,
    goals: p.goals ?? 0,
    assists: p.assists ?? 0,
    yellowCards: p.yellow_cards ?? 0,
    redCards: p.red_cards ?? 0,
    saves: p.saves ?? 0,
    photoUrl: p.photo ? p.photo.replace('images/players/', '') : '',
  }));

  return (
    <Stack spacing={4}>
      <PlayersTable players={playerStats} />
    </Stack>
  );
};

export default PlayerStatistics;
