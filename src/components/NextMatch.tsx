import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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
    height: 100px;
  }

  .team {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    font-weight: bold;
    color: white;
    flex: 1;
    max-width: 300px;
    justify-content: center;
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
  const matchDate = new Date('2025-04-07T19:00:00');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
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
  }, []);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <TournamentInfo>
          <a href="https://r-cup.com.ua/tournament/1025060" target="_blank" rel="noopener noreferrer">
            <img src="/images/matches/logo-tournament.png" alt="Турнір" />
          </a>
          <div className="text">
            <div className="meta">ПЕРША ЛІГА • ТУР 5</div>
          </div>
        </TournamentInfo>
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
        <DateText>Неділя, 6 квітня</DateText>
        <MatchBox>
          <div className="team">
            <span>FAYNA TEAM</span>
            <img src="/images/matches/logo-fayna-match.svg" alt="Fayna Team" />
          </div>
          <div className="vs">
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            19:00
          </div>
          </div>
          <div className="team">
            <img src="/images/matches/logo-opponent-match.svg" alt="Manchester United" />
            <span>BARCELONA</span>
          </div>
        </MatchBox>
        <Stadium>
          <div className="venue">🏟️ МАНЕЖ REJO-ВДНХ №1</div>
          <div className="address">
            <span className="icon">📍</span>
            <span>Київ, проспект Академіка Глушкова, 1</span>
          </div>
        </Stadium>
        <div style={{ marginTop: '2rem' }}>
          <a
            href="https://www.youtube.com/@FCFAYNATEAM"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.6rem',
              background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.1))',
              border: '1px solid rgba(255, 0, 0, 0.6)',
              borderRadius: '6px',
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
            ДИВИТИСЬ ТРАНСЛЯЦІЮ НА YOUTUBE
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