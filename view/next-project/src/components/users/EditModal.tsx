import {
  ChakraProvider,
  Center,
  Input,
  Select,
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
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import Button from '../common/RegistButton';
import { useRouter } from 'next/router';
import { get } from '@api/api_methods';
import { put } from '@api/user';

interface Bureau {
  id: number;
  name: string;
}

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
  bureaus: Bureau[];
}

interface FormData {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

export default function FundInformationEditModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    id: 1,
    name: '',
    bureau_id: 1,
    role_id: 1,
  });

  // モーダルを開いているuserを取得
  const getFormData = useCallback(async () => {
    const getFormDataURL = process.env.CSR_API_URI + '/users/' + props.id;
    setFormData(await get(getFormDataURL));
  }, [props.id, setFormData]);

  useEffect(() => {
    if (router.isReady) {
      getFormData();
    }
  }, [router, getFormData]);

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const submitUser = async (data: any, id: number | string) => {
    const submitUserURL = process.env.CSR_API_URI + '/users/' + id;
    const res = await put(submitUserURL, data);
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
                  ユーザの編集
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
                    <Flex>
                      <Input
                        w='100'
                        borderRadius='full'
                        borderColor='primary.1'
                        value={formData.name}
                        onChange={handler('name')}
                      />
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      学科
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Select
                      value={formData.bureau_id}
                      onChange={handler('bureau_id')}
                      borderRadius='full'
                      borderColor='primary.1'
                      w='224px'
                    >
                      {props.bureaus.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      権限
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Flex>
                      <Input
                        w='100'
                        borderRadius='full'
                        borderColor='primary.1'
                        value={formData.role_id}
                        onChange={handler('role_id')}
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
              <Button
                width='220px'
                onClick={() => {
                  submitUser(formData, props.id);
                  router.reload();
                }}
              >
                編集する
              </Button>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
