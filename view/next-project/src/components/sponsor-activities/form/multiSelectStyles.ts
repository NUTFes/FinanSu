import { StylesConfig } from 'react-select';

interface StyleOption {
  value: string;
  label: string;
}

export const multiSelectStyles: StylesConfig<StyleOption, true> = {
  control: (base) => ({
    ...base,
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    minHeight: '2.5rem',
  }),
  valueContainer: (base, state) => ({
    ...base,
    padding: state.hasValue ? '0.5rem 0.625rem' : '0 0.5rem',
    display: 'flex',
    flexDirection: state.hasValue ? 'column' : 'row',
    alignItems: state.hasValue ? 'stretch' : 'center',
    gap: '0.25rem',
    overflow: 'hidden',
    minWidth: 0,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    justifyContent: 'space-between',
    margin: '0',
    maxWidth: '100%',
    minWidth: 0,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#4b5563',
    fontSize: '0.875rem',
    padding: '4px 8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
    maxWidth: 'calc(100% - 2rem)',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#4b5563',
    padding: '0 8px',
    borderRadius: '0 4px 4px 0',
    flexShrink: 0,
    ':hover': {
      backgroundColor: '#d1d5db',
      color: '#1f2937',
    },
  }),
  clearIndicator: () => ({
    display: 'none',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#4b5563',
    padding: '0.5rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
    margin: '0',
  }),
  input: (base) => ({
    ...base,
    margin: '0',
    padding: '0',
    color: '#4b5563',
  }),
};
