import {
  Box,
  Center,
  ChakraProvider,
  Divider,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { Dispatch, SetStateAction } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import theme from '@assets/theme';
import { Teacher } from '@type/common';
interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  children?: React.ReactNode;
  teacher: Teacher;
}

export default function DetailModal(props: ModalProps) {
  const closeModal = () => {
    props.setShowModal(false);
  };

  // モーダルに表示する用のteacherを定義
  const teacher: Teacher = props.teacher;

  const isBlack: string = props.teacher.isBlack.toString();

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
            <Grid templateColumns='repeat(12, 1fr)' gap={4} mb={10}>
              <GridItem colSpan={12}>
                <Center color='black.600' h='100%' fontSize='2xl'>
                  詳細
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
                      {teacher.departmentID == 1 && (
                        <Text>機械工学分野/機械創造工学課程・機械創造工学専攻</Text>
                      )}
                      {teacher.departmentID == 2 && (
                        <Text>電気電子情報工学分野/電気電子情報工学課程/電気電子情報工学専攻</Text>
                      )}
                      {teacher.departmentID == 3 && (
                        <Text>
                          情報・経営システム工学分野/情報・経営システム工学課程/情報・経営システム工学専攻
                        </Text>
                      )}
                      {teacher.departmentID == 4 && (
                        <Text>
                          物質生物工学分野/物質材料工学課程/生物機能工学課程/物質材料工学専攻/生物機能工学専攻
                        </Text>
                      )}
                      {teacher.departmentID == 5 && (
                        <Text>環境社会基盤工学分野/環境社会基盤工学課程/環境社会基盤工学専攻</Text>
                      )}
                      {teacher.departmentID == 6 && (
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
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
