import React from 'react';
import { useLogin } from '../hooks/ApiHooks';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
const LoginForm: React.FC = () => {
  const { setUser } = React.useContext(AppContext);
  const { login, error } = useLogin();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();
  const checkForEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    try {
      const user = await login(email, password);
      if (user) {
        console.log('User logged in:', user);
        localStorage.setItem('token', user.token);
        setUser(user);
        navigate('/');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login error:', error);
      setUser(null);
    }
  };
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={checkForEnterKey}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            onKeyDown={checkForEnterKey}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        style={{ padding: '10px 20px' }}
      >
        Login
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginForm;
