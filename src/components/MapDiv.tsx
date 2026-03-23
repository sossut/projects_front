import React from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useProjects } from '../hooks/ApiHooks';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapDiv;
