import React, { useEffect } from 'react';
import { useProjects } from '../hooks/ApiHooks';
import type { Project } from '../interfaces/Project';

import styled from 'styled-components';

import ProjectDetails from './ProjectDetails';
import ProjectEdit from './ProjectEdit';
import ProjectModalOptionsMenu from './ProjectModalOptionsMenu';
import ProjectViewJson from './ProjectViewJson';
import type { MetroArea } from '../interfaces/MetroArea';

interface ProjectInfoModalProps {
  id: number;
  onClose: () => void;
  metroAreas?: MetroArea[] | [];
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

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  id,
  onClose,
  metroAreas
}) => {
  const { getProject } = useProjects();
  const [project, setProject] = React.useState<Project | null>(null);
  const [view, setView] = React.useState<'details' | 'edit' | 'json'>(
    'details'
  );
  const [showOptions, setShowOptions] = React.useState(false);
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
            <button
              onClick={() => setShowOptions((prev) => !prev)}
              style={{
                padding: 1,

                background: 'black',
                color: '#fff'
              }}
            >
              Options
            </button>
            {showOptions && (
              <ProjectModalOptionsMenu
                onEdit={() => setView('edit')}
                onDetails={() => setView('details')}
                onViewJson={() => setView('json')}
                onClose={() => setShowOptions(false)}
              />
            )}
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
              <span
                style={{
                  transform: 'translate(0, -3px)'
                }}
              >
                &times;
              </span>
            </button>
          </div>
          {view === 'details' && <ProjectDetails project={project} />}
          {view === 'edit' && project && (
            <ProjectEdit
              project={project}
              onClose={onClose}
              metroAreas={metroAreas}
            />
          )}
          {view === 'json' && <ProjectViewJson id={project?.id || 0} />}
        </ModalContent>
      </Modal>
    </ModalBackground>
  );
};

export default ProjectInfoModal;
