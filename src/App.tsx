import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NotFound from "./components/NotFound";
import Home from './pages/Home';
import Fanshop from './pages/Fanshop';
import PasswordGate from './PasswordGate';
import Matches from './pages/Matches';
import Squad from './pages/Squad';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fanshop" element={<Fanshop />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  );
}

export default App;