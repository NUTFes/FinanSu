import {
  ChakraProvider,
  Button,
  Center,
  Text,
  Input,
  Flex,
  Box,
  Spacer,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import * as React from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import RegistButton from './RegistButton';

const RegistModal = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
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
                予算の登録
              </Text>
              <VStack spacing='15px'>
                <Flex>
                  <Center color='black.600' mr='3'>
                    年度
                  </Center>
                  <Input w='100' borderRadius='full' borderColor='primary.1' />
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    項目
                  </Center>
                  <Input w='100' borderRadius='full' borderColor='primary.1' />
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    金額
                  </Center>
                  <Input w='100' borderRadius='full' borderColor='primary.1' />
                </Flex>
              </VStack>
            </VStack>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <RegistButton
                width='220px'
                color='white'
                bgGradient='linear(to-br, primary.1, primary.2)'
              >
                登録する
              </RegistButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default RegistModal;
