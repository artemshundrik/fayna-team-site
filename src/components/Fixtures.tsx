import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Box, Button, Typography } from '@mui/material';
import { useTournament } from '../context/TournamentContext';
import { Box as MuiBox } from '@mui/material';

const Section = motion(Box);

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const Card = styled(MuiBox)<{ full?: boolean }>`
  background: #fff;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey[100]};
  width: 100%;
  box-sizing: border-box;
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
`;

const Fixtures = () => {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const { effectiveTournamentId } = useTournament();

  useEffect(() => {
    const fetchFixtures = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team1:team1_ref ( name, logo ),
          team2:team2_ref ( name, logo ),
          tournament:tournament_id ( logo_url, stadium, address, url )
        `)
        .order('date', { ascending: true });

      // If a specific tournament selected (archive/current resolved), refetch with filter
      let list = data || [];
      if (!error && effectiveTournamentId) {
        const { data: filtered, error: err2 } = await supabase
          .from('matches')
          .select(`
            *,
            team1:team1_ref ( name, logo ),
            team2:team2_ref ( name, logo ),
            tournament:tournament_id ( logo_url, stadium, address, url )
          `)
          .eq('tournament_id', effectiveTournamentId)
          .order('date', { ascending: true });
        if (!err2 && filtered) list = filtered;
      }

      if (!error && list) {
        const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', "п'ятниця", 'субота'];
        const formatted = list.map((match: any) => {
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
          .filter(m => new Date(`${m.date}T${m.time || '00:00'}+03:00`) < now)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const upcomingMatches = formatted
          .filter(m => new Date(`${m.date}T${m.time || '00:00'}+03:00`) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const sliced = [pastMatches[0], upcomingMatches[0]].filter(Boolean);
        setFixtures(sliced);
      } else {
        console.error('Помилка завантаження матчів:', error);
      }
    };
    fetchFixtures();
  }, [effectiveTournamentId]);

  return (
    <Section
      sx={(theme) => ({
        px: 2,
        py: { xs: 4, sm: 8 },
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
          <Typography variant="h5" component="h2" sx={{
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Розклад матчів
          </Typography>
          <Button href="/matches" variant="outlined" endIcon={<ArrowForwardIcon />} sx={(theme)=>({
            textTransform:'none',
            fontWeight:600,
            borderColor:theme.palette.grey[400],
            color:theme.palette.text.primary,
            '&:hover':{
              borderColor:theme.palette.primary.main,
              color:theme.palette.primary.main
            }
          })}>
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
                <Box sx={(theme)=>({
                  position:'absolute', top:0, left:0,
                  backgroundColor: index===0 ? theme.palette.grey[200] : theme.palette.secondary.dark,
                  color:index===0?theme.palette.text.secondary:theme.palette.common.white,
                  fontSize:'0.875rem', px:2, py:1, textTransform:'uppercase', fontWeight:600,
                  borderTopLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                })}>
                  {index===0?'Минула гра':'Наступна гра'}
                </Box>
              )}

              <Box
                component="a"
                href={match.tournament?.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mb: '6px', display: 'inline-block' }}
              >
                <Box
                  component="img"
                  src={match.tournament?.logo_url || '/default-tournament.png'}
                  alt="Tournament"
                  height={64}
                  sx={{ display: 'block' }}
                />
              </Box>
              <Box sx={{fontSize: { xs: '0.9rem', sm: '1.1rem' },opacity:0.8,fontWeight:600}}>{match.date_text}</Box>

              <Box sx={{
                display:'grid',
                width: '100%',
                gridTemplateColumns:{ xs:'1fr auto 1fr', sm:'1fr auto 1fr' },
                justifyItems:'center',
                alignItems:'center',
                gap:'0.75rem',
                mt:'0.5rem',
                minWidth: 0
              }}>
                <Box sx={{ justifySelf: 'end', display:'flex', alignItems:'center', gap:{ xs:'0.25rem', sm:'0.6rem' }, minWidth: 0 }}>
                  <Box sx={{
                    fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight:600,
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    overflow: { xs: 'visible', sm: 'hidden' },
                    textOverflow: { xs: 'clip', sm: 'ellipsis' },
                    wordBreak: 'break-word',
                  }}>{match.team1?.name}</Box>
                  <Box component="img" src={match.team1?.logo||'/default-logo.png'} alt={match.team1?.name} sx={{
                    height:'clamp(36px,6vw,48px)',
                    width:'clamp(36px,6vw,48px)',
                    borderRadius:'50%'
                  }} />
                </Box>

                <Box sx={{ justifySelf: 'center' }}>
                  {(() => {
                    const MY_TEAM_NAME = "FAYNA TEAM";
                    const isFaynaTeam1 = match.team1?.name === MY_TEAM_NAME;
                    const isFaynaTeam2 = match.team2?.name === MY_TEAM_NAME;
                    let myScore = null;
                    let opponentScore = null;
                    if (isFaynaTeam1) {
                      myScore = match.score_team1;
                      opponentScore = match.score_team2;
                    } else if (isFaynaTeam2) {
                      myScore = match.score_team2;
                      opponentScore = match.score_team1;
                    }
                    return (
                      <Box sx={(theme) => {
                        let bg = theme.palette.grey[200];
                        let color = theme.palette.text.secondary;
                        if (myScore != null && opponentScore != null) {
                          if (myScore > opponentScore) {
                            bg = theme.palette.success.main;
                            color = theme.palette.common.white;
                          } else if (myScore === opponentScore) {
                            bg = theme.palette.grey[500];
                            color = theme.palette.common.white;
                          } else if (myScore < opponentScore) {
                            bg = theme.palette.error.main;
                            color = theme.palette.common.white;
                          }
                        }
                        return {
                          backgroundColor: bg,
                          color: color,
                          padding: '0.4rem 0.8rem',
                          borderRadius: '0.4rem',
                          fontSize: { xs: '0.9rem', sm: '1.1rem' },
                          fontWeight: 600,
                          minWidth: '2.2rem',
                          textAlign: 'center',
                          transition: 'background 0.2s'
                        };
                      }}>
                        {match.score || match.time}
                      </Box>
                    );
                  })()}
                </Box>

                <Box sx={{ justifySelf: 'start', display:'flex', alignItems:'center', gap:{ xs:'0.25rem', sm:'0.6rem' }, minWidth: 0 }}>
                  <Box component="img" src={match.team2?.logo||'/default-logo.png'} alt={match.team2?.name} sx={{
                    height:'clamp(36px,6vw,48px)',
                    width:'clamp(36px,6vw,48px)',
                    borderRadius:'50%'
                  }} />
                  <Box sx={{
                    fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight:600,
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    overflow: { xs: 'visible', sm: 'hidden' },
                    textOverflow: { xs: 'clip', sm: 'ellipsis' },
                    wordBreak: 'break-word',
                  }}>{match.team2?.name}</Box>
                </Box>
              </Box>

              <Box sx={{fontSize: { xs: '0.9rem', sm: '1rem' },opacity:0.9,lineHeight:1.8,mt:'0.5rem'}}>
                <Box sx={{fontWeight:600}}>🏟 {match.tournament?.stadium}</Box>
                <Box sx={(theme)=>({color:theme.palette.text.secondary})}>📍 {match.tournament?.address}</Box>
              </Box>
            </Card>
          ))}
        </Grid>

      </ContentWrapper>
    </Section>
  );
};

export default Fixtures;
