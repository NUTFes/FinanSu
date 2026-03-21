import { useMemo } from 'react';
import Select, { MultiValue, StylesConfig } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  values?: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  customStyles?: StylesConfig<Option, true>;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  values,
  placeholder,
  customStyles,
}) => {
  const normalizedValues = useMemo(() => values ?? [], [values]);

  const menuPortalTarget = typeof window !== 'undefined' ? document.body : undefined;
  const mergedStyles = useMemo<StylesConfig<Option, true>>(
    () => ({
      menuPortal: (base) => ({
        ...base,
        zIndex: 70,
      }),
      ...customStyles,
    }),
    [customStyles],
  );

  return (
    <Select<Option, true>
      isMulti
      options={options}
      value={normalizedValues}
      placeholder={placeholder}
      menuPortalTarget={menuPortalTarget}
      menuPosition='fixed'
      styles={mergedStyles}
      onChange={(newValue: MultiValue<Option>) => {
        const nextSelected = [...newValue];
        onChange(nextSelected);
      }}
    />
  );
};

export default MultiSelect;
