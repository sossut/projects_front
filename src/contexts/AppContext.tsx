import React, { type Dispatch, type SetStateAction } from 'react';
import type { User } from '../interfaces/User';

interface AppContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AppContext = React.createContext<AppContextProps>({
  user: null,
  setUser: () => {}
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
