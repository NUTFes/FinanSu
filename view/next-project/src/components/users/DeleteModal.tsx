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
import React, { useState, useEffect, useCallback } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { get, del } from '@api/api_methods';
import theme from '@assets/theme';
import { RedButton } from '@components/common';

interface Bureau {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
  bureaus: Bureau[];
}

export default function DeleteModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const [user, setUser] = useState<User>({
    id: 0,
    name: '',
    bureau_id: 1,
    role_id: 1,
  });

  // モーダルを開いているuserを取得
  const getUser = useCallback(async () => {
    const getUserURL = process.env.CSR_API_URI + '/users/' + props.id;
    setUser(await get(getUserURL));
  }, [props.id, setUser]);

  useEffect(() => {
    if (router.isReady) {
      getUser();
    }
  }, [router, getUser]);

  const deleteUser = async (id: number | string) => {
    const deleteUserURL = process.env.CSR_API_URI + '/users/' + id;
    await del(deleteUserURL);
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
                  ユーザの削除
                </Center>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={10}>
                <Grid templateColumns='repeat(12, 1fr)' gap={4}>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      氏名
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
                      学科
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {user.bureau_id}
                    </Text>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      権限
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {user.role_id}
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
                  deleteUser(props.id);
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
