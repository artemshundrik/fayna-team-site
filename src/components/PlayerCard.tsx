import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardMedia, Typography, useTheme, styled } from '@mui/material';
import { alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import { supabase } from '../supabase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

function getUkrainianYears(age: number): string {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'років';
  if (lastDigit === 1) return 'рік';
  if (lastDigit >= 2 && lastDigit <= 4) return 'роки';
  return 'років';
}

function calculateAge(birthDateStr: string): number {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();
  if (m < 0 || (m === 0 && d < 0)) age--;
  return age;
}

type PlayerCardProps = {
  name: string;
  position: string;
  number: number;
  photoUrl?: string;
  hoverPhotoUrl?: string;
  photoComponent?: React.ReactNode;
  birthDate?: string;
  matches?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  saves?: number;
  sx?: object;
};

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  overflow: 'hidden',
  borderRadius: theme.shape.medium,
  position: 'relative',
  color: theme.palette.common.white,
  width: '100%',
  maxWidth: 360,
  margin: '0 auto',
  background: `linear-gradient(180deg, rgb(37, 37, 37) 0%, rgb(16, 16, 17) 100%)`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  animation: `${fadeIn} 0.6s ease-out`,
  fontFamily: theme.typography.fontFamily,
  minHeight: isMobile ? 380 : 460,
  [theme.breakpoints.up('md')]: {
    maxWidth: 480,
  },
  // Можлива підтримка stagger-ефекту через проп animationDelay у майбутньому
}));

const HoverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  height: '50%',
  backgroundImage: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.85)} 0%, ${alpha(theme.palette.common.black, 0)} 100%)`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  pointerEvents: 'none',
}));

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  position,
  number,
  photoUrl,
  hoverPhotoUrl,
  photoComponent,
  birthDate,
  sx,
}) => {
  const theme = useTheme();
  const [hover, setHover] = React.useState(false);
  // useMediaQuery for mobile detection
  const isMobile = typeof window !== 'undefined'
    ? window.matchMedia('(max-width:599.95px)').matches
    : false;
  const age = birthDate ? calculateAge(birthDate) : 0;
  const years = getUkrainianYears(age);
  const formattedBirthDate = birthDate
    ? new Date(birthDate).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const basePhoto = photoUrl ?? '/images/player-placeholder.png';
  const hoverPhoto = hoverPhotoUrl ?? null;

  const [overallStats, setOverallStats] = React.useState<{
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    saves: number;
  }>({
    matches: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    saves: 0,
  });

  React.useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('players')
        .select('statistics')
        .eq('number', number)
        .single();
      if (error || !data?.statistics) {
        console.error('Error fetching statistics JSON:', error);
        return;
      }
      // data.statistics is an object: { year: { tournament: {goals,..} } }
      const statsObj = data.statistics as Record<string, Record<string, {
        goals: number;
        saves: number;
        assists: number;
        matches: number;
        red_cards: number;
        yellow_cards: number;
      }>>;
      // Flatten and accumulate all nested values
      const aggregated = Object.values(statsObj)
        .flatMap(Object.values)
        .reduce(
          (acc, curr) => ({
            matches: acc.matches + (curr.matches || 0),
            goals: acc.goals + (curr.goals || 0),
            assists: acc.assists + (curr.assists || 0),
            yellowCards: acc.yellowCards + (curr.yellow_cards || 0),
            redCards: acc.redCards + (curr.red_cards || 0),
            saves: acc.saves + (curr.saves || 0),
          }),
          { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, saves: 0 }
        );
      setOverallStats(aggregated);
    }
    fetchStats();
  }, [number]);

  if (isMobile) {
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');
    return (
      <Link to={`/player/${number}`} style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            background: '#fff',
            borderRadius: 1,
            px: 0,
            py: 1,
            mb: 1.3,
            minHeight: 92,
            width: '100%',
            cursor: 'pointer',
            border: theme => `1.5px solid ${theme.palette.grey[100]}`,
            position: 'relative',
            animation: `${fadeIn} 0.7s cubic-bezier(0.22, 1, 0.36, 1)`,
            ...sx
          }}
        >
          <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2 }}>
            <Typography
              sx={{
                fontSize: 28,
                color: theme => theme.palette.grey[400],
                fontWeight: 600,
                lineHeight: 1,
                minWidth: 34,
                mr: 2,
                fontFamily: 'FixelDisplay, sans-serif',
                letterSpacing: 0.5,
                textShadow: '0 1px 0 #fff5, 0 1px 6px #eee8'
              }}
            >
              {number}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: 500,
                  fontSize: 15,
                  color: '#232323',
                  mr: 0.5,
                  fontFamily: 'FixelDisplay, sans-serif',
                }}
              >
                {firstName}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontWeight: 900,
                  fontSize: 18,
                  color: '#111',
                  fontFamily: 'FixelDisplay, sans-serif',
                }}
              >
                {lastName}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 12,
                color: theme => theme.palette.primary.main,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                mt: 0.2,
                fontFamily: 'FixelDisplay, sans-serif',
              }}
            >
              {position}
            </Typography>
          </Box>
          <Box sx={{ width: 72, height: 88, minWidth: 72, ml: 2, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Box
              component="img"
              src={hover && hoverPhoto ? hoverPhoto : basePhoto}
              alt={name}
              sx={{
                width: 72,
                height: 88,
                objectFit: 'contain',
                borderRadius: '50%',
                transition: 'opacity 0.4s ease',
              }}
            />
          </Box>
        </Box>
      </Link>
    );
  }

  return (
    <Link to={`/player/${number}`} style={{ textDecoration: 'none' }}>
      <StyledCard
        isMobile={isMobile}
        onMouseEnter={() => !isMobile && setHover(true)}
        onMouseLeave={() => !isMobile && setHover(false)}
      >
      <Box sx={{
        position: 'relative',
        overflow: 'hidden',
        height: isMobile ? 380 : 460,
        aspectRatio: isMobile ? undefined : '480 / 580',
        background: 'linear-gradient(145deg, #242424 0%, #020202 100%)',
      }}>
        {photoComponent || (
          <Box
            component="img"
            src={hover && hoverPhoto ? hoverPhoto : basePhoto}
            alt={name}
            sx={{
              width: isMobile ? 72 : '100%',
              height: isMobile ? 88 : '100%',
              objectFit: 'contain',
              borderRadius: isMobile ? '50%' : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            p: theme.spacing(10, 0, 3),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundImage: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.9)} 0%, ${alpha(theme.palette.common.black, 0)} 100%)`,
            zIndex: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              transition: 'opacity 0.4s ease',
              opacity: !isMobile && hover ? 0 : 1,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            {name.split(' ')[0]}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              transition: 'opacity 0.4s ease',
              opacity: !isMobile && hover ? 0 : 1,
              color: theme.palette.common.white,
              fontWeight: 900,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            {name.split(' ')[1]}
          </Typography>
        </Box>
        <Typography
          variant="h1"
          sx={{
            position: 'absolute',
            top: theme.spacing(4),
            left: theme.spacing(4),
            fontFamily: 'AdiCupQ2022, sans-serif',
            fontSize: '3.2rem',
            fontWeight: 900,
            transition: 'opacity 0.4s ease, color 0.4s ease',
            color: theme.palette.common.white,
            opacity: hover ? 0.3 : 1,
          }}
        >
          {number}
        </Typography>
        <HoverOverlay
          sx={{
            transform: !isMobile && hover ? 'translateY(0%)' : 'translateY(100%)',
            transition: 'transform 0.4s ease',
            zIndex: 2,
          }}
        >
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            {position !== 'Воротар' ? (
              <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.common.white, fontWeight: 500 }}>
                  {overallStats.goals}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                  Голи
                </Typography>
              </Box>
            ) : (
              <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.common.white, fontWeight: 500 }}>
                  {overallStats.saves}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                  Сейви
                </Typography>
              </Box>
            )}
            <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.common.white, fontWeight: 500 }}>
                {overallStats.assists}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                Асисти
              </Typography>
            </Box>
            <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.common.white, fontWeight: 500 }}>
                {overallStats.matches}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                Матчі
              </Typography>
            </Box>
            <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: theme.spacing(1) }}>
                <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.warning.main, fontWeight: 500 }}>
                  {overallStats.yellowCards}
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.error.main, fontWeight: 500 }}>
                  {overallStats.redCards}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                Картки
              </Typography>
            </Box>
          </Box>
          {birthDate && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: theme.spacing(1),
              mt: theme.spacing(2),
              px: theme.spacing(3),
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.common.white }}>
                🎂 {formattedBirthDate}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.common.white }}>
                {age} {years}
              </Typography>
            </Box>
          )}
        </HoverOverlay>
      </Box>
      </StyledCard>
    </Link>
  );
};

export default PlayerCard;
