import React from 'react';
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import { useProjects } from '../hooks/ApiHooks';
import ProjectInfoModal from './ProjectInfoModal';
import type { Project } from '../interfaces/Project';

const buildingTypeColors: Record<string, string> = {
  skyscraper: '#2563eb',
  'high-rise': '#10b981',
  highrise: '#10b981',
  'major-civic-or-commercial-building': '#f59e0b',
  industrial: '#8b5cf6',
  'industrial-building': '#8b5cf6'
};

const buildingTypeOrder = [
  'Skyscraper',
  'High-rise',
  'Major civic or commercial building',
  'Industrial building'
];

const normalizeBuildingType = (buildingType?: string | null) => {
  return (buildingType || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-');
};

const getBuildingTypeColor = (buildingType?: string | null) => {
  const normalized = normalizeBuildingType(buildingType);
  return buildingTypeColors[normalized] ?? '#64748b';
};

const createBuildingTypeIcon = (buildingType?: string | null) => {
  const color = getBuildingTypeColor(buildingType);

  return L.divIcon({
    className: 'building-type-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background: ${color};
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.35);
      box-sizing: border-box;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
};

const getMarkerSizeForZoom = (zoom: number) => {
  if (zoom <= 2) return 8;
  if (zoom <= 4) return 10;
  if (zoom <= 6) return 12;
  return 16;
};

const createSizedBuildingTypeIcon = (
  buildingType?: string | null,
  size = 16
) => {
  const color = getBuildingTypeColor(buildingType);
  const borderSize = Math.max(1, Math.round(size / 8));

  return L.divIcon({
    className: 'building-type-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 999px;
      background: ${color};
      border: ${borderSize}px solid #ffffff;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.35);
      box-sizing: border-box;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [Math.round(size / 2), Math.round(size / 2)],
    popupAnchor: [0, -Math.round(size / 2)]
  });
};

const BuildingTypeMarkers: React.FC<{
  projects: Project[];
  onProjectClick: (projectId: number) => void;
}> = ({ projects, onProjectClick }) => {
  const map = useMap();
  const [zoom, setZoom] = React.useState(map.getZoom());

  React.useEffect(() => {
    const handleZoomEnd = () => {
      setZoom(map.getZoom());
    };

    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

  const iconSize = React.useMemo(() => getMarkerSizeForZoom(zoom), [zoom]);

  return (
    <>
      {projects.map((project) => (
        <Marker
          key={project.id}
          icon={createSizedBuildingTypeIcon(project.buildingType, iconSize)}
          position={[
            project.location?.latitude || 0,
            project.location?.longitude || 0
          ]}
        >
          <Popup>
            <strong>{project.name ? project.name : 'Unnamed Project'}</strong>
            <br />
            <button
              onClick={() => onProjectClick(project.id as number)}
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
    </>
  );
};

const MapWrap = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
`;

const Legend = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.88);
  color: #ffffff;
  font-size: 0.8rem;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(8px);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;

const LegendSwatch = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
`;

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
    <MapWrap>
      <Legend aria-label="Building type legend">
        {buildingTypeOrder.map((buildingType) => (
          <LegendItem key={buildingType}>
            <LegendSwatch $color={getBuildingTypeColor(buildingType)} />
            <span>{buildingType}</span>
          </LegendItem>
        ))}
      </Legend>
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
        {projects && projects.length > 0 && (
          <BuildingTypeMarkers
            projects={projects}
            onProjectClick={openModalForProject}
          />
        )}
      </MapContainer>
      {selectedProject && (
        <ProjectInfoModal
          selectedProject={selectedProject}
          onClose={() => setSelectedProject(null)}
          onProjectUpdate={() => {}}
        />
      )}
    </MapWrap>
  );
};

export default MapDiv;
