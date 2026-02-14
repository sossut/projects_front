import React from 'react';
import styled from 'styled-components';

import { useProjects } from '../hooks/ApiHooks';
import type { BuildingUse } from '../interfaces/BuildingUse';
import ProjectInfoModal from './ProjectInfoModal';
import ProjectImageModal from './ProjectImageModal';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background-color: #515050;
  color: white;
`;

const TH = styled.th`
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
`;

const TD = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
`;

const ProjectTable = () => {
  const { projects, getProjectsSimple } = useProjects();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState<null | 'image' | 'info'>(
    null
  );
  const [carouselIndex, setCarouselIndex] = React.useState<{
    [key: number]: number;
  }>({});
  const handlePrev = (projectId: number, mediasLength: number) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [projectId]: prev[projectId] > 0 ? prev[projectId] - 1 : mediasLength - 1
    }));
  };

  const handleNext = (projectId: number, mediasLength: number) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [projectId]: prev[projectId] < mediasLength - 1 ? prev[projectId] + 1 : 0
    }));
  };

  React.useEffect(() => {
    getProjectsSimple();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    console.log(projects);
  }, [projects]);
  return (
    <Table>
      <THead>
        <tr>
          <TH>ID</TH>
          <TH>Name</TH>
          <TH>City</TH>
          <TH>Country</TH>
          <TH>Status</TH>
          <TH>Building Type</TH>
          <TH>Building Uses</TH>
          <TH>Height (m)</TH>
          <TH>Height (Floors)</TH>
          <TH>Expected Completion Date</TH>
          <TH>Images</TH>
          <TH>More Info</TH>
        </tr>
      </THead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <TD>{project.id}</TD>
            <TD>{project.name}</TD>
            <TD>{project.city as string}</TD>
            <TD>{project.country as string}</TD>
            <TD>{project.status}</TD>
            <TD>{project.buildingType}</TD>
            <TD>
              {(project.buildingUses as BuildingUse[] | undefined)?.map(
                (use, idx) => (
                  <span key={use.id as number}>
                    {use.buildingUse}
                    {idx < (project.buildingUses as BuildingUse[]).length - 1
                      ? ', '
                      : ''}
                  </span>
                )
              )}
            </TD>
            <TD>{project.buildingHeightMeters}</TD>
            <TD>{project.buildingHeightFloors}</TD>
            <TD>{project.expectedDateText}</TD>

            <TD>
              {project.projectMedias?.map((media) => (
                <img
                  key={media.id}
                  src={media.url}
                  alt="Project"
                  style={{ height: 100, marginRight: 5 }}
                  onClick={() => {
                    setSelectedImage(media.url);
                    setIsModalOpen('image');
                  }}
                />
              ))}
            </TD>
            <TD>
              <button
                onClick={() => {
                  setSelectedProjectId(project.id as number);
                  setIsModalOpen('info');
                }}
              >
                More Info
              </button>
            </TD>
          </tr>
        ))}
      </tbody>
      {isModalOpen === 'image' && selectedImage && (
        <ProjectImageModal
          imageUrl={selectedImage}
          onClose={() => setIsModalOpen(null)}
        />
      )}
      {isModalOpen === 'info' && selectedProjectId !== null && (
        <ProjectInfoModal
          id={selectedProjectId}
          onClose={() => setIsModalOpen(null)}
        />
      )}
    </Table>
  );
};

export default ProjectTable;
