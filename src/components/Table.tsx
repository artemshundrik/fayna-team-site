import React from 'react';

const teams = [
  { place: 1, name: 'Крила Донбасу', logo: '/images/teams/logo-krila-donbasu.png', positionChange: 'up', form: ['W', 'W', 'D', 'W', 'L'] },
  { place: 2, name: 'ФК Фокус', logo: '/images/teams/logo-focus.png', positionChange: 'down', form: ['D', 'W', 'W', 'W', 'W'] },
  { place: 3, name: 'UID', logo: '/images/teams/logo-uid.png', positionChange: 'same', form: ['L', 'L', 'W', 'D', 'W'] },
  { place: 4, name: 'NOOSPHERE KYIV', logo: '/images/teams/logo-noosphere-kyiv.png', positionChange: 'same', form: ['W', 'W', 'W', 'L', 'D'] },
  { place: 5, name: 'LEFT COAST', logo: '/images/teams/logo-left-coast.png', positionChange: 'up', form: ['D', 'D', 'W', 'W', 'W'] },
  { place: 6, name: 'FC Inter Kyiv', logo: '/images/teams/logo-inter-kyiv.png', positionChange: 'down', form: ['L', 'L', 'L', 'W', 'D'] },
  { place: 7, name: 'FC Goldmine', logo: '/images/teams/logo-goldmine.png', positionChange: 'same', form: ['W', 'D', 'D', 'L', 'W'] },
  { place: 8, name: 'OnlyFans Team', logo: '/images/teams/logo-only-fans.png', positionChange: 'up', form: ['W', 'W', 'L', 'D', 'D'] },
  { place: 9, name: 'PIN-UP', logo: '/images/teams/logo-pin-up.png', positionChange: 'down', form: ['L', 'L', 'D', 'W', 'W'] },
  { place: 10, name: 'Благора Інвест', logo: '/images/teams/logo-blagora.png', positionChange: 'same', form: ['D', 'W', 'L', 'L', 'W'] },
  { place: 11, name: 'FC Agents', logo: '/images/teams/logo-agents.png', positionChange: 'up', form: ['W', 'W', 'D', 'L', 'D'] },
  { place: 12, name: 'FC MAXIMUS', logo: '/images/teams/logo-maximus.png', positionChange: 'down', form: ['L', 'W', 'W', 'D', 'W'] },
  { place: 13, name: 'FC KITRUM', logo: '/images/teams/logo-kitrum.png', positionChange: 'same', form: ['D', 'L', 'W', 'W', 'D'] },
  { place: 14, name: 'ФК "Ерідон"', logo: '/images/teams/logo-eridon.png', positionChange: 'up', form: ['W', 'L', 'D', 'W', 'W'] },
  { place: 15, name: 'FAYNA TEAM', logo: '/images/matches/logo-fayna-match-black.svg', positionChange: 'same', form: ['W', 'L', 'D', 'L', 'W'] },
];

const getPositionIcon = (change: string) => {
  switch (change) {
    case 'up':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="green" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L6 10H10V20H14V10H18L12 4Z" />
        </svg>
      );
    case 'down':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20L6 14H10V4H14V14H18L12 20Z" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#9e9e9e" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12L14 6V10H4V14H14V18L20 12Z" />
        </svg>
      );
  }
};

const getFormColor = (result: string) => {
  switch (result) {
    case 'W':
      return '#4caf50';
    case 'L':
      return '#f44336';
    case 'D':
      return '#9e9e9e';
    default:
      return '#ccc';
  }
};

const tableContainerStyle = {
  width: '100%',
  fontFamily: 'Cuprum, sans-serif',
  overflowX: 'auto' as const,
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const columns = [
  { key: 'place', label: '#', width: '3rem', align: 'right' },
  { key: 'team', label: 'КОМАНДА', width: '16rem', align: 'left' },
  { key: 'games', label: 'І', width: '2.5rem', align: 'right' },
  { key: 'wins', label: 'В', width: '2.5rem', align: 'right' },
  { key: 'draws', label: 'Н', width: '2.5rem', align: 'right' },
  { key: 'losses', label: 'П', width: '2.5rem', align: 'right' },
  { key: 'goals', label: 'МЗ/МП', width: '3.5rem', align: 'right' },
  { key: 'form', label: 'ФОРМА', width: 'auto', align: 'left' },
];

const headerRowStyle = {
  display: 'flex',
  padding: '1rem 1rem 1rem 0.5rem',
  backgroundColor: '#f6f6f6',
  fontSize: '0.9rem',
  color: '#444',
  borderBottom: 'none',
  alignItems: 'center'
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '1.25rem 1rem',
  borderBottom: 'none'
};

const formStyle = {
  display: 'flex',
  gap: '0.35rem',
  minWidth: '7rem',
  justifyContent: 'flex-start'
};

const formBoxStyle = {
  padding: '0.3rem 0.5rem',
  borderRadius: '6px',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem'
};

const Table = () => {
  return (
    <div style={tableContainerStyle}>
      <div style={headerRowStyle}>
        {columns.map((col, idx) => (
          <div key={idx} style={{
            width: col.width,
            textAlign: col.align as 'left' | 'right',
            display: 'flex',
            justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
            alignItems: 'center',
            fontWeight: 700,
            paddingLeft: col.align === 'left' ? '1.5rem' : '1rem',
            paddingRight: col.align === 'right' ? '1rem' : '0'
          }}>
            {col.key === 'team' ? <span style={{ textTransform: 'uppercase' }}>{col.label}</span> : col.label}
          </div>
        ))}
      </div>
      {teams.map((team, idx) => (
        <div key={idx} style={{
          ...rowStyle,
          background: idx % 2 === 0 ? '#f9f9f9' : 'white',
          fontWeight: team.name === 'FAYNA TEAM' ? 'bold' : 'normal'
        }}>
          {columns.map((col, i) => {
            switch (col.key) {
              case 'place':
                return (
                  <div key={i} style={{ width: col.width, display: 'flex', justifyContent: 'flex-end', fontWeight: 600, paddingLeft: '0.5rem' }}>
                    {team.place} {getPositionIcon(team.positionChange)}
                  </div>
                );
              case 'team':
                return (
                  <div key={i} style={{
                    width: col.width,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <img src={team.logo} alt={team.name} style={{ width: '48px', height: '48px', borderRadius: '50%', marginLeft: '1.5rem' }} />
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{team.name}</span>
                  </div>
                );
              case 'games':
              case 'wins':
              case 'draws':
              case 'losses':
                return (
                  <div key={i} style={{ width: col.width, textAlign: 'right', paddingLeft: '1rem', paddingRight: '1rem' }}>0</div>
                );
              case 'goals':
                return (
                  <div key={i} style={{ width: col.width, textAlign: 'right', paddingLeft: '1rem', paddingRight: '1rem' }}>0 - 0</div>
                );
              case 'form':
                return (
                  <div key={i} style={formStyle}>
                    {team.form.map((res, idx) => (
                      <span key={idx} style={{
                        ...formBoxStyle,
                        backgroundColor: getFormColor(res)
                      }}>{res}</span>
                    ))}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Table;
