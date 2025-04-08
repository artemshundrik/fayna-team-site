import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';

const formatDateWithTime = (dateStr: string, time: string) => {
  const date = new Date(dateStr);

  const days = [
    'Неділя',
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'Пʼятниця',
    'Субота',
  ];

  const dayOfWeek = days[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleDateString('uk-UA', { month: 'long' });

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
  padding: 1rem 0;
`;

const MatchesGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
`;

const MatchStripe = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 1rem 2rem;
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

const LeftColumn = styled.div`
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
`;

const CenterColumn = styled.div`
  flex: 2;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  padding-left: 0;
`;

const CenterContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-left: -11rem;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: ${({ active }) => (active ? '#111' : '#888')};
  border-bottom: ${({ active }) => (active ? '2px solid #111' : 'none')};
  padding-bottom: 0.5rem;

  &:hover {
    color: #000;
  }
`;

const FixtureTile = styled.div`
  position: relative;
  background: #fff;
  border-radius: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 48%;
  text-align: center;
  box-shadow: none;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Badge = styled.div<{ variant?: 'last' | 'next' }>`
  position: absolute;
  top: 0;
  left: 0;
  background: ${({ variant }) => (variant === 'next' ? '#000' : '#e9e9e9')};
  color: ${({ variant }) => (variant === 'next' ? '#fff' : '#6e6e6e')};
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  padding: 0.4rem 1rem;
  border-radius: 0;
  z-index: 10;
`;

const Matches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const matchData = [
    {
      date: '2025-04-09',
      time: '22:00',
      teams: 'FAYNA TEAM проти BARCELONA',
      competition: 'Чвертьфінал Ліги Чемпіонів УЄФА',
      stadium: 'Манеж REJO-ВДНХ №1',
      tournamentLogo: '/images/matches/logo-rejo.png',
      team1Logo: '/images/matches/logo-fayna-match-black.svg',
      team2Logo: '/images/matches/logo-barcelona.svg',
    },
    {
      date: '2025-04-12',
      time: '22:00',
      teams: 'BARCELONA проти FAYNA TEAM',
      competition: 'Чвертьфінал Ліги Чемпіонів УЄФА',
      stadium: 'Манеж REJO-ВДНХ №1',
      tournamentLogo: '/images/matches/logo-rejo.png',
      team1Logo: '/images/matches/logo-barcelona.svg',
      team2Logo: '/images/matches/logo-fayna-match-black.svg',
    },
    {
      date: '2025-04-15',
      time: '21:00',
      teams: 'FAYNA TEAM проти BARCELONA',
      competition: 'Ліга 1',
      stadium: 'Манеж REJO-ВДНХ №1',
      tournamentLogo: '/images/matches/logo-rejo.png',
      team1Logo: '/images/matches/logo-fayna-match-black.svg',
      team2Logo: '/images/matches/logo-barcelona.svg',
    },
    {
      date: '2024-12-01',
      time: '19:30',
      teams: 'FAYNA TEAM проти REAL MADRID',
      competition: 'Товариський матч',
      stadium: 'Манеж REJO-ВДНХ №1',
      tournamentLogo: '/images/matches/logo-rejo.png',
      team1Logo: '/images/matches/logo-fayna-match-black.svg',
      team2Logo: '/images/matches/logo-barcelona.svg',
      score: '2 - 0',
    },
    {
      date: '2024-11-20',
      time: '20:00',
      teams: 'FAYNA TEAM проти BARCELONA',
      competition: 'Фінал Кубка Дружби',
      stadium: 'Манеж REJO-ВДНХ №1',
      tournamentLogo: '/images/matches/logo-rejo.png',
      team1Logo: '/images/matches/logo-fayna-match-black.svg',
      team2Logo: '/images/matches/logo-barcelona.svg',
      score: '1 - 0',
    },
  ];

  const now = new Date();
  const futureMatches = matchData.filter(match => new Date(match.date) >= now);
  const pastMatches = matchData.filter(match => new Date(match.date) < now);

  const lastMatch = pastMatches[pastMatches.length - 1];
  const nextMatch = futureMatches[0];

  return (
    <Layout>
      <Wrapper>
        <Heading>Матчі</Heading>
        <Paragraph>Незабаром тут буде розклад, результати та статистика матчів команди FAYNA TEAM.</Paragraph>
        
        <MatchesGrid>
          {lastMatch && (
            <FixtureTile>
              <Badge variant="last">Минула гра</Badge>
              <img src="/images/matches/logo-rejo.png" alt="Rejo" height="80" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>{formatDateWithTime(lastMatch.date, lastMatch.time)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>{lastMatch.teams.split(' проти ')[0]}</strong>
                <img src={lastMatch.team1Logo} alt="Команда 1" style={{ height: '40px' }} />
                <ScoreBox>{lastMatch.score}</ScoreBox>
                <img src={lastMatch.team2Logo} alt="Команда 2" style={{ height: '40px' }} />
                <strong style={{ fontSize: '1.1rem' }}>{lastMatch.teams.split(' проти ')[1]}</strong>
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{lastMatch.stadium}</div>
            </FixtureTile>
          )}

          {nextMatch && (
            <FixtureTile>
              <Badge variant="next">Наступна гра</Badge>
              <img src="/images/matches/logo-rejo.png" alt="Rejo" height="80" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>{formatDateWithTime(nextMatch.date, nextMatch.time)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>{nextMatch.teams.split(' проти ')[0]}</strong>
                <img src={nextMatch.team1Logo} alt="Команда 1" style={{ height: '40px' }} />
                <TimeBox>{nextMatch.time}</TimeBox>
                <img src={nextMatch.team2Logo} alt="Команда 2" style={{ height: '40px' }} />
                <strong style={{ fontSize: '1.1rem' }}>{nextMatch.teams.split(' проти ')[1]}</strong>
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{nextMatch.stadium}</div>
            </FixtureTile>
          )}
        </MatchesGrid>

        <Tabs>
          <Tab active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>Майбутні</Tab>
          <Tab active={activeTab === 'past'} onClick={() => setActiveTab('past')}>Зіграні</Tab>
        </Tabs>
        
        <MatchesList>
          {(activeTab === 'upcoming' ? futureMatches : pastMatches).map((match, index) => (
            <MatchStripe key={index}>
              <LeftColumn>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={match.tournamentLogo}
                    alt="Логотип турніру"
                    style={{ height: '80px' }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>ПЕРША ЛІГА • ТУР {index + 1}</span>
                </div>
              </LeftColumn>

              <CenterColumn>
                <CenterContentWrapper>
                  <p style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>{formatDateWithTime(match.date, match.time)}</p>
                  {(() => {
                    const teamsArray = match.teams.split(' проти ');
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <strong style={{ fontSize: '1.1rem' }}>{teamsArray[0]}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={match.team1Logo}
                            alt="Логотип команди 1"
                            style={{ height: '40px' }}
                          />
                          {activeTab === 'past' ? (
                            <ScoreBox>{match.score}</ScoreBox>
                          ) : (
                            <TimeBox>{match.time}</TimeBox>
                          )}
                          <img
                            src={match.team2Logo}
                            alt="Логотип команди 2"
                            style={{ height: '40px' }}
                          />
                        </div>
                        <strong style={{ fontSize: '1.1rem' }}>{teamsArray[1]}</strong>
                      </div>
                    );
                  })()}
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>{match.stadium}</p>
                </CenterContentWrapper>
              </CenterColumn>
            </MatchStripe>
          ))}
        </MatchesList>
      </Wrapper>
    </Layout>
  );
};

export default Matches;