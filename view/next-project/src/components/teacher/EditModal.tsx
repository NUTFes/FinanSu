import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { get } from '@api/api_methods';
import { put } from '@api/teachers';
import theme from '@assets/theme';
import { PrimaryButton } from '@components/common';
import { Department, Teacher } from '@type/common';
interface FormData {
  name: string;
  position: string;
  departmentID: number;
  room: string;
  isBlack: boolean;
  remark: string;
}

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  children?: React.ReactNode;
  id: number | string;
  teacher: Teacher;
  departments: Department[];
}

export default function FundInformationEditModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const initFormData: FormData = {
    name: '',
    position: '',
    departmentID: 1,
    room: '',
    isBlack: false,
    remark: '',
  };
  const [formData, setFormData] = useState<FormData>(initFormData);
  const [isBlack, setIsBlack] = useState<string>(props.teacher.isBlack.toString());

  // teacherを取得
  const getFormData = useCallback(async () => {
    const getFormDataURL = process.env.CSR_API_URI + '/teachers/' + props.id;
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

  const update = async (data: FormData, id: number | string, isBlack: string) => {
    if (isBlack == 'true') {
      data.isBlack = true;
    } else {
      data.isBlack = false;
    }
    const updateTeacherURL = process.env.CSR_API_URI + '/teachers/' + id;
    await put(updateTeacherURL, data);
  };

  return (
    <ChakraProvider theme={theme}>
      <Modal closeOnOverlayClick={false} isOpen={props.openModal} onClose={closeModal} isCentered>
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
                  教員の編集
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
                  <GridItem colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      職位
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    <Flex>
                      <Input
                        w='100'
                        borderRadius='full'
                        borderColor='primary.1'
                        value={formData.position}
                        onChange={handler('position')}
                      />
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      学科
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    <Select
                      value={formData.departmentID}
                      onChange={handler('departmentID')}
                      borderRadius='full'
                      borderColor='primary.1'
                      w='100'
                    >
                      {props.departments.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      居室
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    <Flex>
                      <Input
                        w='100'
                        borderRadius='full'
                        borderColor='primary.1'
                        value={formData.room}
                        onChange={handler('room')}
                      />
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      ブラックリスト
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    <Flex>
                      <RadioGroup defaultValue={isBlack} onChange={setIsBlack}>
                        <Stack spacing={5} direction='row'>
                          <Radio color='primary.2' value='true'>
                            追加する
                          </Radio>
                          <Radio color='primary.2' value='false'>
                            追加しない
                          </Radio>
                        </Stack>
                      </RadioGroup>
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
              <PrimaryButton
                onClick={() => {
                  update(formData, props.id, isBlack);
                  router.reload();
                }}
              >
                編集する
              </PrimaryButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
