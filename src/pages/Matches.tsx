import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import styled from 'styled-components';
import { Box, Button, Container, Stack, Tabs, Tab } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Layout from '../layout/Layout';
import Table from '../components/Table';

const formatDateWithTime = (dateStr: string, time: string) => {
  const date = new Date(dateStr);

  const dayOfWeek = new Intl.DateTimeFormat('uk-UA', { weekday: 'long' }).format(date).toLowerCase();
  const day = date.getDate();

  const parts = new Intl.DateTimeFormat('uk-UA', {
    month: 'long',
    day: 'numeric',
  }).formatToParts(date);

  const month = parts.find(p => p.type === 'month')?.value?.toLowerCase() || '';

  return `${dayOfWeek}, ${day} ${month}, ${time}`;
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const listItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};


const Heading = styled.h1`
  font-family: 'FixelDisplay', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Paragraph = styled.p`
  font-family: 'FixelDisplay', sans-serif;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;

  @media (min-width: 900px) {
    max-width: 1200px;
    padding: 0 1.5rem;
  }
`;



const LeftColumn = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const CenterColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CenterContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
`;


const RightColumn = styled.div<{ expanded?: boolean }>`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team1:team1_ref ( name, logo ),
          team2:team2_ref ( name, logo ),
          tournament:tournament_id ( logo_url, stadium, league_name, url ),
          round_number, highlight_link
        `)
        .order('date', { ascending: true });

      if (!error && data) {
        const formatted = data.map((match: any) => {
          const dateObj = new Date(`${match.date}T${match.time}`);
          const formattedDate = formatDateWithTime(match.date, match.time);
          const score = match.score_team1 != null && match.score_team2 != null
            ? `${match.score_team1} - ${match.score_team2}`
            : null;

          return {
            date: match.date,
            time: match.time ? match.time.slice(0, 5) : '',
            dateFormatted: formattedDate,
            stadium: match.tournament?.stadium || '',
            score,
            tournamentLogo: match.tournament?.logo_url || '',
            leagueName: match.tournament?.league_name || '',
            tournamentUrl: match.tournament?.url || '',
            tour: match.round_number,
            team1Logo: match.team1?.logo || '',
            team2Logo: match.team2?.logo || '',
            teams: `${match.team1?.name || 'Команда 1'} проти ${match.team2?.name || 'Команда 2'}`,
            youtube_link: match.highlight_link,
          };
        });

        setMatches(formatted);
      } else {
        console.error('Помилка завантаження матчів:', error);
      }
    };

    fetchMatches();
  }, []);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'table'>('upcoming');

  const matchData = matches;

  const now = new Date();
  const futureMatches = matchData.filter(match => new Date(match.date) >= now);
  const pastMatches = matchData.filter(match => new Date(match.date) < now);

  

  return (
    <Layout>
      <Box
        sx={(theme) => ({
          fontFamily: `'FixelDisplay', sans-serif`,
          minHeight: '100vh',
          padding: { xs: '1rem', sm: '2rem' },
          backgroundColor: theme.palette.grey[50],
          color: theme.palette.text.primary,
          textAlign: 'center',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        })}
      >
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 2 }, mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="МАЙБУТНІ" value="upcoming" sx={{ fontWeight: 600, fontFamily: 'FixelDisplay, sans-serif' }} />
            <Tab label="ЗІГРАНІ" value="past" sx={{ fontWeight: 600, fontFamily: 'FixelDisplay, sans-serif' }} />
            <Tab label="ТАБЛИЦЯ" value="table" sx={{ fontWeight: 600, fontFamily: 'FixelDisplay, sans-serif' }} />
          </Tabs>
        </Container>
        
        {activeTab === 'table' && (
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
              mx: 'auto',
              px: { xs: 0, sm: 2 },
            }}
          >
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Table />
            </Stack>
          </Box>
        )}

        {activeTab === 'upcoming' && (
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
              mx: 'auto',
              px: { xs: 0, sm: 2 },
            }}
          >
            <Stack
              component={motion.div}
              initial="hidden"
              animate="visible"
              variants={listContainer}
              spacing={2}
            >
              {futureMatches.map((match, index) => {
                const [team1, team2] = match.teams.split(' проти ');
                return (
                  <Box
                    component={motion.div}
                    variants={listItem}
                    key={index}
                    sx={(theme) => ({
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: theme.palette.background.default,
                      padding: {
                        xs: '0.75rem 0.5rem',
                        sm: '0.75rem 1.25rem',
                      },
                      minHeight: '110px',
                      borderRadius: '8px',
                      border: `1px solid ${theme.palette.grey[100]}`,
                      transition: 'box-shadow 0.3s ease-in-out',
                      flexDirection: {
                        xs: 'column',
                        sm: 'row',
                      },
                      gap: {
                        xs: 2,
                        sm: '2rem',
                      },
                      textAlign: {
                        xs: 'center',
                        sm: 'left',
                      },
                      flexWrap: 'wrap',
                    })}
                  >
                    {/* LEFT */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <a href={match.tournamentUrl || '#'} target="_blank" rel="noopener noreferrer">
                        <img
                          src={match.tournamentLogo}
                          alt="Турнір"
                          style={{ height: '56px' }}
                        />
                      </a>
                      <Box
                        sx={(theme) => ({
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: theme.palette.text.primary,
                        })}
                      >
                        {match.leagueName}
                        {match.tour ? ` • ТУР ${match.tour}` : ''}
                      </Box>
                    </Box>

                    {/* CENTER */}
                    <Box
                      sx={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={(theme) => ({
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                        })}
                      >
                        {formatDateWithTime(match.date, match.time)}
                      </Box>

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto 1fr',
                          alignItems: 'center',
                          justifyItems: 'center',
                          width: '100%',
                          gap: { xs: 1, sm: 2 },
                          minWidth: 0,
                        }}
                      >
                        {/* Team 1 */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            minWidth: 0,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: { xs: 'center', sm: 'center' },
                              gap: { xs: '0.25rem', sm: '0.5rem' },
                              flexDirection: { xs: 'column', sm: 'row-reverse' },
                              width: '100%',
                            }}
                          >
                            <img src={match.team1Logo} alt="Team 1" style={{ height: '36px', borderRadius: '50%' }} />
                            <Box
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                textAlign: { xs: 'center', sm: 'right' },
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {team1}
                            </Box>
                          </Box>
                        </Box>
                        {/* Time */}
                        <Box
                          sx={(theme) => ({
                            backgroundColor: theme.palette.grey[200],
                            color: theme.palette.text.secondary,
                            padding: { xs: '0.2rem 0.3rem', sm: '0.4rem 0.8rem' },
                            borderRadius: '0.4rem',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 600,
                            width: { xs: '60px', sm: '64px' },
                            minWidth: { xs: '60px', sm: '64px' },
                            maxWidth: { xs: '60px', sm: '64px' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          })}
                        >
                          {match.time}
                        </Box>
                        {/* Team 2 */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            minWidth: 0,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: { xs: 'center', sm: 'center' },
                              gap: { xs: '0.25rem', sm: '0.5rem' },
                              flexDirection: { xs: 'column', sm: 'row' },
                              width: '100%',
                            }}
                          >
                            <img src={match.team2Logo} alt="Team 2" style={{ height: '36px', borderRadius: '50%' }} />
                            <Box
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                textAlign: { xs: 'center', sm: 'left' },
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {team2}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* RIGHT */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      {match.youtube_link && (
                        <a
                          href={match.youtube_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '0.4rem',
                            fontWeight: 600,
                            color: '#f44336',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            transition: 'text-decoration 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = 'underline';
                            e.currentTarget.style.textDecorationColor = '#f44336'; // червоний
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = 'none';
                            e.currentTarget.style.textDecorationColor = 'unset';
                          }}
                        >
                          <Box component="span" sx={(theme) => ({ color: theme.palette.error.main, fontWeight: 600, fontSize: '0.95rem' })}>
                            Дивитись огляд
                          </Box>
                          <YouTubeIcon sx={{ fontSize: 20, color: (theme) => theme.palette.error.main }} />
                        </a>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}

        {activeTab === 'past' && (
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
              mx: 'auto',
              px: { xs: 0, sm: 2 },
            }}
          >
            <Stack
              component={motion.div}
              initial="hidden"
              animate="visible"
              variants={listContainer}
              spacing={2}
            >
              {pastMatches.map((match, index) => {
                // --- КОЛІР ДЛЯ SCORE (для FAYNA TEAM) ---
                const MY_TEAM_NAME = 'FAYNA TEAM';
                const [team1, team2] = match.teams.split(' проти ');

                let myScore = null;
                let opponentScore = null;
                if (team1.trim() === MY_TEAM_NAME) {
                  myScore = parseInt(match.score?.split('-')[0]?.trim(), 10);
                  opponentScore = parseInt(match.score?.split('-')[1]?.trim(), 10);
                } else if (team2.trim() === MY_TEAM_NAME) {
                  myScore = parseInt(match.score?.split('-')[1]?.trim(), 10);
                  opponentScore = parseInt(match.score?.split('-')[0]?.trim(), 10);
                }
                // --- END КОЛІР ДЛЯ SCORE ---
                return (
                  <Box
                    component={motion.div}
                    variants={listItem}
                    key={index}
                    sx={(theme) => ({
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: theme.palette.background.default,
                      padding: {
                        xs: '0.75rem 0.5rem',
                        sm: '0.75rem 1.25rem',
                      },
                      minHeight: '110px',
                      borderRadius: '8px',
                      border: `1px solid ${theme.palette.grey[100]}`,
                      flexWrap: 'wrap',
                      cursor: 'default',
                      transition: 'box-shadow 0.3s ease-in-out',
                      flexDirection: {
                        xs: 'column',
                        sm: 'row',
                      },
                      gap: {
                        xs: 2,
                        sm: '2rem',
                      },
                      textAlign: {
                        xs: 'center',
                        sm: 'left',
                      },
                    })}
                  >
                    {/* LEFT */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <a href={match.tournamentUrl || '#'} target="_blank" rel="noopener noreferrer">
                        <img
                          src={match.tournamentLogo}
                          alt="Турнір"
                          style={{ height: '56px' }}
                        />
                      </a>
                      <Box
                        sx={(theme) => ({
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: theme.palette.text.primary,
                        })}
                      >
                        {match.leagueName}
                        {match.tour ? ` • ТУР ${match.tour}` : ''}
                      </Box>
                    </Box>

                    {/* CENTER */}
                    <Box
                      sx={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={(theme) => ({
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                        })}
                      >
                        {formatDateWithTime(match.date, match.time)}
                      </Box>

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto 1fr',
                          alignItems: 'center',
                          justifyItems: 'center',
                          width: '100%',
                          gap: { xs: 1, sm: 2 },
                          minWidth: 0,
                        }}
                      >
                        {/* Team 1 */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            minWidth: 0,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: { xs: 'center', sm: 'center' },
                              gap: { xs: '0.25rem', sm: '0.5rem' },
                              flexDirection: { xs: 'column', sm: 'row-reverse' },
                              width: '100%',
                            }}
                          >
                            <img src={match.team1Logo} alt="Team 1" style={{ height: '36px', borderRadius: '50%' }} />
                            <Box
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                textAlign: { xs: 'center', sm: 'right' },
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {team1}
                            </Box>
                          </Box>
                        </Box>
                        {/* Score */}
                        <Box
                          sx={(theme) => {
                            let bg = theme.palette.grey[200];
                            let color = theme.palette.text.secondary;

                            if (myScore !== null && opponentScore !== null) {
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
                              padding: { xs: '0.2rem 0.3rem', sm: '0.4rem 0.8rem' },
                              borderRadius: '0.4rem',
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                              fontWeight: 600,
                              width: { xs: '60px', sm: '64px' },
                              minWidth: { xs: '60px', sm: '64px' },
                              maxWidth: { xs: '60px', sm: '64px' },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s'
                            };
                          }}
                        >
                          {match.score}
                        </Box>
                        {/* Team 2 */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            minWidth: 0,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: { xs: 'center', sm: 'center' },
                              gap: { xs: '0.25rem', sm: '0.5rem' },
                              flexDirection: { xs: 'column', sm: 'row' },
                              width: '100%',
                            }}
                          >
                            <img src={match.team2Logo} alt="Team 2" style={{ height: '36px', borderRadius: '50%' }} />
                            <Box
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                textAlign: { xs: 'center', sm: 'left' },
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {team2}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* RIGHT */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      {match.youtube_link && (
                        <a
                          href={match.youtube_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '0.4rem',
                            fontWeight: 600,
                            color: '#f44336',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            transition: 'text-decoration 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = 'underline';
                            e.currentTarget.style.textDecorationColor = '#f44336'; // червоний
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = 'none';
                            e.currentTarget.style.textDecorationColor = 'unset';
                          }}
                        >
                          <Box component="span" sx={(theme) => ({ color: theme.palette.error.main, fontWeight: 600, fontSize: '0.95rem' })}>
                            Дивитись огляд
                          </Box>
                          <YouTubeIcon sx={{ fontSize: 20, color: (theme) => theme.palette.error.main }} />
                        </a>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Matches;