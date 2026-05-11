import React, { useEffect } from 'react';

import { useProjects } from '../hooks/ApiHooks';
import type { Project } from '../interfaces/Project';

interface ProjectViewJsonProps {
  id: number;
}

const ProjectViewJson: React.FC<ProjectViewJsonProps> = ({ id }) => {
  const { getProjectFormatted } = useProjects();
  const [copied, setCopied] = React.useState(false);
  const [formattedProject, setFormattedProject] =
    React.useState<Project | null>(null);

  const instructions = `\n\n---\nInstructions:\n1. Enrich and find more data for this json 
  \n2. Review all fields for accuracy.\n3. Dont make up new fields.\n
  4. Media  urls should be direct links to media files, not source pages, ending with .jpg .webp, .png \n
  5.  Try to find the date for the media and add it as mediaDate. Meaning when the image was taken.\n
  6. Here is the json schema with enum fields:\n
  7. try to find contact information for the operators (architects, consults, developers, constructors), if not found, leave empty string. Do NOT fabricate or guess contact details. Only one email or phone number per entity, and only if clearly linked to the project in a credible source. \n
  
    {
      "id": "",
      "name": "",
      "buildingType": "Skyscraper | High-rise | Major civic or commercial building | Industrial building",
      "buildingUses": [
        {buildingUse: "office | residential | mixed-use | hotel | hospital | education | retail | cultural | industrial | logistics | data_center | transport_station | airport | sports_stadium | other"}
        
      ],
      "buildingHeightMeters": null,
      "buildingHeightFloors": null,
      "glassFacade": "yes | no | null",
      "facadeBasis": "renderings | construction_photos | architectural_specs | mixed | unknown",
      "budgetEur": null,
      "location": {
        "city": "",
        "address": "",
        "metroArea": "",
        "country": "",
        "continent": "",
        "postcode": "",
        "coordinates": {
          "latitude": null,
          "longitude": null
        }
      },
      "projectWebsites": [],
      "status": "planned | approved | proposed | under_construction | on_hold | pre_construction | completed",
      "expectedCompletionWindow": {
        "expected": "",
        "earliest": "",
        "latest": "",
        "sourceBasis": "developer | contractor | planning | database | media | inferred"
      },
      "developers": [
        {
          "name": "",
          "website": "",
          "contact": { "email": "", "phone": "" },
          "source": ""
        }
      ],
      "architects": [
        {
          "name": "",
          "website": "",
          "contact": { "email": "", "phone": "" },
          "source": ""
        }
      ],
      "contractors": [
        {
          "name": "",
          "website": "",
          "contact": { "email": "", "phone": "" },
          "source": ""
        }
      ],
       "consultants": [
        {
          "name": "",
          "website": "",
          "contact": { "email": "", "phone": "" },
          "source": ""
        }
      ],
      "media": [
        {
          "title": "",
          "url": "",
          "sourcePage": "",
          "mediaType": "",
          "mediaDate": "YYYY-MM-DD",
        }
      ],
      "sources": [
        {
          "url": "",
          "sourceType": "developer | architect | planning | database | media | other",
          "publisher": "",
          "accessedAt": "YYYY-MM-DD"
        }
      ],
      "lastVerifiedDate": "YYYY-MM-DD",
      "confidenceScore": "Low | Medium | High"
    }
  

  `;
  const handleCopy = () => {
    const text = instructions + JSON.stringify(formattedProject, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  useEffect(() => {
    (async () => {
      const data = await getProjectFormatted(id);
      setFormattedProject(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div>
      <button onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy JSON & Instructions'}
      </button>

      <h2>Project JSON</h2>
      <strong>Instructions:</strong>
      <ol>
        <li>Paste this JSON into your target system.</li>
        <li>Review all fields for accuracy.</li>
        <li>Contact support if you encounter issues.</li>
      </ol>
      <pre>{JSON.stringify(formattedProject, null, 2)}</pre>
      <div style={{ marginTop: 16, color: '#555', fontSize: 14 }}></div>
    </div>
  );
};

export default ProjectViewJson;
