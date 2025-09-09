import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const NavLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    <Link to="/" style={{ textDecoration: 'none' }} onClick={onClick}>
      <Typography variant="navLink">Головна</Typography>
    </Link>
    <Link to="/squad" style={{ textDecoration: 'none' }} onClick={onClick}>
      <Typography variant="navLink">Команда</Typography>
    </Link>
    <Link to="/matches" style={{ textDecoration: 'none' }} onClick={onClick}>
      <Typography variant="navLink">Матчі</Typography>
    </Link>
    <Link to="/fanshop" style={{ textDecoration: 'none' }} onClick={onClick}>
      <Typography variant="navLink">Фаншоп</Typography>
    </Link>
  </>
);

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={(theme) => ({
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: 2,
            py: { xs: 0.5, sm: 1 }, // менше падінг на мобілці
            minHeight: { xs: 48, sm: 64 }, // нижча висота хедера на мобілці
            boxShadow: 'none',
          })}
        >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 2 }}>
              <Link to="/">
                <Box
                  component="img"
                  src="/images/logo-fayna.svg"
                  alt="FAYNA TEAM logo"
                  sx={{ height: { xs: 40, sm: 64 } }}
                  srcSet="/images/logo-fayna.svg 1x, /images/logo-fayna.svg 2x"
                  sizes="(max-width: 600px) 40px, 64px"
                />
              </Link>
            </Box>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <NavLinks />
            </Stack>
          </Box>
 
          {/* Спонсори */}
          <Box sx={{ alignItems: 'center', gap: 3, display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="ToSho Agency" arrow>
              <a href="https://tosho.agency/" target="_blank" rel="noopener noreferrer">
                <img src="/images/sponsors/logo-sponsor-tosho.svg" alt="ToSho" height="24" className="sponsor-logo" />
              </a>
            </Tooltip>
            <Tooltip title="Wookie Studio" arrow>
              <a href="https://wookie.com.ua/ua/" target="_blank" rel="noopener noreferrer">
                <img src="/images/sponsors/logo-sponsor-wookie.svg" alt="Wookie" height="24" className="sponsor-logo" />
              </a>
            </Tooltip>
            <Tooltip title="Minimal Coffee Room" arrow>
              <a href="https://www.instagram.com/minimal_coffeeroom/" target="_blank" rel="noopener noreferrer">
                <img src="/images/sponsors/logo-sponsor-minimal.svg" alt="Minimal" height="24" className="sponsor-logo" />
              </a>
            </Tooltip>
          </Box>
 
          {/* Mobile Menu Icon */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setMenuOpen(true)}
            sx={{
              color: (theme) => theme.palette.text.primary,
              display: { xs: 'block', md: 'none' }, // Показати тільки на мобільних
              boxShadow: 'none', // Прибираємо тінь
              '&:hover': {
                backgroundColor: 'transparent', // Окремий ефект для ховера
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setMenuOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: '100%',
          maxWidth: '100vw',
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            width: 250,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={() => setMenuOpen(false)}
              sx={{
                color: (theme) => theme.palette.text.primary,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Stack direction="column" spacing={2} mt={2}>
            <NavLinks onClick={() => setMenuOpen(false)} />
          </Stack>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 3 }}>
            {/* Спонсори в мобільному меню */}
            <Tooltip title="ToSho Agency" arrow>
              <a href="https://tosho.agency/" target="_blank" rel="noopener noreferrer">
                <img src="/images/sponsors/logo-sponsor-tosho.svg" alt="ToSho" height="24" className="sponsor-logo" />
              </a>
            </Tooltip>
            <Tooltip title="Wookie Studio" arrow>
              <a href="https://wookie.com.ua/ua/" target="_blank" rel="noopener noreferrer">
                <img src="/images/sponsors/logo-sponsor-wookie.svg" alt="Wookie" height="24" className="sponsor-logo" />
              </a>
            </Tooltip>
            <Tooltip title="Minimal Coffee Room" arrow>
              <a href="https://www.instagram.com/minimal_coffeeroom/" target="_blank" rel="noopener noreferrer">
                <img src="/images/sponsors/logo-sponsor-minimal.svg" alt="Minimal" height="24" className="sponsor-logo" />
              </a>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>

      {/* Основний контент */}
      <Box sx={{ paddingTop: '64px' }}>
        {/* Ваш контент */}
      </Box>
      <style>{`
        .sponsor-logo {
          transition: transform 0.3s ease-in-out;
          cursor: pointer;
          display: inline-block;
        }

        .sponsor-logo:hover {
          transform: scale(1.1);
        }

        .sponsor-container {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default Header;
