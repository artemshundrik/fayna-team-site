import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';
import Table from '../components/Table';

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
  const month = date.toLocaleDateString('uk-UA', { month: 'long' }).replace('травень', 'травня').replace('червень', 'червня').replace('липень', 'липня').replace('вересень', 'вересня').replace('жовтень', 'жовтня').replace('грудень', 'грудня').replace('січень', 'січня').replace('лютий', 'лютого').replace('березень', 'березня').replace('квітень', 'квітня').replace('серпень', 'серпня').replace('листопад', 'листопада');

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

const MatchesGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
`;

const MatchStripe = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
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
  padding-top: ${({ expanded }) => (expanded ? '0' : '1.2rem')};
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

  /* Прибрано ховер ефект */
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

const RightColumn = styled.div<{ expanded?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: ${({ expanded }) => (expanded ? '0' : '1.2rem')};
`;

const Matches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'table'>('upcoming');
  const [expandedMatchIndex, setExpandedMatchIndex] = useState<number | null>(null);
  useEffect(() => {
    setExpandedMatchIndex(null);
  }, [activeTab]);

  const matchData = [
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
            <FixtureTile
              onClick={() => setExpandedMatchIndex(expandedMatchIndex === -1 ? null : -1)}
              style={{
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Badge variant="last">Минула гра</Badge>
              <img src="/images/matches/logo-rejo.png" alt="Rejo" height="64" style={{ marginBottom: '0.25rem' }} />
              <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>{formatDateWithTime(lastMatch.date, lastMatch.time)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>{lastMatch.teams.split(' проти ')[0]}</strong>
                <img src={lastMatch.team1Logo} alt="Команда 1" style={{ height: '40px' }} />
                <ScoreBox>{lastMatch.score}</ScoreBox>
                <img src={lastMatch.team2Logo} alt="Команда 2" style={{ height: '40px' }} />
                <strong style={{ fontSize: '1.1rem' }}>{lastMatch.teams.split(' проти ')[1]}</strong>
              </div>

              <div
                  style={{
                    background: '#fff',
                    borderTop: '1px solid #ddd',
                    padding: expandedMatchIndex === -1 ? '1rem 0' : '0',
                    fontSize: '1.1rem',
                    color: '#333',
                    width: '100%',
                    marginTop: '0.5rem',
                    maxHeight: expandedMatchIndex === -1 ? '500px' : '0',
                    overflow: 'hidden',
                    opacity: expandedMatchIndex === -1 ? 1 : 0,
                  }}
                >
                <div
                  style={{
                    display: 'flex',
                    gap: '3rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <li>Іванов, 17' ⚽</li>
                      <li>Петров, 54' ⚽</li>
                    </ul>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li>Сидоренко, 22' 🟨</li>
                    </ul>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li>Іванов ⭐</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div style={{
                fontSize: '0.9rem',
                opacity: expandedMatchIndex === -1 ? 0 : 0.7,
                maxHeight: expandedMatchIndex === -1 ? 0 : '20px',
                overflow: 'hidden',
              }}>
                {lastMatch.stadium}
              </div>
            </FixtureTile>
          )}

          {nextMatch && (
            <FixtureTile>
              <Badge variant="next">Наступна гра</Badge>
              <img src="/images/matches/logo-rejo.png" alt="Rejo" height="64" style={{ marginBottom: '0.25rem' }} />
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
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>ПЕРША ЛІГА • ТУР {index + 1}</span>
                  </div>
                </LeftColumn>

                <CenterColumn>
                  <CenterContentWrapper>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>{formatDateWithTime(match.date, match.time)}</p>
                    {(() => {
                      const teamsArray = match.teams.split(' проти ');
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <strong style={{ fontSize: '1.1rem' }}>{teamsArray[0]}</strong>
                          <img
                            src={match.team1Logo}
                            alt="Логотип команди 1"
                            style={{ height: '40px' }}
                          />
                          <TimeBox>{match.time}</TimeBox>
                          <img
                            src={match.team2Logo}
                            alt="Логотип команди 2"
                            style={{ height: '40px' }}
                          />
                          <strong style={{ fontSize: '1.1rem' }}>{teamsArray[1]}</strong>
                        </div>
                      );
                    })()}
                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{match.stadium}</div>
                  </CenterContentWrapper>
                </CenterColumn>
              </MatchStripe>
            ))}
          </MatchesList>
        )}

        {activeTab === 'past' && (
          <MatchesList>
            {pastMatches.map((match, index) => (
              <React.Fragment key={index}>
                <HoverableMatchStripe
                  onClick={() =>
                    setExpandedMatchIndex(expandedMatchIndex === index ? null : index)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <LeftColumn expanded={expandedMatchIndex === index}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={match.tournamentLogo}
                        alt="Логотип турніру"
                        style={{ height: '64px' }}
                      />
                      <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>ПЕРША ЛІГА • ТУР {index + 1}</span>
                    </div>
                  </LeftColumn>

                  <CenterColumn>
                    <CenterContentWrapper>
                      <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>{formatDateWithTime(match.date, match.time)}</p>
                      {(() => {
                        const teamsArray = match.teams.split(' проти ');
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <strong style={{ fontSize: '1.1rem' }}>{teamsArray[0]}</strong>
                            <img
                              src={match.team1Logo}
                              alt="Логотип команди 1"
                              style={{ height: '40px' }}
                            />
                            <ScoreBox>{match.score}</ScoreBox>
                            <img
                              src={match.team2Logo}
                              alt="Логотип команди 2"
                              style={{ height: '40px' }}
                            />
                            <strong style={{ fontSize: '1.1rem' }}>{teamsArray[1]}</strong>
                          </div>
                        );
                      })()}
                      {!(activeTab === 'past' && expandedMatchIndex === index) && (
                        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{match.stadium}</div>
                      )}
                      {(activeTab === 'past' && expandedMatchIndex === index) && (
                        <div
                          style={{
                            background: '#fff',
                            borderTop: '1px solid #ddd',
                            padding: '1rem 0',
                            fontSize: '1.1rem',
                            color: '#333',
                            width: '100%',
                            marginTop: '0.5rem',
                            maxHeight: '500px',
                            overflow: 'hidden',
                            opacity: 1,
                            transition: 'max-height 0.4s ease, opacity 0.4s ease',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              gap: '3rem',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                            }}
                          >
                            <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <li>Іванов, 17' ⚽</li>
                                <li>Петров, 54' ⚽</li>
                              </ul>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li>Сидоренко, 22' 🟨</li>
                              </ul>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li>Іванов ⭐</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </CenterContentWrapper>
                  </CenterColumn>

                  {activeTab === 'past' && (
                    <RightColumn expanded={expandedMatchIndex === index}>
                      <a
                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Заміни на свій лінк
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          color: '#FF0000',
                          fontWeight: 'bold',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textTransform: 'uppercase' }}>
                          Дивитись огляд
                          <img
                            src="/images/icons/youtube.svg"
                            alt="YouTube"
                            style={{ width: '20px', height: '20px' }}
                          />
                        </span>
                      </a>
                    </RightColumn>
                  )}
                </HoverableMatchStripe>
                {(activeTab === 'past' && expandedMatchIndex === index) && (
                  <div
                    style={{
                      background: '#fff',
                      borderTop: '1px solid #ddd',
                      padding: '1rem 0',
                      fontSize: '1.1rem',
                      color: '#333',
                      width: '100%',
                      marginTop: '0.5rem',
                      maxHeight: '500px',
                      overflow: 'hidden',
                      opacity: 1,
                      transition: 'max-height 0.4s ease, opacity 0.4s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <li>Іванов, 17' ⚽</li>
                          <li>Петров, 54' ⚽</li>
                        </ul>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          <li>Сидоренко, 22' 🟨</li>
                        </ul>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          <li>Іванов ⭐</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </MatchesList>
        )}
      </Wrapper>
    </Layout>
  );
};

export default Matches;