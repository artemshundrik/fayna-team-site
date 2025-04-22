import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../types/supabase';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

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
  const theme = useTheme();

  const formBoxStyle = {
    display: 'inline-block',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '0.4rem',
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body2.fontSize,
    marginRight: '0.3rem',
    textAlign: 'center',
    lineHeight: '1.5rem',
  };

  const getFormColor = (result: string) => {
    switch (result) {
      case 'В':
        return theme.palette.success.main;
      case 'Н':
        return theme.palette.grey[500];
      case 'П':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[300];
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
    fontSize: theme.typography.body1.fontSize,
    fontFamily: theme.typography.fontFamily,
  };

  const tableHeaderCellStyle = {
    ...tableCellStyle,
    fontWeight: theme.typography.fontWeightSemiBold,
    color: theme.palette.grey[500],
    fontSize: theme.typography.body1.fontSize,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.common.white,
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

  const [teams, setTeams] = useState<Database['public']['Tables']['teams']['Row'][]>([]);

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.palette.grey[500]} xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12L14 6V10H4V14H14V18L20 12Z" />
          </svg>
        );
    }
  };

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={tableStyle}>
        <Box sx={tableRowStyle}>
          {columns.map((col, idx) => (
            <Box key={idx} sx={{ ...tableHeaderCellStyle, textAlign: col.align as 'left' | 'right' }}>
              {col.label}
            </Box>
          ))}
        </Box>
        {teams.map((team, idx) => (
          <Box
            key={idx}
            sx={{
              ...tableRowStyle,
              backgroundColor: idx % 2 === 0
                ? theme.palette.grey[100]
                : theme.palette.common.white,
              borderLeft: team.is_our_team ? `4px solid ${theme.palette.primary.main}` : 'none',
            }}
          >
            {columns.map((col, i) => {
              switch (col.key) {
                case 'place':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      {team.place}
                    </Box>
                  );
                case 'team':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}>
                        <img src={team.logo || ''} alt={team.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <Box
                          component="span"
                          sx={{
                            fontSize: theme.typography.body1.fontSize,
                            fontWeight: team.is_our_team ? theme.typography.fontWeightMedium : theme.typography.fontWeightMedium,
                            marginLeft: 0,
                            color: team.is_our_team ? theme.palette.primary.main : 'inherit',
                            textShadow: team.is_our_team ? `0 0 1px ${theme.palette.primary.main}` : 'none',
                            fontFamily: theme.typography.fontFamily,
                          }}
                        >
                          {team.name}
                        </Box>
                      </Box>
                    </Box>
                  );
                case 'games_played':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.games_played}</Box>
                  );
                case 'wins':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.wins}</Box>
                  );
                case 'draws':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.draws}</Box>
                  );
                case 'losses':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.losses}</Box>
                  );
                case 'goals':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>{team.goals_string}</Box>
                  );
                case 'points':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      {team.points}
                    </Box>
                  );
                case 'form':
                  return (
                    <Box key={i} sx={{ ...tableCellStyle, textAlign: col.align as 'left' | 'right', width: col.width }}>
                      {typeof team.form === 'string' &&
                        team.form !== '0' &&
                        team.form.split('').map((res, idx) => {
                          const resUA = res === 'w' ? 'В' : res === 'd' ? 'Н' : res === 'l' ? 'П' : '';
                          return (
                            <Box key={idx} component="span" sx={{
                              ...formBoxStyle,
                              backgroundColor: getFormColor(resUA)
                            }}>{resUA}</Box>
                          );
                        })}
                    </Box>
                  );
                default:
                  return null;
              }
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Table;
