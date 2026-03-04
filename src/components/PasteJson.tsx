import React from 'react';
import { useProjects } from '../hooks/ApiHooks';

const PasteJson: React.FC = () => {
  const { updateProjectNoId, addProjects } = useProjects();
  const [jsonInput, setJsonInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const handleParse = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.id) {
        console.log('Parsed JSON:', parsed);
        const response = await updateProjectNoId(parsed);
        setMessage(`Project updated: ${response.message}`);
        setError(null);
        setJsonInput('');
      }
      if (parsed.projects) {
        console.log('Parsed JSON (posting projects): ', parsed);
        const response = await addProjects(parsed);
        setMessage(`Projects added: ${response.message}`);
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
        <h2
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Paste JSON Data From ChatGPT
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}
        >
          <button onClick={handleParse} style={{ marginTop: '10px' }}>
            Post Projects / Update Project
          </button>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
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
