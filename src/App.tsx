import './App.css';
import { useContext, type ReactElement } from 'react';
import {
  Route,
  Routes,
  BrowserRouter,
  HashRouter,
  Navigate
} from 'react-router-dom';
import { AppContext, AppProvider } from './contexts/AppContext';
import Home from './views/Home';
import NavBar from './components/NavBar';
import Updates from './views/Updates';
import Else from './views/Else';
import Login from './views/Login';
import Map from './views/Map';
import Help from './views/Help';

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { user } = useContext(AppContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const Router =
    window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

  return (
    <Router>
      <AppProvider>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/updates"
            element={
              <RequireAuth>
                <Updates />
              </RequireAuth>
            }
          />
          <Route
            path="/else"
            element={
              <RequireAuth>
                <Else />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Else />
              </RequireAuth>
            }
          />
          <Route
            path="/map"
            element={
              <RequireAuth>
                <Map />
              </RequireAuth>
            }
          />
          <Route
            path="/help"
            element={
              <RequireAuth>
                <Help />
              </RequireAuth>
            }
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
