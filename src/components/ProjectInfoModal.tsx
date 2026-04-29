import React from 'react';
import type { Project } from '../interfaces/Project';

import styled from 'styled-components';

import ProjectDetails from './ProjectDetails';
import ProjectEdit from './ProjectEdit';
import ProjectModalOptionsMenu from './ProjectModalOptionsMenu';
import ProjectViewJson from './ProjectViewJson';
import type { MetroArea } from '../interfaces/MetroArea';
import { useEnrichment, useProjects } from '../hooks/ApiHooks';
import { AppContext } from '../contexts/AppContext';
interface ProjectInfoModalProps {
  selectedProject: Project | null;
  onClose: () => void;
  metroAreas?: MetroArea[] | [];
  onProjectUpdate: (updatedProject: Project) => void;
  userId?: number;
  goPrevious?: () => void;
  goNext?: () => void;
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
  selectedProject,
  onClose,
  metroAreas,
  onProjectUpdate,
  userId,
  goPrevious,
  goNext
}) => {
  const [view, setView] = React.useState<'details' | 'edit' | 'json'>(
    'details'
  );
  const [showOptions, setShowOptions] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { setEnrichingProjectId } = React.useContext(AppContext);
  const {
    startEnrichmentForProject,
    waitForEnrichmentJobTerminalStatus,
    clearEnrichmentInFlight
  } = useEnrichment();
  const { getProjectFormatted } = useProjects();
  const startEnrichment = async () => {
    const projectId = selectedProject?.id || 0;

    if (
      window.confirm(
        `Are you sure you want to start enrichment for ${selectedProject?.name}?`
      )
    ) {
      try {
        setEnrichingProjectId(projectId as number);
        console.log(
          `Starting enrichment for project: ${selectedProject?.name} (ID: ${projectId})`
        );
        const job = await startEnrichmentForProject(projectId);
        console.log('Enrichment job started:', job);
        const jobId =
          (job as { jobId?: number | string; id?: number | string } | undefined)
            ?.jobId ??
          (job as { jobId?: number | string; id?: number | string } | undefined)
            ?.id;

        if (!jobId || !selectedProject?.id) {
          alert('Could not start enrichment: missing job id');
          setEnrichingProjectId(null);
          return;
        }

        alert(
          `Enrichment job started, job ID: ${jobId} for project ${selectedProject?.name}`
        );
        onClose();

        const result = await waitForEnrichmentJobTerminalStatus(
          jobId,
          10000,
          25 * 60 * 1000
        );
        const refreshedProject = await getProjectFormatted(selectedProject.id);
        if (refreshedProject) {
          onProjectUpdate(refreshedProject);
        }

        if (result.status === 'completed') {
          alert(`Enrichment completed for ${selectedProject.name}`);
        } else {
          alert(`Enrichment failed for ${selectedProject.name}`);
        }
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Failed to start enrichment';
        alert(message);
        console.error('Enrichment flow failed:', e);
      } finally {
        if (projectId) {
          clearEnrichmentInFlight(projectId);
          setEnrichingProjectId(null);
        }
      }
    }
  };

  const handleCopyEmail = () => {
    const email = `Hello,
I’m contacting you on behalf of Rostek. Rostek is a facade access solutions company specializing in safe, practical, and reliable access systems for building maintenance and facade operations. 
I am messaging you regarding ${selectedProject?.name} in ${selectedProject?.location?.city}.
We are verifying project information and would appreciate your help in confirming:
• Whether ${selectedProject?.name} project is active, and if yes, what the current status is.
• Who is the right person to contact for more information such as:
  - Timetable
  - Contact information
  - Facade access or maintenance access solutions for the project
I would appreciate your reply and I am looking forward to continuing and starting collaboration with your company.
Best regards,
Mikael Alakari

Rostek
rostek.fi
info@rostek.fi
+358 207 402 560`;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  return (
    <ModalBackground>
      <div>
        <button
          style={{
            position: 'fixed',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1001
          }}
          onClick={goPrevious}
        >
          {'\u2190' /* Left arrow symbol */}
        </button>
        <button
          style={{
            position: 'fixed',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1001
          }}
          onClick={goNext}
        >
          {'\u2192' /* Right arrow symbol */}
        </button>
      </div>
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
            <div>
              <h2
                style={{
                  margin: 0
                }}
              >
                {selectedProject?.name}
              </h2>
              <p>last updated: {selectedProject?.updatedAt?.toString()}</p>
            </div>
            <button
              style={{
                padding: 4,

                background: 'black',
                color: '#fff'
              }}
              onClick={handleCopyEmail}
            >
              {copied ? 'Email Copied!' : 'Copy Email'}
            </button>
            <button
              style={{
                padding: 4,

                background: 'black',
                color: '#fff'
              }}
              onClick={startEnrichment}
            >
              Start enrichment
            </button>
            <button
              onClick={() => setShowOptions((prev) => !prev)}
              style={{
                padding: 4,

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
                marginRight: 10,
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
          {view === 'details' && (
            <ProjectDetails
              project={selectedProject}
              onProjectUpdate={onProjectUpdate}
              userId={userId}
            />
          )}
          {view === 'edit' && selectedProject && (
            <ProjectEdit
              project={selectedProject}
              onClose={onClose}
              metroAreas={metroAreas}
              onProjectUpdate={onProjectUpdate}
            />
          )}
          {view === 'json' && <ProjectViewJson id={selectedProject?.id || 0} />}
        </ModalContent>
      </Modal>
    </ModalBackground>
  );
};

export default ProjectInfoModal;
