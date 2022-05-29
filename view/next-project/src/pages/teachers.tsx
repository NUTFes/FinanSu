import Head from 'next/head';
import { useState } from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spacer,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { Center } from '@chakra-ui/react';
import { RiAddCircleLine } from 'react-icons/ri';
import { get } from '@api/fundInformations';
import MainLayout from '@components/layout/MainLayout';
import EditButton from '@components/General/EditButton';
import OpenAddModalButton from '@components/teacher/OpenAddModalButton';
import OpenEditModalButton from '@components/teacher/OpenEditModalButton';
import OpenDeleteModalButton from '@components/teacher/OpenDeleteModalButton';

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

interface TeacherInformation {
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

interface Department {
  id: number;
  name: string;
}

interface Props {
  teacherInformation: TeacherInformation[];
}

export const getStaticProps = async () => {
  const getTeacherInformationURL = process.env.SSR_API_URI + '/teachers';
  const teacherInformationRes = await get(getTeacherInformationURL);
  return {
    props: {
      teacherInformation: teacherInformationRes,
    },
  };
};
export default function TeachersList(props: Props) {
  const [teachersList, setTeachersList] = useState<TeacherInformation[]>(props.teacherInformation);
  // 学科一覧
  const departments: Department[] = [
    {
      id: 1,
      name: '機械工学分野/機械創造工学課程・機械創造工学専攻',
    },
    {
      id: 2,
      name: '電気電子情報工学分野/電気電子情報工学課程/電気電子情報工学専攻',
    },
    {
      id: 3,
      name: '情報・経営システム工学分野/情報・経営システム工学課程/情報・経営システム工学専攻',
    },
    {
      id: 4,
      name: '物質生物工学分野/物質材料工学課程/生物機能工学課程/物質材料工学専攻/生物機能工学専攻',
    },
    {
      id: 5,
      name: '環境社会基盤工学分野/環境社会基盤工学課程/環境社会基盤工学専攻',
    },
    {
      id: 6,
      name: '量子・原子力統合工学分野/原子力システム安全工学専攻',
    },
  ];

  // 全教員のラジオボタンが押されたときの処理
  const allTeachersList = () => {
    setTeachersList(props.teacherInformation);
  };
  // 募金先教員のラジオボタンが押されたときの処理
  const investorList = () => {
    setTeachersList(props.teacherInformation.filter((teacher) => teacher.is_black == false));
  };

  return (
    <MainLayout>
      <Center>
        <Box m='10' px='10' boxShadow='base' rounded='lg'>
          <Box mt='10' mx='5'>
            <Flex>
              <Center mr='5' fontSize='2xl' fontWeight='100' color='black.0'>
                教員一覧
              </Center>
            </Flex>
            <Flex>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row'>
                  <Radio color='primary.2' value='1' onClick={allTeachersList}>
                    全教員
                  </Radio>
                  <Radio color='primary.2' value='2' onClick={investorList}>
                    募金先教員
                  </Radio>
                </Stack>
              </RadioGroup>
              <Spacer />
              <Box>
                <OpenAddModalButton teachersInformation={teachersList} departments={departments}>
                  教員登録
                </OpenAddModalButton>
              </Box>
            </Flex>
          </Box>
          <Box p='5' mb='2'>
            <Table>
              <Thead>
                <Tr>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      氏名
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      職位
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      学科
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      居室
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      備考
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'></Th>
                </Tr>
              </Thead>
              <Tbody>
                {teachersList.map((teachersItem) => (
                  <Tr key={teachersItem.name}>
                    <Td>
                      {teachersItem.is_black && (
                        <Center color='black.900'>{teachersItem.name}</Center>
                      )}
                      {!teachersItem.is_black && (
                        <Center color='black.300'>{teachersItem.name}</Center>
                      )}
                    </Td>
                    <Td>
                      <Center color='black.300'>{teachersItem.position}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>
                        {teachersItem.department_id == 1 && (
                          <Text>機械工学分野/機械創造工学課程・機械創造工学専攻</Text>
                        )}
                        {teachersItem.department_id == 2 && (
                          <Text>
                            電気電子情報工学分野/電気電子情報工学課程/電気電子情報工学専攻
                          </Text>
                        )}
                        {teachersItem.department_id == 3 && (
                          <Text>
                            情報・経営システム工学分野/情報・経営システム工学課程/情報・経営システム工学専攻
                          </Text>
                        )}
                        {teachersItem.department_id == 4 && (
                          <Text>
                            物質生物工学分野/物質材料工学課程/生物機能工学課程/物質材料工学専攻/生物機能工学専攻
                          </Text>
                        )}
                        {teachersItem.department_id == 5 && (
                          <Text>
                            環境社会基盤工学分野/環境社会基盤工学課程/環境社会基盤工学専攻
                          </Text>
                        )}
                        {teachersItem.department_id == 6 && (
                          <Text>量子・原子力統合工学分野/原子力システム安全工学専攻</Text>
                        )}
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{teachersItem.room}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{teachersItem.remark}</Center>
                    </Td>
                    <Td>
                      <Center>
                        <EditButton />
                      </Center>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Center>
    </MainLayout>
  );
}
