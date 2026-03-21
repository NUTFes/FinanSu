import { Dispatch, SetStateAction } from 'react';
import Select, { StylesConfig } from 'react-select';

interface Option {
  value: string;
  label: string;
}

const searchSelectStyles: StylesConfig<Option, false> = {
  control: (base) => ({
    ...base,
    borderRadius: '9999px',
    borderColor: 'var(--color-primary-1)',
    borderWidth: '1px',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    boxShadow: 'none',
    minHeight: '2.5rem',
    '&:hover': {
      borderColor: 'var(--color-primary-1)',
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),
};

interface SearchSelectProps {
  options?: Option[];
  value?: Option | null;
  defaultValue?: Option | null;
  onChange?: (value: Option | null) => void;
  setID?: Dispatch<SetStateAction<string>>;
  noOptionMessage?: string;
  placeholder?: string;
  isClearable?: boolean;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  value,
  defaultValue,
  setID,
  noOptionMessage,
  placeholder,
  onChange,
  isClearable = false,
}) => {
  const selected =
    value !== undefined
      ? value
      : defaultValue !== undefined
      ? defaultValue
      : (options && options[0]) || null;

  return (
    <Select
      styles={searchSelectStyles}
      options={options}
      value={selected}
      isClearable={isClearable}
      defaultValue={defaultValue ?? (value === undefined ? options?.[0] : undefined)}
      noOptionsMessage={() => noOptionMessage}
      placeholder={placeholder}
      onChange={(option, actionMeta) => {
        switch (actionMeta.action) {
          case 'select-option':
            if (option) {
              setID && setID(option?.value || '0');
              onChange && onChange(option);
            }
            break;
          case 'remove-value':
          case 'pop-value':
            if (actionMeta.removedValue) {
              setID && setID('');
              onChange && onChange(null);
            }
            break;
          case 'clear':
            setID && setID('');
            onChange && onChange(null);
            break;
          default:
            break;
        }
      }}
    />
  );
};

export default SearchSelect;
