import React, { useEffect, useState, useRef } from 'react';
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
  Box,
  Skeleton
} from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';

type ExtendedTeam = Database['public']['Tables']['teams']['Row'] & {
  points: number;
  goals_string: string;
  place: number;
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
    color: theme.palette.success.contrastText,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body2.fontSize,
    marginRight: theme.spacing(0.5),
    textAlign: 'center',
    lineHeight: '1.5rem',
    verticalAlign: 'middle',
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
  { key: 'points', label: 'О', align: 'center' },
  { key: 'games_played', label: 'І', align: 'center' },
  { key: 'wins', label: 'В', align: 'center', hideOnMobile: true },
  { key: 'draws', label: 'Н', align: 'center', hideOnMobile: true },
  { key: 'losses', label: 'П', align: 'center', hideOnMobile: true },
  { key: 'goals', label: '+/−', align: 'center', hideOnMobile: true },
  { key: 'form', label: 'ФОРМА', width: '180px', align: 'left', hideOnMobile: true },
];

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  // Store teams state
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo, is_our_team, games_played, wins, draws, losses, goals_for, goals_against, form, url')
        .returns<Database['public']['Tables']['teams']['Row'][]>();
      if (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
        return;
      }
      if (data) {
        const teamsWithPoints = calculateTeamStats(data);
        const sortedTeams = teamsWithPoints
          .slice()
          .sort(
            (a, b) =>
              b.points - a.points ||
              ((b.goals_for ?? 0) - (b.goals_against ?? 0)) - ((a.goals_for ?? 0) - (a.goals_against ?? 0))
          );
        const teamsWithPlace: ExtendedTeam[] = sortedTeams.map((team, index) => {
          return {
            ...team,
            place: index + 1,
          };
        });
        setTeams(teamsWithPlace);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fade-in effect after loading
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timeout);
    } else {
      setVisible(false);
    }
  }, [loading]);


  return (
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 0 } }}>
      <Paper elevation={0} square sx={{ border: 'none' }}>
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontSize: '0.85rem',
            color: theme.palette.grey[600],
            padding: theme.spacing(1),
            textAlign: 'center',
          }}
        >
          <ScreenRotationIcon sx={{ fontSize: '1.2rem' }} />
          Щоб побачити повну таблицю — переверніть телефон у горизонтальне положення
        </Box>
        <Box
          sx={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        >
          <TableContainer
            sx={{
              width: '100%',
              border: `1px solid ${theme.palette.grey[100]}`,
              borderRadius: '8px',
              overflowX: 'auto', // додано горизонтальний скрол
              WebkitOverflowScrolling: 'touch', // плавний скрол на iOS
              overflowY: 'hidden',
            }}
          >
            <Table
              sx={{
                minWidth: '100%',
                width: '100%',
                tableLayout: 'auto',
                // Default padding for all columns
                '& th, & td': {
                  px: { xs: 3, sm: 4 },
                },
                // Override padding for the first two columns (# and Команда)
                '& th:nth-of-type(1), & td:nth-of-type(1), & th:nth-of-type(2), & td:nth-of-type(2)': {
                  px: { xs: 1, sm: 1 },
                },
              }}
            >
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
                        // Responsive padding for header cells
                        ...(col.key === 'team'
                          ? { padding: { xs: '6px 8px', sm: '6px 16px' } }
                          : col.key === 'place'
                          ? { paddingLeft: { xs: '8px', sm: '24px' }, paddingRight: { xs: '4px', sm: '12px' } }
                          : col.key === 'form'
                          ? { paddingLeft: { xs: '4px', sm: '8px' }, paddingRight: { xs: '4px', sm: '8px' } }
                          : col.key === 'games_played' || col.key === 'goals' || col.key === 'points'
                          ? { padding: { xs: '6px 16px', sm: '12px 16px' } }
                          : { padding: { xs: '6px 4px', sm: '12px 16px' } }),
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
                {loading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx} sx={{ height: 56 }}>
                        {/* Place */}
                        <TableCell align="center">
                          <Skeleton variant="rectangular" animation="wave" width={24} height={24} sx={{ borderRadius: 1 }} />
                        </TableCell>
                        {/* Team with logo or placeholder */}
                        <TableCell align="left">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: theme.palette.grey[200],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Skeleton
                                variant="circular"
                                animation="wave"
                                width={40}
                                height={40}
                                sx={{
                                  position: 'absolute',
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                }}
                              />
                            </Box>
                            <Skeleton variant="text" animation="wave" width={80 + Math.random() * 40} height={24} />
                          </Box>
                        </TableCell>
                        {/* Points */}
                        <TableCell align="center">
                          <Skeleton variant="text" animation="wave" width={32} height={24} />
                        </TableCell>
                        {/* Games played */}
                        <TableCell align="center">
                          <Skeleton variant="text" animation="wave" width={32} height={24} />
                        </TableCell>
                        {/* Wins */}
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Skeleton variant="text" animation="wave" width={32} height={24} />
                        </TableCell>
                        {/* Draws */}
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Skeleton variant="text" animation="wave" width={32} height={24} />
                        </TableCell>
                        {/* Losses */}
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Skeleton variant="text" animation="wave" width={32} height={24} />
                        </TableCell>
                        {/* Goals */}
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Skeleton variant="text" animation="wave" width={56} height={24} />
                        </TableCell>
                        {/* Form */}
                        <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Skeleton
                                key={i}
                                variant="rectangular"
                                animation="wave"
                                width={24}
                                height={24}
                                sx={{ borderRadius: '0.4rem' }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : teams.map((team, idx) => (
                      // залишити як є
                      <TableRow
                        key={idx}
                        onClick={() => {
                          if (team.url) {
                            window.open(team.url, '_blank');
                          }
                        }}
                        sx={{
                          cursor: 'pointer',
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
                                    paddingLeft: { xs: '8px', sm: '24px' },
                                    paddingRight: { xs: '4px', sm: '12px' },
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
                                    padding: { xs: '6px 8px', sm: '6px 16px' },
                                    width: '100%',
                                    maxWidth: '100%',
                                    display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {team.logo ? (
                                      <img src={team.logo} alt={team.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                    ) : (
                                      <Box
                                        sx={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: '50%',
                                          background: theme.palette.grey[200],
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontWeight: theme.typography.fontWeightBold,
                                          color: theme.palette.grey[700],
                                          fontSize: '1.1rem',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        {team.name?.split(' ').map(w => w[0]).join('').slice(0,2)}
                                      </Box>
                                    )}
                                    {team.url ? (
                                      <a
                                        href={team.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'inline-block',
                                          textDecoration: 'none',
                                          color: 'inherit',
                                        }}
                                        onClick={e => e.stopPropagation()}
                                      >
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
                                      </a>
                                    ) : (
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
                                    )}
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
                                    padding: { xs: '6px 8px', sm: '12px 16px' },
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
                                    padding: { xs: '6px 4px', sm: '12px 16px' },
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
                                    padding: { xs: '6px 4px', sm: '12px 16px' },
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
                                    padding: { xs: '6px 8px', sm: '12px 16px' },
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
                                    padding: { xs: '6px 16px', sm: '12px 16px' },
                                    display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                                    fontWeight: theme.typography.fontWeightBold,
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
                                    // Removed width/minWidth/maxWidth/whiteSpace for form cell
                                    paddingLeft: { xs: '4px', sm: '8px' },
                                    paddingRight: { xs: '4px', sm: '8px' },
                                    display: col.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                                  }}
                                >
                                  {typeof team.form === 'string' && (() => {
                                    const rawForm = team.form || '';
                                    const mapped = rawForm
                                      .split(', ')
                                      .map(res => (res === 'w' ? 'В' : res === 'd' ? 'Н' : res === 'l' ? 'П' : ''));

                                    const sliced = mapped.slice(-5);
                                    const reversed = sliced.reverse();
                                    const filled = reversed.concat(Array(5 - reversed.length).fill(''));

                                    return (
                                      <Box
                                        component="div"
                                        sx={{
                                          display: 'grid',
                                          gridTemplateColumns: 'repeat(5, 1fr)',
                                          columnGap: theme.spacing(0.5),
                                          justifyItems: 'start',
                                        }}
                                      >
                                        {filled.map((resUA, idx) => {
                                          const title =
                                            resUA === 'В'
                                              ? 'Перемога'
                                              : resUA === 'Н'
                                              ? 'Нічия'
                                              : resUA === 'П'
                                              ? 'Поразка'
                                              : '';
                                          return resUA ? (
                                            <Tooltip key={idx} title={title} arrow>
                                              <Box component="span" sx={{
                                                ...formBoxStyle,
                                                backgroundColor: getFormColor(resUA),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}>
                                                {resUA}
                                              </Box>
                                            </Tooltip>
                                          ) : (
                                            <Box
                                              key={idx}
                                              component="span"
                                              sx={{
                                                ...formBoxStyle,
                                                backgroundColor: theme.palette.grey[300],
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}
                                            />
                                          );
                                        })}
                                      </Box>
                                    );
                                  })()}
                                </TableCell>
                              );
                            default:
                              return null;
                          }
                        })}
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default TableComponent;
