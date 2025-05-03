import clsx from 'clsx';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface Props {
  title: string;
  children: React.ReactNode;
}

const Dropdown = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    // document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // 定義を変更
  const handleOutsideClick: EventListener =
    () =>
    (e: React.MouseEvent<Element, MouseEvent>): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

  return (
    <>
      <div ref={dropdownRef} className='relative inline-block text-left'>
        <span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type='button'
            className='inline-flex w-full justify-center px-4 text-xl transition duration-150 ease-in-out focus:outline-none'
            id='options-menu'
            aria-haspopup='true'
            aria-expanded={isOpen}
          >
            <div className={clsx('flex items-center')}>
              {props.title}
              <RiArrowDropDownLine className={clsx('ml-1')} size={'26px'} />
            </div>
          </button>
        </span>

        {isOpen && (
          <>
            <div className='absolute left-0 z-50 mt-2 w-32 origin-top-left rounded-md px-3 pt-2 shadow-lg'>
              <div className='bg-white shadow-xs rounded-md'>
                <div
                  className='py-1'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='options-menu'
                >
                  {props.children}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dropdown;
