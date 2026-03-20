import React from 'react';
import styled from 'styled-components';
import type { Project } from '../interfaces/Project';
import type { BuildingUse } from '../interfaces/BuildingUse';
import type { ProjectWebsite } from '../interfaces/ProjectWebsite';
import type { Consultant } from '../interfaces/Consultant';
import type { Contractor } from '../interfaces/Contractor';
import { useProjects } from '../hooks/ApiHooks';
import unFavoritedIcon from '../assets/star.png';

import favoritedIcon from '../assets/star-symbol-icon.png';

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
  onProjectUpdate?: (updatedProject: Project) => void;
  userId?: number;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onProjectUpdate,
  userId
}) => {
  const { postProjectFavorite, deleteProjectFavorite, updateProject } =
    useProjects();
  const storedUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const username = storedUser?.user?.username || storedUser?.username || '';
  const isFavoritedByCurrentUser = React.useMemo(() => {
    if (typeof project?.favorited === 'boolean') {
      return project.favorited;
    }

    if (!userId || !project?.favoritedByUsers?.length) {
      return false;
    }

    return project.favoritedByUsers.some(
      (favoritedUser) =>
        favoritedUser.id !== null && Number(favoritedUser.id) === Number(userId)
    );
  }, [project?.favorited, project?.favoritedByUsers, userId]);
  const [checkedAt, setCheckedAt] = React.useState<string | Date | null>(
    project?.checkedAt ?? null
  );
  const [favorited, setFavorited] = React.useState(isFavoritedByCurrentUser);
  const [checkedByUsername, setCheckedByUsername] = React.useState(
    project?.checkedByUsername || ''
  );

  React.useEffect(() => {
    setFavorited(isFavoritedByCurrentUser);
  }, [isFavoritedByCurrentUser]);

  React.useEffect(() => {
    setCheckedAt(project?.checkedAt ?? null);
    setCheckedByUsername(project?.checkedByUsername || '');
  }, [project?.checkedAt, project?.checkedByUsername]);

  React.useEffect(() => {
    console.log(isFavoritedByCurrentUser);
  }, [isFavoritedByCurrentUser]);
  const handleFavorite = async () => {
    if (!project?.id || !userId) return;

    await postProjectFavorite(project.id);
    setFavorited(true);
    onProjectUpdate?.({
      ...project,
      favorited: true,
      favoritedByUsers: [
        ...(project.favoritedByUsers?.filter(
          (favoritedUser) =>
            favoritedUser.id !== null &&
            Number(favoritedUser.id) !== Number(userId)
        ) || []),
        { id: userId, username: username }
      ]
    });
  };

  const handleUnfavorite = async () => {
    if (!project?.id || !userId) return;

    await deleteProjectFavorite(project.id);
    setFavorited(false);
    onProjectUpdate?.({
      ...project,
      favorited: false,
      favoritedByUsers:
        project.favoritedByUsers?.filter(
          (favoritedUser) =>
            favoritedUser.id !== null &&
            Number(favoritedUser.id) !== Number(userId)
        ) || []
    });
  };

  const handleCheck = async () => {
    if (!project?.id || !userId) return;
    await updateProject(project.id, { checkedBy: userId });
    onProjectUpdate?.({
      id: project.id,
      name: project.name,
      checkedBy: userId,
      checkedAt: new Date(),
      checkedByUsername: username
    } as Project);
    setCheckedAt(new Date());
    setCheckedByUsername(username);
  };

  const handleUncheck = async () => {
    if (!project?.id || !userId) return;
    await updateProject(project.id, { checkedBy: null });
    onProjectUpdate?.({
      id: project.id,
      name: project.name,
      checkedBy: null,
      checkedAt: null,
      checkedByUsername: ''
    } as Project);
    setCheckedAt(null);
    setCheckedByUsername('');
  };

  return (
    <div className="project-details">
      <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
        {(checkedAt && (
          <div>
            <div>Project has been checked</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to mark this project as checked again?'
                    )
                  ) {
                    handleCheck();
                  }
                }}
              >
                Check again
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to uncheck this project?'
                    )
                  ) {
                    handleUncheck();
                  }
                }}
              >
                Uncheck
              </button>
            </div>

            <div style={{ fontSize: '0.9em', color: '#aaa' }}>
              Checked by user: {checkedByUsername} on{' '}
              {new Date(checkedAt).toLocaleDateString()}
            </div>
          </div>
        )) || (
          <div>
            <div style={{ color: '#f44' }}>Project has not been checked</div>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to mark this project as checked?'
                  )
                ) {
                  handleCheck();
                }
              }}
            >
              Mark as Checked
            </button>
          </div>
        )}
        {favorited ? (
          <div>
            <div>Project is favorited</div>
            <button onClick={handleUnfavorite}>
              <img height={'64px'} src={favoritedIcon} alt="Favorited" />
            </button>
            <div style={{ fontSize: '0.9em', color: '#aaa' }}>
              Favorited by:{' '}
              {project?.favoritedByUsers
                ?.filter((u) => u.id !== null && u.username)
                .map((u) => u.username)
                .join(', ') || 'unknown'}
            </div>
          </div>
        ) : (
          <div>
            <div>Project is not favorited</div>
            <button onClick={handleFavorite}>
              <img height={'64px'} src={unFavoritedIcon} alt="Not Favorited" />
            </button>
          </div>
        )}
      </div>
      {(project?.media?.length ?? 0) > 0 && (
        <div>
          <div style={{ padding: '4px 8px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {project?.media?.map((media) => (
                <div
                  key={media.id}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: 4
                  }}
                >
                  {media.mediaDate && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        padding: '2px 4px',
                        borderRadius: 4
                      }}
                    >
                      {new Date(media.mediaDate).toLocaleDateString()}
                    </div>
                  )}
                  <img
                    key={media.id}
                    src={media.url}
                    alt={media.title || 'Project'}
                    style={{ height: 280, borderRadius: 4 }}
                  />
                </div>
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
                        {consultant.contact?.email && (
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
                        {consultant.contact?.phone && (
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
                        {contractor.contact?.email && (
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
                        {contractor.contact?.phone && (
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
