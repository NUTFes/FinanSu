import type { JSX } from 'react';
interface Props {
  className?: string;
  placeholder?: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  children?: React.ReactNode;
  type?: string;
  datalist?: {
    key: string;
    data: { id: number; name: string }[];
  };
}

function Input(props: Props): JSX.Element {
  const className =
    'rounded-full border border-primary-1 py-2 px-4 w-full focus:outline-none focus:border-primary-1 focus:ring-1 focus:ring-primary-1' +
    (props.className ? ` ${props.className}` : '');
  return (
    <div>
      <input
        className={className}
        placeholder={props.placeholder}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        type={props.type}
        list={props.datalist?.key}
      >
        {props.children}
      </input>
      {props.datalist && (
        <datalist id={props.datalist.key}>
          {props.datalist.data.map((option) => (
            <option key={option.id} value={option.name} />
          ))}
        </datalist>
      )}
    </div>
  );
}

export default Input;
