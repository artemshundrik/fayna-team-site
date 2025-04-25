import React from 'react';
import Layout from '../layout/Layout';
import PlayersList from '../components/PlayersList';
import { Box, Container, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Squad: React.FC = () => {
  const theme = useTheme();
  return (
    <Box sx={{ backgroundColor: theme.palette.grey[100] }}>
      <Layout>
        <Container
          component="main"
          maxWidth="lg"
          disableGutters
          sx={{
            py: theme.spacing(4),
            backgroundColor: theme.palette.grey[100],
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          }}
        >

          <Stack spacing={4}>
            <Box component="section">
              <Typography variant="h6" sx={{ mb: theme.spacing(1), textTransform: 'uppercase' }}>
                Воротарі
              </Typography>
              <PlayersList position="Воротар" />
            </Box>

            <Box component="section">
              <Typography variant="h6" sx={{ mb: theme.spacing(1), textTransform: 'uppercase' }}>
                Універсали
              </Typography>
              <PlayersList position="Універсал" />
            </Box>
          </Stack>
        </Container>
      </Layout>
    </Box>
  );
};

export default Squad;