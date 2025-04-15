import React from 'react';

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
        if (overlay) overlay.style.opacity = '1';
        if (data) data.style.transform = 'translateX(0)';
        if (numberEl) numberEl.style.opacity = '0.3';
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector('.player-image') as HTMLElement;
        if (img) img.style.transform = 'scale(1)';
        const overlay = e.currentTarget.querySelector('.hover-overlay') as HTMLElement;
        const data = e.currentTarget.querySelector('.hover-data') as HTMLElement;
        const numberEl = e.currentTarget.querySelector('.player-number') as HTMLElement;
        if (overlay) overlay.style.opacity = '0';
        if (data) data.style.transform = 'translateX(-100%)';
        if (numberEl) numberEl.style.opacity = '1';
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
            <div style={{ fontSize: '1.4rem', fontWeight: '500', textTransform: 'uppercase', color: '#fff', marginBottom: '0.25rem', paddingLeft: '30px' }}>
            {name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', textTransform: 'uppercase', color: '#ff1695', paddingLeft: '30px' }}>
              {name.split(' ')[1]}
            </div>
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
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                width: '100%',
                marginBottom: '1rem',
                color: 'white',
              }}>
                <div style={{ textAlign: 'center', minWidth: '45%' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: '600', color: 'white' }}>{goals ?? 0}</div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Голи</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '45%' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: '600', color: 'white' }}>{assists ?? 0}</div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Асисти</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '45%', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '3.4rem', fontWeight: '600', color: 'white' }}>{matches ?? 0}</div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Матчі</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '45%', marginTop: '0.5rem' }}>
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
                {position === 'Воротар' && (
                  <div style={{ textAlign: 'center', minWidth: '45%', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '3.4rem', fontWeight: '600', color: 'white' }}>{saves ?? 0}</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '-0.5rem' }}>Сейви</div>
                  </div>
                )}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                fontWeight: '600',
                fontSize: '1.2rem',
                color: '#ddd',
              }}>
                {birthDate ? `${new Date().getFullYear() - new Date(birthDate).getFullYear()} років` : ''}
              </div>
              {birthDate && (
                <div style={{ fontWeight: '600', fontSize: '1rem', color: '#ddd' }}>
                  🎂 {birthDate} ({new Date().getFullYear() - new Date(birthDate).getFullYear()} років)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerCard;
