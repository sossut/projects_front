import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;
const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: #333;
  &:hover {
    background: #f0f0f0;
  }
`;

interface ProjectModalOptionsMenuProps {
  onEdit: () => void;
  onDetails: () => void;
  onClose: () => void;
  onViewJson: () => void;
}

const ProjectModalOptionsMenu: React.FC<ProjectModalOptionsMenuProps> = ({
  onEdit,
  onDetails,
  onClose,
  onViewJson
}) => {
  return (
    <MenuContainer>
      <MenuItem
        onClick={() => {
          onDetails();
          onClose();
        }}
      >
        Details
      </MenuItem>
      <MenuItem
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          onViewJson();
          onClose();
        }}
      >
        {' '}
        View JSON
      </MenuItem>
    </MenuContainer>
  );
};

export default ProjectModalOptionsMenu;
