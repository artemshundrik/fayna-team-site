import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { supabase } from '../supabase';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
const fetchScore = async () => {
  try {
    const res = await fetch('/.netlify/functions/get-latest-score');
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      try {
        const fallback = JSON.parse(text);
        return fallback;
      } catch {
        console.error('Invalid response (not JSON):', text);
        return null;
      }
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching score:', err);
    return null;
  }
};

const GlobalStyle = createGlobalStyle`
  @keyframes shine {
    0% { background-position: 100% }
    100% { background-position: -100% }
  }

  .watch-link-wrapper {
    display: inline-block;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    cursor: pointer;
  }

  .watch-link {
    display: inline-block;
    position: relative;
    color: inherit;
    text-decoration: none;
    background: linear-gradient(90deg, #ff1695 0%, #fff 50%, #ff1695 100%);
    background-size: 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 2s infinite linear;
  }

  .watch-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 2px;
    background-color: #ff1695;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease-out;
  }

  .watch-link:hover::after {
    transform: scaleX(1);
  }

  .watch-text {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .arrow {
    display: inline-block;
  }

`;

const Wrapper = styled.section`
  background: url('/images/matches/next-match-bg.png') no-repeat center center;
  background-size: cover;
  position: relative;
  padding: 4rem 1rem;
  text-align: center;
  color: white;
  font-family: 'Cuprum', sans-serif;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(12px);
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = styled.h2`
  font-size: 1.6rem;
  color: #aaa;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const DateText = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Countdown = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const FlipUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .label {
    margin-top: 0;
    font-size: 0.75rem;
    color: #aaa;
    text-transform: uppercase;
  }
`;

const Time = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #ccc;
`;

const MatchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  position: relative;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: contain;
  }

  .team {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    font-weight: bold;
    color: white;
    flex: 1;
    max-width: 300px;

    &.reverse {
      flex-direction: row-reverse;
      text-align: right;

      .team-info {
        align-items: flex-end;
      }
    }

    .team-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }


  .vs {
    position: relative;
    margin: 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    min-width: 80px;
    padding: 0 1rem;
  }
`;

const TeamWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  max-width: 300px;
`;

const Form = styled.div<{ align?: 'left' | 'right' }>`
  display: flex;
  justify-content: ${({ align }) => (align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center')};
  gap: 0.5rem;
  margin-top: 0.5rem;

  .form-item {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 4px;
  }

  .w {
    background-color: #4caf50;
  }

  .l {
    background-color: #f44336;
  }

  .d {
    background-color: #9e9e9e;
  }
`;

const Stadium = styled.div`
  font-size: 1rem;
  color: #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;

  .venue {
    font-weight: bold;
    font-size: 1.1rem;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  .address {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #aaa;
    font-size: 0.95rem;
  }

  .icon {
    color: red;
  }
`;

const TournamentInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;

  img {
    height: 80px;
    margin-bottom: 0.3rem;
  }

  .text {
    text-align: center;
    font-size: 0.95rem;
    color: #ccc;

    .name {
      font-weight: bold;
      font-size: 1.4rem;
      color: white;
    }

    .meta {
      font-size: 1rem;
      color: white;
      font-weight: 400;
    }
  }
`;

const NextMatch = () => {
  const [data, setData] = useState<Database['public']['Tables']['matches']['Row'] & {
    team1: Database['public']['Tables']['teams']['Row'] | null;
    team2: Database['public']['Tables']['teams']['Row'] | null;
  } | null>(null);
  const [matchDate, setMatchDate] = useState<Date | null>(null);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [score, setScore] = useState<{
    home: number;
    away: number;
    url?: string;
    homeTeam?: string;
    awayTeam?: string;
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!matchDate) return;

      const now = new Date();
      const matchDateOnly = new Date(matchDate);
      matchDateOnly.setHours(0, 0, 0, 0);
      const nowDateOnly = new Date(now);
      nowDateOnly.setHours(0, 0, 0, 0);
      const isSameDay = matchDateOnly.getTime() === nowDateOnly.getTime();
      const isPast = now > matchDate;
      let calculatedDays = Math.floor((matchDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24));
      if (isSameDay || isPast) {
        calculatedDays = 0;
      }
      const distance = matchDate.getTime() - now.getTime();

      if (distance <= 0) {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        clearInterval(interval);
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setDays(calculatedDays);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(interval);
  }, [matchDate]);

  useEffect(() => {
    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*, team1:team1_id(*), team2:team2_id(*)')
        .order('date')
        .limit(1)
        .single();

      if (error) {
        console.error('Match fetch error:', error);
      } else {
        console.log('Next match data:', data);
        setData(data);
        if (data?.date && data?.time) {
          const dateTimeString = `${data.date}T${data.time}`;
          setMatchDate(new Date(dateTimeString));
        }
      }
    };

    fetchMatch();
  }, []);

  useEffect(() => {
    async function checkScore() {
      const latest = await fetchScore();
      console.log('📺 latest score:', latest);
      const match = latest.title?.match(/^(.*?)\s(\d+[-:]\d+)\s(.*?)\s/);
      const extractedHome = match?.[1]?.trim().toLowerCase() || '';
      const extractedAway = match?.[3]?.trim().toLowerCase() || '';
      console.log('🏷 extracted home:', extractedHome, '| away:', extractedAway);
      if (!latest || !data || (latest.homeScore == null && latest.awayScore == null)) return;

      const team1Name = data.team1?.name?.toLowerCase() || '';
      const team2Name = data.team2?.name?.toLowerCase() || '';
      const home = extractedHome;
      const away = extractedAway;
      const isFayna = home.includes('fayna') || away.includes('fayna');
      console.log('🏷 team1:', team1Name, '| team2:', team2Name);
      console.log('🆚 home:', home, '| away:', away);
      console.log('✅ isFayna:', isFayna);
      if (!isFayna) return;

      const isTeam1Home = home.includes(team1Name) || team1Name.includes(home);
      const isTeam2Home = home.includes(team2Name) || team2Name.includes(home);

      if (isTeam1Home || isTeam2Home) {
        console.log('🎯 Setting score:', {
          home: isTeam1Home ? latest.homeScore : latest.awayScore,
          away: isTeam1Home ? latest.awayScore : latest.homeScore,
          url: latest.url,
          homeTeam: latest.homeTeam,
          awayTeam: latest.awayTeam,
        });
        setScore({
          home: isTeam1Home ? latest.homeScore : latest.awayScore,
          away: isTeam1Home ? latest.awayScore : latest.homeScore,
          url: latest.url,
          homeTeam: latest.homeTeam,
          awayTeam: latest.awayTeam,
        });
      }
    }

    checkScore();
  }, [data]);
  const isFinished = score !== null;

  return (
    <>
      <GlobalStyle />
      <Wrapper as={motion.section}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <TournamentInfo>
          <a href="https://r-cup.com.ua/" target="_blank" rel="noopener noreferrer">
            <img src="/images/matches/logo-rejo.png" alt="Турнір" />
          </a>
          <div className="text">
            <div className="meta">
              {data?.tournament_title}
              {data?.round_number ? ` • ТУР ${data.round_number}` : ''}
            </div>
          </div>
        </TournamentInfo>
        {!isFinished ? (
          <Countdown>
            <FlipUnit>
              <div style={{ fontSize: '2.88rem', fontWeight: 'bold' }}>
                {String(days).padStart(2, '0')}
              </div>
              <div className="label">дні</div>
            </FlipUnit>
            <FlipUnit>
              <div style={{ fontSize: '2.88rem', fontWeight: 'bold' }}>
                {String(hours).padStart(2, '0')}
              </div>
              <div className="label">год</div>
            </FlipUnit>
            <FlipUnit>
              <div style={{ fontSize: '2.88rem', fontWeight: 'bold' }}>
                {String(minutes).padStart(2, '0')}
              </div>
              <div className="label">хв</div>
            </FlipUnit>
            <FlipUnit>
              <div style={{ fontSize: '2.88rem', fontWeight: 'bold' }}>
                {String(seconds).padStart(2, '0')}
              </div>
              <div className="label">сек</div>
            </FlipUnit>
          </Countdown>
        ) : (
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#ccc',
            marginBottom: '1.5rem',
          }}>
            Матч завершено
          </div>
        )}
        {matchDate && (
          <DateText>
            {format(matchDate, 'EEEE, d MMMM', { locale: uk })}
          </DateText>
        )}
        <MatchBox>
          <TeamWrapper>
            {data?.team1 && (
              <div className="team reverse">
                <img src={data.team1.logo || '/images/placeholder.svg'} alt={data.team1.name} />
                <div className="team-info">
                  <span className="name">{data.team1.name}</span>
                  {data.team1?.form && (
                    <Form align="left">
                      {data.team1.form.slice(0, 5).toLowerCase().split('').map((item, i) => (
                        <div key={i} className={`form-item ${item}`}>
                          {item === 'w' ? 'В' : item === 'l' ? 'П' : 'Н'}
                        </div>
                      ))}
                    </Form>
                  )}
                </div>
              </div>
            )}
          </TeamWrapper>

          <div className="vs">
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              minWidth: '100px',
            }}>
              {score !== null
                ? `${score.home} - ${score.away}`
                : matchDate && new Date() < matchDate
                ? matchDate.toLocaleTimeString('uk-UA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--:--'}
            </div>
          </div>


          <TeamWrapper>
            {data?.team2 && (
              <div className="team">
                <img src={data.team2.logo || '/images/placeholder.svg'} alt={data.team2.name} />
                <div className="team-info">
                  <span className="name">{data.team2.name}</span>
                  {data.team2?.form && (
                    <Form align="right">
                      {data.team2.form.slice(0, 5).toLowerCase().split('').map((item, i) => (
                        <div key={i} className={`form-item ${item}`}>
                          {item === 'w' ? 'В' : item === 'l' ? 'П' : 'Н'}
                        </div>
                      ))}
                    </Form>
                  )}
                </div>
              </div>
            )}
          </TeamWrapper>
        </MatchBox>
        <Stadium>
          <div className="venue">🏟 {data?.stadium}</div>
          <div className="address">
            <span className="icon">📍</span>
            <span>{data?.address}</span>
          </div>
        </Stadium>
        <div style={{ marginTop: '2rem' }}>
          <a
            href={score?.url || data?.youtube_link || 'https://www.youtube.com/@FCFAYNATEAM'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.6rem',
              background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.1))',
              border: '1px solid rgba(255, 0, 0, 0.6)',
              borderRadius: '0px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              transition: 'background 0.3s ease, border 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, rgb(255, 0, 0), rgb(255, 0, 0))';
              setIsHovered(true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.1))';
              setIsHovered(false);
            }}
          >
            {score?.url ? 'ДИВИТИСЬ ПОВНИЙ МАТЧ' : 'ДИВИТИСЬ ТРАНСЛЯЦІЮ НА YOUTUBE'}
            <img
              src={isHovered ? "/images/icons/youtube_white.svg" : "/images/icons/youtube.svg"}
              alt="YouTube"
              style={{ width: '20px', height: '20px' }}
            />
          </a>
        </div>
      </Wrapper>
    </>
  );
};

export default NextMatch;