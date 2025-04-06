import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

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
  background-color: #111;
  padding: 4rem 1rem;
  text-align: center;
  color: white;
  font-family: 'Cuprum', sans-serif;
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

  .flip-card {
    perspective: 1000px;
    width: 60px;
    height: 60px;
    position: relative;
  }

  .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.7s ease-in-out;
  }

  .flip-front,
  .flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background: #222;
    color: white;
    font-size: 2rem;
    font-weight: bold;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flip-back {
    transform: rotateX(180deg);
  }

  .label {
    margin-top: 0.4rem;
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
    height: 40px;
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
      font-size: 0.9rem;
      color: #aaa;
    }
  }
`;

const NextMatch = () => {
  const matchDate = new Date('2025-04-07T19:00:00');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = matchDate.getTime() - now.getTime();

      if (distance <= 0) {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        clearInterval(interval);
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

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
        <Title>Наступний матч</Title>
        <DateText>Неділя, 6 квітня 2025</DateText>
        <Countdown>
          <FlipUnit>
            <div className="flip-card">
              <motion.div
                className="flip-inner"
                key={hours}
                initial={{ rotateX: 180 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flip-front">{String(hours).padStart(2, '0')}</div>
                <div className="flip-back">{String(hours).padStart(2, '0')}</div>
              </motion.div>
            </div>
            <div className="label">год</div>
          </FlipUnit>
          <FlipUnit>
            <div className="flip-card">
              <motion.div
                className="flip-inner"
                key={minutes}
                initial={{ rotateX: 180 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flip-front">{String(minutes).padStart(2, '0')}</div>
                <div className="flip-back">{String(minutes).padStart(2, '0')}</div>
              </motion.div>
            </div>
            <div className="label">хв</div>
          </FlipUnit>
          <FlipUnit>
            <div className="flip-card">
              <motion.div
                className="flip-inner"
                key={seconds}
                initial={{ rotateX: 180 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flip-front">{String(seconds).padStart(2, '0')}</div>
                <div className="flip-back">{String(seconds).padStart(2, '0')}</div>
              </motion.div>
            </div>
            <div className="label">сек</div>
          </FlipUnit>
        </Countdown>
        <TournamentInfo>
          <img src="/images/matches/logo-tournament.png" alt="Турнір" />
          <div className="text">
            <div className="name">R-Cup</div>
            <div className="meta">Перша Ліга • Тур 5</div>
          </div>
        </TournamentInfo>
        <MatchBox>
          <div className="team">
            <span>FAYNA TEAM</span>
            <img src="/images/matches/logo-fayna-match.svg" alt="Fayna Team" />
          </div>
          <div className="vs">
            <div
              style={{
                background: '#222',
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
            <span>MANCHESTER UNITED</span>
          </div>
        </MatchBox>
        <Stadium>
          <div className="venue">МАНЕЖ REJO-ВДНХ №1</div>
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
              padding: '0.8rem 1.6rem',
              border: '2px solid white',
              borderRadius: '0',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '1rem',
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'white';
              (e.currentTarget as HTMLAnchorElement).style.color = '#111';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = 'white';
            }}
          >
            <img
              src="/images/icons/youtube.svg"
              alt="YouTube"
              style={{ width: '22px', height: '22px' }}
            />
            Дивитись трансляцію
          </a>
        </div>
      </Wrapper>
    </>
  );
};

export default NextMatch;