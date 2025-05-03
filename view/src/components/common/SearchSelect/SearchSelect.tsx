import { Dispatch, useEffect, useState, SetStateAction } from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface SearchSelectProps {
  options?: Option[];
  value?: Option;
  onChange?: (value: Option) => void;
  setID?: Dispatch<SetStateAction<string>>;
  noOptionMessage?: string;
  placeholder?: string;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  value,
  onChange,
  setID,
  noOptionMessage,
  placeholder,
}) => {
  const [selected, setSelected] = useState<Option | null>(value || (options && options[0]) || null);

  useEffect(() => {
    setSelected(value || (options && options[0]) || null);
  }, [options]);

  return (
    <Select
      options={options}
      value={selected}
      noOptionsMessage={() => noOptionMessage}
      placeholder={placeholder}
      onChange={(option, actionMeta) => {
        switch (actionMeta.action) {
          case 'select-option':
            if (option) {
              setSelected(option);
              setID && setID(option?.value || '0');
            }
            break;
          case 'remove-value':
          case 'pop-value':
            if (actionMeta.removedValue) {
              setSelected(null);
              setID && setID('');
            }
            break;
          case 'clear':
            setSelected(null);
            setID && setID('');
            break;
          default:
            break;
        }
      }}
    />
  );
};

export default SearchSelect;
