import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
interface DropdownCheckboxProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

const DropdownLabel = styled.span`
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
  &:hover {
    background: #e9e9e9;
  }
  color: black;
`;

const DropdownCheckbox: React.FC<DropdownCheckboxProps> = ({
  options,
  selected,
  onChange,
  label
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
    >
      <button type="button" onClick={() => setOpen((o) => !o)}>
        {label} {selected.length > 0 ? `(${selected.length})` : ''}
      </button>
      {open && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '70%',
            boxSizing: 'border-box',
            marginBottom: 8,
            padding: 4
          }}
        />
      )}
      {open && (
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            border: '1px solid #ccc',
            zIndex: 10,
            minWidth: 160,
            padding: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxHeight: 600,
            overflowY: 'auto'
          }}
        >
          {filteredOptions.map((option) => (
            <DropdownLabel
              key={option}
              style={{ display: 'block', marginBottom: 4 }}
              onClick={() => {
                if (selected.includes(option)) {
                  onChange(selected.filter((s) => s !== option));
                } else {
                  onChange([...selected, option]);
                }
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selected, option]);
                  } else {
                    onChange(selected.filter((s) => s !== option));
                  }
                }}
              />{' '}
              {option}
            </DropdownLabel>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;
