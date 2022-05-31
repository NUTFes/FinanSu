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
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import Button from '@components/General/Button';
import { useRouter } from 'next/router';
import { get, del } from '@api/api_methods';

interface Department {
  id: number;
  name: string;
}

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

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
  teacher: Teacher;
  departments: Department[];
}

export default function DeleteModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  // モーダルに表示する用のteacherを定義
  const initTeacher: Teacher = {
    id: Number(props.id),
    name: '',
    position: '',
    department_id: 1,
    room: '',
    is_black: false,
    remark: '',
    created_at: '',
    updated_at: '',
  };
  const [teacher, setTeacher] = useState<Teacher>(initTeacher);

  const isBlack: string = props.teacher.is_black.toString();

  useEffect(() => {
    if (router.isReady) {
      // teacherを取得
      const getTeacherURL = process.env.CSR_API_URI + '/teachers/' + props.id;
      const getTeacher = async (url: string) => {
        setTeacher(await get(url));
      };
      getTeacher(getTeacherURL);
    }
  }, [router]);

  const deleteTeacher = async (id: number | string) => {
    const deleteURL = process.env.CSR_API_URI + '/teachers/' + id;
    await del(deleteURL);
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
                  教員の削除
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
                    <Text fontSize='lg' pl={2}>
                      {teacher.name}
                    </Text>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      職位
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {teacher.position}
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
                      {teacher.department_id == 1 && (
                        <Text>機械工学分野/機械創造工学課程・機械創造工学専攻</Text>
                      )}
                      {teacher.department_id == 2 && (
                        <Text>電気電子情報工学分野/電気電子情報工学課程/電気電子情報工学専攻</Text>
                      )}
                      {teacher.department_id == 3 && (
                        <Text>
                          情報・経営システム工学分野/情報・経営システム工学課程/情報・経営システム工学専攻
                        </Text>
                      )}
                      {teacher.department_id == 4 && (
                        <Text>
                          物質生物工学分野/物質材料工学課程/生物機能工学課程/物質材料工学専攻/生物機能工学専攻
                        </Text>
                      )}
                      {teacher.department_id == 5 && (
                        <Text>環境社会基盤工学分野/環境社会基盤工学課程/環境社会基盤工学専攻</Text>
                      )}
                      {teacher.department_id == 6 && (
                        <Text>量子・原子力統合工学分野/原子力システム安全工学専攻</Text>
                      )}
                    </Text>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      居室
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {teacher.room}
                    </Text>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      ブラックリスト
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Flex>
                      <RadioGroup defaultValue={isBlack}>
                        <Stack spacing={5} direction='row'>
                          <Radio color='primary.2' value='true' isDisabled>
                            追加する
                          </Radio>
                          <Radio color='primary.2' value='false' isDisabled>
                            追加しない
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Flex>
                    <Divider />
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={4}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      備考
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={8}>
                    <Text fontSize='lg' pl={2}>
                      {teacher.remark}
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
              <Button
                width='220px'
                bgGradient='linear(to-br, red.500 ,red.600)'
                _hover={{ bg: 'red.600' }}
                onClick={() => {
                  deleteTeacher(props.id);
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
}
