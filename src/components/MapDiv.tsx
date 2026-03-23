import React from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { useProjects } from '../hooks/ApiHooks';

const MapDiv: React.FC = () => {
  const { projects, getProjectsCoordinates } = useProjects();
  React.useEffect(() => {
    getProjectsCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ width: '100%', height: '70vh' }}>
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
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapDiv;
