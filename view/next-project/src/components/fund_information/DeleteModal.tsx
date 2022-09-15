import {
  ChakraProvider,
  Center,
  Text,
  Flex,
  Box,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { get, del } from '@api/api_methods';
import theme from '@assets/theme';
import { RedButton } from '@components/common';

interface Teacher {
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
  id: number;
  name: string;
  department_id: number;
  role_id: number;
}

interface FundInformation {
  user_id: number;
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
  id: number | string;
  teacher_id: number;
  user_id: number;
}

export default function DeleteModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  // モーダルに表示する用のfund_informationを定義
  const [fundInformation, setFundInformation] = useState<FundInformation>({
    user_id: 0,
    teacher_id: '',
    price: 0,
    remark: '',
    is_first_check: false,
    is_last_check: false,
  });

  const [teacher, setTeacher] = useState<Teacher>({
    id: Number(fundInformation.teacher_id),
    name: '',
    position: '',
    department_id: 1,
    room: '',
    is_black: false,
    remark: '',
    created_at: '',
    updated_at: '',
  });

  const [user, setUser] = useState<User>({
    id: 0,
    name: '',
    department_id: 1,
    role_id: 1,
  });

  // モーダルを開いているfund_informationを取得
  const getFundInformation = useCallback(async () => {
    const getFundInformationURL = process.env.CSR_API_URI + '/fund_informations/' + props.id;
    setFundInformation(await get(getFundInformationURL));
  }, [props.id]);

  // teacher_idに紐づくteacherを取得
  const getTeacher = useCallback(async () => {
    const getTeacherURL = process.env.CSR_API_URI + '/teachers/' + props.teacher_id;
    setTeacher(await get(getTeacherURL));
  }, [props.teacher_id]);

  // user_idに紐づくuserを取得
  const getUser = useCallback(async () => {
    const getUserURL = process.env.CSR_API_URI + '/users/' + props.user_id;
    setUser(await get(getUserURL));
  }, [props.user_id]);

  useEffect(() => {
    if (router.isReady) {
      getFundInformation();
      getTeacher();
      getUser();
    }
  }, [router, getFundInformation, getTeacher, getUser]);

  const deleteFundInformation = async (id: number | string) => {
    const deleteFundInformationURL = process.env.CSR_API_URI + '/fund_informations/' + id;
    await del(deleteFundInformationURL);
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
              <GridItem rowSpan={1} colSpan={12}>
                <Center color='black.600' h='100%' fontSize='xl'>
                  募金の削除
                </Center>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={10}>
                <Grid templateColumns='repeat(12, 1fr)' gap={4}>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      報告者名
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {user.name}
                    </Text>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      教員名
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {teacher.name}
                    </Text>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      金額
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {fundInformation.price}
                    </Text>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      備考
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {fundInformation.remark}
                    </Text>
                    <Divider />
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem colSpan={1} />
            </Grid>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <RedButton
                onClick={() => {
                  deleteFundInformation(props.id);
                  router.reload();
                }}
              >
                削除する
              </RedButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
