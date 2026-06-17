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
import Admin from './views/Admin';
import Profile from './views/Profile';

const isAdminUser = (user: unknown) => {
  if (!user || typeof user !== 'object') {
    return false;
  }

  if ('role' in user && (user as { role?: string }).role === 'admin') {
    return true;
  }

  if ('user' in user) {
    return (user as { user?: { role?: string } }).user?.role === 'admin';
  }

  return false;
};

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { user } = useContext(AppContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RequireAdmin = ({ children }: { children: ReactElement }) => {
  const { user } = useContext(AppContext);

  if (!user || !isAdminUser(user)) {
    return <Navigate to="/" replace />;
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
            path="/queue"
            element={
              <RequireAuth>
                <Else />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
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
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
