import React from 'react';

import logo from '../assets/react.svg';

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import NavBarProfile from './NavBarProfile';

const Nav = styled.nav`
  background: #000;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
`;

const NavLink = styled(Link)`
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
`;
const NavBarCore = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const NavBarLink = styled.div`
  display: flex;
  align-items: center;
  .navbar-link {
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

const NavBar: React.FC = () => {
  return (
    <Nav>
      <NavBarCore>
        <NavLink to="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </NavLink>
        <NavBarLink>
          <NavLink to="/" className="navbar-link">
            Home
          </NavLink>
          <NavLink to="/something" className="navbar-link">
            Something
          </NavLink>
          <NavLink to="/else" className="navbar-link">
            Else
          </NavLink>
        </NavBarLink>
      </NavBarCore>
      <NavBarProfile />
    </Nav>
  );
};

export default NavBar;
