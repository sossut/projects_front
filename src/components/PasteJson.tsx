import React from 'react';
import styled from 'styled-components';
import { useProjects } from '../hooks/ApiHooks';

const PrimaryButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  }
`;

const PasteJson: React.FC = () => {
  const { updateProjectNoId, addProjects } = useProjects();
  const [jsonInput, setJsonInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const handleParse = async () => {
    try {
      if (!jsonInput.trim()) {
        setError('Please paste JSON data first');
        return;
      }
      const parsed = JSON.parse(jsonInput);
      if (parsed.id) {
        console.log('Parsed JSON:', parsed);
        const response = await updateProjectNoId(parsed);
        setMessage(`Project updated: ${response.message}`);
        setError(null);
        setJsonInput('');
      } else if (parsed.projects) {
        console.log('Parsed JSON (posting projects): ', parsed);
        const response = await addProjects(parsed);
        setMessage(`Projects added: ${response.message}`);
        setError(null);
        setJsonInput('');
      } else {
        setError(
          'JSON must contain either "id" (to update a single project) or "projects" array (for bulk import). Did you paste the correct ChatGPT response?'
        );
      }
    } catch (err) {
      console.log(err);
      if (err instanceof SyntaxError) {
        const match = err.message.match(/position (\d+)/);
        const position = match ? match[1] : 'unknown';
        setError(
          `JSON syntax error at position ${position}: ${err.message}. Check that all brackets, quotes and commas are correct.`
        );
      } else {
        setError(
          `Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`
        );
      }
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
          <PrimaryButton onClick={handleParse}>
            Post Projects / Update Project
          </PrimaryButton>
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
