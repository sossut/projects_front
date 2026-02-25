import React, { useEffect } from 'react';
import { useProjects } from '../hooks/ApiHooks';
import { useBuildingUses } from '../hooks/ApiHooks';
import type { Project } from '../interfaces/Project';

import styled from 'styled-components';
import type { BuildingUse } from '../interfaces/BuildingUse';
import DropdownCheckbox from './DropdownCheckbox';
import type { Consultant } from '../interfaces/Consultant';
import ContactEditModal from './ContactEditModal';
import type { MetroArea } from '../interfaces/MetroArea';
import type { ProjectWebsite } from '../interfaces/ProjectWebsite';

const EditContainer = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  input,
  select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

interface ProjectEditProps {
  project: Project;
  onClose: () => void;
  metroAreas?: MetroArea[] | [];
  onProjectUpdate: (updatedProject: Project) => void;
}

const ProjectEdit: React.FC<ProjectEditProps> = ({
  project,
  onClose,
  metroAreas,
  onProjectUpdate
}) => {
  const { buildingUses, getBuildingUses } = useBuildingUses();
  const { updateProject, getProjectSimpleById } = useProjects();
  const [formData, setFormData] = React.useState<Project>({
    ...project,
    consultants: (project.consultants || []).filter(
      (c) => c && c.name // Ensure we only include valid consultants
    ) as Consultant[],
    architects: (project.architects || []).filter(
      (a) => a && a.name // Ensure we only include valid architects
    ) as Consultant[],
    contractors: (project.contractors || []).filter(
      (c) => c && c.name // Ensure we only include valid contractors
    ) as Consultant[],
    developers: (project.developers || []).filter(
      (d) => d && d.name // Ensure we only include valid developers
    ) as Consultant[],
    media: (project.media || []).filter(
      (m) => m && m.url // Ensure we only include valid media entries
    ),
    projectWebsites: (project.projectWebsites || []).filter(
      (w): w is ProjectWebsite =>
        typeof w === 'object' &&
        w !== null &&
        'url' in w &&
        typeof w.url === 'string'
    ) as ProjectWebsite[]
  });
  const [removals, setRemovals] = React.useState<Record<string, number[]>>({});
  const [isConctactModalOpen, setIsContactModalOpen] = React.useState(false);
  const [editingOperator, setEditingOperator] = React.useState<{
    type: 'consultant' | 'architect' | 'contractor' | 'developer';
    index: number;
  } | null>(null);
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

  const addToRemovals = (field: string, id: number) => {
    setRemovals((prev) => ({
      ...prev,
      [field]: [...(prev[field] ?? []), id]
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    const dataToSubmit = {
      ...formData,
      removals
    };
    const updatedProject = await updateProject(
      project.id as number,
      localStorage.getItem('token') || '',
      dataToSubmit
    );
    const projectSimple = await getProjectSimpleById(
      updatedProject.id as number
    );
    onProjectUpdate(projectSimple);
    onClose();
  };
  React.useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <EditContainer>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Media</label>
          {Array.isArray(formData.media) && formData.media.length > 0 ? (
            formData.media.map((media, idx) => (
              <div
                key={media.id ?? idx}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <img
                  src={media.url}
                  alt={media.title || 'Project Media'}
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                <input
                  type="text"
                  value={media.url || ''}
                  onChange={(e) => {
                    const newMedias = [...(formData.media || [])];
                    newMedias[idx] = { ...media, url: e.target.value };
                    setFormData((prev) => ({
                      ...prev,
                      media: newMedias
                    }));
                  }}
                  placeholder="Media URL"
                />
                <input
                  type="text"
                  value={media.title || ''}
                  onChange={(e) => {
                    const newMedias = [...(formData.media || [])];
                    newMedias[idx] = { ...media, title: e.target.value };
                    setFormData((prev) => ({
                      ...prev,
                      media: newMedias
                    }));
                  }}
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={media.mediaType || ''}
                  onChange={(e) => {
                    const newMedias = [...(formData.media || [])];
                    newMedias[idx] = { ...media, mediaType: e.target.value };
                    setFormData((prev) => ({
                      ...prev,
                      media: newMedias
                    }));
                  }}
                  placeholder="Media Type"
                />
                <input
                  type="text"
                  value={media.filename || ''}
                  onChange={(e) => {
                    const newMedias = [...(formData.media || [])];
                    newMedias[idx] = { ...media, filename: e.target.value };
                    setFormData((prev) => ({
                      ...prev,
                      media: newMedias
                    }));
                  }}
                  placeholder="Filename"
                />
                <input
                  type="text"
                  value={media.sourcePage || ''}
                  onChange={(e) => {
                    const newMedias = [...(formData.media || [])];
                    newMedias[idx] = { ...media, sourcePage: e.target.value };
                    setFormData((prev) => ({
                      ...prev,
                      media: newMedias
                    }));
                  }}
                  placeholder="Source Page"
                />
                <button
                  type="button"
                  style={{ color: 'red' }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      media: prev.media?.filter((_, i) => i !== idx) || []
                    }));
                    if (media.id) {
                      addToRemovals('media', media.id);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No media</p>
          )}
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                media: [
                  ...(prev.media || []),
                  {
                    url: '',
                    title: '',
                    mediaType: '',
                    filename: '',
                    sourcePage: '',
                    projectId: project.id as number // <-- add this line
                  }
                ]
              }));
            }}
          >
            Add Media
          </button>
        </FormGroup>
        <FormGroup>
          <h3>Address</h3>
          <div>
            <label>Country:</label>
            <input
              type="text"
              name="location.country"
              value={formData.location?.country || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Metropolitan Area:</label>
            <select
              name="location.metroArea"
              value={formData.location?.metroArea || ''}
              onChange={handleChange}
            >
              <option value="">Select Metro Area</option>
              {Array.isArray(metroAreas) &&
                metroAreas.map((metro) => (
                  <option key={metro.id} value={metro.id}>
                    {metro.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              name="location.city"
              value={formData.location?.city || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="location.address"
              value={formData.location?.address || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Postcode:</label>
            <input
              type="text"
              name="location.postcode"
              value={formData.location?.postcode || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Latitude:</label>
            <input
              type="text"
              name="location.coordinates.latitude"
              value={
                (formData.location?.coordinates &&
                'latitude' in formData.location.coordinates
                  ? (formData.location.coordinates as { latitude: number })
                      .latitude
                  : '') || ''
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Longitude:</label>
            <input
              type="text"
              name="location.coordinates.longitude"
              value={
                (formData.location?.coordinates &&
                'longitude' in formData.location.coordinates
                  ? (formData.location.coordinates as { longitude: number })
                      .longitude
                  : '') || ''
              }
              onChange={handleChange}
            />
          </div>
        </FormGroup>
        <FormGroup>
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
        </FormGroup>
        <FormGroup>
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
            <div style={{ marginBottom: 8 }}>
              <DropdownCheckbox
                label="Add Building Uses"
                options={
                  Array.isArray(buildingUses)
                    ? (buildingUses as unknown as BuildingUse[]).map((bu) =>
                        typeof bu === 'object' && bu !== null
                          ? bu.buildingUse
                          : String(bu)
                      )
                    : []
                }
                selected={
                  Array.isArray(formData.buildingUses)
                    ? (formData.buildingUses as BuildingUse[]).map((bu) =>
                        typeof bu === 'object' && bu !== null
                          ? bu.buildingUse
                          : String(bu)
                      )
                    : []
                }
                onChange={(selected) => {
                  setFormData((prev) => ({
                    ...prev,
                    buildingUses: Array.isArray(buildingUses)
                      ? (buildingUses as unknown as BuildingUse[]).filter(
                          (bu) =>
                            selected.includes(
                              typeof bu === 'object' && bu !== null
                                ? bu.buildingUse
                                : String(bu)
                            )
                        )
                      : []
                  }));
                }}
              />
            </div>
            {Array.isArray(formData.buildingUses) &&
            formData.buildingUses.length > 0 ? (
              formData.buildingUses.map((use, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: 0,
                    gap: 8
                  }}
                >
                  <p style={{ margin: 0 }}>
                    {typeof use === 'object' && use !== null
                      ? use.buildingUse
                      : use}
                  </p>
                  <button
                    type="button"
                    style={{ color: 'red', marginLeft: 4 }}
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
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p style={{ margin: 0, color: '#888' }}>No building uses</p>
            )}
          </div>
        </FormGroup>
        <FormGroup>
          <label>Confidence Score:</label>
          <select
            name="confidenceScore"
            value={formData.confidenceScore || ''}
            onChange={handleChange}
          >
            <option value="">Select Confidence Score</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </FormGroup>
        <FormGroup>
          <label>Consultants:</label>
          {Array.isArray(formData.consultants) &&
          formData.consultants.length > 0 ? (
            (formData.consultants || []).map((consultant, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {' '}
                {}
                <p style={{ margin: 0 }}>{consultant.name}</p>
                <button
                  type="button"
                  style={{ color: 'blue' }}
                  onClick={() => {
                    setEditingOperator({
                      type: 'consultant',
                      index: idx
                    });
                    setIsContactModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  style={{ color: 'red' }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      consultants: (prev.consultants as Consultant[]).filter(
                        (_, i) => i !== idx
                      )
                    }));
                    if (consultant.id) {
                      addToRemovals('consultants', consultant.id);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No consultants</p>
          )}
          <button
            type="button"
            onClick={() => {
              setEditingOperator({
                type: 'consultant',
                index: -1
              });
              setIsContactModalOpen(true);
            }}
          >
            Add Consultant
          </button>
        </FormGroup>
        <FormGroup>
          <label>Architects:</label>
          {Array.isArray(formData.architects) &&
          formData.architects.length > 0 ? (
            (formData.architects || []).map((architect, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <p style={{ margin: 0 }}>{architect.name}</p>
                <button
                  type="button"
                  style={{ color: 'blue' }}
                  onClick={() => {
                    setEditingOperator({
                      type: 'architect',
                      index: idx
                    });
                    setIsContactModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  style={{ color: 'red' }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      architects: (prev.architects as Consultant[]).filter(
                        (_, i) => i !== idx
                      )
                    }));
                    if (architect.id) {
                      addToRemovals('architects', architect.id);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No architects</p>
          )}
          <button
            type="button"
            onClick={() => {
              setEditingOperator({
                type: 'architect',
                index: -1
              });
              setIsContactModalOpen(true);
            }}
          >
            Add Architect
          </button>
        </FormGroup>
        <FormGroup>
          <label>Contractors:</label>
          {Array.isArray(formData.contractors) &&
          formData.contractors.length > 0 ? (
            (formData.contractors || []).map((contractor, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <p style={{ margin: 0 }}>{contractor.name}</p>
                <button
                  type="button"
                  style={{ color: 'blue' }}
                  onClick={() => {
                    setEditingOperator({
                      type: 'contractor',
                      index: idx
                    });
                    setIsContactModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  style={{ color: 'red' }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      contractors: (prev.contractors as Consultant[]).filter(
                        (_, i) => i !== idx
                      )
                    }));
                    if (contractor.id) {
                      addToRemovals('contractors', contractor.id);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No contractors</p>
          )}
          <button
            type="button"
            onClick={() => {
              setEditingOperator({
                type: 'contractor',
                index: -1
              });
              setIsContactModalOpen(true);
            }}
          >
            Add Contractor
          </button>
        </FormGroup>
        <FormGroup>
          <label>Developers:</label>
          {Array.isArray(formData.developers) &&
          formData.developers.length > 0 ? (
            (formData.developers || []).map((developer, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <p style={{ margin: 0 }}>{developer.name}</p>
                <button
                  type="button"
                  style={{ color: 'blue' }}
                  onClick={() => {
                    setEditingOperator({
                      type: 'developer',
                      index: idx
                    });
                    setIsContactModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  style={{ color: 'red' }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      developers: (prev.developers as Consultant[]).filter(
                        (_, i) => i !== idx
                      )
                    }));
                    if (developer.id) {
                      addToRemovals('developers', developer.id);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No developers</p>
          )}
          <button
            type="button"
            onClick={() => {
              setEditingOperator({
                type: 'developer',
                index: -1
              });
              setIsContactModalOpen(true);
            }}
          >
            Add Developer
          </button>
        </FormGroup>

        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
      {isConctactModalOpen && editingOperator && (
        <ContactEditModal
          type={editingOperator.type}
          onClose={() => {
            setIsContactModalOpen(false);
            setEditingOperator(null);
          }}
          initialValues={(() => {
            const item =
              formData[
                (editingOperator.type + 's') as
                  | 'consultants'
                  | 'architects'
                  | 'contractors'
                  | 'developers'
              ]?.[editingOperator.index];
            return {
              name: item?.name || '',
              email: item?.email || '',
              phone: item?.phone || '',
              website: item?.website || ''
            };
          })()}
          open={isConctactModalOpen}
          onSave={(data) => {
            setFormData((prev) => {
              // Helper to map type to property key
              const key = (editingOperator.type + 's') as
                | 'consultants'
                | 'architects'
                | 'contractors'
                | 'developers';
              return {
                ...prev,
                [key]: [...(prev[key] as Consultant[]), data]
              };
            });
          }}
          onCloseWithoutSaving={() => {
            setIsContactModalOpen(false);
            setEditingOperator(null);
          }}
          editMode="add"
        />
      )}
    </EditContainer>
  );
};

export default ProjectEdit;
