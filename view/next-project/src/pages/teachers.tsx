import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Center } from '@chakra-ui/react';
import { get, get_with_token } from '@api/api_methods';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/teacher/OpenAddModalButton';
import OpenEditModalButton from '@components/teacher/OpenEditModalButton';
import OpenDeleteModalButton from '@components/teacher/OpenDeleteModalButton';
import DetailModal from '@components/teacher/DetailModal';

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
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

interface Department {
  id: number;
  name: string;
}

interface Props {
  teachers: Teacher[];
}

export const getStaticProps = async () => {
  const getTeacherURL = process.env.SSR_API_URI + '/teachers';
  const teacherRes = await get(getTeacherURL);
  return {
    props: {
      teachers: teacherRes,
    },
  };
};
export default function TeachersList(props: Props) {
  const [teachersList, setTeachersList] = useState<Teacher[]>(props.teachers);
  // 学科一覧
  const departments: Department[] = [
    {
      id: 1,
      name: '電気電子情報',
    },
    {
      id: 2,
      name: '生物機能',
    },
    {
      id: 3,
      name: '機械創造',
    },
    {
      id: 4,
      name: '物質材料',
    },
    {
      id: 5,
      name: '環境社会基盤',
    },
    {
      id: 6,
      name: '情報・経営システム',
    },
    {
      id: 7,
      name: '基盤共通教育',
    },
    {
      id: 8,
      name: '原子力システム安全',
    },
    {
      id: 9,
      name: '技術科学イノベーション',
    },
    {
      id: 10,
      name: 'システム安全',
    },
    {
      id: 11,
      name: '技術支援',
    },
    {
      id: 12,
      name: 'その他',
    },
    {
      id: 13,
      name: '学長・事務',
    },
    {
      id: 14,
      name: 'FL',
    },
  ];

  // 詳細モーダル用の変数
  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };

  const router = useRouter();

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      // current_userの取得とセット
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const currentUserRes = await get_with_token(url);

        // current_userの権限がユーザなら前のページに戻る
        if (currentUserRes.role_id == 1) {
          router.back();
        }
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);

  // 全教員のラジオボタンが押されたときの処理
  const allTeachersList = () => {
    setTeachersList(props.teachers);
  };
  // 募金先教員のラジオボタンが押されたときの処理
  const investorList = () => {
    setTeachersList(props.teachers.filter((teacher) => teacher.is_black == false));
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
                    <Td onClick={() => ShowModal()}>
                      {teachersItem.is_black && (
                        <Center color='black.900'>{teachersItem.name}</Center>
                      )}
                      {!teachersItem.is_black && (
                        <Center color='black.300'>{teachersItem.name}</Center>
                      )}
                    </Td>
                    <Td onClick={() => ShowModal()}>
                      <Center color='black.300'>{teachersItem.position}</Center>
                    </Td>
                    <Td onClick={() => ShowModal()}>
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
                    <Td onClick={() => ShowModal()}>
                      <Center color='black.300'>{teachersItem.room}</Center>
                    </Td>
                    <Td onClick={() => ShowModal()}>
                      <Center color='black.300'>{teachersItem.remark}</Center>
                    </Td>
                    <Td>
                      <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                        <GridItem>
                          <Center>
                            <OpenEditModalButton
                              id={teachersItem.id}
                              teacher={teachersItem}
                              departments={departments}
                            />
                          </Center>
                        </GridItem>
                        <GridItem>
                          <Center>
                            <OpenDeleteModalButton
                              id={teachersItem.id}
                              teacher={teachersItem}
                              departments={departments}
                            />
                          </Center>
                        </GridItem>
                      </Grid>
                    </Td>
                    <DetailModal
                      teacher={teachersItem}
                      openModal={showModal}
                      setShowModal={setShowModal}
                    />
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
