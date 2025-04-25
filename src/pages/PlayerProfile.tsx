import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { supabase } from '../supabase';
import Layout from '../layout/Layout';

const fadeIn = {
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(0)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

type Player = {
  id: number;
  first_name: string;
  last_name: string;
  number: number;
  position: string;
  photo: string;
  birth_date: string;
  matches: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
};

const PlayerProfile = () => {
  const theme = useTheme();
  const { number } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('number', number)
        .single();
      if (data) {
        setPlayer(data);
        console.log('Фото гравця:', data.photo);
      }
      setLoading(false);
    };
    fetchPlayer();
  }, [number]);

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  if (!player) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Гравця не знайдено</Box>;
  }

  const photoUrl = player.photo.replace('images/players/', '');

  return (
    <Layout>
      <Box sx={{ p: 0, m: 0 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100vw',
            height: { xs: '60vh', md: '80vh' },
            background: 'linear-gradient(180deg, rgb(37, 37, 37) 0%, rgb(16, 16, 17) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.common.white,
            textAlign: 'center',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Player Image */}
            <Box
              component="img"
              src={`/images/players/${photoUrl}`}
              alt={`${player.first_name} ${player.last_name}`}
              sx={{
                ...fadeIn,
                animation: 'fadeInUp 1.2s ease-out forwards',
                opacity: 0,
                maxHeight: { xs: 400, md: 600 },
                width: 'auto',
                mx: 'auto',
                display: 'block',
                zIndex: 11,
                bottom: 0,
                position: 'absolute',
                transform: 'translateY(-50%)',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '50%',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent)',
                zIndex: 12,
              }}
            />

            {/* Name and Position Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                zIndex: 10,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: { xs: '1.4rem', md: '1.6rem' },
                  fontWeight: 500,
                  letterSpacing: '0.05rem',
                  color: theme.palette.common.white,
                  textTransform: 'uppercase',
                  mb: -4,
                }}
              >
                {player.first_name}
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '4rem', md: '10rem' },
                  fontWeight: 900,
                  letterSpacing: '-0.05rem',
                  background: `linear-gradient(to bottom, ${theme.palette.primary.main}, rgba(255, 51, 77, 0.4))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {player.last_name.toUpperCase()}
              </Typography>
            </Box>

            {/* <Typography
              variant="subtitle2"
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                fontSize: { xs: '1rem', md: '1.4rem' },
                fontWeight: 600,
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                pr: theme.spacing(4),
                zIndex: 10,
              }}
            >
              {player.position}
            </Typography> */}
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Статистика</Typography>
          <ul>
            <li>Матчів: {player.matches ?? 0}</li>
            <li>Голи: {player.goals ?? 0}</li>
            <li>Асисти: {player.assists ?? 0}</li>
            <li>Жовті картки: {player.yellow_cards ?? 0}</li>
            <li>Червоні картки: {player.red_cards ?? 0}</li>
            <li>Сейви: {player.saves ?? 0}</li>
          </ul>
        </Box>
      </Box>
    </Layout>
  );
};

export default PlayerProfile;