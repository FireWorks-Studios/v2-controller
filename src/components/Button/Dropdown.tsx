import React from 'react';
import './Dropdown.css'
import classnames from 'classnames';
import dropdownOptions from './DropdownOptions';
import { DropdownOption } from './DropdownOptions';


interface Props {
  editing: boolean;
  // eslint-disable-next-line no-unused-vars
  updateMapping(mapping: DropdownOption['value'], id: number): void
  value: string;
  id: number;
}

const Dropdown: React.FC<Props> = ({
    editing,
    updateMapping,
    value,
    id,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateMapping(event.target.value as DropdownOption['value'], id)
  };

  return (
    <select name="remap" 
    className={
      classnames('selectList', {
      editing: editing,
      [`id-${id}`]: true
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