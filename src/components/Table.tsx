import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../types/supabase';
import { useTheme } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Paper,
  Container,
  Tooltip,
  Box
} from '@mui/material';

type ExtendedTeam = Database['public']['Tables']['teams']['Row'] & {
  points: number;
  goals_string: string;
  place: number;
  positionChange: 'up' | 'down' | 'same';
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

const TableComponent = () => {
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

type Column = {
  key: string;
  label: string;
  align: 'left' | 'center' | 'right' | 'inherit' | 'justify';
  width?: string;
  hideOnMobile?: boolean;
};

const columns: Column[] = [
  { key: 'place', label: '#', width: '3rem', align: 'center' },
  { key: 'team', label: 'КОМАНДА', align: 'left', width: '100%' },
  { key: 'games_played', label: 'І', align: 'center' },
  { key: 'wins', label: 'В', align: 'center', hideOnMobile: true },
  { key: 'draws', label: 'Н', align: 'center', hideOnMobile: true },
  { key: 'losses', label: 'П', align: 'center', hideOnMobile: true },
  { key: 'goals', label: '+/−', align: 'center' },
  { key: 'points', label: 'О', align: 'center' },
  { key: 'form', label: 'ФОРМА', width: '150px', align: 'left', hideOnMobile: true },
];

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo, is_our_team, games_played, wins, draws, losses, goals_for, goals_against, form')
        .returns<Database['public']['Tables']['teams']['Row'][]>();
      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }
      if (data) {
        const teamsWithPoints = calculateTeamStats(data);

        // Save previous positions by id
        const previousPositions = new Map(teamsWithPoints.map((team, i) => [team.id, i]));

        const sortedTeams = teamsWithPoints
          .slice() // ensure not in-place
          .sort(
            (a, b) =>
              b.points - a.points ||
              ((b.goals_for ?? 0) - (b.goals_against ?? 0)) - ((a.goals_for ?? 0) - (a.goals_against ?? 0))
          );

        const teamsWithPlace: ExtendedTeam[] = sortedTeams.map((team, index) => {
          const prevIndex = previousPositions.get(team.id);
          let positionChange: 'up' | 'down' | 'same' = 'same';
          if (typeof prevIndex === 'number') {
            if (index < prevIndex) positionChange = 'up';
            else if (index > prevIndex) positionChange = 'down';
          }
          return {
            ...team,
            place: index + 1,
            positionChange,
          };
        });

        setTeams(teamsWithPlace);
      }
    };
    fetchTeams();
  }, []);

  const [teams, setTeams] = useState<ExtendedTeam[]>([]);

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
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 2 } }}>
      <Paper elevation={0} square sx={{ border: 'none' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer sx={{ width: '100%' }}>
            <Table sx={{ minWidth: '100%', width: '100%', tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  {columns.map((col, idx) => (
                    <TableCell
                      key={idx}
                      align={col.align as 'left' | 'center' | 'right' | 'justify' | 'inherit'}
                      sx={{
                        fontWeight: theme.typography.fontWeightSemiBold,
                        color: theme.palette.grey[500],
                        borderBottom: `1px solid ${theme.palette.grey[300]}`,
                        backgroundColor: theme.palette.common.white,
                        fontFamily: theme.typography.fontFamily,
                        whiteSpace: 'nowrap',
                        display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                        ...(col.key === 'goals' ? { whiteSpace: 'nowrap' } : {}),
                      }}
                    >
                      {(col.key === 'games_played') ? (
                        <Tooltip title="Ігри зіграні" arrow>
                          <span>{col.label}</span>
                        </Tooltip>
                      ) : (col.key === 'wins') ? (
                        <Tooltip title="Перемоги" arrow>
                          <span>{col.label}</span>
                        </Tooltip>
                      ) : (col.key === 'draws') ? (
                        <Tooltip title="Нічиї" arrow>
                          <span>{col.label}</span>
                        </Tooltip>
                      ) : (col.key === 'losses') ? (
                        <Tooltip title="Поразки" arrow>
                          <span>{col.label}</span>
                        </Tooltip>
                      ) : (col.key === 'goals') ? (
                        <Tooltip title="М'ячі забиті / пропущені" arrow>
                          <span>{col.label}</span>
                        </Tooltip>
                      ) : (col.key === 'points') ? (
                        <Tooltip title="Очки" arrow>
                          <span>{col.label}</span>
                        </Tooltip>
                      ) : (col.key === 'form') ? (
                        <Tooltip title="Результати останніх матчів (В – перемога, Н – нічия, П – поразка)" arrow>
                          <span>{col.label}</span>
                        </Tooltip>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? theme.palette.grey[100] : theme.palette.common.white,
                      borderLeft: team.is_our_team ? `4px solid ${theme.palette.primary.main}` : 'none',
                    }}
                  >
                    {columns.map((col, i) => {
                      switch (col.key) {
                        case 'place':
                          return (
                            <TableCell
                              key={i}
                              align={col.align}
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                paddingLeft: '24px',
                                paddingRight: '12px',
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={0.15}
                                alignItems="center"
                                justifyContent="center"
                                sx={{ pl: 0, pr: 0 }}
                              >
                                <span>{team.place}</span>
                                {getPositionIcon(team.positionChange)}
                              </Stack>
                            </TableCell>
                          );
                        case 'team':
                          return (
                            <TableCell
                              key={i}
                              align={col.align}
                              sx={{
                                fontSize: {
                                  xs: '0.85rem',
                                  sm: theme.typography.body1.fontSize
                                },
                                fontFamily: theme.typography.fontFamily,
                                padding: '6px 16px',
                                width: '100%',
                                maxWidth: '100%',
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img src={team.logo || ''} alt={team.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: {
                                      xs: '0.85rem',
                                      sm: theme.typography.body1.fontSize
                                    },
                                    fontWeight: team.is_our_team ? theme.typography.fontWeightMedium : theme.typography.fontWeightMedium,
                                    ml: 0,
                                    color: team.is_our_team ? theme.palette.primary.main : 'inherit',
                                    textShadow: team.is_our_team ? `0 0 1px ${theme.palette.primary.main}` : 'none',
                                    fontFamily: theme.typography.fontFamily,
                                  }}
                                >
                                  {team.name}
                                </Box>
                              </div>
                            </TableCell>
                          );
                        case 'games_played':
                          return (
                            <TableCell
                              key={i}
                              align={col.align}
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              {team.games_played}
                            </TableCell>
                          );
                        case 'wins':
                          return (
                            <TableCell
                              key={i}
                              align={col.align}
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              {team.wins}
                            </TableCell>
                          );
                        case 'draws':
                          return (
                            <TableCell
                              key={i}
                              align={col.align}
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              {team.draws}
                            </TableCell>
                          );
                        case 'losses':
                          return (
                            <TableCell
                              key={i}
                              align={col.align}
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              {team.losses}
                            </TableCell>
                          );
                        case 'goals':
                          return (
                            <TableCell
                              key={i}
                              align="center"
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {team.goals_string}
                            </TableCell>
                          );
                        case 'points':
                          return (
                            <TableCell
                              key={i}
                              align={col.align}
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              {team.points}
                            </TableCell>
                          );
                        case 'form':
                          return (
                            <TableCell
                              key={i}
                              align={col.align as 'left' | 'center' | 'right' | 'justify' | 'inherit'}
                              sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontFamily: theme.typography.fontFamily,
                                width: col.width,
                                minWidth: col.width,
                                maxWidth: col.width,
                                whiteSpace: 'nowrap',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                              }}
                            >
                              {typeof team.form === 'string' &&
                                team.form !== '0' &&
                                team.form.split('').map((res, idx) => {
                                  const resUA = res === 'w' ? 'В' : res === 'd' ? 'Н' : res === 'l' ? 'П' : '';
                                  const title = resUA === 'В' ? 'Перемога' : resUA === 'Н' ? 'Нічия' : resUA === 'П' ? 'Поразка' : '';
                                  return (
                                    <Tooltip key={idx} title={title} arrow>
                                      <span style={{
                                        ...formBoxStyle,
                                        backgroundColor: getFormColor(resUA),
                                        display: 'inline-block',
                                        textAlign: 'center' as const,
                                      }}>{resUA}</span>
                                    </Tooltip>
                                  );
                                })}
                            </TableCell>
                          );
                        default:
                          return null;
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default TableComponent;
