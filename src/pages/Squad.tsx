import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layout/Layout';
import PlayersList from '../components/PlayersList';
import PlayerStatistics from '../components/PlayerStatistics';
import { Box, Container, Typography, Stack, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Squad: React.FC = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = parseInt(searchParams.get('tab') || '0', 10);
  const [tab, setTab] = useState(tabParam);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setSearchParams({ tab: newValue.toString() });
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50] }}>
      <Layout>
        <Container
          component="main"
          maxWidth="lg"
          disableGutters
          sx={{
            pt: { xs: theme.spacing(2), sm: theme.spacing(4) },
            pb: { xs: theme.spacing(2), sm: theme.spacing(4) },
            px: { xs: theme.spacing(2), sm: 0 },  // side padding on mobile
            backgroundColor: theme.palette.grey[50],
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