import React from 'react';
import './Dropdown.css'
import classnames from 'classnames';

const dropdownOptions = [
  { value: 'Space', label: 'Space' },
  { value: 'Green Flag', label: 'Green Flag' },
  { value: 'Pause', label: 'Pause' },
  { value: 'Stop', label: 'Stop' },
  { value: 'Remap', label: 'Remap' },
  { value: 'ArrowUp', label: '▲' },
  { value: 'ArrowDown', label: '▼' },
  { value: 'ArrowLeft', label: '◀' },
  { value: 'ArrowRight', label: '▶' },
  { value: 'w', label: 'w' },
  { value: 'a', label: 'a' },
  { value: 's', label: 's' },
  { value: 'd', label: 'd' },
  { value: 'z', label: 'z' },
  { value: 'x', label: 'x' },
  { value: 'b', label: 'b' },
  { value: 'c', label: 'c' },
  { value: 'e', label: 'e' },
  { value: 'f', label: 'f' },
  { value: 'g', label: 'g' },
  { value: 'h', label: 'h' },
  { value: 'i', label: 'i' },
  { value: 'j', label: 'j' },
  { value: 'k', label: 'k' },
  { value: 'l', label: 'l' },
  { value: 'm', label: 'm' },
  { value: 'n', label: 'n' },
  { value: 'o', label: 'o' },
  { value: 'p', label: 'p' },
  { value: 'q', label: 'q' },
  { value: 'r', label: 'r' },
  { value: 't', label: 't' },
  { value: 'u', label: 'u' },
  { value: 'v', label: 'v' },
  { value: 'y', label: 'y' },
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
] as const;

export type DropdownOption = typeof dropdownOptions[number]

interface Props {
  editing: boolean;
  updateMapping(mapping: DropdownOption['value']): void
  value: string;
}

const Dropdown: React.FC<Props> = ({
    editing,
    updateMapping,
    value,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateMapping(event.target.value as DropdownOption['value'])
  };

  return (
    <select name="remap" 
    className={
      classnames('selectList', {
        editing: editing
    })} 
    value={value} 
    onChange={handleChange}>
      {dropdownOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;