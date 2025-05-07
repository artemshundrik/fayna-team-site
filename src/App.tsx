import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NotFound from "./components/NotFound";
import PlayerProfile from './pages/PlayerProfile';
import Home from './pages/Home';
import Fanshop from './pages/Fanshop';
import PasswordGate from './PasswordGate';
import Matches from './pages/Matches';
import Squad from './pages/Squad';
import Styleguide from './pages/Styleguide';
import ProductDetailPage from './pages/ProductDetailPage';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PasswordGate>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fanshop" element={<Fanshop />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/squad" element={<Squad />} />
            <Route path="/styleguide" element={<Styleguide />} />
            <Route path="/player/:number" element={<PlayerProfile />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PasswordGate>
    </ThemeProvider>
  );
}

export default App;