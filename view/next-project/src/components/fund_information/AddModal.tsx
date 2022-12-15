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
  Select,
  Spacer,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { post } from '@api/fundInformations';
import theme from '@assets/theme';
import RegistButton from '@components/common/RegistButton';
import { Department, FundInformation, Teacher, User } from '@type/common';


interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
  children?: React.ReactNode;
  teachersInformation: Teacher[];
  departments: Department[];
  currentUser: User;
  userID: number | string;
}

const OpenAddModal: FC<ModalProps> = (props) => {
  const [user] = useRecoilState(userAtom);

  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();
  const [departmentID, setDepartmentID] = useState<number | string>(1);
  const [formData, setFormData] = useState<FundInformation>({
    userID: user.id,
    teacherID: 1,
    price: 0,
    remark: '',
    isFirstCheck: false,
    isLastCheck: false,
  });

  useEffect(() => {
    if (router.isReady) {
      const initFormData: FundInformation = {
        userID: user.id,
        teacherID: 1,
        price: 0,
        remark: '',
        isFirstCheck: false,
        isLastCheck: false,
      };
      setFormData(initFormData);
    }
  }, [user, router.isReady]);

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

  const handleDepartmentID = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentID(Number(e.target.value));
  };

  const addFundInformation = async (data: FundInformation) => {
    const addFundInformationUrl = process.env.CSR_API_URI + '/fund_informations';
    await post(addFundInformationUrl, data);
  };

  // 学科ごとの教員のセレクトボックス
  const selectTeacherContent = (teachers: Teacher[]) => {
    return (
      <>
        <Select
          value={formData.teacherID}
          onChange={handler('teacherID')}
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
                      value={departmentID}
                      onChange={handleDepartmentID}
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
                    {departmentID == 1 && selectTeacherContent(electricalTeachers)}
                    {departmentID == 2 && selectTeacherContent(biologicalTeachers)}
                    {departmentID == 3 && selectTeacherContent(machineTeachers)}
                    {departmentID == 4 && selectTeacherContent(materialTeachers)}
                    {departmentID == 5 && selectTeacherContent(environmentalTeachers)}
                    {departmentID == 6 && selectTeacherContent(informationManagementTeachers)}
                    {departmentID == 7 && selectTeacherContent(commonEducationTeachers)}
                    {departmentID == 8 && selectTeacherContent(nuclearTeachers)}
                    {departmentID == 9 && selectTeacherContent(technologyInovationTeachers)}
                    {departmentID == 10 && selectTeacherContent(systemSafetyTeachers)}
                    {departmentID == 11 && selectTeacherContent(technologySupportTeachers)}
                    {departmentID == 12 && selectTeacherContent(industryAcademiaFusionTeachers)}
                    {departmentID == 13 && selectTeacherContent(presidentClericals)}
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
