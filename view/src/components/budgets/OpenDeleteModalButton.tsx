import * as React from 'react';
import { useState } from 'react';
import DeleteModal from '@components/budgets/DeleteModal';
import { DeleteButton } from '@components/common';

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  id: number;
  isDisabled: boolean;
}

export const OpenDeleteModalButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <DeleteButton onClick={onOpen} isDisabled={props.isDisabled} />
      {isOpen && <DeleteModal id={props.id} setShowModal={setIsOpen} />}
    </>
    // <ChakraProvider theme={theme}>
    //   <Button
    //     w='25px'
    //     h='25px'
    //     p='0'
    //     minWidth='0'
    //     borderRadius='full'
    //     bgGradient='linear(to-br, red.500 ,red.600)'
    //     onClick={ShowModal}
    //   >
    //     <RiDeleteBinLine size={'15px'} color={'white'} />
    //     {props.children}
    //   </Button>
    //   <DeleteModal id={props.id} openModal={showModal} setShowModal={setShowModal} />
    // </ChakraProvider>
  );
};

export default OpenDeleteModalButton;
