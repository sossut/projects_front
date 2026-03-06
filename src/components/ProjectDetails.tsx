import React from 'react';
import styled from 'styled-components';
import type { Project } from '../interfaces/Project';
import type { BuildingUse } from '../interfaces/BuildingUse';
import type { ProjectWebsite } from '../interfaces/ProjectWebsite';
import type { Consultant } from '../interfaces/Consultant';
import type { Contractor } from '../interfaces/Contractor';
const LabelTD = styled.td`
  font-weight: bold;
  padding: 4px 8px;
  vertical-align: top;
  width: 150px;
  white-space: nowrap;
  border: 1px solid #555;
`;

const ValueTD = styled.td`
  padding: 4px 8px;
  vertical-align: top;
  word-break: break-all;
  border: 1px solid #555;
`;

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const Li = styled.li`
  padding: 4px 8px;
`;

interface ProjectDetailsProps {
  project: Project | null;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div className="project-details">
      <div>
        <button>Project has been checked</button>
        {project?.checkedAt && (
          <div style={{ fontSize: '0.9em', color: '#aaa' }}>
            Checked by user ID {project.checkedBy} on{' '}
            {new Date(project.checkedAt as Date).toLocaleDateString()}
          </div>
        )}
      </div>
      {(project?.media?.length ?? 0) > 0 && (
        <div>
          <div style={{ padding: '4px 8px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {project?.media?.map((media) => (
                <img
                  key={media.id}
                  src={media.url}
                  alt={media.title || 'Project'}
                  style={{ height: 280, borderRadius: 4 }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <table
        style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}
      >
        <tbody>
          <tr>
            <LabelTD>City</LabelTD>
            <ValueTD>{project?.location?.city}</ValueTD>
          </tr>
          <tr>
            <LabelTD>Country</LabelTD>
            <ValueTD>{project?.location?.country}</ValueTD>
          </tr>
          <tr>
            <LabelTD>Coordinates</LabelTD>
            <ValueTD>
              {'latitude' in (project?.location?.coordinates ?? {}) &&
              'longitude' in (project?.location?.coordinates ?? {})
                ? `${(project?.location?.coordinates as { latitude: number; longitude: number }).latitude}, ${(project?.location?.coordinates as { latitude: number; longitude: number }).longitude}`
                : 'N/A'}
            </ValueTD>
          </tr>
          <tr>
            <LabelTD>Address</LabelTD>
            <ValueTD>{project?.location?.address}</ValueTD>
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
          <tr>
            <LabelTD>Confidence</LabelTD>
            <ValueTD>{project?.confidenceScore}</ValueTD>
          </tr>
          <tr>
            <LabelTD>Budget</LabelTD>
            <ValueTD>
              {project?.budgetEur
                ? `${project.budgetEur.toLocaleString()} EUR`
                : 'N/A'}
            </ValueTD>
          </tr>
          <tr>
            <LabelTD>Glass Facade</LabelTD>
            <ValueTD>{project?.glassFacade}</ValueTD>
          </tr>
          <tr>
            <LabelTD>Facade Basis</LabelTD>
            <ValueTD>{project?.facadeBasis}</ValueTD>
          </tr>
          {(project?.projectWebsites?.length ?? 0) > 0 && (
            <tr>
              <LabelTD>Websites</LabelTD>
              <ValueTD>
                <Ul>
                  {(project?.projectWebsites as ProjectWebsite[])?.map(
                    (site) => (
                      <Li key={site.id as number | string}>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#4af' }}
                        >
                          {site.url}
                        </a>
                      </Li>
                    )
                  )}
                </Ul>
              </ValueTD>
            </tr>
          )}
          {(project?.developers?.length ?? 0) > 0 && (
            <tr>
              <LabelTD>Developers</LabelTD>
              <ValueTD>
                <Ul>
                  {project?.developers?.map((dev) => (
                    <div
                      style={{ border: '1px solid #555' }}
                      key={dev.id || dev.name}
                    >
                      <Li>
                        <strong>{dev.name}</strong>
                      </Li>
                      <Li>
                        Website:{' '}
                        <a
                          href={dev.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {dev.website}
                        </a>
                      </Li>
                      <Li>
                        Email:{' '}
                        <a href={`mailto:${dev.contact?.email}`}>
                          {dev.contact?.email}
                        </a>
                      </Li>
                      <Li>
                        Phone:{' '}
                        <a href={`tel:${dev.contact?.phone}`}>
                          {dev.contact?.phone}
                        </a>
                      </Li>
                    </div>
                  ))}
                </Ul>
              </ValueTD>
            </tr>
          )}
          {(project?.architects?.length ?? 0) > 0 && (
            <tr>
              <LabelTD>Architects</LabelTD>
              <ValueTD>
                <Ul>
                  {project?.architects?.map((arch) => (
                    <div
                      key={arch.id || arch.name}
                      style={{ border: '1px solid #555' }}
                    >
                      <Li>
                        <strong>{arch.name}</strong>
                      </Li>
                      <Li>
                        Website:{' '}
                        <a
                          href={arch.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {arch.website}
                        </a>
                      </Li>
                      <Li>
                        Email:{' '}
                        <a href={`mailto:${arch.contact?.email}`}>
                          {arch.contact?.email}
                        </a>
                      </Li>
                      <Li>
                        Phone:{' '}
                        <a href={`tel:${arch.contact?.phone}`}>
                          {arch.contact?.phone}
                        </a>
                      </Li>
                    </div>
                  ))}
                </Ul>
              </ValueTD>
            </tr>
          )}
          {(project?.consultants?.length ?? 0) > 0 && (
            <tr>
              <LabelTD>Consultants</LabelTD>
              <ValueTD>
                <Ul>
                  {(project?.consultants as Consultant[])
                    .filter((c) => c.name)
                    .map((consultant) => (
                      <Li key={consultant.id || consultant.name}>
                        <div>
                          <strong>{consultant.name}</strong>
                        </div>
                        {consultant.email && (
                          <div>
                            Email:{' '}
                            <a
                              href={`mailto:${consultant.contact?.email}`}
                              style={{ color: '#4af' }}
                            >
                              {consultant.contact?.email}
                            </a>
                          </div>
                        )}
                        {consultant.phone && (
                          <div>
                            Phone:{' '}
                            <a
                              href={`tel:${consultant.contact?.phone}`}
                              style={{ color: '#4af' }}
                            >
                              {consultant.contact?.phone}
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
                      </Li>
                    ))}
                </Ul>
              </ValueTD>
            </tr>
          )}
          {(project?.contractors?.length ?? 0) > 0 && (
            <tr>
              <LabelTD>Contractors</LabelTD>
              <ValueTD>
                <Ul>
                  {(project?.contractors as Contractor[])
                    .filter((c) => c.name)
                    .map((contractor) => (
                      <Li key={contractor.id || contractor.name}>
                        <div>
                          <strong>{contractor.name}</strong>
                        </div>
                        {contractor.email && (
                          <div>
                            Email:{' '}
                            <a
                              href={`mailto:${contractor.contact?.email}`}
                              style={{ color: '#4af' }}
                            >
                              {contractor.contact?.email}
                            </a>
                          </div>
                        )}
                        {contractor.phone && (
                          <div>
                            Phone:{' '}
                            <a
                              href={`tel:${contractor.contact?.phone}`}
                              style={{ color: '#4af' }}
                            >
                              {contractor.contact?.phone}
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
                      </Li>
                    ))}
                </Ul>
              </ValueTD>
            </tr>
          )}
          {(project?.sources?.length ?? 0) > 0 && (
            <tr>
              <LabelTD>Sources</LabelTD>
              <ValueTD>
                <Ul>
                  {project?.sources?.map((link) => (
                    <Li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4af' }}
                      >
                        {link.publisher}
                      </a>
                    </Li>
                  ))}
                </Ul>
              </ValueTD>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDetails;
