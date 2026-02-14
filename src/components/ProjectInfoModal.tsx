import React, { useEffect } from 'react';
import { useProjects } from '../hooks/ApiHooks';
import type { Project } from '../interfaces/Project';

interface ProjectInfoModalProps {
  id: number;
  onClose: () => void;
}

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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#000000',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '80%',
          maxHeight: '80%',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{project?.name}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {project?.projectMedias?.map((media) => (
            <img
              key={media.id}
              src={media.url}
              alt="Project"
              style={{ height: 100, marginRight: 10, marginBottom: 10 }}
            />
          ))}
        </div>
        <table>
          <tbody>
            <tr>
              <td>Country</td>
              <td>{project?.address?.country?.name}</td>
            </tr>
            <tr>
              <td>City</td>
              <td>{project?.address?.city?.name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectInfoModal;
