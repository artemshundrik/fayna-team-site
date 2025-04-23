import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import styled from 'styled-components';
import { Box, Button } from '@mui/material';
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

const Wrapper = styled.div`
  font-family: 'FixelDisplay', sans-serif;
  min-height: 100vh;
  padding: 2rem;
  background: #F3F4F6;
  color: #111;
  text-align: center;
`;

const Heading = styled.h1`
  font-family: 'FixelDisplay', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Paragraph = styled.p`
  font-family: 'FixelDisplay', sans-serif;
  font-size: 1.1rem;
  color: #555;
`;

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;

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
          team1:team1_id ( name, logo ),
          team2:team2_id ( name, logo ),
          tournament:tournament_id ( logo_url, stadium, league_name ),
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
      <Wrapper>
        <MatchesList>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
            <Button
              onClick={() => setActiveTab('upcoming')}
              sx={(theme) => ({
                fontFamily: 'FixelDisplay, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: activeTab === 'upcoming'
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                borderBottom: activeTab === 'upcoming'
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
                borderRadius: 0,
                px: 1.5,
                pb: 0.5,
                transition: 'border-color 0.2s ease, color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              })}
            >
              МАЙБУТНІ
            </Button>
            <Button
              onClick={() => setActiveTab('past')}
              sx={(theme) => ({
                fontFamily: 'FixelDisplay, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: activeTab === 'past'
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                borderBottom: activeTab === 'past'
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
                borderRadius: 0,
                px: 1.5,
                pb: 0.5,
                transition: 'border-color 0.2s ease, color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              })}
            >
              ЗІГРАНІ
            </Button>
            <Button
              onClick={() => setActiveTab('table')}
              sx={(theme) => ({
                fontFamily: 'FixelDisplay, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: activeTab === 'table'
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                borderBottom: activeTab === 'table'
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
                borderRadius: 0,
                px: 1.5,
                pb: 0.5,
                transition: 'border-color 0.2s ease, color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              })}
            >
              ТАБЛИЦЯ
            </Button>
          </div>
        </MatchesList>
        
        {activeTab === 'table' && (
          <MatchesList>
            <Table />
          </MatchesList>
        )}

        {activeTab === 'upcoming' && (
          <MatchesList>
            {futureMatches.map((match, index) => {
              const [team1, team2] = match.teams.split(' проти ');
              return (
                <Box
                  key={index}
                  sx={(theme) => ({
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.palette.background.paper,
                    padding: {
                      xs: '0.75rem 0.5rem',
                      sm: '0.75rem 1.25rem',
                    },
                    minHeight: '110px',
                    borderRadius: 0,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    transition: 'box-shadow 0.3s ease-in-out',
                    flexDirection: {
                      xs: 'column',
                      sm: 'row',
                    },
                    flexWrap: 'wrap',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    },
                  })}
                >
                  {/* LEFT */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <img
                      src={match.tournamentLogo}
                      alt="Турнір"
                      style={{ height: '56px' }}
                    />
                    <Box
                      sx={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: '#111',
                      }}
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'nowrap',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{team1}</Box>
                        <img src={match.team1Logo} alt="Team 1" style={{ height: '36px' }} />
                      </Box>

                      <Box
                        sx={(theme) => ({
                          backgroundColor: theme.palette.grey[200],
                          color: theme.palette.text.secondary,
                          padding: '0.4rem 0.8rem',
                          borderRadius: '0.4rem',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          minWidth: '2.2rem',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        })}
                      >
                        {match.time}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={match.team2Logo} alt="Team 2" style={{ height: '36px' }} />
                        <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{team2}</Box>
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
                          color: '#e53935',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          transition: 'text-decoration 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        <span>Дивитись огляд</span>
                        <YouTubeIcon sx={{ fontSize: 20 }} />
                      </a>
                    )}
                  </Box>
                </Box>
              );
            })}
          </MatchesList>
        )}

        {activeTab === 'past' && (
          <MatchesList>
            {pastMatches.map((match, index) => {
              const [team1, team2] = match.teams.split(' проти ');
              return (
                <Box
                  key={index}
                  sx={(theme) => ({
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                    padding: {
                      xs: '0.75rem 0.5rem',
                      sm: '0.75rem 1.25rem',
                    },
                    minHeight: '110px',
                    gap: '2rem',
                    borderRadius: 0,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    flexWrap: 'wrap',
                    cursor: 'default',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    },
                    flexDirection: {
                      xs: 'column',
                      sm: 'row',
                    },
                  })}
                >
                  {/* LEFT */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <img
                      src={match.tournamentLogo}
                      alt="Турнір"
                      style={{ height: '56px' }}
                    />
                    <Box
                      sx={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: '#111',
                      }}
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'nowrap',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{team1}</Box>
                        <img src={match.team1Logo} alt="Team 1" style={{ height: '36px' }} />
                      </Box>

                      <Box
                        sx={(theme) => ({
                          backgroundColor: theme.palette.secondary.dark,
                          color: theme.palette.common.white,
                          padding: '0.4rem 0.8rem',
                          borderRadius: '0.4rem',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          minWidth: '2.2rem',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        })}
                      >
                        {match.score}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={match.team2Logo} alt="Team 2" style={{ height: '36px' }} />
                        <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{team2}</Box>
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
                          color: '#e53935',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          transition: 'text-decoration 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        <span>Дивитись огляд</span>
                        <YouTubeIcon sx={{ fontSize: 20 }} />
                      </a>
                    )}
                  </Box>
                </Box>
              );
            })}
          </MatchesList>
        )}
      </Wrapper>
    </Layout>
  );
};

export default Matches;