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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { post } from '@api/fundInformations';
import { get_with_token } from '@api/api_methods';
import React, { useState, useEffect } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import RegistButton from '@components/General/RegistButton';
import { FC } from 'react';
import { useRouter } from 'next/router';

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

interface User {
  id: number | string;
  name: string;
  department_id: number;
  role_id: number;
}

interface FundInformation {
  user_id: number | string;
  teacher_id: number | string;
  price: number;
  remark: string;
  is_first_check: boolean;
  is_last_check: boolean;
}

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  teachersInformation: TeachersInformation[];
  currentUser: User;
  userID: number | string;
}

const OpenAddModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const initFormData: FundInformation = {
    user_id: 1,
    teacher_id: 1,
    price: 0,
    remark: '',
    is_first_check: false,
    is_last_check: false,
  };

  let updateFormData: FundInformation = {
    user_id: 1,
    teacher_id: 1,
    price: 0,
    remark: '',
    is_first_check: false,
    is_last_check: false,
  };

  const router = useRouter();

  const [formData, setFormData] = useState<FundInformation>(initFormData);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    department_id: 1,
    role_id: 1,
  });

  // formDataのuser_idに代入するために現在のUserを取得
  useEffect(() => {
    if (router.isReady) {
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const res = await get_with_token(url);
        setCurrentUser(res);

        // formDataの更新用データにuserのidを代入
        updateFormData.user_id = res.id;
        // formDataを更新
        setFormData(updateFormData);
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
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
            <Grid templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem colSpan={12}>
                <Center color='black.600' h='100%' fontSize='xl' mb={5}>
                  募金の登録
                </Center>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={10}>
                <Grid templateColumns='repeat(12, 1fr)' gap={4}>
                  <GridItem colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      教員名
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    <Select
                      value={formData.teacher_id}
                      onChange={handler('teacher_id')}
                      borderRadius='full'
                      borderColor='primary.1'
                      w='100'
                    >
                      {props.teachersInformation.map((data) => (
                        <option value={data.id}>{data.name}</option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      金額
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    <Flex>
                      <Input
                        w='100'
                        borderRadius='full'
                        borderColor='primary.1'
                        value={formData.price}
                        onChange={handler('price')}
                      />
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      備考
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    <Flex>
                      <Input
                        w='100'
                        borderRadius='full'
                        borderColor='primary.1'
                        value={formData.remark}
                        onChange={handler('remark')}
                      />
                    </Flex>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem colSpan={1} />
            </Grid>
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
