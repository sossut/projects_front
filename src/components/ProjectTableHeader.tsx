import React from 'react';
import styled from 'styled-components';

interface ProjectTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader = styled.th`
  padding: 8px;
  border: 1px solid #ddd;

  text-align: left;
`;

const ProjectTableHeader: React.FC<ProjectTableHeaderProps> = ({
  children,
  className
}) => {
  return <TableHeader className={className}>{children}</TableHeader>;
};

export default ProjectTableHeader;
