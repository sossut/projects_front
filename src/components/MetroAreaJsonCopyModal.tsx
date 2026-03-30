import React from 'react';
import { useProjects } from '../hooks/ApiHooks';
interface MetroAreaJsonCopyModalProps {
  metroAreaName: string;
  metroAreaId: number;
  onClose: () => void;
}

const MetroAreaJsonCopyModal: React.FC<MetroAreaJsonCopyModalProps> = ({
  metroAreaName,
  metroAreaId,
  onClose
}) => {
  const [buildingType, setBuildingType] = React.useState('');
  const [buildingTypeId, setBuildingTypeId] = React.useState<number | null>(
    null
  );

  const { projectNames, getProjectNamesByMetroAreaAndBuildingType } =
    useProjects();

  const copyToClipboard = () => {
    const text = `BUILDING PROJECT RESEARCH — JSON-ONLY OUTPUT (STRICT)

                  TASK
                  Conduct comprehensive research using public web sources and reputable construction/real-estate databases to identify ALL projects matching [TYPE] in [LOCATION] that are planned, approved, proposed, under construction, or on hold.

                  Do NOT provide a shortlist — include every single project that fits.
                  Explicitly EXCLUDE projects that are cancelled, shelved, or abandoned.

                  LOCATION SCOPE
                  Metro area — include projects located within the broader metropolitan area (including surrounding municipalities commonly considered part of the metro region).

                  BUILDING TYPE PARAMETER (INPUT)
                  [TYPE] = one or more of:
                  A — Skyscraper (over 150 m)
                  B — High-rise (50–150 m)
                  C — Major civic or commercial building (hospital, university, shopping centers, museums, airports, train stations, police/fire stations, passenger port terminals, etc.)
                  D — Industrial building (manufacturing, data centers, container port terminals, power plants, etc.)

                  BUILDING CATEGORY (OUTPUT — USE ONLY THESE LABELS)
                  Skyscraper
                  High-rise
                  Major civic or commercial building
                  Industrial building

                  BUILDING USE / FUNCTION (OUTPUT)
                  Identify the primary intended use(s), such as:
                  office, residential, mixed-use, hotel, hospital/healthcare, education, retail, cultural, industrial, logistics, other.

                  RESEARCH SOURCES TO USE
                  Use a combination of:
                  1) Public web sources: developer/architect sites, official project sites, planning authority portals, municipal zoning/permit records, press releases, reputable news/industry publications, local planning/permitting sources, local news/local newspapers.
                  2) Wikipedia cross-check ONLY to estimate expected project count via “tallest buildings for [LOCATION]” — but confirm projects via authoritative sources.
                  3) Structured databases (where accessible): Emporis, CTBUH, SkyscraperPage, BCI Central, Dodge Construction Network, BuildZoom, municipal/regional planning databases.

                  INCLUSION / EXCLUSION RULES
                  Include only if status is: planned, approved, proposed, under construction, or on hold.
                  Exclude if explicitly described as: cancelled, shelved, abandoned completed.
                  If status is unclear/conflicting: include ONLY if at least one RECENT, credible source confirms the project is still active.

                  DATA QUALITY RULES (STRICT)
                  - Do NOT speculate or invent projects.
                  - Prioritize the most recent and authoritative sources.
                  - If only height in floors is known, DO NOT convert to meters in JSON (store meters as null, floors as the known value).
                  - If a direct image URL (ending .jpg/.png/.webp) cannot be reliably obtained, set media.url to "" and do NOT place the webpage URL there; instead put the webpage under projectWebsites or sources.
                  - Ensure internal consistency across fields (names, statuses, sources, completion windows, etc.).
                  - try to find contact information for the operators (architects, consults, developers, constructors)

                  OUTPUT FORMAT — ABSOLUTE REQUIREMENTS
                  1) Output MUST be ONLY valid JSON.
                  2) Output MUST be a single JSON object with exactly one top-level key: "projects".
                  3) Do NOT output any tables, markdown, explanations, headings, or commentary.
                  4) Do NOT wrap the JSON in backticks.
                  5) Use the schema below exactly (field names and types).
                  6) Unknown values:
                    - Use null for unknown numeric values and unknown structured values (coordinates, completion dates).
                    - Use "" for unknown text fields.
                    - Use [] for unknown/none lists (projectWebsites, media, sources, developers, architects, contractors).
                  7) Each project must include at least one verifiable source (URL or named database entry). Prefer primary sources and structured databases; list all sources used.
                  8) Clearly indicate when information comes from paid/restricted databases (in sources.sourceType and/or publisher notes).

                  STATUS ENUM (JSON)
                  "planned" | "approved" | "proposed" | "under_construction" | "on_hold"

                  CONFIDENCE SCORE GUIDELINES
                  High — Confirmed by multiple recent sources, including at least one primary or database source.
                  Medium — Confirmed by one reliable recent source or multiple secondary sources.
                  Low — Limited confirmation, older sources, or unresolved discrepancies.

                  Here is the names of all projects in the database matching the criteria, to avoid duplicates (if any):

                  ${projectNames.join(',\n ')}


                  JSON SCHEMA TEMPLATE (MUST MATCH) IN JSON CODE FORMAT json code block.
                  {
                    "projects": [
                      {
                        "name": "",
                        "buildingType": "Skyscraper | High-rise | Major civic or commercial building | Industrial building",
                        "buildingUse": [
                          "office | residential | mixed-use | hotel | hospital | education | retail | cultural | industrial | logistics | data_center | transport_station | airport | sports_stadium | other"
                        ],
                        "buildingHeightMeters": null,
                        "buildingHeightFloors": null,
                        "glassFacade": "yes | no | null",
                        "facadeBasis": "renderings | construction_photos | architectural_specs | mixed | unknown",
                        "projectBudgetEur": null,
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
                            "mediaDate": "YYYY-MM-DD"
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
                    ]
                  }

                  PARAMETERS (INPUT)
                  [TYPE] = ${buildingType}
                  [LOCATION] = ${metroAreaName}


                  `;
    navigator.clipboard.writeText(text);
    onClose();
  };

  const handleNames = async (buildingTypeId: number) => {
    if (metroAreaId && buildingTypeId) {
      const pn = await getProjectNamesByMetroAreaAndBuildingType(
        metroAreaId,
        buildingTypeId
      );
      console.log(pn);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          minWidth: '300px',
          color: 'black'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Copy JSON Template for ChatGPT</h2>
        <p>
          Click the button below to copy a JSON template with instructions for
          ChatGPT to conduct research on building projects in {metroAreaName}.
        </p>
        <label>
          Building Type:
          <select
            value={buildingType}
            onChange={(e) => {
              const selectedBuildingType = e.target.value;
              const selectedTypeId = e.target.selectedOptions[0]?.dataset.btId;
              const parsedTypeId = selectedTypeId
                ? parseInt(selectedTypeId, 10)
                : null;

              setBuildingType(selectedBuildingType);
              setBuildingTypeId(parsedTypeId);
              console.log('change');
              if (parsedTypeId) {
                handleNames(parsedTypeId);
              }
            }}
          >
            <option value="">Select building type</option>
            <option data-bt-id="1" value="A">
              Skyscraper (over 150 m)
            </option>
            <option data-bt-id="2" value="B">
              High-rise (50–150 m)
            </option>
            <option data-bt-id="3" value="C">
              Major civic or commercial building
            </option>
            <option data-bt-id="4" value="D">
              Industrial building
            </option>
          </select>
        </label>

        <button onClick={copyToClipboard}>Copy JSON Template</button>
      </div>
    </div>
  );
};

export default MetroAreaJsonCopyModal;
