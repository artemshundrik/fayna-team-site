import React, { useEffect, useState } from 'react';
import { Stack, CircularProgress } from '@mui/material';
import PlayersTableWithFilters from './PlayersTableWithFilters';
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
  statistics?: any;
};

type Tournament = {
  id: string;
  title: string;
};

const PlayerStatistics: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: playersData, error: playersError } = await supabase.from('players').select('*');
      const { data: tournamentsData, error: tournamentsError } = await supabase.from('tournaments').select('*');

      if (playersData) setPlayers(playersData);
      if (tournamentsData) setTournaments(tournamentsData);

      if (playersError) console.error(playersError);
      if (tournamentsError) console.error(tournamentsError);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="300px">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <PlayersTableWithFilters players={players} tournaments={tournaments} />
    </Stack>
  );
};

export default PlayerStatistics;
