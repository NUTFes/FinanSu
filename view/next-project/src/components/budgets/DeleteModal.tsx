import {
  ChakraProvider,
  Center,
  Text,
  Flex,
  Box,
  Button,
  Spacer,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { del } from '@api/budget';
import theme from '@assets/theme';

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
}

const BudgetDeleteModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const deleteBudget = async (id: number | string) => {
    const deleteBudgetUrl = process.env.CSR_API_URI + '/budgets/' + id;
    await del(deleteBudgetUrl);
  };

  return (
    <ChakraProvider theme={theme}>
      <Modal isOpen={props.openModal} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent pb='5' borderRadius='3xl'>
          <ModalBody p='3'>
            <Flex mt='5'>
              <Spacer />
              <Box mr='5' _hover={{ background: '#E2E8F0', cursor: 'pointer' }}>
                <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
              </Box>
            </Flex>
            <VStack spacing='30px'>
              <Text fontSize='xl' color='black.600'>
                予算の削除
              </Text>
              <VStack spacing='15px'>
                <Flex>
                  <Center color='black.600' mr='3'>
                    削除してもよいですか？
                  </Center>
                </Flex>
              </VStack>
            </VStack>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <Button
                width='220px'
                bgGradient='linear(to-br, red.500 ,red.600)'
                onClick={() => {
                  deleteBudget(props.id);
                  router.reload();
                }}
              >
                削除する
              </Button>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default BudgetDeleteModal;
