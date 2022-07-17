import * as React from 'react';
import clsx from 'clsx';

interface Props {
  onClick?: () => void;
}

const Button: React.FC<Props> = ({
  children,
  onClick,
}) => {
  return (
    <button className={clsx("px-4 py-2 text-white-0 font-bold text-md rounded-lg bg-gradient-to-br from-primary-1 to-primary-2 hover:bg-primary-2")}
      onClick={onClick}
    >
      <div className={clsx("flex items-center")}>
        {children}
      </div>
    </button>
  );
};

export default Button;
