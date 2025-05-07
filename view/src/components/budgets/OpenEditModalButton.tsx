import * as React from 'react';
import { useState } from 'react';


import EditModal from '@components/budgets/EditModal';
import { Source, Year } from '@type/common';

import { EditButton } from '../common';

export interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id?: number;
  sources: Source[];
  years: Year[];
  isDisabled: boolean;
}

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };
  return (
    <>
      <EditButton onClick={() => setShowModal(true)} isDisabled={props.isDisabled} />
      {showModal && (
        <EditModal
          id={props.id ? props.id : 0}
          openModal={showModal}
          setShowModal={setShowModal}
          sources={props.sources}
          years={props.years}
        />
      )}
    </>
    // <ChakraProvider theme={theme}>
    //   <Button
    //     w='25px'
    //     h='25px'
    //     p='0'
    //     minWidth='0'
    //     borderRadius='full'
    //     bgGradient='linear(to-br, primary.1 ,primary.2)'
    //     onClick={ShowModal}
    //   >
    //     <RiPencilFill size={'15px'} color={'white'} />
    //     {props.children}
    //   </Button>
    //   <EditModal
    //     id={props.id ? props.id : 0}
    //     openModal={showModal}
    //     setShowModal={setShowModal}
    //     sources={props.sources}
    //     years={props.years}
    //   />
    // </ChakraProvider>
  );
};
export default OpenEditModalButton;
