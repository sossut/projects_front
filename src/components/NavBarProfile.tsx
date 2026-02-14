import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

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
  return (
    <ProfileContainer>
      <NavLink to="/profile" className="navbar-profile-link">
        Profile
      </NavLink>
      <NavLink to="/login" className="navbar-profile-link">
        Login
      </NavLink>
    </ProfileContainer>
  );
};

export default NavBarProfile;
