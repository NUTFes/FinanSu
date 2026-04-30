interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const RegistButton: React.FC<Props> = ({ children, width, height, onClick }) => {
  return (
    <button
      className='from-primary-1 to-primary-2 text-white-0 hover:from-primary-2 hover:to-primary-1 rounded-md bg-linear-to-br px-4 py-2 transition-all'
      style={{ height, width }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default RegistButton;
