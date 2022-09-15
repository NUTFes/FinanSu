import { ChakraProvider, Button } from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';
import { RiPencilFill } from 'react-icons/ri';

import theme from '@assets/theme';
import EditModal from '@components/budgets/EditModal';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id: number;
  sources: Source[];
  years: Year[];
}

interface Source {
  id: number;
  name: string;
}

interface Year {
  id: number;
  year: number;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <ChakraProvider theme={theme}>
      <Button
        w='25px'
        h='25px'
        p='0'
        minWidth='0'
        borderRadius='full'
        bgGradient='linear(to-br, primary.1 ,primary.2)'
        onClick={ShowModal}
      >
        <RiPencilFill size={'15px'} color={'white'} />
        {props.children}
      </Button>
      <EditModal
        id={props.id}
        openModal={showModal}
        setShowModal={setShowModal}
        sources={props.sources}
        years={props.years}
      />
    </ChakraProvider>
  );
};
export default OpenEditModalButton;
