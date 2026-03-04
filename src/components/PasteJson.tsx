import React from 'react';
import { useProjects } from '../hooks/ApiHooks';

const PasteJson: React.FC = () => {
  const { updateProjectNoId, addProjects } = useProjects();
  const [jsonInput, setJsonInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleParse = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.id) {
        console.log('Parsed JSON:', parsed);
        await updateProjectNoId(parsed);
        setError(null);
        setJsonInput('');
      }
      if (parsed.projects) {
        console.log('Parsed JSON (posting projects): ', parsed);
        await addProjects(parsed.projects);
        setError(null);
        setJsonInput('');
      }
    } catch (err) {
      console.log(err);
      setError('Invalid JSON');
    }
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ height: '120px' }}>
        <h2 style={{ display: 'flex', alignContent: 'center' }}>
          Paste JSON Data From ChatGPT
        </h2>
        <div>
          <button onClick={handleParse} style={{ marginTop: '10px' }}>
            Post Projects / Update Project
          </button>
        </div>
      </div>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON data here"
        rows={10}
        style={{ width: '95%', padding: '10px', fontSize: '14px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PasteJson;
