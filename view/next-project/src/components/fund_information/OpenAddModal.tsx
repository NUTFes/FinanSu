import {
  ChakraProvider,
  Select,
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
import { post } from '@api/fundInformations';
import * as React from 'react';
import { useState } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import RegistButton from '@components/General/RegistButton';
import { FC } from 'react';
import { useRouter } from 'next/router';

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  teachersInformation: TeachersInformation[];
}
interface TeachersInformation {
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

const OpenAddModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [formData, setFormData] = useState({
    teacher_id: 1,
    user_id: 1,
    price: '',
    remark: '',
    is_first_check: false,
    is_last_check: false,
  });

  const router = useRouter();

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addFundInformation = async (data: any) => {
    const addFundInformationUrl = process.env.CSR_API_URI + '/fund_informations';
    await post(addFundInformationUrl, data);
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
                募金の登録
              </Text>
              <VStack spacing='15px'>
                <Flex>
                  <Center color='black.600' mr='3'>
                    氏名
                  </Center>
                  <Select
                    value={formData.teacher_id}
                    onChange={handler('teacher_id')}
                    borderRadius='full'
                    borderColor='primary.1'
                    w='224px'
                  >
                    {props.teachersInformation.map((data) => (
                      <option value={data.id}>{data.name}</option>
                    ))}
                  </Select>
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    金額
                  </Center>
                  <Input
                    w='100'
                    borderRadius='full'
                    borderColor='primary.1'
                    value={formData.price}
                    onChange={handler('price')}
                  />
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    備考
                  </Center>
                  <Input
                    w='100'
                    borderRadius='full'
                    borderColor='primary.1'
                    value={formData.remark}
                    onChange={handler('remark')}
                  />
                </Flex>
              </VStack>
            </VStack>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <RegistButton
                width='220px'
                onClick={() => {
                  addFundInformation(formData);
                  router.reload();
                }}
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

export default OpenAddModal;
