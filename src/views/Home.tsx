import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import styled from 'styled-components';
import ProjectTable from '../components/ProjectTable';

const HomeContainer = styled.div`
  padding: 20px;
`;

const Home: React.FC = () => {
  const { user } = useContext(AppContext);
  console.log(user);
  return (
    <HomeContainer>
      <h2>Projects</h2>
      <ProjectTable />
    </HomeContainer>
  );
};

export default Home;
