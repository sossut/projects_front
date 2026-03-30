import React from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useProjects } from '../hooks/ApiHooks';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import ProjectInfoModal from './ProjectInfoModal';
import type { Project } from '../interfaces/Project';

const defaultMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapDiv: React.FC = () => {
  const { projects, getProjectsCoordinates, getProjectFormatted } =
    useProjects();
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  React.useEffect(() => {
    getProjectsCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const openModalForProject = async (projectId: number) => {
    const p = await getProjectFormatted(projectId);
    setSelectedProject(p);
  };
  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <MapContainer
        center={[30, -0.09]}
        zoom={3}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects &&
          projects.map((project) => (
            <Marker
              key={project.id}
              icon={defaultMarkerIcon}
              position={[
                project.location?.latitude || 0,
                project.location?.longitude || 0
              ]}
            >
              <Popup>
                <strong>
                  {project.name ? project.name : 'Unnamed Project'}
                </strong>
                <br />
                <button
                  onClick={() => openModalForProject(project.id as number)}
                  style={{
                    marginTop: '5px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      {selectedProject && (
        <ProjectInfoModal
          selectedProject={selectedProject}
          onClose={() => setSelectedProject(null)}
          onProjectUpdate={() => {}}
        />
      )}
    </div>
  );
};

export default MapDiv;
