import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Home from './views/Home';
import NavBar from './components/NavBar';
import Updates from './views/Updates';
import Else from './views/Else';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/else" element={<Else />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
