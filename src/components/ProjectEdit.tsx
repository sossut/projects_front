import React, { useEffect } from 'react';
import { useProjects } from '../hooks/ApiHooks';
import { useBuildingUses } from '../hooks/ApiHooks';
import type { Project } from '../interfaces/Project';

import styled from 'styled-components';
import type { BuildingUse } from '../interfaces/BuildingUse';

const EditContainer = styled.div`
  padding: 20px;
`;

interface ProjectEditProps {
  project: Project;
  onClose: () => void;
}

const ProjectEdit: React.FC<ProjectEditProps> = ({ project, onClose }) => {
  const { buildingUses, getBuildingUses } = useBuildingUses();
  const { updateProject } = useProjects();
  const [formData, setFormData] = React.useState<Project>(project);
  useEffect(() => {
    getBuildingUses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Supports nested fields using dot notation (e.g., location.address)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updated: any = { ...prev };
        let obj = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] = { ...obj[keys[i]] };
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProject(project.id as number, formData);
    onClose();
  };

  return (
    <EditContainer>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <h3>Address</h3>
          <div>
            <label>Country:</label>
            <input
              type="text"
              name="address.country.name"
              value={formData.address?.country?.name || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Metropolitan Area:</label>
            <input
              type="text"
              name="address.metroArea.name"
              value={formData.address?.metroArea?.name || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              name="address.city.name"
              value={formData.address?.city?.name || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address.address"
              value={formData.address?.address || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Postcode:</label>
            <input
              type="text"
              name="address.postcode"
              value={formData.address?.postcode || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <h4>Location Coordinates</h4>
          <div>
            <label>Latitude:</label>
            <input
              type="text"
              name="address.location.coordinates.latitude"
              value={
                (formData.address?.location &&
                'latitude' in formData.address.location
                  ? (formData.address.location as { latitude: number }).latitude
                  : '') || ''
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Longitude:</label>
            <input
              type="text"
              name="address.location.coordinates.longitude"
              value={
                (formData.address?.location &&
                'longitude' in formData.address.location
                  ? (formData.address.location as { longitude: number })
                      .longitude
                  : '') || ''
              }
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label>Budget €:</label>
          <input
            type="number"
            name="budgetEur"
            value={formData.budgetEur || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Building Height Meters:</label>
          <input
            type="number"
            name="buildingHeightMeters"
            value={formData.buildingHeightMeters || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Building Height Floors:</label>
          <input
            type="number"
            name="buildingHeightFloors"
            value={formData.buildingHeightFloors || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Building Type:</label>
          <select
            name="buildingTypeId"
            value={(formData.buildingTypeId as number) || ''}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="2">Skyscraper</option>
            <option value="1">High-rise</option>
            <option value="3">Major civic or commercial building</option>
            <option value="4">Industrial building</option>
          </select>
        </div>
        <div>
          <label>Building Uses:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              name="buildingUsesSelect"
              value=""
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                const selectedUse = (
                  buildingUses as unknown as BuildingUse[]
                ).find((use) => use.buildingUse === value);
                if (!selectedUse) return;
                setFormData((prev) => ({
                  ...prev,
                  buildingUses: Array.isArray(prev.buildingUses)
                    ? [...(prev.buildingUses as BuildingUse[]), selectedUse]
                    : [selectedUse]
                }));
              }}
            >
              <option value="">Add use...</option>
              {(buildingUses as unknown as BuildingUse[]).map((use) => (
                <option key={use.id} value={use.buildingUse}>
                  {use.buildingUse}
                </option>
              ))}
              {/* Add more options as needed */}
            </select>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {Array.isArray(formData.buildingUses) &&
              formData.buildingUses.map((use, idx) => (
                <li
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <input
                    type="text"
                    value={
                      typeof use === 'object' && use !== null
                        ? use.buildingUse
                        : use
                    }
                    onChange={(e) => {
                      const newUses = [
                        ...((formData.buildingUses ?? []) as BuildingUse[])
                      ];
                      if (typeof use === 'object' && use !== null) {
                        newUses[idx] = { ...use, buildingUse: e.target.value };
                      }
                      setFormData((prev) => ({
                        ...prev,
                        buildingUses: newUses as BuildingUse[]
                      }));
                    }}
                    style={{ marginRight: 4 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        buildingUses: (
                          prev.buildingUses as BuildingUse[] | undefined
                        )?.filter((_, i) => i !== idx) as
                          | BuildingUse[]
                          | undefined
                      }));
                    }}
                    style={{ color: 'red' }}
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <label>Confidence Score:</label>
          <input
            type="number"
            name="confidenceScore"
            value={formData.confidenceScore || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Consultants:</label>
          {/* <input
            type="date"
            name="endDate"
            value={formData.consultants ? JSON.stringify(formData.consultants) : ''}
            onChange={handleChange}
          /> */}
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </EditContainer>
  );
};

export default ProjectEdit;
