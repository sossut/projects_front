import './App.css';
import { Route, Routes, BrowserRouter, HashRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Home from './views/Home';
import NavBar from './components/NavBar';
import Updates from './views/Updates';
import Else from './views/Else';
import Login from './views/Login';
import Map from './views/Map';

function App() {
  const Router =
    window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

  return (
    <Router>
      <AppProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/else" element={<Else />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Else />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
