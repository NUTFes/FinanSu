import { useState } from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  values?: Option[];
  onChange: (value: Option[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, onChange, values = [options[0]] }) => {
  const [selected, setSelected] = useState<{ value: string; label: string }[]>(values);

  return (
    <Select
      isMulti
      options={options}
      value={selected}
      onChange={(_, actionMeta) => {
        switch (actionMeta.action) {
          case 'select-option':
            if (actionMeta.option) {
              setSelected([...selected, actionMeta.option]);
              onChange([...selected, actionMeta.option]);
            }
            break;

          case 'remove-value':
          case 'pop-value':
            if (actionMeta.removedValue) {
              setSelected(
                selected.filter((option) => option.value !== actionMeta.removedValue.value),
              );
              onChange(selected.filter((option) => option.value !== actionMeta.removedValue.value));
            }
            break;

          case 'clear':
            setSelected([]);
            onChange([]);
            break;

          default:
            break;
        }
      }}
    />
  );
};

export default MultiSelect;
