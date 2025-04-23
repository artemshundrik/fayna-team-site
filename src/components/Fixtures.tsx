import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // шлях залежить від твого проєкту
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Box, Button, Typography } from '@mui/material';

const Section = motion(Box);

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;


const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const Card = styled.div<{ full?: boolean }>`
  background: #fff;
  position: relative;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  transition: box-shadow 0.3s ease;

  @media (max-width: 600px) {
    padding: 1rem;
    gap: 0.75rem;
  }

  ${({ full }) =>
    full &&
    `
      @media (max-width: 768px) {
        grid-column: span 1;
      }
    `}

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Teams = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
`;



const Fixtures = () => {
  const [fixtures, setFixtures] = useState<any[]>([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      const { data, error } = await supabase
        .from('matches')
      .select(`
          *,
          team1:team1_id ( name, logo ),
          team2:team2_id ( name, logo ),
          tournament:tournament_id ( logo_url, stadium, address )
        `)
        .order('date', { ascending: true });

      if (!error && data) {
        const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', "п'ятниця", 'субота'];
        const formatted = data.map((match: any) => {
          const dateObj = new Date(`${match.date}T${match.time}`);
          const formatter = new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          });
          const weekdayName = weekdays[dateObj.getDay()];

          return {
            ...match,
            date_text: `${weekdayName}, ${formatter.format(dateObj)}`,
            score: match.score_team1 != null && match.score_team2 != null
              ? `${match.score_team1} - ${match.score_team2}`
              : match.time?.slice(0, 5),
          };
        });

        const now = new Date();
        const pastMatches = formatted
          .filter(m => new Date(`${m.date}T${m.time}`) < now)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const upcomingMatches = formatted
          .filter(m => new Date(`${m.date}T${m.time}`) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const sliced = [
          pastMatches[0], // last match
          upcomingMatches[0], // next match
        ].filter(Boolean);

        setFixtures(sliced);
      } else {
        console.error('Помилка завантаження матчів:', error);
      }
    };

    fetchFixtures();
  }, []);
  return (
    <Section
      sx={(theme) => ({
        px: 2,
        py: 8,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontFamily: 'FixelDisplay, sans-serif',
      })}
    >
      <ContentWrapper
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            Розклад матчів
          </Typography>

          <Button
            href="/matches"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={(theme) => ({
              textTransform: 'none',
              fontWeight: 600,
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            })}
          >
            Всі матчі
          </Button>
        </Box>

        <Grid
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {fixtures.map((match, index) => (
            <Card key={index} full={index === 1}>
              {(index === 0 || index === fixtures.length - 1) && (
                <Box
                  sx={(theme) => ({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: index === 0 ? theme.palette.grey[200] : theme.palette.secondary.dark,
                    color: index === 0 ? theme.palette.text.secondary : theme.palette.common.white,
                    fontSize: '0.875rem',
                    px: 2,
                    py: 1,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  })}
                >
                  {index === 0 ? 'Минула гра' : 'Наступна гра'}
                </Box>
              )}
              <Box
                component="img"
                src={match.tournament?.logo_url || '/default-tournament.png'}
                alt="Tournament"
                height={64}
                sx={{ mb: '6px' }}
              />
              <Box sx={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: 600 }}>{match.date_text}</Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr auto 1fr', sm: '1fr auto 1fr' },
                  alignItems: 'center',
                  justifyItems: 'center',
                  gap: '0.75rem',
                  mt: '0.5rem',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: { xs: '0.25rem', sm: '0.6rem' },
                    minWidth: 'auto',
                    maxWidth: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src={match.team1?.logo || '/default-logo.png'}
                    alt={match.team1?.name || 'Команда 1'}
                    sx={{
                      height: 'clamp(36px, 6vw, 48px)',
                      width: 'clamp(36px, 6vw, 48px)',
                      borderRadius: '50%',
                    }}
                  />
                  <Box
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {match.team1?.name || 'Команда 1'}
                  </Box>
                </Box>

                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      match.score_team1 != null && match.score_team2 != null
                        ? theme.palette.secondary.dark
                        : theme.palette.grey[200],
                    color:
                      match.score_team1 != null && match.score_team2 != null
                        ? theme.palette.common.white
                        : theme.palette.text.secondary,
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.4rem',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    minWidth: '2.2rem',
                    textAlign: 'center',
                  })}
                >
                  {match.score || match.time}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: { xs: '0.25rem', sm: '0.6rem' },
                    minWidth: 'auto',
                    maxWidth: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src={match.team2?.logo || '/default-logo.png'}
                    alt={match.team2?.name || 'Команда 2'}
                    sx={{
                      height: 'clamp(36px, 6vw, 48px)',
                      width: 'clamp(36px, 6vw, 48px)',
                      borderRadius: '50%',
                    }}
                  />
                  <Box
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {match.team2?.name || 'Команда 2'}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.8, mt: '0.5rem' }}>
                <Box sx={{ fontWeight: 600 }}>🏟 {match.tournament?.stadium || 'Манеж REJO-ВДНХ №1'}</Box>
                <Box sx={(theme) => ({ color: theme.palette.text.secondary })}>📍 {match.tournament?.address || 'вул. Академіка Глушкова, 1, Київ'}</Box>
              </Box>
            </Card>
          ))}
        </Grid>

      </ContentWrapper>
    </Section>
  );
};

export default Fixtures;
