
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
const YoutubeLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.6rem;
  background: linear-gradient(90deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.1));
  border: 1px solid rgba(255, 0, 0, 0.6);
  border-radius: 0px;
  color: white;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.2));
    border-color: rgba(255, 0, 0, 0.8);
    transform: translateY(-1px);
  }
`;

const ActionText = styled.div`
  color: #aaa;
  font-size: 0.95rem;
  font-style: italic;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
const GlobalStyle = createGlobalStyle`
  @keyframes shine {
    0% { background-position: 100% }
    100% { background-position: -100% }
  }

.team.horizontal {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-content: flex-start;
}

.team.horizontal.reverse {
  flex-direction: row-reverse;
  justify-content: flex-end;
  gap: 1.5rem;
}

/* TEAM1: вирівнювання по правому краю */
.team.horizontal .team-layout {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.team.horizontal .team-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

/* TEAM2: вирівнювання по лівому краю */
.team.horizontal.reverse .team-layout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.team.horizontal.reverse .team-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.team-header .name {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  white-space: nowrap;
}

.team-extra {
  margin-top: 0.3rem;
  font-size: 1.1rem;
  font-weight: 300;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.team.horizontal .team-extra {
  align-items: flex-end;
  text-align: right;
}

.team.horizontal.reverse .team-extra {
  align-items: flex-start;
  text-align: left;
}
.team-header {
  text-align: inherit;
}

  

  .team-header,
  .team-extra {
    align-items: inherit;
    text-align: inherit;
  }

  .team-header .name {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
    white-space: nowrap;
  }


  .team img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: contain;
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


 

  .team-logo {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 50%;
  }



  .watch-text {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .arrow {
    display: inline-block;
  }
  
  .team-layout {
    min-width: 160px;
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
    gap: 2rem;
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
  justify-content: ${({ align }) =>
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'};
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%; /* додай це! */

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
  margin-top: -1.5rem;

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
    finishedManually?: boolean;
  } | null>(null);
  const [matchIsOver, setMatchIsOver] = useState(false);

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
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*, team1:team1_id(*), team2:team2_id(*), tournament:tournament_id(*), mvp:mvp_player_id(*)')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error || !matches || matches.length === 0) {
        console.error('Match fetch error:', error);
        return;
      }

      const now = new Date();

      // знайти перший матч у майбутньому
      let upcoming = matches.find(m => new Date(`${m.date}T${m.time}`) > now);

      // якщо нема — взяти останній зіграний
      if (!upcoming) {
        upcoming = matches[matches.length - 1];
      }

      setData(upcoming);
      if (upcoming?.date && upcoming?.time) {
        const dateTimeString = `${upcoming.date}T${upcoming.time}`;
        setMatchDate(new Date(dateTimeString));
      }
    };

    fetchMatch();
  }, []);

  useEffect(() => {
    if (!matchDate) return;
  
    const now = new Date();
    const twoHoursLater = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
    if (now > twoHoursLater) {
      setMatchIsOver(true);
    }
  }, [matchDate]);

  useEffect(() => {
    async function checkScore() {
      const latest = await fetchScore();
      console.log('📺 latest score:', latest);
      if (data?.date && data?.time) {
        const matchStart = new Date(`${data.date}T${data.time}`);
        const twoHoursLater = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000);
        const now = new Date();
        if (now > twoHoursLater) {
          setMatchIsOver(true);
        }
      }
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
const isLive = !!score?.url && !score?.finishedManually;
const isNowLive = matchDate && new Date() >= matchDate && new Date() < new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
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
            <img src={data?.tournament?.logo_url || '/images/matches/logo-rejo.png'} alt={data?.tournament?.title || 'Турнір'} />
          </a>
          <div className="text">
            <div className="meta">
              {data?.tournament?.league_name}
              {data?.round_number ? ` • ТУР ${data.round_number}` : ''}
            </div>
          </div>
        </TournamentInfo>
        {!score && !matchIsOver ? (
          isLive || isNowLive ? (
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255, 0, 0, 0.15)',
              border: '1px solid rgba(255, 0, 0, 0.5)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(6px)',
            }}>
              🔴 Пряма трансляція
            </div>
          ) : (
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
          )
        ) : (
          matchIsOver ? (
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(6px)',
            }}>
              🏁 Матч завершено
            </div>
          ) : (
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255, 0, 0, 0.15)',
              border: '1px solid rgba(255, 0, 0, 0.5)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(6px)',
            }}>
              🔴 Пряма трансляція
            </div>
          )
        )}
        {matchDate && (
          <DateText>
            {format(matchDate, 'EEEE, d MMMM', { locale: uk })}
          </DateText>
        )}
        <MatchBox>
        <TeamWrapper>
  {data?.team1 && (
    <div className="team horizontal">
      <div className="team-layout">
        <div className="team-header">
          <span className="name">{data.team1.name}</span>
        </div>
        <div className="team-info">
          {data.team1?.form && (
            <Form align="right">
              {data.team1.form.slice(0, 5).toLowerCase().split('').map((item, i) => {
                const label = item === 'w' ? 'В' : item === 'l' ? 'П' : 'Н';
                const className = item === 'w' ? 'w' : item === 'l' ? 'l' : 'd';
                return <div key={i} className={`form-item ${className}`}>{label}</div>;
              })}
            </Form>
          )}
          {data.team1.name?.toLowerCase().includes('fayna') && matchIsOver && (
            <div className="team-extra">
              {data?.mvp && <div>⭐ MVP {data.mvp.last_name}</div>}
              {data?.scorers_fayna && data.scorers_fayna.split(',').map((name, i) => (
                <div key={i}>⚽ {name.trim()}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <img src={data.team1.logo || '/images/placeholder.svg'} alt={data.team1.name} />
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
      {matchIsOver && data?.score_team1 != null && data?.score_team2 != null
        ? `${data.score_team1} - ${data.score_team2}`
        : matchDate && new Date() < matchDate
        ? matchDate.toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : isNowLive ? 'vs' : '--:--'}
    </div>
  </div>

  <TeamWrapper>
  {data?.team2 && (
    <div className="team horizontal reverse">
      <div className="team-layout">
        <div className="team-header">
          <span className="name">{data.team2.name}</span>
        </div>
        <div className="team-info">
          {data.team2?.form && (
            <Form align="left">
              {data.team2.form.slice(0, 5).toLowerCase().split('').map((item, i) => {
                const label = item === 'w' ? 'В' : item === 'l' ? 'П' : 'Н';
                const className = item === 'w' ? 'w' : item === 'l' ? 'l' : 'd';
                return <div key={i} className={`form-item ${className}`}>{label}</div>;
              })}
            </Form>
          )}
          {data.team2.name?.toLowerCase().includes('fayna') && matchIsOver && (
            <div className="team-extra">
              {data?.mvp && <div>⭐ MVP {data.mvp.last_name}</div>}
              {data?.scorers_fayna && data.scorers_fayna.split(',').map((name, i) => (
                <div key={i}>⚽ {name.trim()}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <img src={data.team2.logo || '/images/placeholder.svg'} alt={data.team2.name} />
    </div>
  )}
</TeamWrapper>
</MatchBox>
        <div style={{ position: 'relative', marginTop: '2.5rem' }}>
          <Stadium>
            <div className="venue">🏟 {data?.tournament?.stadium}</div>
            <div className="address">
              <span className="icon">📍</span>
              <span>{data?.tournament?.address}</span>
            </div>
          </Stadium>
        </div>
        <div style={{ marginTop: '2rem' }}>
        {matchIsOver && data?.highlight_link ? (
  // 1. Матч завершено і є огляд
  <div style={{ marginTop: '2rem' }}>
    <YoutubeLink
      href={data.highlight_link}
      target="_blank"
      rel="noopener noreferrer"
    >
      ДИВИТИСЬ ОГЛЯД МАТЧУ
      <img src="/images/icons/youtube.svg" style={{ width: 20, height: 20 }} />
    </YoutubeLink>
  </div>
) : matchIsOver && !data?.highlight_link ? (
  // 2. Матч завершено, але огляду ще нема
            <div style={{
    marginTop: '2rem',
    color: '#aaa',
    fontSize: '0.95rem',
    fontStyle: 'italic',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      Огляд буде доступний пізніше
      <img
        src="/images/icons/youtube.svg"
        alt="Очікуємо на огляд"
        style={{ width: 20, height: 20, opacity: 0.5 }}
      />
    </span>
  </div>
) : !matchIsOver && data?.youtube_link ? (
  // 3. Матч ще не завершено, але є трансляція
  <div style={{ marginTop: '2rem' }}>
    <YoutubeLink
      href={data.youtube_link}
      target="_blank"
      rel="noopener noreferrer"
    >
      ДИВИТИСЬ ТРАНСЛЯЦІЮ НА YOUTUBE
      <img src="/images/icons/youtube.svg" style={{ width: 20, height: 20 }} />
    </YoutubeLink>
  </div>
) : (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <ActionText>
                Очікуємо на трансляцію
                <img
                  src="/images/icons/youtube.svg"
                  alt="Очікуємо на трансляцію"
                  style={{ width: 20, height: 20, opacity: 0.5 }}
                />
              </ActionText>
            </div>
)}
        </div>
      </Wrapper>
    </>
  );
};

export default NextMatch;