import React from 'react';
import type { Project } from '../interfaces/Project';

import styled from 'styled-components';

import ProjectDetails from './ProjectDetails';
import ProjectEdit from './ProjectEdit';
import ProjectModalOptionsMenu from './ProjectModalOptionsMenu';
import ProjectViewJson from './ProjectViewJson';
import EnrichmentConfirmationModal from './EnrichmentConfirmationModal';
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

const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(StyledButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessButton = styled(StyledButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(StyledButton)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CloseButton = styled.button`
  padding: 0;
  margin-right: 10px;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
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
  const [showEnrichmentConfirm, setShowEnrichmentConfirm] =
    React.useState(false);
  const [enrichmentLoading, setEnrichmentLoading] = React.useState(false);
  const { setEnrichingProjectId } = React.useContext(AppContext);
  const {
    startEnrichmentForProject,
    waitForEnrichmentJobTerminalStatus,
    clearEnrichmentInFlight
  } = useEnrichment();
  const { getProjectFormatted } = useProjects();
  const handleOpenEnrichmentModal = () => {
    setShowEnrichmentConfirm(true);
  };

  const handleEnrichmentConfirm = async () => {
    const projectId = selectedProject?.id || 0;

    setEnrichmentLoading(true);
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
        setShowEnrichmentConfirm(false);
        setEnrichingProjectId(null);
        return;
      }

      setShowEnrichmentConfirm(false);

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
      setEnrichmentLoading(false);
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
            <PrimaryButton onClick={handleCopyEmail}>
              {copied ? 'Email Copied!' : 'Copy Email'}
            </PrimaryButton>
            <SuccessButton onClick={handleOpenEnrichmentModal}>
              Start enrichment
            </SuccessButton>
            <SecondaryButton onClick={() => setShowOptions((prev) => !prev)}>
              Options
            </SecondaryButton>
            {showOptions && (
              <ProjectModalOptionsMenu
                onEdit={() => setView('edit')}
                onDetails={() => setView('details')}
                onViewJson={() => setView('json')}
                onClose={() => setShowOptions(false)}
              />
            )}
            <CloseButton onClick={onClose} aria-label="Close">
              <span
                style={{
                  transform: 'translate(0, -3px)'
                }}
              >
                &times;
              </span>
            </CloseButton>
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
      {showEnrichmentConfirm && selectedProject && (
        <EnrichmentConfirmationModal
          projectName={selectedProject.name || 'Unknown Project'}
          onConfirm={handleEnrichmentConfirm}
          onCancel={() => {
            setShowEnrichmentConfirm(false);
          }}
          isLoading={enrichmentLoading}
        />
      )}
    </ModalBackground>
  );
};

export default ProjectInfoModal;
