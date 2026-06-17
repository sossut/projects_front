import React from 'react';
import styled from 'styled-components';
import { AppContext } from '../contexts/AppContext';
import { useAdminUsers } from '../hooks/ApiHooks';

const Page = styled.div`
  min-height: calc(100vh - 80px);
  padding: 32px 20px 48px;
  background:
    radial-gradient(
      circle at top left,
      rgba(21, 205, 252, 0.18),
      transparent 34%
    ),
    linear-gradient(180deg, #f7fafc 0%, #eef4f8 100%);
`;

const Shell = styled.div`
  max-width: 1120px;
  margin: 0 auto;
`;

const Hero = styled.section`
  display: grid;
  gap: 12px;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.2rem);
    color: #0f172a;
  }

  p {
    margin: 0;
    max-width: 72ch;
    color: #475569;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
`;

const Card = styled.section`
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  padding: 22px;
  backdrop-filter: blur(10px);

  h2 {
    margin: 0 0 8px;
    font-size: 1.25rem;
    color: #0f172a;
  }

  p {
    margin: 0 0 18px;
    color: #64748b;
  }
`;

const FullWidthCard = styled(Card)`
  grid-column: 1 / -1;
`;

const Form = styled.form`
  display: grid;
  gap: 14px;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
  color: #0f172a;
  font-weight: 600;

  input,
  select {
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

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
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

const Secondary = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 0.95rem;
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

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;

  th,
  td {
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    vertical-align: middle;
  }

  th {
    font-size: 0.9rem;
    color: #475569;
    font-weight: 700;
  }

  tbody tr:hover {
    background: rgba(37, 99, 235, 0.05);
  }
`;

const PickButton = styled.button`
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 999px;
  padding: 8px 12px;
  background: #fff;
  color: #0f172a;
  font-size: 0.9rem;
`;

const initialCreateUserState = {
  username: '',
  email: '',
  password: ''
};

const initialPasswordState = {
  userId: '',
  password: ''
};

const Admin: React.FC = () => {
  const { user } = React.useContext(AppContext);
  const { loading, error, users, getUsers, createUser, changeUserPassword } =
    useAdminUsers();
  const [createUserForm, setCreateUserForm] = React.useState(
    initialCreateUserState
  );
  const [passwordForm, setPasswordForm] = React.useState(initialPasswordState);
  const [status, setStatus] = React.useState<string | null>(null);
  const [statusTone, setStatusTone] = React.useState<'success' | 'info'>(
    'info'
  );

  React.useEffect(() => {
    void getUsers();
  }, [getUsers]);

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const response = await createUser({ ...createUserForm, role: 'user' });
    if (response) {
      setStatus(`User ${createUserForm.username} created.`);
      setStatusTone('success');
      setCreateUserForm(initialCreateUserState);
      void getUsers();
    }
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStatus(null);

    const userId = Number(passwordForm.userId);
    if (!Number.isFinite(userId) || userId <= 0) {
      setStatus('Enter a valid user ID.');
      setStatusTone('info');
      return;
    }

    const response = await changeUserPassword(userId, passwordForm.password);
    if (response) {
      setStatus(`Password changed for user ${userId}.`);
      setStatusTone('success');
      setPasswordForm(initialPasswordState);
      void getUsers();
    }
  };

  const applyUserSelection = (selectedUserId: number) => {
    setPasswordForm({ userId: String(selectedUserId), password: '' });
    setStatus(`Selected user ID ${selectedUserId}.`);
    setStatusTone('info');
  };

  const userRole = user?.role || 'user';

  return (
    <Page>
      <Shell>
        <Hero>
          <h1>Admin</h1>
          <p>
            Use this page to add new users and change existing users' passwords.
            You are signed in with the {userRole} role.
          </p>
        </Hero>

        {status && <Alert $tone={statusTone}>{status}</Alert>}
        {error && <Alert $tone="error">{error}</Alert>}

        <Grid>
          <Card>
            <h2>Add user</h2>
            <p>Create a new user account through the backend admin endpoint.</p>
            <Form onSubmit={handleCreateUser}>
              <Field>
                Username
                <input
                  type="text"
                  value={createUserForm.username}
                  onChange={(event) =>
                    setCreateUserForm((current) => ({
                      ...current,
                      username: event.target.value
                    }))
                  }
                  required
                />
              </Field>
              <Field>
                Email
                <input
                  type="email"
                  value={createUserForm.email}
                  onChange={(event) =>
                    setCreateUserForm((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  placeholder="user@example.com"
                  required
                />
              </Field>
              <Field>
                Password
                <input
                  type="password"
                  value={createUserForm.password}
                  onChange={(event) =>
                    setCreateUserForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  required
                />
              </Field>
              <Actions>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Create user'}
                </Button>
                <Secondary>POST /users/</Secondary>
              </Actions>
            </Form>
          </Card>

          <Card>
            <h2>Change password</h2>
            <p>
              Enter a user ID and a new password, then send the update to the
              backend.
            </p>
            <Form onSubmit={handleChangePassword}>
              <Field>
                User ID
                <input
                  type="number"
                  min="1"
                  value={passwordForm.userId}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      userId: event.target.value
                    }))
                  }
                  placeholder="123"
                  required
                />
              </Field>
              <Field>
                New password
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  required
                />
              </Field>
              <Actions>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Change password'}
                </Button>
                <Secondary>PUT /users/:id/</Secondary>
              </Actions>
            </Form>
          </Card>

          <FullWidthCard>
            <h2>Users</h2>
            <p>
              Use this list to find a user's email and ID before changing a
              password.
            </p>
            <UserTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((currentUser) => (
                    <tr key={currentUser.id}>
                      <td>{currentUser.id}</td>
                      <td>{currentUser.email || '-'}</td>
                      <td>{currentUser.username || '-'}</td>
                      <td>{currentUser.role || '-'}</td>
                      <td>
                        <PickButton
                          type="button"
                          onClick={() => applyUserSelection(currentUser.id)}
                        >
                          Use for password change
                        </PickButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No users loaded yet.</td>
                  </tr>
                )}
              </tbody>
            </UserTable>
          </FullWidthCard>
        </Grid>
      </Shell>
    </Page>
  );
};

export default Admin;
