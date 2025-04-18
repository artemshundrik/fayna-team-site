import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // шлях залежить від твого проєкту
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
  position: relative;
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
  const [fixtures, setFixtures] = useState<any[]>([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      const { data, error } = await supabase
        .from('matches')
      .select(`
          *,
          team1:team1_id ( name, logo ),
          team2:team2_id ( name, logo ),
          tournament:tournament_id ( logo_url, stadium, address )
        `)
        .order('date', { ascending: true });

      if (!error && data) {
        const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', "п'ятниця", 'субота'];
        const formatted = data.map((match: any) => {
          const dateObj = new Date(`${match.date}T${match.time}`);
          const formatter = new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          });
          const weekdayName = weekdays[dateObj.getDay()];

          return {
            ...match,
            date_text: `${weekdayName}, ${formatter.format(dateObj)}`,
            score: match.score_team1 != null && match.score_team2 != null
              ? `${match.score_team1} - ${match.score_team2}`
              : match.time?.slice(0, 5),
          };
        });

        const now = new Date();
        const pastMatches = formatted
          .filter(m => new Date(`${m.date}T${m.time}`) < now)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const upcomingMatches = formatted
          .filter(m => new Date(`${m.date}T${m.time}`) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const sliced = [
          pastMatches[0], // last match
          upcomingMatches[0], // next match
        ].filter(Boolean);

        setFixtures(sliced);
      } else {
        console.error('Помилка завантаження матчів:', error);
      }
    };

    fetchFixtures();
  }, []);
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
          {fixtures.map((match, index) => (
            <Card key={index}>
              {index === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '0rem',
                  left: '0rem',
                  background: '#E9E9E9',
                  color: '#6E6E6E',
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}>
                  Минула гра
                </div>
              )}
              {index === fixtures.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '0rem',
                  left: '0rem',
                  background: '#000',
                  color: '#fff',
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}>
                  Наступна гра
                </div>
              )}
              <img src={match.tournament?.logo_url || '/default-tournament.png'} alt="Tournament" height="64" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>{match.date_text}</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  justifyItems: 'center',
                  gap: '0.75rem',
                  marginTop: '0.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.6rem',
                    minWidth: '180px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{match.team1?.name || 'Команда 1'}</span>
                  <img src={match.team1?.logo || '/default-logo.png'} alt={match.team1?.name || 'Команда 1'} style={{ height: 48, width: 48, borderRadius: '50%' }} />
                </div>

                <ScoreBox isActive={match.score_team1 != null && match.score_team2 != null}>
                  {match.score || match.time}
                </ScoreBox>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '0.6rem',
                    minWidth: '180px',
                  }}
                >
                  <img src={match.team2?.logo || '/default-logo.png'} alt={match.team2?.name || 'Команда 2'} style={{ height: 48, width: 48, borderRadius: '50%' }} />
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{match.team2?.name || 'Команда 2'}</span>
                </div>
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.8', marginTop: '0.5rem' }}>
                <div>🏟 {match.tournament?.stadium || 'Манеж REJO-ВДНХ №1'}</div>
                <div style={{ color: '#888' }}>📍 {match.tournament?.address || 'вул. Академіка Глушкова, 1, Київ'}</div>
              </div>
            </Card>
          ))}
        </Grid>

        <ButtonWrapper>
          <Button href="/matches">Повний календар</Button>
        </ButtonWrapper>
      </ContentWrapper>
    </Section>
  );
};

export default Fixtures;
