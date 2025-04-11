import React from 'react';
import Layout from '../layout/Layout';
import PlayerCard from '../components/PlayerCard';

const players = [
  { number: 3, name: 'Владислав Скляр', lastName: 'Скляр', position: 'Універсал' },
  { number: 4, name: 'Артем Шундрик', lastName: 'Шундрик', position: 'Універсал' },
  { number: 5, name: 'Віктор Зінчук', lastName: 'Зінчук', position: 'Універсал' },
  { number: 7, name: 'Анатолій Пристайчук', lastName: 'Пристайчук', position: 'Універсал' },
  { number: 10, name: 'Ігор Сірик', lastName: 'Сірик', position: 'Універсал' },
  { number: 11, name: 'Андрій Супруненко', lastName: 'Супруненко', position: 'Універсал' },
  { number: 12, name: 'Олександр Стеблюк', lastName: 'Стеблюк', position: 'Універсал' },
  { number: 13, name: 'Роман Подзізей', lastName: 'Подзізей', position: 'Універсал' },
  { number: 17, name: "Владислав Хом'яков", lastName: 'Хомяков', position: 'Універсал' },
  { number: 18, name: 'Сергій Осадчий', lastName: 'Осадчий', position: 'Універсал' },
  { number: 19, name: 'Сергій Осаульчук', lastName: 'Осаульчук', position: 'Універсал' },
  { number: 22, name: 'Мосієнко', lastName: 'Мосієнко', position: 'Універсал' },
  { number: 33, name: 'Руслан Кашкарьов', lastName: 'Кашкарьов', position: 'Воротар' },
  { number: 71, name: 'Артем Головченко', lastName: 'Головченко', position: 'Воротар' },
  { number: 81, name: 'Назар Гнібєда', lastName: 'Гнібєда', position: 'Універсал' },
  { number: 99, name: 'Юрій Глущук', lastName: 'Глущук', position: 'Універсал' },
];

const goalkeepers = players.filter(p => p.position === 'Воротар');
const universals = players.filter(p => p.position === 'Універсал');

const Squad: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f4f4f4' }}>
      <Layout>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          backgroundColor: '#f4f4f4',
          color: '#000',
          fontFamily: 'Cuprum, sans-serif'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Склад</h1>
          
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Голкіпери</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              justifyContent: 'center',
              gap: 'clamp(1rem, 2vw, 2rem)',
              marginTop: '1rem',
              marginBottom: '2rem'
            }}>
              {goalkeepers.map(player => (
                <PlayerCard
                  key={player.number}
                  name={player.name}
                  position={player.position!}
                  number={player.number}
                  photoUrl={encodeURIComponent(`${player.number} - ${player.lastName}.png`)}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Універсали</h2>
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(1rem, 2vw, 2rem)',
                marginTop: '1rem',
                marginBottom: '2rem'
              }}>
                {universals.map(player => (
                  <PlayerCard
                    key={player.number}
                    name={player.name}
                    position={player.position!}
                    number={player.number}
                    photoUrl={encodeURIComponent(`${player.number} - ${player.lastName}.png`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Squad;