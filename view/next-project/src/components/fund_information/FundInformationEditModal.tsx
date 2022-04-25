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
import React, { useEffect, useState } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import Button from '../General/RegistButton';
import { useRouter } from 'next/router';
import { get, put } from '@api/fundInformations';

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
  teachersInformation: TeachersInformation[];
  currentUser: User;
}

export default function FundInformationEditModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const [formData, setFormData] = useState<FundInformation>({
    user_id: 0,
    teacher_id: '',
    price: 0,
    remark: '',
    is_first_check: false,
    is_last_check: false,
  });

  useEffect(() => {
    if (router.isReady) {
      const getFormDataUrl = process.env.CSR_API_URI + '/fund_informations/' + props.id;
      const getFormData = async (url: string) => {
        setFormData(await get(url));
      };
      getFormData(getFormDataUrl);
    }
  }, [router]);

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

  const submitFundInformation = async (data: any, id: number | string) => {
    const submitFundInformationURL = process.env.CSR_API_URI + '/fund_informations/' + id;
    await put(submitFundInformationURL, data);
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
                  募金の編集
                </Center>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={10}>
                <Grid templateColumns='repeat(12, 1fr)' gap={4}>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      教員名
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
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
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      金額
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
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
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      備考
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
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
              <Button
                width='220px'
                onClick={() => {
                  submitFundInformation(formData, props.id);
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
