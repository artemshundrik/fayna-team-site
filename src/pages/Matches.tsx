import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import styled from 'styled-components';
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
  font-family: 'Cuprum', sans-serif;
  min-height: 100vh;
  padding: 2rem;
  background: #f7f7f7;
  color: #111;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  color: #555;
`;

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
`;

const MatchStripe = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: #fff;
  padding: 1rem 2rem;
  gap: 1rem;
  transition: box-shadow 0.3s ease;
`;
const HoverableMatchStripe = styled(MatchStripe)`
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ScoreBox = styled.div`
  background: #1e1f22;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 2.2rem;
  text-align: center;
`;

const TimeBox = styled.div`
  background: #e9e9e9;
  color: #6e6e6e;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 2.2rem;
  text-align: center;
`;

const LeftColumn = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1.2rem 0;
`;

const CenterColumn = styled.div`
  text-align: center;
  justify-self: center;
`;

const CenterContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Tab = styled.button<{ active: boolean }>`
  font-family: 'Cuprum', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active }) => (active ? '#FF1695' : '#111')};
  padding: 0;
  text-align: left;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #FF1695;
    transform: translateY(-2px);
  }
`;

const RightColumn = styled.div<{ expanded?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: ${({ expanded }) => (expanded ? '0' : '1.2rem')};
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
          round_number
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
            time: match.time.slice(0, 5),
            dateFormatted: formattedDate,
            stadium: match.tournament.stadium,
            score,
            tournamentLogo: match.tournament.logo_url,
            leagueName: match.tournament.league_name,
            tour: match.round_number,
            team1Logo: match.team1.logo,
            team2Logo: match.team2.logo,
            teams: `${match.team1.name} проти ${match.team2.name}`,
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
            <Tab active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>Майбутні</Tab>
            <Tab active={activeTab === 'past'} onClick={() => setActiveTab('past')}>Зіграні</Tab>
            <Tab active={activeTab === 'table'} onClick={() => setActiveTab('table')}>Таблиця</Tab>
          </div>
        </MatchesList>
        
        {activeTab === 'table' && (
          <MatchesList>
            <Table />
          </MatchesList>
        )}

        {activeTab === 'upcoming' && (
          <MatchesList>
            {futureMatches.map((match, index) => (
              <MatchStripe key={index} style={{ cursor: 'default' }}>
                <LeftColumn>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={match.tournamentLogo}
                      alt="Логотип турніру"
                      style={{ height: '64px' }}
                    />
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{match.leagueName}{match.tour ? ` • ТУР ${match.tour}` : ''}</span>
                  </div>
                </LeftColumn>

                <CenterColumn>
                  <CenterContentWrapper>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>{formatDateWithTime(match.date, match.time)}</p>
                    {(() => {
                      const teamsArray = match.teams.split(' проти ');
                      return (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto 1fr',
                          alignItems: 'center',
                          gap: '1rem',
                          width: '100%',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1.1rem' }}>{teamsArray[0]}</strong>
                            <img src={match.team1Logo} alt="Логотип команди 1" style={{ height: '40px' }} />
                          </div>

                          <TimeBox>{match.time}</TimeBox>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem' }}>
                            <img src={match.team2Logo} alt="Логотип команди 2" style={{ height: '40px' }} />
                            <strong style={{ fontSize: '1.1rem' }}>{teamsArray[1]}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </CenterContentWrapper>
                  </CenterColumn>
                </MatchStripe>
            ))}
          </MatchesList>
        )}

        {activeTab === 'past' && (
          <MatchesList>
            {pastMatches.map((match, index) => (
              <MatchStripe key={index} style={{ cursor: 'default' }}>
                <LeftColumn>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={match.tournamentLogo}
                      alt="Логотип турніру"
                      style={{ height: '64px' }}
                    />
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{match.leagueName}{match.tour ? ` • ТУР ${match.tour}` : ''}</span>
                  </div>
                </LeftColumn>

                <CenterColumn>
                  <CenterContentWrapper>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>{formatDateWithTime(match.date, match.time)}</p>
                    {(() => {
                      const teamsArray = match.teams.split(' проти ');
                      return (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto 1fr',
                          alignItems: 'center',
                          gap: '1rem',
                          width: '100%',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1.1rem' }}>{teamsArray[0]}</strong>
                            <img src={match.team1Logo} alt="Логотип команди 1" style={{ height: '40px' }} />
                          </div>

                          <ScoreBox>{match.score}</ScoreBox>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem' }}>
                            <img src={match.team2Logo} alt="Логотип команди 2" style={{ height: '40px' }} />
                            <strong style={{ fontSize: '1.1rem' }}>{teamsArray[1]}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </CenterContentWrapper>
                </CenterColumn>
              </MatchStripe>
            ))}
          </MatchesList>
        )}
      </Wrapper>
    </Layout>
  );
};

export default Matches;