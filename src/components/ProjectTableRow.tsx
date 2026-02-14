import React from 'react';
import styled from 'styled-components';

interface ProjectTableRowProps {
  children: React.ReactNode;
  className?: string;
}

const TableRow = styled.tr``;

const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  children,
  className
}) => {
  return <TableRow className={className}>{children}</TableRow>;
};

export default ProjectTableRow;
