import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Container, Typography, Button, TextField, Card, CardContent, Stack, Alert, Chip, IconButton, Grid, Tabs, Tab, List, ListItem, Divider, Tooltip, Snackbar, Accordion, AccordionSummary, AccordionDetails, Badge, Avatar, Checkbox, Switch, Radio, Slider, Box } from '@mui/material';
import { Add, Delete, Edit, CheckCircle, Warning } from '@mui/icons-material';
import theme from '../theme';

export default function Styleguide() {
  const [activeSection, setActiveSection] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { root: containerRef.current, threshold: 0.5 }
    );

    const sections = containerRef.current?.querySelectorAll('section');
    sections?.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <Stack direction="row" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: 280, bgcolor: 'background.paper', p: 3, borderRight: 1, borderColor: 'divider', height: '100vh', position: 'sticky', top: 0 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          🧩 FAYNA UI
        </Typography>
        <Stack spacing={1}>
          {[
            'Buttons', 'Inputs', 'Cards', 'Typography', 'Colors',
            'Alerts & Feedback', 'Icons', 'Chips', 'Grid Layout',
            'Navigation', 'Lists', 'Information', 'Interactivity',
            'Media / Avatar', 'Forms'
          ].map((label) => (
            <Button
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              sx={{
                justifyContent: 'flex-start',
                color: activeSection === label.toLowerCase().replace(/\s+/g, '-') ? 'primary.main' : 'text.primary',
                fontWeight: 500,
                borderRadius: 2,
                px: 2,
                bgcolor: activeSection === label.toLowerCase().replace(/\s+/g, '-') ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Box>
      <Container ref={containerRef} maxWidth="md" sx={{ py: 6, px: 4, height: '100vh', overflowY: 'scroll' }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
          FAYNA UI Styleguide
        </Typography>

      <section id="buttons" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Buttons</Typography>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained">Primary</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
            <Button variant="contained" disabled>Disabled</Button>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="small">Small</Button>
            <Button variant="contained" size="medium">Medium</Button>
            <Button variant="contained" size="large">Large</Button>
          </Stack>
        </Stack>
      </section>

      <section id="inputs" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Inputs</Typography>
        <Stack spacing={2}>
          <TextField label="Default" variant="outlined" />
          <TextField label="Disabled" variant="outlined" disabled />
        </Stack>
      </section>

      <section id="cards" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Cards</Typography>
        <Card>
          <CardContent>
            <Typography variant="h6">Player Card</Typography>
            <Typography color="text.secondary">This is a sample card for a futsal player.</Typography>
          </CardContent>
        </Card>
      </section>

      <section id="typography" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Typography</Typography>
        <Stack spacing={2}>
          <Typography variant="h1">h1. Heading</Typography>
          <Typography variant="h2">h2. Heading</Typography>
          <Typography variant="h3">h3. Heading</Typography>
          <Typography variant="h4">h4. Heading</Typography>
          <Typography variant="h5">h5. Heading</Typography>
          <Typography variant="h6">h6. Heading</Typography>
          <Typography variant="body1">Body1 – Default body text</Typography>
          <Typography variant="body2">Body2 – Secondary body text</Typography>
          <Typography variant="caption">Caption – Smaller label text</Typography>
          <Typography variant="button">Button – Used in buttons</Typography>
          <Typography variant="overline">Overline – Uppercase helper</Typography>
        </Stack>
      </section>

      <section id="colors" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Colors</Typography>
        <Stack spacing={4}>
          {['primary', 'secondary', 'error', 'success', 'warning', 'info'].map((group) => (
            <Stack key={group} spacing={1}>
              <Typography variant="subtitle1">
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {Object.entries(theme.palette[group] || {}).map(([shade, color]) => (
                  <Stack key={shade} alignItems="center" spacing={0.5}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      bgcolor: color,
                      borderRadius: 1,
                      border: '1px solid #ccc'
                    }} />
                    <Typography variant="caption" align="center">
                      {shade}<br />{color}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ))}
          <Stack spacing={1}>
            <Typography variant="subtitle1">Grey</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {Object.entries(theme.palette.grey || {}).map(([shade, color]) => (
                <Stack key={shade} alignItems="center" spacing={0.5}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    bgcolor: color,
                    borderRadius: 1,
                    border: '1px solid #ccc'
                  }} />
                  <Typography variant="caption" align="center">
                    {shade}<br />{color}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </section>

      <section id="alerts-&-feedback" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Alerts & Feedback</Typography>
        <Stack spacing={2}>
          <Alert severity="error">This is an error alert</Alert>
          <Alert severity="warning">This is a warning alert</Alert>
          <Alert severity="info">This is an info alert</Alert>
          <Alert severity="success">This is a success alert</Alert>
        </Stack>
      </section>

      <section id="icons" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Icons</Typography>
        <Stack direction="row" spacing={2}>
          <Add />
          <Edit />
          <Delete />
          <CheckCircle />
          <Warning />
        </Stack>
      </section>

      <section id="chips" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Chips</Typography>
        <Stack direction="row" spacing={2}>
          <Chip label="Default" />
          <Chip label="Primary" color="primary" />
          <Chip label="Outlined" variant="outlined" />
          <Chip label="Deletable" onDelete={() => {}} />
        </Stack>
      </section>

      <section id="grid-layout" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Grid Layout</Typography>
        <Grid container spacing={2}>
          {[...Array(6)].map((_, i) => (
            <Grid xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardContent>
                  <Typography>Card {i + 1}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>

      <section id="navigation" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Navigation</Typography>
        <Tabs value={0}>
          <Tab label="Tab One" />
          <Tab label="Tab Two" />
        </Tabs>
      </section>

      <section id="lists" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Lists</Typography>
        <List>
          <ListItem>Item One</ListItem>
          <Divider />
          <ListItem>Item Two</ListItem>
        </List>
      </section>

      <section id="information" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Information</Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Tooltip text">
            <Button>Hover me</Button>
          </Tooltip>
          <Snackbar open message="This is a snackbar message" />
        </Stack>
      </section>

      <section id="interactivity" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Interactivity</Typography>
        <Accordion>
          <AccordionSummary>Accordion Header</AccordionSummary>
          <AccordionDetails>Accordion Content</AccordionDetails>
        </Accordion>
      </section>

      <section id="media-avatar" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Media / Avatar</Typography>
        <Stack direction="row" spacing={2}>
          <Badge badgeContent={4} color="primary">
            <Avatar>A</Avatar>
          </Badge>
          <Avatar src="https://placehold.co/40x40" />
        </Stack>
      </section>

      <section id="forms" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Forms</Typography>
        <Stack direction="row" spacing={2}>
          <Checkbox defaultChecked />
          <Switch defaultChecked />
          <Radio checked />
          <Slider defaultValue={30} />
        </Stack>
      </section>
    </Container>
  </Stack>
  );
}