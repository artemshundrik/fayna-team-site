import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled(motion.section)`
  padding: 4rem 1rem;
  background-color: #f7f7f7;
  color: black;
  font-family: 'Cuprum', sans-serif;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;

const Heading = styled(motion.h2)`
  font-size: 1.25rem;
  text-transform: uppercase;
  margin-bottom: 2rem;
  padding-left: 0;
  font-weight: 600;
  text-align: left;
  max-width: 1200px;
  margin: 0 auto 2rem auto;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #fff;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Teams = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
  font-size: clamp(1rem, 2vw, 1.4rem);
  text-transform: uppercase;
  font-family: 'Cuprum', sans-serif;
  text-decoration: none;
  position: relative;
  background: linear-gradient(135deg, #FF1695, #ff6ac1);
  color: white;
  border: none;
  border-radius: 0;
  box-shadow: 0 0 12px rgba(255, 22, 149, 0.5), 0 0 24px rgba(255, 22, 149, 0.3);
  overflow: hidden;
  transition: background 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: all 0.75s ease;
  }

  &:hover::after {
    left: 100%;
  }

  &:hover {
    background: white;
    color: #FF1695;
    box-shadow: 0 6px 16px rgba(255, 22, 149, 0.5);
  }
`;

const ScoreBox = styled.div<{ isActive?: boolean }>`
  background: ${({ isActive }) => (isActive ? '#1e1f22' : '#e9e9e9')};
  color: ${({ isActive }) => (isActive ? '#fff' : '#6e6e6e')};
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 2.2rem;
  text-align: center;
`;

const Fixtures = () => {
  return (
    <Section>
      <ContentWrapper
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Розклад матчів
        </Heading>

        <Grid
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card>
            <img src="/images/matches/logo-rejo.png" alt="Rejo" height="48" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Понеділок, 1 квітня, 22:00</div>
            <Teams>
              <strong>FAYNA TEAM</strong>
              <img src="/images/matches/logo-fayna-match-black.svg" alt="FAYNA TEAM" height="36" />
              <span>vs</span>
              <img src="/images/matches/logo-barcelona.svg" alt="Barcelona" height="36" />
              <strong>BARCELONA</strong>
            </Teams>
            <ScoreBox isActive>1 - 0</ScoreBox>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Манеж REJO-ВДНХ №1</div>
          </Card>

          <Card>
            <img src="/images/matches/logo-rejo.png" alt="Rejo" height="48" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Субота, 6 квітня, 18:30</div>
            <Teams>
              <strong>FAYNA TEAM</strong>
              <img src="/images/matches/logo-fayna-match-black.svg" alt="FAYNA TEAM" height="36" />
              <span>vs</span>
              <img src="/images/matches/logo-barcelona.svg" alt="Barcelona" height="36" />
              <strong>BARCELONA</strong>
            </Teams>
            <ScoreBox isActive>2 - 2</ScoreBox>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Манеж REJO-ВДНХ №1</div>
          </Card>

          <Card>
            <img src="/images/matches/logo-rejo.png" alt="Rejo" height="48" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Середа, 10 квітня, 22:00</div>
            <Teams>
              <strong>FAYNA TEAM</strong>
              <img src="/images/matches/logo-fayna-match-black.svg" alt="FAYNA TEAM" height="36" />
              <span>vs</span>
              <img src="/images/matches/logo-barcelona.svg" alt="Barcelona" height="36" />
              <strong>BARCELONA</strong>
            </Teams>
            <ScoreBox>22:00</ScoreBox>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Манеж REJO-ВДНХ №1</div>
          </Card>
        </Grid>

        <ButtonWrapper>
          <Button href="/calendar">Повний календар</Button>
        </ButtonWrapper>
      </ContentWrapper>
    </Section>
  );
};

export default Fixtures;
