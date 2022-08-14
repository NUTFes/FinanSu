import React, { useRef, useState, useEffect } from "react";
import { RiAccountCircleFill, RiArrowDropDownLine } from 'react-icons/ri'
import clsx from 'clsx'

interface Props {
  title: string;
  children: React.ReactNode;
}

const Dropdown = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e: any) =>{
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div ref={dropdownRef} className="relative inline-block text-left">
        <span>
          <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex justify-center w-full px-4 text-xl focus:outline-none transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded={isOpen}>
            <div className={clsx('flex items-center')}>
              {props.title}
              <RiArrowDropDownLine className={clsx("ml-1")} size={'26px'} />
            </div>
          </button>
        </span>

        {isOpen && (
          <>
            <div className="origin-top-left absolute left-0 mt-2 px-3 pt-2 w-32 rounded-md shadow-lg z-50">
              <div className="rounded-md bg-white shadow-xs">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
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
