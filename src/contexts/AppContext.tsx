import React, { type Dispatch, type SetStateAction } from 'react';
import type { User } from '../interfaces/User';

const USER_STORAGE_KEY = 'user';

interface AppContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  enrichingProjectId: number | null;
  setEnrichingProjectId: Dispatch<SetStateAction<number | null>>;
}

const AppContext = React.createContext<AppContextProps>({
  user: null,
  setUser: () => {},
  enrichingProjectId: null,
  setEnrichingProjectId: () => {}
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? (JSON.parse(savedUser) as User) : null;
    } catch {
      return null;
    }
  });

  const [enrichingProjectId, setEnrichingProjectId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }
    localStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  return (
    <AppContext.Provider
      value={{ user, setUser, enrichingProjectId, setEnrichingProjectId }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
