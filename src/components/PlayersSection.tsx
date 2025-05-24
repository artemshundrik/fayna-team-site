import React, { useState, useEffect, useRef } from 'react';
// Enable source-map debugging for easier tracing
import { Box, Typography, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PlayerCard from './PlayerCard';
const MemoPlayerCard = React.memo(PlayerCard);
import { supabase } from '../supabase';

const resolvePhotoUrl = (raw: string | null): string => {
  if (!raw) return '/images/player-placeholder.png';
  const fileName = raw.replace(/^images\/players\//, '');
  return `/images/players/${fileName}`;
};

const SafeImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? '/images/player-placeholder.png' : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
      }}
    />
  );
};

interface Player {
  first_name: string;
  last_name: string;
  position: string;
  number: string;
  photo: string;
}

const PlayersSection: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const elements = document.querySelectorAll('[data-player-index]');
    const newVisible = [...visibleCards];

    elements.forEach((el, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            newVisible[idx] = true;
            setVisibleCards([...newVisible]);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach(o => o.disconnect());
    };
  }, [players]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from<Player>('players')
        .select('first_name, last_name, position, number, photo')
        .order('number', { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      const playersWithUrls = (data || []).map(p => ({
        ...p,
        photo: resolvePhotoUrl(p.photo),
      }));

      setPlayers(playersWithUrls);
    };
    fetchPlayers();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (isScrolling) return;
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;

    setIsScrolling(true);
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(() => setIsScrolling(false), 400); // ~0.4 s debounce
  };

  return (
    <Box component="section" sx={{ backgroundColor: 'common.white', py: 6 }}>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 10 },
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '-0.03em',
            }}
          >
            ГРАВЦІ
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <IconButton
              onClick={() => handleScroll('left')}
              aria-label="Scroll players left"
              color="primary"
              sx={{
                borderRadius: '50%',
                width: 40,
                height: 40,
                border: theme => `1px solid ${theme.palette.grey[400]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s, color 0.3s',
                '&:hover': {
                  borderColor: theme => theme.palette.primary.main,
                },
              }}
            >
              <KeyboardArrowLeftIcon
                sx={{
                  fontSize: 24,
                  color: theme => theme.palette.text.primary,
                  transition: 'transform 0.3s ease, color 0.3s ease',
                  '.MuiIconButton-root:hover &': {
                    transform: 'scale(1.05)',
                    color: theme => theme.palette.primary.main,
                  },
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => handleScroll('right')}
              aria-label="Scroll players right"
              color="primary"
              sx={{
                borderRadius: '50%',
                width: 40,
                height: 40,
                border: theme => `1px solid ${theme.palette.grey[400]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s, color 0.3s',
                '&:hover': {
                  borderColor: theme => theme.palette.primary.main,
                },
              }}
            >
              <KeyboardArrowRightIcon
                sx={{
                  fontSize: 24,
                  color: theme => theme.palette.text.primary,
                  transition: 'transform 0.3s ease, color 0.3s ease',
                  '.MuiIconButton-root:hover &': {
                    transform: 'scale(1.05)',
                    color: theme => theme.palette.primary.main,
                  },
                }}
              />
            </IconButton>
          </Box>
        </Box>
        <Box position="relative">
          <Box>
            <Box
              ref={scrollRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                px: { xs: 2, md: 10 },
                gap: theme => theme.spacing(2),
              }}
            >
              {players.map((p, index) => (
                <Box
                  key={p.number}
                  data-player-index={index}
                  sx={{
                    flex: '0 0 80%',
                    maxWidth: 360,
                    scrollSnapAlign: 'center',
                    opacity: visibleCards[index] ? 1 : 0,
                    transform: visibleCards[index] ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                  }}
                >
                  <MemoPlayerCard
                    name={`${p.first_name} ${p.last_name}`}
                    position={p.position}
                    number={p.number}
                    photoComponent={<SafeImage src={p.photo} alt={p.first_name} />}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PlayersSection;