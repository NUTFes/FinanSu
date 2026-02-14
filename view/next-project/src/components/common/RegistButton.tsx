interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const RegistButton: React.FC<Props> = ({ children, width, height, onClick }) => {
  return (
    <button
      className='
        rounded-md bg-linear-to-br from-primary-1 to-primary-2 px-4 py-2
        text-white-0 transition-all
        hover:from-primary-2 hover:to-primary-1
      '
      style={{ height, width }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default RegistButton;
