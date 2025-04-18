import React from 'react';

function getUkrainianYears(age: number): string {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'років';
  if (lastDigit === 1) return 'рік';
  if (lastDigit >= 2 && lastDigit <= 4) return 'роки';
  return 'років';
}

function calculateAge(birthDateStr: string): number {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();
  if (m < 0 || (m === 0 && d < 0)) {
    age--;
  }
  return age;
}

const fontStyle = `
  @font-face {
    font-family: 'AdiCupQ2022';
    src: url('/fonts/AdiCupQ2022.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);  /* Card starts below */
    }
    100% {
      opacity: 1;
      transform: translateY(0);  /* Card moves to its original position */
    }
  }
`;

type PlayerCardProps = {
  name: string;
  position: string;
  number: number;
  photoUrl?: string;
  birthDate?: string;
  matches?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  saves?: number;
};

const PlayerCard: React.FC<PlayerCardProps> = ({ name, position, number, photoUrl, birthDate, matches, goals, assists, yellowCards, redCards, saves }) => {
  return (
    <>
      <style>{fontStyle}</style>
      <div style={{
        overflow: 'hidden',
        color: 'white',
        position: 'relative',
        fontFamily: 'Cuprum, sans-serif',
        width: '360px',
        height: 'calc(100% + 0px)',
        margin: '0 auto',
        background: 'linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%)',
        transition: 'transform 0.3s ease',
        animation: 'fadeIn 1s ease-out',  // Apply fade-in animation
        boxSizing: 'border-box',
      }} 
      onMouseEnter={(e) => {
        const img = e.currentTarget.querySelector('.player-image') as HTMLElement;
        if (img) img.style.transform = 'scale(1.08)';
        const overlay = e.currentTarget.querySelector('.hover-overlay') as HTMLElement;
        const data = e.currentTarget.querySelector('.hover-data') as HTMLElement;
        const numberEl = e.currentTarget.querySelector('.player-number') as HTMLElement;
        const nameBlock = e.currentTarget.querySelector('.player-name') as HTMLElement;
        const birthBlock = e.currentTarget.querySelector('.player-birthdate') as HTMLElement;
        if (overlay) overlay.style.opacity = '1';
        if (data) data.style.transform = 'translateX(0)';
        if (numberEl) numberEl.style.opacity = '0.3';
        if (nameBlock) nameBlock.style.opacity = '0';
        if (birthBlock) birthBlock.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector('.player-image') as HTMLElement;
        if (img) img.style.transform = 'scale(1)';
        const overlay = e.currentTarget.querySelector('.hover-overlay') as HTMLElement;
        const data = e.currentTarget.querySelector('.hover-data') as HTMLElement;
        const numberEl = e.currentTarget.querySelector('.player-number') as HTMLElement;
        const nameBlock = e.currentTarget.querySelector('.player-name') as HTMLElement;
        const birthBlock = e.currentTarget.querySelector('.player-birthdate') as HTMLElement;
        if (overlay) overlay.style.opacity = '0';
        if (data) data.style.transform = 'translateX(-100%)';
        if (numberEl) numberEl.style.opacity = '1';
        if (nameBlock) nameBlock.style.opacity = '1';
        if (birthBlock) birthBlock.style.opacity = '0';
      }}>
        <div style={{
          position: 'relative',
        }}>
          <div style={{ overflow: 'hidden', position: 'relative', height: '380px' }}>
            {photoUrl ? (
              <img
                src={`/images/players/${photoUrl}`}
                alt={name}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  height: '380px',
                  width: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  transition: 'transform 0.4s ease',
                }}
                className="player-image"
              />
            ) : (
              <div style={{
                position: 'absolute',
                bottom: 0,
                height: '380px',
                width: '100%',
                background: '#2c2c2c',
              }} />
            )}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            padding: '1rem 0 1.5rem',
            textAlign: 'left',
            lineHeight: '1',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.0) 100%)',
            width: '100%',
            zIndex: 2,
          }}>
            <div className="player-name" style={{ transition: 'opacity 0.4s ease;' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '500', textTransform: 'uppercase', color: '#fff', marginBottom: '0.25rem', paddingLeft: '30px' }}>
                {name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '900', textTransform: 'uppercase', color: '#ff1695', paddingLeft: '30px' }}>
                {name.split(' ')[1]}
              </div>
            </div>
          </div>
          <div
            className="player-birthdate"
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '30px',
              fontSize: '1.4rem',
              fontWeight: 400,
              color: '#ddd',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              zIndex: 3,
            }}
          >
            🎂 <span style={{ fontWeight: 300, fontSize: '1.2rem' }}>{birthDate}</span>
            {birthDate ? (
              <span style={{ marginLeft: '0.8rem', fontWeight: 600, color: '#fff', fontSize: '1.4rem' }}>
                {calculateAge(birthDate)} {getUkrainianYears(calculateAge(birthDate))}
              </span>
            ) : null}
          </div>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            fontSize: '3.2rem',
            fontWeight: '900',
            color: '#fff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            fontFamily: 'AdiCupQ2022, sans-serif',
            zIndex: 2,
          }} className="player-number">
            {number}
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)',
            zIndex: 1,
          }} className="hover-overlay">
            <div style={{
              transform: 'translateX(-100%)',
              transition: 'transform 0.4s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: '0.95rem',
              lineHeight: 1.4,
              width: '100%',
              padding: '1rem',
              boxSizing: 'border-box',
            }} className="hover-data">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.2rem 0.5rem',
                width: '100%',
                marginBottom: '1rem',
                color: 'white',
              }}>
                {position !== 'Воротар' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.4rem', fontWeight: '600' }}>{goals ?? 0}</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Голи</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.4rem', fontWeight: '600' }}>{saves ?? 0}</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Сейви</div>
                  </div>
                )}

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: '600' }}>{assists ?? 0}</div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Асисти</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: '600' }}>{matches ?? 0}</div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Матчі</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '3.4rem', fontWeight: '600', color: '#ffcc00' }}>
                      {yellowCards ?? 0}
                    </div>
                    <div style={{ fontSize: '3.4rem', fontWeight: '600', color: '#ff4d4d' }}>
                      {redCards ?? 0}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Картки</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerCard;
