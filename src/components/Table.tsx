import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../types/supabase';

const formBoxStyle = {
  display: 'inline-block',
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '0.4rem',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.75rem',
  marginRight: '0.3rem',
  textAlign: 'center',
  lineHeight: '1.5rem',
};

const calculateTeamStats = (teams: Database['public']['Tables']['teams']['Row'][]) => {
  return teams.map((team) => {
    const points = (team.wins || 0) * 3 + (team.draws || 0);
    const goals_string = `${team.goals_for} - ${team.goals_against}`;
    return {
      ...team,
      points,
      goals_string
    };
  });
};

const Table = () => {
  const [teams, setTeams] = useState<Database['public']['Tables']['teams']['Row'][]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo, is_our_team, games_played, wins, draws, losses, goals_for, goals_against, form');
      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }
      if (data) {
        const teamsWithPoints = calculateTeamStats(data);

        const sortedTeams = teamsWithPoints
          .sort((a, b) => b.points - a.points || (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against));

        const teamsWithPlace = sortedTeams.map((team, index) => ({
          ...team,
          place: index + 1,
        }));

        setTeams(teamsWithPlace as Database['public']['Tables']['teams']['Row'][]);
      }
    };
    fetchTeams();
  }, []);

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
      case 'В':
        return '#4caf50';
      case 'Н':
        return '#9e9e9e';
      case 'П':
        return '#f44336';
      default:
        return '#ccc';
    }
  };

  const tableStyle = {
    display: 'table',
    width: '100%',
    borderCollapse: 'collapse'
  };

  const tableRowStyle = {
    display: 'table-row',
    height: '4rem',
  };

  const tableCellStyle = {
    display: 'table-cell',
    padding: '0.75rem 0.5rem',
    textAlign: 'right' as const,
    verticalAlign: 'middle' as const,
    fontSize: '1.1rem'
  };

  const tableHeaderCellStyle = {
    ...tableCellStyle,
    fontWeight: 'bold',
    color: '#888',
    fontSize: '0.9rem',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#fff',
  };

  const columns = [
    { key: 'place', label: '#', width: '1rem', align: 'center' },
    { key: 'team', label: 'КОМАНДА', width: '15rem', align: 'left' },
    { key: 'games_played', label: 'І', width: '1.5rem', align: 'center' },
    { key: 'wins', label: 'В', width: '1.5rem', align: 'center' },
    { key: 'draws', label: 'Н', width: '1.5rem', align: 'center' },
    { key: 'losses', label: 'П', width: '1.5rem', align: 'center' },
    { key: 'goals', label: 'МЗ/МП', width: '2rem', align: 'center' },
    { key: 'points', label: 'О', width: '1.5rem', align: 'center' },
    { key: 'form', label: 'ФОРМА', width: '6rem', align: 'left' },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={tableStyle}>
        <div style={tableRowStyle}>
          {columns.map((col, idx) => (
            <div key={idx} style={{ ...tableHeaderCellStyle, textAlign: col.align as 'left' | 'right' }}>
              {col.label}
            </div>
          ))}
        </div>
        {teams.map((team, idx) => (
          <div key={idx} style={{ ...tableRowStyle, backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
            {columns.map((col, i) => {
              switch (col.key) {
                case 'place':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      {team.place}
                    </div>
                  );
                case 'team':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}>
                        <img src={team.logo || ''} alt={team.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <span
                          style={{
                            fontSize: '1rem',
                            fontWeight: team.is_our_team ? 800 : 600,
                            marginLeft: 0,
                            color: team.is_our_team ? '#e91e63' : 'inherit',
                            textShadow: team.is_our_team ? '0 0 1px #e91e63' : 'none'
                          }}
                        >
                          {team.name}
                        </span>
                      </div>
                    </div>
                  );
                case 'games_played':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.games_played}</div>
                  );
                case 'wins':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.wins}</div>
                  );
                case 'draws':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.draws}</div>
                  );
                case 'losses':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.losses}</div>
                  );
                case 'goals':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.goals_string}</div>
                  );
                case 'points':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      {team.points}
                    </div>
                  );
                case 'form':
                  return (
                    <div key={i} style={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      {typeof team.form === 'string' &&
                        team.form !== '0' &&
                        team.form.split('').map((res, idx) => {
                          const resUA = res === 'w' ? 'В' : res === 'd' ? 'Н' : res === 'l' ? 'П' : '';
                          return (
                            <span key={idx} style={{
                              ...formBoxStyle,
                              backgroundColor: getFormColor(resUA)
                            }}>{resUA}</span>
                          );
                        })}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
