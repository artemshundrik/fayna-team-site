import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// const MotionTableRow = motion(TableRow);

type PlayerStat = {
  id: string;
  number: number;
  name: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  saves: number;
  photoUrl?: string;
};

type PlayersTableProps = {
  players: PlayerStat[];
};

const PlayersTable: React.FC<PlayersTableProps> = ({ players }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = React.useState<
    'matches' | 'goals' | 'assists' | 'saves' | 'yellowCards' | 'redCards'
  >('matches');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const handleSort = (
    field: 'matches' | 'goals' | 'assists' | 'saves' | 'yellowCards' | 'redCards'
  ) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortOrder === 'asc') {
      return (a[sortBy] ?? 0) - (b[sortBy] ?? 0);
    }
    return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
  });

  return (
    <>
      {/* Table for desktop */}
      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          borderRadius: 0,
          boxShadow: 'none',
          '@media (max-width: 600px)': {
            display: 'none',
          },
        }}
      >
        <Table>
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                fontWeight: theme.typography.fontWeightMedium,
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
            >
              #
            </TableCell>
            <TableCell
              sx={{
                fontWeight: theme.typography.fontWeightMedium,
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
            >
              Гравець
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: 80,
                fontWeight: sortBy === 'matches' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                color: sortBy === 'matches' ? theme.palette.primary.main : theme.palette.grey[500],
                cursor: 'pointer',
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
              onClick={() => handleSort('matches')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ minWidth: 60, textAlign: 'center', display: 'inline-block' }}>
                  Матчі
                </Box>
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    ml: -0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: sortBy === 'matches' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {sortBy === 'matches' && (sortOrder === 'asc' ? (
                    <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                  ))}
                </Box>
              </span>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: 80,
                fontWeight: sortBy === 'goals' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                color: sortBy === 'goals' ? theme.palette.primary.main : theme.palette.grey[500],
                cursor: 'pointer',
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
              onClick={() => handleSort('goals')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ minWidth: 60, textAlign: 'center', display: 'inline-block' }}>
                  Голи
                </Box>
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    ml: -0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: sortBy === 'goals' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {sortBy === 'goals' && (sortOrder === 'asc' ? (
                    <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                  ))}
                </Box>
              </span>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: 80,
                fontWeight: sortBy === 'assists' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                color: sortBy === 'assists' ? theme.palette.primary.main : theme.palette.grey[500],
                cursor: 'pointer',
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
              onClick={() => handleSort('assists')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ minWidth: 60, textAlign: 'center', display: 'inline-block' }}>
                  Асисти
                </Box>
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    ml: -0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: sortBy === 'assists' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {sortBy === 'assists' && (sortOrder === 'asc' ? (
                    <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                  ))}
                </Box>
              </span>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: 80,
                fontWeight: sortBy === 'yellowCards' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                color: sortBy === 'yellowCards' ? theme.palette.primary.main : theme.palette.grey[500],
                cursor: 'pointer',
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
              onClick={() => handleSort('yellowCards')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ minWidth: 60, textAlign: 'center', display: 'inline-block' }}>
                  Жовт.
                </Box>
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    ml: -0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: sortBy === 'yellowCards' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {sortBy === 'yellowCards' && (sortOrder === 'asc' ? (
                    <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                  ))}
                </Box>
              </span>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: 80,
                fontWeight: sortBy === 'redCards' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                color: sortBy === 'redCards' ? theme.palette.primary.main : theme.palette.grey[500],
                cursor: 'pointer',
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
              onClick={() => handleSort('redCards')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ minWidth: 60, textAlign: 'center', display: 'inline-block' }}>
                  Черв.
                </Box>
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    ml: -0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: sortBy === 'redCards' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {sortBy === 'redCards' && (sortOrder === 'asc' ? (
                    <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                  ))}
                </Box>
              </span>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: 80,
                fontWeight: sortBy === 'saves' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                color: sortBy === 'saves' ? theme.palette.primary.main : theme.palette.grey[500],
                cursor: 'pointer',
                borderBottom: `1px solid ${theme.palette.divider}`,
                textTransform: 'uppercase',
              }}
              onClick={() => handleSort('saves')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ minWidth: 60, textAlign: 'center', display: 'inline-block' }}>
                  Сейви
                </Box>
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    ml: -0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: sortBy === 'saves' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {sortBy === 'saves' && (sortOrder === 'asc' ? (
                    <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                  ))}
                </Box>
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow
              key={player.number}
              onClick={() => navigate(`/player/${player.number}`)}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 0.2s ease, border-bottom-color 0.2s ease',
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                },
              }}
            >
              <TableCell align="center" sx={{ borderBottom: 'none' }}>
                <span style={{
                  fontWeight: theme.typography.fontWeightLight,
                  fontSize: theme.typography.body1.fontSize,
                  color: 'inherit',
                }}>
                  {index + 1}
                </span>
              </TableCell>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5), py: theme.spacing(1), borderBottom: 'none' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={`/images/players/${player.photoUrl || 'default-player.png'}`}
                    alt={player.name}
                    onError={(e) => { e.currentTarget.src = '/images/players/default-player.png'; }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center -60%',
                      transform: 'scale(1.5)',
                    }}
                  />
                </div>
                <span style={{
                  fontWeight: theme.typography.fontWeightSemiBold,
                  fontSize: theme.typography.h6.fontSize,
                }}>
                  {player.name}
                </span>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: 'none',
                  minWidth: 80,
                  fontWeight: sortBy === 'matches' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                }}
              >
                {player.matches}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: 'none',
                  minWidth: 80,
                  fontWeight: sortBy === 'goals' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                }}
              >
                {player.goals}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: 'none',
                  minWidth: 80,
                  fontWeight: sortBy === 'assists' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                }}
              >
                {player.assists}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: 'none',
                  minWidth: 80,
                  fontWeight: sortBy === 'yellowCards' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                }}
              >
                {player.yellowCards}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: 'none',
                  minWidth: 80,
                  fontWeight: sortBy === 'redCards' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                }}
              >
                {player.redCards}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderBottom: 'none',
                  minWidth: 80,
                  fontWeight: sortBy === 'saves' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                }}
              >
                {player.saves}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
      {/* Cards for mobile */}
      <Box sx={{ '@media (min-width: 601px)': { display: 'none' } }}>
        {sortedPlayers.map((player, index) => (
          <Box
            key={player.number}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderBottom: '1px solid #ddd',
              padding: theme.spacing(2),
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
              },
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/player/${player.number}`)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <img
                src={`/images/players/${player.photoUrl || 'default-player.png'}`}
                alt={player.name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginRight: theme.spacing(2),
                }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/players/default-player.png'; }}
              />
              <span style={{
                fontWeight: theme.typography.fontWeightSemiBold,
                fontSize: theme.typography.h6.fontSize,
              }}>
                {player.name}
              </span>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: theme.typography.body2.fontSize }}>
              <span>Матчі: {player.matches}</span>
              <span>Голи: {player.goals}</span>
              <span>Асисти: {player.assists}</span>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default PlayersTable;
