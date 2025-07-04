import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  birth_date?: string;
};

const PlayerProfile = () => {
  const theme = useTheme();
  const { number } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const [prevPlayer, setPrevPlayer] = useState<{ number: number; first_name: string; last_name: string } | null>(null);
  const [nextPlayer, setNextPlayer] = useState<{ number: number; first_name: string; last_name: string } | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!number || isNaN(Number(number))) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('players')
        .select('statistics, photo, first_name, last_name, position, birth_date')
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

  if (!number || isNaN(Number(number))) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Недійсний номер гравця</Box>;
  }

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
            height: { xs: '40vh', md: '80vh' },
            minHeight: { xs: 300, md: 700 },
            background: 'linear-gradient(180deg, rgb(37, 37, 37) 0%, rgb(16, 16, 17) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.common.white,
            textAlign: 'center',
            overflow: 'visible',
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
                maxHeight: { xs: 260, md: 600 },
                width: 'auto',
                mx: 'auto',
                display: 'block',
                zIndex: 11,
                bottom: 0,
                position: 'absolute',
                left: { xs: '45%', md: 'auto' },
                transform: { xs: 'translateX(0)', md: 'translateX(-50%)' },
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
                  xs: 'translate(-80%, 0)',
                  md: 'translate(-50%, -50%)'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'left', md: 'flex-start' },
                textAlign: { xs: 'left', md: 'left' },
                zIndex: 10,
                px: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.6rem' },
                  fontWeight: 500,
                  letterSpacing: '0.05rem',
                  color: theme.palette.common.white,
                  textTransform: 'uppercase',
                  mb: -1,
                  textAlign: { xs: 'left', md: 'left' },
                }}
              >
                {player.first_name}
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '7rem' },
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
                pt: { xs: 2, md: 6 },
                mb: { xs: 3, md: 0 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'transparent',
                pb: { xs: 7, md: 0 },
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
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 16, color: theme.palette.primary.main }}>←</span>
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
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    {nextPlayer.first_name} {nextPlayer.last_name}
                    <span style={{ marginLeft: 16, color: theme.palette.primary.main }}>→</span>
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
            px: { xs: 3, md: 25 },
            py: { xs: 1.5, md: 3 },
            width: '100%',
          }}
        >
          <Grid container justifyContent="flex-start" spacing={{ xs: 3, md: 8 }}>
            {[
              { label: 'Матчі', key: 'matches' },
              { label: 'Голи', key: 'goals' },
              { label: 'Асисти', key: 'assists' },
              { label: 'Жовті картки', key: 'yellow_cards' },
              { label: 'Червоні картки', key: 'red_cards' },
              { label: 'Сейви', key: 'saves' },
            ]
              .filter(stat => !(stat.key === 'saves' && player.position.toLowerCase() === 'універсал'))
              .map((stat) => (
                <Grid
                  item
                  xs={6}
                  sm={3}
                  key={stat.label}
                  sx={{
                    textAlign: { xs: 'left', md: 'left' },
                    py: { xs: 0.5, md: 2 },
                    pr: { xs: 3, sm: 4, md: 8 },
                  }}
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
                      fontSize: { xs: '2rem', sm: '3.6rem', md: '4.2rem' },
                    }}
                  >
                    {player[stat.key as keyof Player] ?? 0}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </Box>

        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            px: { xs: 3, md: 25 },
            py: { xs: 6, md: 8 },
            width: '100%',
          }}
        >
          {isMobile ? (
            <Stack spacing={3} sx={{ width: '100%' }}>
              {[
                {
                  label: 'Номер',
                  value: number || '—',
                },
                {
                  label: 'Дата народження',
                  value: player.birth_date
                    ? new Date(player.birth_date).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—',
                },
                {
                  label: 'Вік',
                  value: player.birth_date
                    ? Math.floor(
                        (new Date().getTime() - new Date(player.birth_date).getTime()) /
                          (1000 * 60 * 60 * 24 * 365.25)
                      )
                    : '—',
                },
                {
                  label: 'Позиція',
                  value: player.position || '—',
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{ textAlign: 'left' }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.grey[500],
                      fontWeight: 600,
                      letterSpacing: '0.03rem',
                      fontFamily: 'MacPawFixelDisplay, sans-serif',
                      fontSize: { xs: '0.85rem', md: '1.1rem' },
                      mb: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1,
                      fontFamily: 'MacPawFixelDisplay, sans-serif',
                      fontSize: { xs: '0.95rem', sm: '0.95rem', md: '1.1rem' },
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Grid container spacing={12} justifyContent="flex-start" alignItems="center">
              {[
                {
                  label: 'Номер',
                  value: number || '—',
                },
                {
                  label: 'Дата народження',
                  value: player.birth_date
                    ? new Date(player.birth_date).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—',
                },
                {
                  label: 'Вік',
                  value: player.birth_date
                    ? Math.floor(
                        (new Date().getTime() - new Date(player.birth_date).getTime()) /
                          (1000 * 60 * 60 * 24 * 365.25)
                      )
                    : '—',
                },
                {
                  label: 'Позиція',
                  value: player.position || '—',
                },
              ].map((item) => (
                <Grid
                  item
                  sm="auto"
                  key={item.label}
                  sx={{ textAlign: 'left' }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.grey[500],
                      fontWeight: 600,
                      letterSpacing: '0.03rem',
                      fontFamily: 'MacPawFixelDisplay, sans-serif',
                      fontSize: { xs: '0.85rem', md: '1.1rem' },
                      mb: 0.5,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1,
                      fontFamily: 'MacPawFixelDisplay, sans-serif',
                      fontSize: { xs: '0.95rem', sm: '0.95rem', md: '1.1rem' },
                    }}
                  >
                    {item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default PlayerProfile;