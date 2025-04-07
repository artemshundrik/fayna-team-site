import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from "./components/NotFound";
import Home from './pages/Home';
import Fanshop from './pages/Fanshop';
import PasswordGate from './PasswordGate';

function App() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fanshop" element={<Fanshop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  );
}

export default App;