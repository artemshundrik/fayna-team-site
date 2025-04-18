import React from 'react';

const InstagramSection: React.FC = () => {
  return (
    <div style={{ marginTop: '4rem' }}>
      <h3 style={{
        fontSize: '1.8rem',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        📸 FAYNA Stories
      </h3>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '1rem',
        gap: '1rem'
      }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              minWidth: '160px',
              height: '280px',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#111',
              flexShrink: 0,
              position: 'relative'
            }}
          >
            <img
              src={`https://picsum.photos/seed/${i}/200/300`}
              alt="Instagram story"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '0.5rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              Story caption {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramSection;