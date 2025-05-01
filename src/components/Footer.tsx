import React from 'react';
import { Box, Typography, Link, Container, Stack, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

const sponsors = [
  {
    name: 'Tosho agency',
    href: 'https://tosho.agency/',
    src: '/images/sponsors/logo-sponsor-tosho-white.svg',
  },
  {
    name: 'Wookie agency',
    href: 'https://wookie.com.ua/ua/',
    src: '/images/sponsors/logo-sponsor-wookie-white.svg',
  },
  {
    name: 'Minimal Coffee Room',
    href: 'https://www.instagram.com/minimal_coffeeroom',
    src: '/images/sponsors/logo-sponsor-minimal-white.svg',
  },
];

const footerLinkStyle = (theme) => ({
  fontWeight: 500,
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
});

const FooterSponsors = () => (
  <Box
    sx={(theme) => ({
      background: 'linear-gradient(90deg, #111 0%, #000 100%)',
      backgroundColor: theme.palette.grey[900],
      pt: { xs: 2, sm: 2 },
      pb: { xs: 2, sm: 2 },
      mb: { xs: 2, sm: 2 },
      width: '100%',
    })}
  >
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        spacing={{ xs: 3, sm: 6 }}
        rowGap={{ xs: 3, sm: 4 }}
      >
        {sponsors.map((sponsor) => (
          <Tooltip key={sponsor.name} title={sponsor.name} arrow>
            <Link
              href={sponsor.href}
              aria-label={sponsor.name}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'inline-block', lineHeight: 0 }}
            >
              <Box
                component="img"
                src={sponsor.src}
                alt={sponsor.name}
                loading="lazy"
                height={{ xs: 28, sm: 32 }}
                sx={(theme) => ({
                  filter: 'grayscale(1)',
                  opacity: 0.4,
                  transition: 'filter 0.3s ease, opacity 0.3s ease',
                  '&:hover': {
                    filter: 'none',
                    opacity: 1,
                  },
                })}
              />
            </Link>
          </Tooltip>
        ))}
      </Stack>
    </Container>
  </Box>
);

const FooterLinks = () => {
  return (
    <Box pb={2}>
      <Box component="nav" aria-labelledby="footer-navigation">
        <Typography id="footer-navigation" component="h2" variant="h6" sx={{ textTransform: 'uppercase', fontSize: '1.25rem', mt: 2, mb: 1.5 }}>
          Швидкі посилання
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Link href="/" sx={(theme) => footerLinkStyle(theme)}>ГОЛОВНА</Link>
          <Link href="/squad" sx={(theme) => footerLinkStyle(theme)}>СКЛАД</Link>
          <Link href="/fanshop" sx={(theme) => footerLinkStyle(theme)}>ФАНШОП</Link>
          <Link href="/matches" sx={(theme) => footerLinkStyle(theme)}>МАТЧІ</Link>
          <Link href="/about" sx={(theme) => footerLinkStyle(theme)}>ПРО НАС</Link>
        </Box>
      </Box>
    </Box>
  );
};

const FooterContacts = () => {
  return (
    <Box pb={2}>
      <Typography variant="h6" sx={{ textTransform: 'uppercase', fontSize: '1.25rem', mt: 2, mb: 1.5 }}>
        Контакти
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 400, fontSize: '0.95rem' }}>
          <LocationOnIcon fontSize="small" />
          вул. Салютна 2, ЖК Файна Таун
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 400, fontSize: '0.95rem' }}>
          <PhoneIcon fontSize="small" />
          +380 44 123 4567
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 400, fontSize: '0.95rem' }}>
          <EmailIcon fontSize="small" />
          <Link href="mailto:info@faynateam.com" sx={(theme) => ({
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          })}>info@faynateam.com</Link>
        </Box>
      </Box>
    </Box>
  );
};

const FooterSocial = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', textAlign: 'left', pb: 2 }}>
      <Box component="img" src="/images/logo-fayna-full-white.svg" alt="FAYNA TEAM" height={48} />
      <Typography sx={{ mt: 1, mb: 1, fontWeight: 400, fontSize: '0.95rem' }}>
        Засновано 2024. Віддані досконалості у футзалі.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 0 }}>
        <Link href="https://www.instagram.com/fc_fayna_team/?igsh=MWx4eXRlMW54NWR2eg%3D%3D&utm_source=qr#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" sx={(theme) => ({
          color: theme.palette.grey[300],
          '&:hover': {
            color: theme.palette.primary.main,
          }
        })}>
          <InstagramIcon fontSize="medium" />
        </Link>
        <Link href="https://www.youtube.com/@FCFAYNATEAM" target="_blank" rel="noopener noreferrer" aria-label="Youtube" sx={(theme) => ({
          color: theme.palette.grey[300],
          '&:hover': {
            color: theme.palette.primary.main,
          }
        })}>
          <YouTubeIcon fontSize="medium" />
        </Link>
      </Box>
    </Box>
  );
};

const FooterBottom = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 400,
        color: (theme) => theme.palette.grey[300],
        maxWidth: '90%',
        lineHeight: 1.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        mt: 4,
      }}
    >
      <Typography>© 2025 Fayna Team. Всі права захищені.</Typography>
      <Typography>
        <Link href="/privacy" sx={(theme) => footerLinkStyle(theme)}>Політика конфіденційності</Link> •{' '}
        <Link href="/terms" sx={(theme) => footerLinkStyle(theme)}>Умови використання</Link>
      </Typography>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        py: 4,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'FixelDisplay, sans-serif',
      })}
    >
      <FooterSponsors />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 2,
            width: '100%',
            alignItems: 'start',
            columnGap: 4,
            pb: 4,
          }}
        >
          <FooterLinks />
          <FooterContacts />
          <FooterSocial />
        </Box>
      </Container>

      <FooterBottom />
    </Box>
  );
};

export default Footer;
