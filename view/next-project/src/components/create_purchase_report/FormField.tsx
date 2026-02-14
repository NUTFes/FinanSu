import { FormControl, FormLabel } from '@/components/common';

interface FormFieldProps {
  id: string;
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  isRequired = false,
  isDisabled = false,
  children,
}) => {
  return (
    <FormControl id={id} isRequired={isRequired} isDisabled={isDisabled}>
      <FormLabel>{label}</FormLabel>
      {children}
    </FormControl>
  );
};

export default FormField;
