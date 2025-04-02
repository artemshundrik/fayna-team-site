import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Team from './pages/Team';
// import Fanshop from './pages/Fanshop';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/team" element={<Team />} /> */}
        {/* <Route path="/fanshop" element={<Fanshop />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;