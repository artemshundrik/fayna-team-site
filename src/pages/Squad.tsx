import React from 'react';
import Layout from '../layout/Layout';
import PlayersList from '../components/PlayersList';

const Squad: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f4f4f4' }}>
      <Layout>
        <main
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: '#f4f4f4',
            color: '#000',
            fontFamily: 'Cuprum, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Склад</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '2rem 0 1rem' }}>Воротарі</h2>
              <PlayersList position="Воротар" />
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '2rem 0 1rem' }}>Універсали</h2>
              <PlayersList position="Універсал" />
            </section>
          </div>
        </main>
      </Layout>
    </div>
  );
};

export default Squad;