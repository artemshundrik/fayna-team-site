import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardMedia, Typography, useTheme, styled, Skeleton } from '@mui/material';
import { alpha } from '@mui/material';
import { keyframes } from '@emotion/react';

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
  birthDate?: string;
  matches?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  saves?: number;
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  overflow: 'hidden',
  borderRadius: 0,
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
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
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
}));

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  position,
  number,
  photoUrl,
  birthDate,
  matches,
  goals,
  assists,
  yellowCards,
  redCards,
  saves,
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
      }}>
        {photoUrl ? (
          <CardMedia
            component="img"
            image={`/images/players/${photoUrl}`}
            alt={name}
            sx={{
              position: 'relative',
              width: '100%',
              height: isMobile ? 380 : 'auto',
              objectFit: 'cover',
              objectPosition: 'top',
              transition: 'transform 0.4s ease',
              transform: hover ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={isMobile ? 380 : 460}
            animation="wave"
            sx={{
              bgcolor: 'grey.800',
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
            color: hover ? theme.palette.common.white : theme.palette.primary.main,
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
                  {goals ?? 0}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                  Голи
                </Typography>
              </Box>
            ) : (
              <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.common.white, fontWeight: 500 }}>
                  {saves ?? 0}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                  Сейви
                </Typography>
              </Box>
            )}
            <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.common.white, fontWeight: 500 }}>
                {assists ?? 0}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                Асисти
              </Typography>
            </Box>
            <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.common.white, fontWeight: 500 }}>
                {matches ?? 0}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.common.white, fontWeight: 600 }}>
                Матчі
              </Typography>
            </Box>
            <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: theme.spacing(1) }}>
                <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.warning.main, fontWeight: 500 }}>
                  {yellowCards ?? 0}
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '2.5rem', color: theme.palette.error.main, fontWeight: 500 }}>
                  {redCards ?? 0}
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
