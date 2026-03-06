import { ReactNode, useEffect, useRef, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface Props {
  title: string;
  onClick?: () => void;
  children: ReactNode;
}

const UserDropdown = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='
          flex items-center gap-1 rounded-md border border-white-0
          bg-transparent px-3 py-2 text-white-0 transition-colors
          hover:bg-white-0 hover:text-primary-4
        '
      >
        <div className='flex flex-row items-center gap-3'>
          {props.children}
          <span
            suppressHydrationWarning
            className='
            hidden text-base font-bold
            md:block
          '
          >
            {props.title}
          </span>
        </div>
        <RiArrowDropDownLine size={20} />
      </button>

      {isOpen && (
        <div
          className='
          absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white-0 py-1
          shadow-lg
        '
        >
          <span
            suppressHydrationWarning
            className='
              mx-auto block w-fit pb-2 text-black-300
              md:hidden
            '
          >
            {props.title}
          </span>
          <button
            onClick={() => {
              props.onClick?.();
              setIsOpen(false);
            }}
            className='
              w-full px-4 py-2 text-left text-primary-4 transition-colors
              hover:bg-gray-100
            '
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
