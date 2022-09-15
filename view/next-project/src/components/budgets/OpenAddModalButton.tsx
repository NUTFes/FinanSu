import { ChakraProvider, Button } from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';

import theme from '@assets/theme';
import AddModal from '@components/budgets/AddModal';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
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

const OpenAddModalButton: React.FC<Props> = (props) => {
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
      <AddModal
        openModal={showModal}
        setShowModal={setShowModal}
        sources={props.sources}
        years={props.years}
      />
    </ChakraProvider>
  );
};

export default OpenAddModalButton;
