import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = React.useState<keyof PlayerStat>('matches');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof PlayerStat) => {
    if (field === sortBy) {
      // Toggle sort order when clicking the same column
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      // When switching columns, start with descending order
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedPlayers = React.useMemo(
    () =>
      [...players].sort((a, b) => {
        const aValue = a[sortBy] ?? 0;
        const bValue = b[sortBy] ?? 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }),
    [players, sortBy, sortOrder]
  );

  const renderSortIcon = (field: keyof PlayerStat) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <ArrowDropUpIcon fontSize="small" />
    ) : (
      <ArrowDropDownIcon fontSize="small" />
    );
  };

  return (
    <TableContainer
      component={Box}
      sx={{
        width: '100%',
        overflowX: 'auto',
        bgcolor: theme.palette.common.white,
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 650, tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ height: 64 }}>
            <TableCell
              align="center"
              sx={{
                position: 'sticky',
                left: 0,
                zIndex: 3,
                backgroundColor: theme.palette.common.white,
                width: 32,
                minWidth: 32,
                textTransform: 'uppercase',
                color: theme.palette.text.secondary,
                fontWeight: 600,
              }}
            >
              #
            </TableCell>
            <TableCell
              sx={{
                position: 'sticky',
                left: 32,
                zIndex: 3,
                backgroundColor: theme.palette.common.white,
                width: { xs: 180, sm: 300 },
                minWidth: { xs: 180, sm: 300 },
                textTransform: 'uppercase',
                color: theme.palette.text.secondary,
                fontWeight: 600,
              }}
            >
              Гравець
            </TableCell>
            {(['matches', 'goals', 'assists', 'yellowCards', 'redCards', 'saves'] as Array<keyof PlayerStat>).map(field => (
              <TableCell
                key={field}
                align="center"
                onClick={() => handleSort(field)}
                sx={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontWeight: 600,
                  color: sortBy === field ? theme.palette.primary.main : theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  width: field === 'assists' 
                    ? { xs: 100, sm: 'auto' } 
                    : { xs: 80, sm: 'auto' },
                  minWidth: field === 'assists' 
                    ? { xs: 100, sm: 0 } 
                    : { xs: 80, sm: 0 },
                }}
              >
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  {field === 'matches' && 'Матчі'}
                  {field === 'goals' && 'Голи'}
                  {field === 'assists' && 'Асисти'}
                  {field === 'yellowCards' && 'Жовт.'}
                  {field === 'redCards' && 'Черв.'}
                  {field === 'saves' && 'Сейви'}
                  {renderSortIcon(field)}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow
              key={player.id}
              onClick={() => navigate(`/player/${player.number}`)}
              sx={{
                cursor: 'pointer',
                ...( !isMobile && {
                  '&:hover td': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }),
                height: 64,
              }}
            >
              <TableCell
                align="center"
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                  backgroundColor: theme.palette.common.white
                }}
              >
                {index + 1}
              </TableCell>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 32,
                  zIndex: 2,
                  backgroundColor: theme.palette.common.white,
                  width: { xs: 180, sm: 300 },
                  minWidth: { xs: 180, sm: 300 }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={player.photoUrl}
                    alt={player.name}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'transparent',
                      mt: '2px',
                      '& img': {
                        objectFit: 'cover',
                        objectPosition: 'center -80%',
                        transform: 'scale(1.8)',
                      },
                    }}
                  />
                  {isMobile ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                      {player.name.split(' ').map((part, idx) => (
                        <Typography key={idx} variant="body2" sx={{ whiteSpace: 'normal', fontWeight: 600 }}>
                          {part}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography noWrap fontWeight={600}>{player.name}</Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: sortBy === 'matches' ? 600 : 'normal' }}
              >
                {player.matches}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: sortBy === 'goals' ? 600 : 'normal' }}
              >
                {player.goals}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: sortBy === 'assists' ? 600 : 'normal' }}
              >
                {player.assists}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: sortBy === 'yellowCards' ? 600 : 'normal' }}
              >
                {player.yellowCards}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: sortBy === 'redCards' ? 600 : 'normal' }}
              >
                {player.redCards}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: sortBy === 'saves' ? 600 : 'normal' }}
              >
                {player.saves}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayersTable;
