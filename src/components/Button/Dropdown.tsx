import React from 'react';
import './Dropdown.css'
import classnames from 'classnames';
import dropdownOptions from './DropdownOptions';
import { DropdownOption } from './DropdownOptions';


interface Props {
  editing: boolean;
  // eslint-disable-next-line no-unused-vars
  updateMapping(mapping: DropdownOption['value'][]): void
  value: string;
}

const Dropdown: React.FC<Props> = ({
    editing,
    updateMapping,
    value,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateMapping([event.target.value as DropdownOption['value']])
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