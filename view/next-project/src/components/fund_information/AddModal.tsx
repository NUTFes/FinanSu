import {
  ChakraProvider,
  Select,
  Center,
  Input,
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
import { useRouter } from 'next/router';
import React, { FC, useState, useMemo } from 'react';
import { useEffect } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { post } from '@api/fundInformations';
import theme from '@assets/theme';
import RegistButton from '@components/common/RegistButton';
import { useGlobalContext } from '@components/global/context';
import { Teacher, Department, User } from '@type/common';

interface FormData {
  user_id: number | string;
  teacher_id: number | string;
  price: number;
  remark: string;
  is_first_check: boolean;
  is_last_check: boolean;
  departmentID: number | string;
}

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  teachersInformation: Teacher[];
  departments: Department[];
  currentUser: User;
  userID: number | string;
}

const OpenAddModal: FC<ModalProps> = (props) => {
  const state = useGlobalContext();
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    user_id: state.user.id,
    teacher_id: 1,
    price: 0,
    remark: '',
    is_first_check: false,
    is_last_check: false,
    departmentID: 1,
  });

  useEffect(() => {
    if (router.isReady) {
      const initFormData: FormData = {
        user_id: state.user.id,
        teacher_id: 1,
        price: 0,
        remark: '',
        is_first_check: false,
        is_last_check: false,
        departmentID: 1,
      };
      setFormData(initFormData);
    }
  }, [state.user, router.isReady]);

  // 学科別教員リストの用意
  // // 電気電子情報
  const electricalTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 1),
    [props.teachersInformation],
  );
  // // 生物
  const biologicalTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 2),
    [props.teachersInformation],
  );
  // // 機械
  const machineTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 3),
    [props.teachersInformation],
  );
  // // 物質
  const materialTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 4),
    [props.teachersInformation],
  );
  // // 環境社会基盤
  const environmentalTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 5),
    [props.teachersInformation],
  );
  // // 情報・経営
  const informationManagementTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 6),
    [props.teachersInformation],
  );
  // // 基盤共通
  const commonEducationTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 7),
    [props.teachersInformation],
  );
  // // 原子力
  const nuclearTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 8),
    [props.teachersInformation],
  );
  // // 技学イノベ
  const technologyInovationTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 9),
    [props.teachersInformation],
  );
  // // システム安全
  const systemSafetyTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 10),
    [props.teachersInformation],
  );
  // // 技術支援
  const technologySupportTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 11),
    [props.teachersInformation],
  );
  // // 産学融合
  const industryAcademiaFusionTeachers: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 12),
    [props.teachersInformation],
  );
  // // 学長・事務
  const presidentClericals: Teacher[] = useMemo(
    () => props.teachersInformation.filter((teacher) => teacher.departmentID === 13),
    [props.teachersInformation],
  );

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addFundInformation = async (data: any) => {
    const addFundInformationUrl = process.env.CSR_API_URI + '/fund_informations';
    await post(addFundInformationUrl, data);
  };

  // 学科ごとの教員のセレクトボックス
  const selectTeacherContent = (teachers: Teacher[]) => {
    return (
      <>
        <Select
          value={formData.teacher_id}
          onChange={handler('teacher_id')}
          borderRadius='full'
          borderColor='primary.1'
          w='100'
        >
          {teachers.map((data) => (
            <option key={data.id} value={data.id}>
              {data.name}
            </option>
          ))}
        </Select>
      </>
    );
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
                      教員名
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={9}>
                    {formData.departmentID == 1 && selectTeacherContent(electricalTeachers)}
                    {formData.departmentID == 2 && selectTeacherContent(biologicalTeachers)}
                    {formData.departmentID == 3 && selectTeacherContent(machineTeachers)}
                    {formData.departmentID == 4 && selectTeacherContent(materialTeachers)}
                    {formData.departmentID == 5 && selectTeacherContent(environmentalTeachers)}
                    {formData.departmentID == 6 &&
                      selectTeacherContent(informationManagementTeachers)}
                    {formData.departmentID == 7 && selectTeacherContent(commonEducationTeachers)}
                    {formData.departmentID == 8 && selectTeacherContent(nuclearTeachers)}
                    {formData.departmentID == 9 &&
                      selectTeacherContent(technologyInovationTeachers)}
                    {formData.departmentID == 10 && selectTeacherContent(systemSafetyTeachers)}
                    {formData.departmentID == 11 && selectTeacherContent(technologySupportTeachers)}
                    {formData.departmentID == 12 &&
                      selectTeacherContent(industryAcademiaFusionTeachers)}
                    {formData.departmentID == 13 && selectTeacherContent(presidentClericals)}
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
