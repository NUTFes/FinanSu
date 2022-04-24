import Head from 'next/head';
import { Box, ChakraProvider } from '@chakra-ui/react';
import OpenEditModalButton from '@components/fund_information/OpenEditModalButton';
import FundInformationAddButton from '@components/fund_information/FundInformationAddButton';
import { Table, Thead, Tbody, Tr, Th, Td, Flex, Spacer, Select } from '@chakra-ui/react';
import theme from '@assets/theme';
import { Center } from '@chakra-ui/react';
import Header from '@components/Header';
import { get, put } from '@api/fundInformations';
import { Checkbox } from '@chakra-ui/react';
import { useState } from 'react';
import { get_with_token } from '@api/api_methods';

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

interface Props {
  teachersInformation: TeachersInformation[];
  fundInformation: FundInformation[];
  currentUser: User;
}

export const getServerSideProps = async () => {
  const getTeachersInformationURL = process.env.SSR_API_URI + '/teachers';
  const getUrl = process.env.SSR_API_URI + '/fund_informations';
  const teachersInformationRes = await get(getTeachersInformationURL);
  const fundInformationRes = await get(getUrl);
  return {
    props: {
      teachersInformation: teachersInformationRes,
      fundInformation: fundInformationRes,
    },
  };
};

export default function FundList(props: Props) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    name: '',
    department_id: 1,
    role_id: 1,
  });

  // ページ読み込み時にcurrent_userを取得
  if (typeof window !== 'undefined') {
    window.onload = async function () {
      // current_userを取得
      const getCurrentUserUrl = process.env.CSR_API_URI + '/current_user';
      const currentUserRes = await get_with_token(getCurrentUserUrl);
      const currentUserData: User = {
        id: currentUserRes.id,
        name: currentUserRes.name,
        department_id: currentUserRes.department_id,
        role_id: currentUserRes.role_id,
      };
      // current_userにセット
      setCurrentUser({
        id: currentUserData.id,
        name: currentUserData.name,
        department_id: currentUserData.department_id,
        role_id: currentUserData.role_id,
      });
    };
  }

  const teachersInformation = props.teachersInformation;
  const [fundList, setFundList] = useState<FundInformation[]>(props.fundInformation);
  const switchCheck = (isChecked: boolean, id: number, input: string) => {
    setFundList(
      fundList.map((fundItem: any) =>
        fundItem.id === id ? { ...fundItem, [input]: !isChecked } : fundItem,
      ),
    );
  };
  const submit = async (id: number) => {
    const putUrl = process.env.CSR_API_URI + '/fund_informations/' + id;
    await put(putUrl, fundList[id - 1]);
  };
  const checkboxContent = (isChecked: boolean, id: number, input: string) => {
    {
      if (isChecked) {
        return (
          <>
            <Checkbox
              defaultChecked
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
                <FundInformationAddButton
                  teachersInformation={teachersInformation}
                  currentUser={currentUser}
                  // leftIcon={<RiAddCircleLine color={'white'} />}
                >
                  学内募金登録
                </FundInformationAddButton>
              </Box>
            </Flex>
          </Box>
          <Box p='5' mb='2'>
            <Table>
              <Thead>
                <Tr>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      自局長確認
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      財務局長確認
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      氏名
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
                {fundList.map((fundItem) => (
                  <Tr key={fundItem.teacher_id} onUnload={submit(fundItem.teacher_id)}>
                    <Td>
                      <Center color='black.300'>
                        {checkboxContent(
                          fundItem.is_first_check,
                          fundItem.teacher_id,
                          'is_first_check',
                        )}
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>
                        {checkboxContent(
                          fundItem.is_last_check,
                          fundItem.teacher_id,
                          'is_last_check',
                        )}
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>會田英雄</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>機械・建設1号棟629</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundItem.user_id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundItem.price}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundItem.remark}</Center>
                    </Td>
                    <Td>
                      <Center>
                        <OpenEditModalButton
                          id={fundItem.id}
                          teachersInformation={teachersInformation}
                          currentUser={currentUser}
                        />
                      </Center>
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
