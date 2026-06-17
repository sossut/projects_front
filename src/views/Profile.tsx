import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { useAdminUsers, useLogin } from '../hooks/ApiHooks';

const Page = styled.div`
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 18px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  strong {
    color: #0f172a;
  }
`;

const FormCard = styled(Card)`
  margin-top: 18px;
`;

const Form = styled.form`
  display: grid;
  gap: 14px;
  margin-top: 18px;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
  color: #0f172a;
  font-weight: 600;

  input {
    width: 100%;
    border: 1px solid rgba(15, 23, 42, 0.16);
    border-radius: 12px;
    padding: 12px 14px;
    font: inherit;
    background: #fff;
    color: #0f172a;
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  border: 0;
  border-radius: 12px;
  padding: 12px 16px;
  background: #0f172a;
  color: #fff;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Alert = styled.div<{ $tone?: 'success' | 'error' | 'info' }>`
  border-radius: 14px;
  padding: 12px 14px;
  background: ${({ $tone }) =>
    $tone === 'error'
      ? 'rgba(239, 68, 68, 0.1)'
      : $tone === 'success'
        ? 'rgba(34, 197, 94, 0.12)'
        : 'rgba(37, 99, 235, 0.08)'};
  color: ${({ $tone }) =>
    $tone === 'error'
      ? '#b91c1c'
      : $tone === 'success'
        ? '#166534'
        : '#1d4ed8'};
`;

const Profile: React.FC = () => {
  const { user, setUser } = React.useContext(AppContext);
  const { login } = useLogin();
  const { loading, error, changeUserPassword } = useAdminUsers();
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [status, setStatus] = React.useState<string | null>(null);
  const [statusTone, setStatusTone] = React.useState<
    'success' | 'error' | 'info'
  >('info');

  const userRole =
    (user && typeof user === 'object' && 'role' in user && user.role) ||
    (user && typeof user === 'object' && 'user' in user
      ? (user as { user?: { role?: string } }).user?.role
      : undefined) ||
    'user';

  const username =
    (user && typeof user === 'object' && 'username' in user && user.username) ||
    (user && typeof user === 'object' && 'user' in user
      ? (user as { user?: { username?: string } }).user?.username
      : undefined) ||
    'Unknown';

  const email =
    (user && typeof user === 'object' && 'email' in user && user.email) ||
    (user && typeof user === 'object' && 'user' in user
      ? (user as { user?: { email?: string } }).user?.email
      : undefined) ||
    'Unknown';

  React.useEffect(() => {
    if (typeof email === 'string' && email !== 'Unknown') {
      setEmailValue(email);
    }
  }, [email]);

  const userId =
    (user && typeof user === 'object' && 'id' in user && user.id) ||
    (user && typeof user === 'object' && 'user' in user
      ? (user as { user?: { id?: number } }).user?.id
      : undefined) ||
    'Unknown';

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStatus(null);

    if (typeof userId !== 'number') {
      setStatus('User ID is missing.');
      setStatusTone('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('New passwords do not match.');
      setStatusTone('error');
      return;
    }

    if (!emailValue) {
      setStatus('Email is missing.');
      setStatusTone('error');
      return;
    }

    const verification = await login(emailValue, currentPassword);
    if (!verification) {
      setStatus('Current password is incorrect.');
      setStatusTone('error');
      return;
    }

    const response = await changeUserPassword(userId, newPassword);
    if (response) {
      setStatus('Password updated.');
      setStatusTone('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <Page>
      <Card>
        <h1>Profile</h1>
        <p>Signed-in user details and account information.</p>

        <Grid>
          <Row>
            <strong>User ID</strong>
            <span>{userId}</span>
          </Row>
          <Row>
            <strong>Username</strong>
            <span>{username}</span>
          </Row>
          <Row>
            <strong>Email</strong>
            <span>{email}</span>
          </Row>
          <Row>
            <strong>Role</strong>
            <span>{userRole}</span>
          </Row>
        </Grid>

        <FormCard>
          <h2>Change password</h2>
          <p>Update your own password here.</p>

          {status && <Alert $tone={statusTone}>{status}</Alert>}
          {error && <Alert $tone="error">{error}</Alert>}

          <Form onSubmit={handlePasswordChange}>
            <Field>
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </Field>
            <Field>
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </Field>
            <Field>
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Change password'}
            </Button>
          </Form>
        </FormCard>
      </Card>
    </Page>
  );
};

export default Profile;
