import React, { useState } from 'react';
import Layout from '../layout/Layout';
import PlayersList from '../components/PlayersList';
import PlayerStatistics from '../components/PlayerStatistics';
import { Box, Container, Typography, Stack, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Squad: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[100] }}>
      <Layout>
        <Container
          component="main"
          maxWidth="lg"
          disableGutters
          sx={{
            pt: { xs: theme.spacing(2), sm: theme.spacing(4) },
            pb: { xs: theme.spacing(2), sm: theme.spacing(4) },
            px: { xs: theme.spacing(2), sm: 0 },  // side padding on mobile
            backgroundColor: theme.palette.grey[100],
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <Tabs value={tab} onChange={handleChange} sx={{ mb: theme.spacing(3) }}>
            <Tab label="Гравці" />
            <Tab label="Статистика" />
          </Tabs>

          {tab === 0 && (
            <PlayersList />
          )}

          {tab === 1 && (
            <PlayerStatistics />
          )}
        </Container>
      </Layout>
    </Box>
  );
};

export default Squad;