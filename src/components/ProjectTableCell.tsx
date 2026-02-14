import React from 'react';
import styled from 'styled-components';
interface ProjectTableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableData = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
`;

const ProjectTableCell: React.FC<ProjectTableCellProps> = ({
  children,
  className
}) => {
  return <TableData className={className}>{children}</TableData>;
};

export default ProjectTableCell;
