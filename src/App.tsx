import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Home from './views/Home';
import NavBar from './components/NavBar';
import Something from './views/Something';
import Else from './views/Else';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/something" element={<Something />} />
          <Route path="/else" element={<Else />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
