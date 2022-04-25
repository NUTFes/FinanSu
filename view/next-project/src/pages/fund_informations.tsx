import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  ChakraProvider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spacer,
  Select,
  Center,
  Checkbox,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import theme from '@assets/theme';
import Header from '@components/Header';
import OpenAddModalButton from '@components/fund_information/OpenAddModalButton';
import OpenEditModalButton from '@components/fund_information/OpenEditModalButton';
import OpenDeleteModalButton from '@components/fund_information/OpenDeleteModalButton';
import { put } from '@api/fundInformations';
import { get, get_with_token } from '@api/api_methods';

interface FundInformation {
  id: number;
  user_id: number;
  teacher_id: number;
  price: number;
  remark: string;
  is_first_check: boolean;
  is_last_check: boolean;
  created_at: string;
  updated_at: string;
}

interface Teachers {
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

interface Props {
  teachers: Teachers[];
  fundInformation: FundInformation[];
  fundInformationView: any[];
  currentUser: User;
}

export const getServerSideProps = async () => {
  const getTeachersInformationURL = process.env.SSR_API_URI + '/teachers';
  const getFundInformationViewURL = process.env.SSR_API_URI + '/get_fund_informations_for_view';
  const teachersInformationRes = await get(getTeachersInformationURL);
  const fundInformationViewRes = await get(getFundInformationViewURL);
  return {
    props: {
      teachers: teachersInformationRes,
      fundInformationView: fundInformationViewRes,
    },
  };
};

export default function FundInformations(props: Props) {
  // ログイン中のユーザ
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    department_id: 1,
    role_id: 1,
  });

  // ログイン中のユーザの権限
  const [isFinanceDirector, setIsFinanceDirector] = useState<boolean>(false);
  const [isFinanceStaff, setIsFinanceStaff] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  const router = useRouter();

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const res = await get_with_token(url);
        setCurrentUser(res);

        // current_userの権限をユーザに設定
        if (res.role_id == 1) {
          setIsUser(true);
        }
        // current_userの権限を財務局長に設定
        else if (res.role_id == 3) {
          setIsFinanceDirector(true);
        }
        // current_userの権限を財務局員に設定
        else if (res.role_id == 4) {
          setIsFinanceStaff(true);
        }
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);
  const userID = currentUser.id;

  // 教員一覧
  const teachers = props.teachers;
  // 募金一覧
  const [fundInformations, setFundInformations] = useState<FundInformation[]>(
    props.fundInformation,
  );

  // チェックの切り替え
  const switchCheck = (isChecked: boolean, id: number, input: string) => {
    setFundInformations(
      fundInformations.map((fundViewItem: any) =>
        fundViewItem.id === id ? { ...fundViewItem, [input]: !isChecked } : fundViewItem,
      ),
    );
  };

  // checkboxの値が変わったときに更新
  const submit = async (id: number) => {
    const putUrl = process.env.CSR_API_URI + '/fund_informations/' + id;
    for (let i = 0; i < fundInformations.length; i++) {
      if (fundInformations[i].id == id) {
        const fundInformation = fundInformations[i];
        await put(putUrl, fundInformation);
      }
    }
  };

  // 変更不可能なcheckboxの描画
  const changeableCheckboxContent = (isChecked: boolean, id: number, input: string) => {
    {
      if (isChecked) {
        return (
          <>
            <Checkbox
              onChange={() => {
                switchCheck(isChecked, id, input);
              }}
            ></Checkbox>
          </>
        );
      } else {
        return (
          <>
            <Checkbox
              onChange={() => {
                switchCheck(isChecked, id, input);
              }}
            ></Checkbox>
          </>
        );
      }
    }
  };

  // 変更不可能なcheckboxの描画
  const unChangeableCheckboxContent = (isChecked: boolean, id: number, input: string) => {
    {
      if (isChecked) {
        return (
          <>
            <Checkbox
              defaultChecked
              isDisabled
              onChange={() => {
                switchCheck(isChecked, id, input);
              }}
            ></Checkbox>
          </>
        );
      } else {
        return (
          <>
            <Checkbox
              isDisabled
              onChange={() => {
                switchCheck(isChecked, id, input);
              }}
            ></Checkbox>
          </>
        );
      }
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>FinanSu | 募金一覧</title>
        <meta name='description' content='ja' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <hr />
      <Center>
        <Box m='10' px='10' boxShadow='base' rounded='lg'>
          <Box mt='10' mx='5'>
            <Flex>
              <Center mr='5' fontSize='2xl' fontWeight='100' color='black.0'>
                募金一覧
              </Center>
              <Select variant='flushed' w='100'>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </Select>
            </Flex>
            <Flex>
              <Spacer />
              <Box>
                <OpenAddModalButton
                  teachersInformation={teachers}
                  currentUser={currentUser}
                  userID={userID}
                >
                  学内募金登録
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
                      財務局員確認
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      財務局長確認
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      教員名
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      居室
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      担当者
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      金額
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
                {props.fundInformationView.map((fundViewItem) => (
                  <Tr
                    key={fundViewItem.fund_information.id}
                    onUnload={submit(fundViewItem.fund_information.id)}
                  >
                    <Td>
                      <Center color='black.300'>
                        {isFinanceDirector &&
                          changeableCheckboxContent(
                            fundViewItem.fund_information.is_first_check,
                            fundViewItem.fund_information.teacher_id,
                            'is_first_check',
                          )}
                        {isFinanceStaff &&
                          changeableCheckboxContent(
                            fundViewItem.fund_information.is_first_check,
                            fundViewItem.fund_information.teacher_id,
                            'is_first_check',
                          )}
                        {isUser &&
                          unChangeableCheckboxContent(
                            fundViewItem.fund_information.is_first_check,
                            fundViewItem.fund_information.teacher_id,
                            'is_first_check',
                          )}
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>
                        {isFinanceDirector &&
                          changeableCheckboxContent(
                            fundViewItem.fund_information.is_first_check,
                            fundViewItem.fund_information.teacher_id,
                            'is_first_check',
                          )}
                        {isFinanceStaff &&
                          unChangeableCheckboxContent(
                            fundViewItem.fund_information.is_first_check,
                            fundViewItem.fund_information.teacher_id,
                            'is_first_check',
                          )}
                        {isUser &&
                          unChangeableCheckboxContent(
                            fundViewItem.fund_information.is_first_check,
                            fundViewItem.fund_information.teacher_id,
                            'is_first_check',
                          )}
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundViewItem.teacher.name}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundViewItem.teacher.room}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundViewItem.user.name}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundViewItem.fund_information.price}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundViewItem.fund_information.remark}</Center>
                    </Td>
                    <Td>
                      <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                        <GridItem>
                          <Center>
                            <OpenEditModalButton
                              id={fundViewItem.fund_information.id}
                              teachersInformation={teachers}
                              currentUser={currentUser}
                            />
                          </Center>
                        </GridItem>
                        <GridItem>
                          <Center>
                            <OpenDeleteModalButton
                              id={fundViewItem.fund_information.id}
                              teacher_id={fundViewItem.fund_information.teacher_id}
                              user_id={Number(fundViewItem.fund_information.user_id)}
                            />
                          </Center>
                        </GridItem>
                      </Grid>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
