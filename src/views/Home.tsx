import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Home: React.FC = () => {
  const { user } = useContext(AppContext);
  console.log(user);
  return (
    <div className="home">
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

export default Home;
