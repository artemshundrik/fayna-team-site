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
  background: #FF1695;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0;
  font-weight: 600;
  text-decoration: none;
  font-family: 'Cuprum', sans-serif;
  text-transform: uppercase;
  transition: background 0.3s;

  &:hover {
    background: #e6007e;
  }
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
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>1 - 0</div>
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
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>2 - 2</div>
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
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>22:00</div>
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
