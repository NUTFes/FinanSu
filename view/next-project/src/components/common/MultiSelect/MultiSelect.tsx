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
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  values = [options[0]],
  placeholder,
}) => {
  const [selected, setSelected] = useState<{ value: string; label: string }[]>(values);
  const className = 'rounded-full border border-primary-1 py-2 px-4 w-full';
  return (
    <Select
      unstyled
      classNames={{
        control: (state) => className,
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
      isMulti
      options={options}
      value={selected}
      placeholder={placeholder}
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
