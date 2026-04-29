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

const TriggerButton = styled.button<{ active?: boolean }>`
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.7rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  background: ${({ active }) =>
    active
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
  box-shadow: ${({ active }) =>
    active
      ? '0 6px 14px rgba(16, 185, 129, 0.2)'
      : '0 6px 14px rgba(59, 130, 246, 0.18)'};
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ active }) =>
      active
        ? '0 8px 20px rgba(16, 185, 129, 0.24)'
        : '0 8px 20px rgba(59, 130, 246, 0.22)'};
  }
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
      <TriggerButton
        type="button"
        active={selected.length > 0}
        onClick={() => setOpen((o) => !o)}
      >
        {label} {selected.length > 0 ? `(${selected.length})` : ''}
      </TriggerButton>
      {open && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '90%',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
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
