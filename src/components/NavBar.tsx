import React from 'react';
import { NavLink } from '../styles/NavBar.styles.';
import logo from '../assets/react.svg';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-core">
        <NavLink to="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" className="navbar-link">
            Home
          </NavLink>
          <NavLink to="/something" className="navbar-link">
            Something
          </NavLink>
          <NavLink to="/else" className="navbar-link">
            Else
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
