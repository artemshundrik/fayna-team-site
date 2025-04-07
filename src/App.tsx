import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from "./components/NotFound";
import Home from './pages/Home';
import Fanshop from './pages/Fanshop';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fanshop" element={<Fanshop />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;