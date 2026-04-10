import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../contexts/AppContext';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  .navbar-profile-link {
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
      color: #15cdfc;
    }
  }
`;

const NavBarProfile: React.FC = () => {
  const { user, setUser } = React.useContext(AppContext);
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    console.log('User logged out');
  };
  return (
    <ProfileContainer>
      <NavLink to="/profile" className="navbar-profile-link">
        Profile
      </NavLink>
      {user ? (
        <NavLink
          to="/login"
          className="navbar-profile-link"
          onClick={handleLogout}
        >
          Logout
        </NavLink>
      ) : (
        <NavLink to="/login" className="navbar-profile-link">
          Login
        </NavLink>
      )}
    </ProfileContainer>
  );
};

export default NavBarProfile;
