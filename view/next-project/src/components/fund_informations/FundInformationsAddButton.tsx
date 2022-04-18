import { ChakraProvider, Button } from '@chakra-ui/react';
import theme from '@assets/theme';
import * as React from 'react';
import FundInformationsAddModal from '@components/fund_informations/FundInformationsAddModal';
import { useState } from 'react';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  teachersinformations: TeachersInformations[];
}

interface TeachersInformations {
  id: number;
  name: string;
  position: string;
  department_id: number;
  room: string;
  is_black: boolean;
  remark: string;
  created_at: string;
  updated_at: string;
}
const FundInformationsAddModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <ChakraProvider theme={theme}>
      <Button
        w={props.width}
        h={props.height}
        color='white'
        bgGradient='linear(to-br, primary.1, primary.2)'
        onClick={ShowModal}
      >
        {props.children}
      </Button>
      <FundInformationsAddModal
        teachersinformations={props.teachersinformations}
        openModal={showModal}
        setShowModal={setShowModal}
      />
    </ChakraProvider>
  );
};

export default FundInformationsAddModalButton;
