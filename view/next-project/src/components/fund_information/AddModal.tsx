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

interface User {
  id: number | string;
  name: string;
  bureau_id: number;
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

interface FormData {
  user_id: number | string;
  teacher_id: number | string;
  price: number;
  remark: string;
  is_first_check: boolean;
  is_last_check: boolean;
  department_id: number | string;
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
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const initFormData: FormData = {
    user_id: 1,
    teacher_id: 1,
    price: 0,
    remark: '',
    is_first_check: false,
    is_last_check: false,
    department_id: 1,
  };
  let updateFormData: FormData = {
    user_id: 1,
    teacher_id: 1,
    price: 0,
    remark: '',
    is_first_check: false,
    is_last_check: false,
    department_id: 1,
  };
  const [formData, setFormData] = useState<FormData>(initFormData);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    bureau_id: 1,
    role_id: 1,
  });

  const initTeacherData: Teacher = {
    id: 1,
    name: '',
    position: '',
    department_id: 1,
    room: '',
    is_black: false,
    remark: '',
    created_at: '',
    updated_at: '',
  };

  // let machineTeacher: Teacher[] = new Array();
  // let electricalTeacher: Teacher[] = new Array();
  // let informationManagementTeacher: Teacher[] = new Array();
  // let materialBiologicalTeacher: Teacher[] = new Array();
  // let environmentalTeacher: Teacher[] = new Array();
  // let nuclearTeacher: Teacher[] = new Array();
  // let otherTeacher: Teacher[] = new Array();

  const [machineTeacher, setMachineTeacher] = useState<Teacher[]>([initTeacherData]);
  const [electricalTeacher, setElectricalTeacher] = useState<Teacher[]>([initTeacherData]);
  const [informationManagementTeacher, setInformationManagementTeacher] = useState<Teacher[]>([
    initTeacherData,
  ]);
  const [materialBiologicalTeacher, setMaterialBiologicalTeacher] = useState<Teacher[]>([
    initTeacherData,
  ]);
  const [environmentalTeacher, setEnvironmentalTeacher] = useState<Teacher[]>([initTeacherData]);
  const [nuclearTeacher, setNuclearTeacher] = useState<Teacher[]>([initTeacherData]);
  const [otherTeacher, setOtherTeacher] = useState<Teacher[]>([initTeacherData]);

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

      // 学科別教員リストの用意
      props.teachersInformation.map((teacher) => {
        // 機械
        if (teacher.department_id == 1) {
          setMachineTeacher((machineTeacher) => [...machineTeacher, teacher]);
        }
        // 電気電子情報
        else if (teacher.department_id == 2) {
          setElectricalTeacher((electricalTeacher) => [...electricalTeacher, teacher]);
        }
        // 情報・経営
        else if (teacher.department_id == 3) {
          setInformationManagementTeacher((informationManagementTeacher) => [
            ...informationManagementTeacher,
            teacher,
          ]);
        }
        // 物質生物
        else if (teacher.department_id == 4) {
          setMaterialBiologicalTeacher((materialBiologicalTeacher) => [
            ...materialBiologicalTeacher,
            teacher,
          ]);
        }
        // 環境社会基盤
        else if (teacher.department_id == 5) {
          setEnvironmentalTeacher((environmentalTeacher) => [...environmentalTeacher, teacher]);
        }
        // 原子力
        else if (teacher.department_id == 6) {
          setNuclearTeacher((nuclearTeacher) => [...nuclearTeacher, teacher]);
        } else {
          setOtherTeacher((otherTeacher) => [...otherTeacher, teacher]);
        }
      });
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
                      value={formData.department_id}
                      onChange={handler('department_id')}
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
                    {formData.department_id == 1 && selectTeacherContent(machineTeacher)}
                    {formData.department_id == 2 && selectTeacherContent(electricalTeacher)}
                    {formData.department_id == 3 &&
                      selectTeacherContent(informationManagementTeacher)}
                    {formData.department_id == 4 && selectTeacherContent(materialBiologicalTeacher)}
                    {formData.department_id == 5 && selectTeacherContent(environmentalTeacher)}
                    {formData.department_id == 6 && selectTeacherContent(nuclearTeacher)}
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
