import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography } from '@mui/material';
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

  // Helper function for rendering sortable header
  const renderSortableHeader = (field: keyof PlayerStat, label: string) => (
    <TableCell
      align="center"
      onClick={() => handleSort(field as any)}
      sx={{
        fontWeight: sortBy === field ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
        fontSize: theme.typography.h6.fontSize,
        textTransform: 'uppercase',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.common.white,
        color: sortBy === field ? theme.palette.primary.main : theme.palette.text.secondary,
        cursor: 'pointer',
        py: 2.5, // додано більше вертикального паддінгу для вищого хедера
        width: 56,
        minWidth: 56,
        maxWidth: 72,
      }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ minWidth: 60, textAlign: 'center' }}>{label}</Box>
        <Box
          component="span"
          sx={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.3s ease',
            opacity: sortBy === field ? 1 : 0,
          }}
        >
          {sortBy === field && (sortOrder === 'asc' ? (
            <ArrowDropUpIcon sx={{ fontSize: 20 }} />
          ) : (
            <ArrowDropDownIcon sx={{ fontSize: 20 }} />
          ))}
        </Box>
      </Box>
    </TableCell>
  );

  return (
    <>
      {/* Фільтри, селектор року, чіпси турнірів, текст "Вибрано" */}
      <Box
        sx={{
          width: '100%',
          mt: 2,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Тут має бути селектор року, чіпси турнірів і текст "Вибрано" */}
        {/* TODO: Додайте сюди ваші фільтри, селектор та чіпси */}
      </Box>
      {/* Table for desktop */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer
          sx={{
            mb: 4,
            borderRadius: 0,
            boxShadow: 'none',
            overflowX: 'auto',
            minWidth: 800,
          }}
        >
          <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{
              fontWeight: theme.typography.fontWeightMedium,
              fontSize: theme.typography.h6.fontSize,
              textTransform: 'uppercase',
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.common.white,
              color: theme.palette.text.secondary,
              textAlign: 'center',
              py: 2.5, // збільшення висоти хедера
              position: 'sticky',
              left: 0,
              zIndex: 6,
              width: 24,
              minWidth: 24,
              maxWidth: 24,
            }}>#</TableCell>
            <TableCell sx={{
              fontWeight: theme.typography.fontWeightMedium,
              fontSize: theme.typography.h6.fontSize,
              textTransform: 'uppercase',
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.common.white,
              color: theme.palette.text.secondary,
              py: 2.5, // збільшення висоти хедера
              position: 'sticky',
              left: 24,
              zIndex: 6,
              width: 220,
              minWidth: 220,
              maxWidth: 220,
            }}>Гравець</TableCell>
            {renderSortableHeader('matches', 'Матчі')}
            {renderSortableHeader('goals', 'Голи')}
            {renderSortableHeader('assists', 'Асисти')}
            {renderSortableHeader('yellowCards', 'Жовт.')}
            {renderSortableHeader('redCards', 'Черв.')}
            {renderSortableHeader('saves', 'Сейви')}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow
              key={player.number}
              onClick={() => navigate(`/player/${player.number}`)}
              hover={true}
              sx={{
                cursor: 'pointer',
                '& td': {
                  backgroundColor: theme.palette.common.white,
                  transition: 'background-color 0.2s ease',
                  verticalAlign: 'middle',
                },
                '&:hover td': {
                  backgroundColor: theme.palette.grey[100],
                },
              }}
            >
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, position: 'sticky', left: 0, zIndex: 5, width: 24, minWidth: 24, maxWidth: 24 }}>
                <span style={{
                  fontWeight: theme.typography.fontWeightLight,
                  fontSize: theme.typography.body1.fontSize,
                  color: 'inherit',
                }}>
                  {index + 1}
                </span>
              </TableCell>
              <TableCell
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1,
                  minWidth: { xs: 220, md: 300 },
                  position: 'sticky',
                  left: 24,
                  zIndex: 5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0, // заборонити стиснення
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'transparent',
                  }}
                >
                  <Box
                    component="img"
                    src={player.photoUrl || '/images/players/default-player.png'}
                    alt={player.name}
                    onError={(e) => { e.currentTarget.src = '/images/players/default-player.png'; }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center -20%',
                      borderRadius: '50%',
                      transform: 'scale(1.2)',
                    }}
                  />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {player.name}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  minWidth: 56,
                  maxWidth: 72,
                  fontWeight: sortBy === 'matches' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {player.matches}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  minWidth: 56,
                  maxWidth: 72,
                  fontWeight: sortBy === 'goals' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {player.goals}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  minWidth: 56,
                  maxWidth: 72,
                  fontWeight: sortBy === 'assists' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {player.assists}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  minWidth: 56,
                  maxWidth: 72,
                  fontWeight: sortBy === 'yellowCards' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {player.yellowCards}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  minWidth: 56,
                  maxWidth: 72,
                  fontWeight: sortBy === 'redCards' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {player.redCards}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  minWidth: 56,
                  maxWidth: 72,
                  fontWeight: sortBy === 'saves' ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {player.saves}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default PlayersTable;
