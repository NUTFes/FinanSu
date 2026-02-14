import clsx from 'clsx';
interface Props {
  className?: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  name?: string;
}

function Radio(props: Props): JSX.Element {
  const { className, value, checked, onChange, onClick, children, name } = props;

  return (
    <label className={clsx('group flex cursor-pointer items-center gap-2', className)}>
      <div className='relative flex size-4 shrink-0 items-center justify-center'>
        <input
          type='radio'
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.value)}
          onClick={onClick}
          className='peer border-primary-1 bg-white-0 checked:border-primary-1 focus-visible:ring-primary-1 group-hover:border-primary-2 size-full cursor-pointer appearance-none rounded-full border-2 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
        />
        <div className='bg-primary-1 pointer-events-none absolute size-2 scale-0 rounded-full opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100' />
      </div>
      {children && (
        <span className='text-black-600 group-hover:text-black-300 text-sm transition-colors select-none'>
          {children}
        </span>
      )}
    </label>
  );
}

export default Radio;
