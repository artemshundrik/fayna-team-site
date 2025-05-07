import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
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
  first_name: string;
  last_name: string;
  position: string;
  photo: string;
  matches?: number;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  saves?: number;
};

const PlayerProfile = () => {
  const theme = useTheme();
  const { number } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const [prevPlayer, setPrevPlayer] = useState<{ number: number; first_name: string; last_name: string } | null>(null);
  const [nextPlayer, setNextPlayer] = useState<{ number: number; first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('statistics, photo, first_name, last_name, position')
        .eq('number', Number(number))
        .single();
      if (data) {
        const stats = data.statistics;
        const flatStats = Object.values(stats || {})
          .flatMap((season: any) => Object.values(season))
          .reduce(
            (acc: any, match: any) => {
              acc.matches = (acc.matches || 0) + (match.matches || 0);
              acc.goals = (acc.goals || 0) + (match.goals || 0);
              acc.assists = (acc.assists || 0) + (match.assists || 0);
              acc.yellow_cards = (acc.yellow_cards || 0) + (match.yellow_cards || 0);
              acc.red_cards = (acc.red_cards || 0) + (match.red_cards || 0);
              acc.saves = (acc.saves || 0) + (match.saves || 0);
              return acc;
            },
            {}
          );
        setPlayer({ ...data, ...flatStats });
        console.log('Фото гравця:', data.photo);
      }

      const { data: allPlayers } = await supabase
        .from('players')
        .select('number, first_name, last_name')
        .order('number', { ascending: true });

      if (allPlayers) {
        const index = allPlayers.findIndex(p => p.number === Number(number));
        setPrevPlayer(allPlayers[index - 1] || null);
        setNextPlayer(allPlayers[index + 1] || null);
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
            background: `
              repeating-linear-gradient(
                135deg,
                rgba(255,255,255,0.06) 0,
                rgba(255,255,255,0.06) 2px,
                transparent 2px,
                transparent 6px
              ),
              linear-gradient(180deg, rgb(37, 37, 37) 0%, rgb(16, 16, 17) 100%)`,
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
                transform: {
                  xs: 'translateY(0)',
                  md: 'translateY(-50%)'
                },
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
                top: { xs: '50%', md: '50%' },
                left: '50%',
                transform: {
                  xs: 'translate(-50%, 0)',
                  md: 'translate(-50%, -50%)'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                zIndex: 10,
                px: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.6rem' },
                  fontWeight: 500,
                  letterSpacing: '0.05rem',
                  color: theme.palette.common.white,
                  textTransform: 'uppercase',
                  mb: -4,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {player.first_name}
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '10rem' },
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

            <Box
              sx={{
                top: 0,
                left: 0,
                position: 'absolute',
                width: '100%',
                zIndex: 25,
                px: { xs: 2, md: 4 },
                pt: { xs: 6, md: 6 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'transparent',
              }}
            >
              {prevPlayer && (
                <Typography
                  component="a"
                  href={`/player/${prevPlayer.number}`}
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: theme.palette.common.white,
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                    },
                  }}
                >
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: theme.palette.primary.main }}>←</span>
                    {prevPlayer.first_name} {prevPlayer.last_name}
                  </Box>
                </Typography>
              )}
              {nextPlayer && (
                <Typography
                  component="a"
                  href={`/player/${nextPlayer.number}`}
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: theme.palette.common.white,
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                    },
                  }}
                >
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    {nextPlayer.first_name} {nextPlayer.last_name}
                    <span style={{ color: theme.palette.primary.main }}>→</span>
                  </Box>
                </Typography>
              )}
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

        <Box
          sx={{
            background: `linear-gradient(180deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
            px: { xs: 2, md: 18 },
            py: { xs: 2, md: 3 },
            width: '100%',
          }}
        >
          <Grid container justifyContent="space-around">
            {[
              { label: 'Матчі', key: 'matches' },
              { label: 'Голи', key: 'goals' },
              { label: 'Асисти', key: 'assists' },
              { label: 'Жовті картки', key: 'yellow_cards' },
              { label: 'Червоні картки', key: 'red_cards' },
              { label: 'Сейви', key: 'saves' },
            ]
              .filter(stat => !(stat.key === 'saves' && player.position.toLowerCase() === 'універсал'))
              .map((stat, idx) => (
                <Grid
                  item
                  xs={6}
                  sm={3}
                  key={stat.label}
                  sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      letterSpacing: '0.03rem',
                      fontFamily: 'MacPawFixelDisplay, sans-serif',
                      fontSize: { xs: '0.9rem', md: '1.1rem' },
                      mb: 1,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1,
                      fontFamily: 'MacPawFixelDisplay, sans-serif',
                      fontSize: { xs: '2.8rem', sm: '3.6rem', md: '4.2rem' },
                    }}
                  >
                    {player[stat.key as keyof Player] ?? 0}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default PlayerProfile;