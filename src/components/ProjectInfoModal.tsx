import React, { useEffect } from 'react';
import { useProjects } from '../hooks/ApiHooks';
import type { Project } from '../interfaces/Project';
import type { BuildingUse } from '../interfaces/BuildingUse';
import type { ProjectWebsite } from '../interfaces/ProjectWebsite';
import styled from 'styled-components';
import type { Consultant } from '../interfaces/Consultant';
import type { Contractor } from '../interfaces/Contractor';
import blackBalls from '../assets/Options_black_balls.png';
import whiteBalls from '../assets/Options_white_balls.png';

interface ProjectInfoModalProps {
  id: number;
  onClose: () => void;
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(107, 105, 105, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: #433939;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  position: relative;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

const ModalContent = styled.div`
  overflow-y: auto;
  max-height: 80vh;
`;

const LabelTD = styled.td`
  font-weight: bold;
  padding: 4px 8px;
  vertical-align: top;
  width: 150px;
  white-space: nowrap;
`;

const ValueTD = styled.td`
  padding: 4px 8px;
  vertical-align: top;
  word-break: break-all;
`;

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ id, onClose }) => {
  const { getProject } = useProjects();
  const [project, setProject] = React.useState<Project | null>(null);
  useEffect(() => {
    (async () => {
      const data = await getProject(id);
      console.log(data);
      setProject(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ModalBackground>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              top: 0,
              left: 0,
              right: 0,
              position: 'sticky',
              background: '#433939', // match modal background to hide content behind
              zIndex: 3,
              padding: '10px 0'
            }}
          >
            <h2
              style={{
                margin: 0
              }}
            >
              {project?.name}
            </h2>
            <button>
              <img
                src={whiteBalls}
                alt="Options"
                style={{ width: 20, height: 20 }}
              />
            </button>
            <button
              onClick={onClose}
              style={{
                padding: 0,

                background: 'transparent',
                color: '#fff',
                border: 'none',
                fontSize: 40,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2 // ensure it's above modal content
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          {(project?.projectMedias?.length ?? 0) > 0 && (
            <tr>
              <td style={{ padding: '4px 8px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {project?.projectMedias?.map((media) => (
                    <img
                      key={media.id}
                      src={media.url}
                      alt={media.title || 'Project'}
                      style={{ height: 280, borderRadius: 4 }}
                    />
                  ))}
                </div>
              </td>
            </tr>
          )}
          <table
            style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}
          >
            <tbody>
              <tr>
                <LabelTD>City</LabelTD>
                <ValueTD>{project?.address?.city?.name}</ValueTD>
              </tr>
              <tr>
                <LabelTD>Country</LabelTD>
                <ValueTD>{project?.address?.country?.name}</ValueTD>
              </tr>
              <tr>
                <LabelTD>Status</LabelTD>
                <ValueTD>{project?.status}</ValueTD>
              </tr>
              <tr>
                <LabelTD>Building Type</LabelTD>
                <ValueTD>{project?.buildingType}</ValueTD>
              </tr>
              <tr>
                <LabelTD>Building Uses</LabelTD>
                <ValueTD>
                  {(project?.buildingUses as BuildingUse[])
                    ?.map((u) => u.buildingUse)
                    .join(', ')}
                </ValueTD>
              </tr>
              <tr>
                <LabelTD>Height</LabelTD>
                <ValueTD>
                  {project?.buildingHeightMeters} m /{' '}
                  {project?.buildingHeightFloors} floors
                </ValueTD>
              </tr>
              <tr>
                <LabelTD>Expected Completion</LabelTD>
                <ValueTD>{project?.expectedDateText}</ValueTD>
              </tr>

              {(project?.projectWebsites?.length ?? 0) > 0 && (
                <tr>
                  <LabelTD>Websites</LabelTD>
                  <ValueTD>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyleType: 'none'
                      }}
                    >
                      {(project?.projectWebsites as ProjectWebsite[])?.map(
                        (site) => (
                          <li key={site.id as number | string}>
                            <a
                              href={site.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#4af' }}
                            >
                              {site.url}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </ValueTD>
                </tr>
              )}
              {(project?.developers?.length ?? 0) > 0 && (
                <tr>
                  <LabelTD>Developers</LabelTD>
                  <ValueTD>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyleType: 'none'
                      }}
                    >
                      {project?.developers?.map((dev) => (
                        <li key={dev.id || dev.name}>{dev.name}</li>
                      ))}
                    </ul>
                  </ValueTD>
                </tr>
              )}
              {(project?.architects?.length ?? 0) > 0 && (
                <tr>
                  <LabelTD>Architects</LabelTD>
                  <ValueTD>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyleType: 'none'
                      }}
                    >
                      {project?.architects?.map((arch) => (
                        <li key={arch.id || arch.name}>{arch.name}</li>
                      ))}
                    </ul>
                  </ValueTD>
                </tr>
              )}
              {(project?.consultants?.length ?? 0) > 0 && (
                <tr>
                  <LabelTD>Consultants</LabelTD>
                  <ValueTD>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyleType: 'none'
                      }}
                    >
                      {(project?.consultants as Consultant[])
                        .filter((c) => c.name)
                        .map((consultant) => (
                          <li key={consultant.id || consultant.name}>
                            <div>
                              <strong>{consultant.name}</strong>
                            </div>
                            {consultant.email && (
                              <div>
                                Email:{' '}
                                <a
                                  href={`mailto:${consultant.email}`}
                                  style={{ color: '#4af' }}
                                >
                                  {consultant.email}
                                </a>
                              </div>
                            )}
                            {consultant.phone && (
                              <div>
                                Phone:{' '}
                                <a
                                  href={`tel:${consultant.phone}`}
                                  style={{ color: '#4af' }}
                                >
                                  {consultant.phone}
                                </a>
                              </div>
                            )}
                            {consultant.website && (
                              <div>
                                Website:{' '}
                                <a
                                  href={consultant.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#4af' }}
                                >
                                  {consultant.website}
                                </a>
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </ValueTD>
                </tr>
              )}
              {(project?.contractors?.length ?? 0) > 0 && (
                <tr>
                  <LabelTD>Contractors</LabelTD>
                  <ValueTD>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyleType: 'none'
                      }}
                    >
                      {(project?.contractors as Contractor[])
                        .filter((c) => c.name)
                        .map((contractor) => (
                          <li key={contractor.id || contractor.name}>
                            <div>
                              <strong>{contractor.name}</strong>
                            </div>
                            {contractor.email && (
                              <div>
                                Email:{' '}
                                <a
                                  href={`mailto:${contractor.email}`}
                                  style={{ color: '#4af' }}
                                >
                                  {contractor.email}
                                </a>
                              </div>
                            )}
                            {contractor.phone && (
                              <div>
                                Phone:{' '}
                                <a
                                  href={`tel:${contractor.phone}`}
                                  style={{ color: '#4af' }}
                                >
                                  {contractor.phone}
                                </a>
                              </div>
                            )}
                            {contractor.website && (
                              <div>
                                Website:{' '}
                                <a
                                  href={contractor.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#4af' }}
                                >
                                  {contractor.website}
                                </a>
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </ValueTD>
                </tr>
              )}
              {(project?.sources?.length ?? 0) > 0 && (
                <tr>
                  <LabelTD>Sources</LabelTD>
                  <ValueTD>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyleType: 'none'
                      }}
                    >
                      {project?.sources?.map((link) => (
                        <li key={link.id}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#4af' }}
                          >
                            {link.publisher}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </ValueTD>
                </tr>
              )}
            </tbody>
          </table>
        </ModalContent>
      </Modal>
    </ModalBackground>
  );
};

export default ProjectInfoModal;
