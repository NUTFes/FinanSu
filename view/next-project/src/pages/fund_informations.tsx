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
import { get, put } from '@api/fundInformations';
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

export default function FundInformations(props: Props) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    department_id: 1,
    role_id: 1,
  });

  const router = useRouter();

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        setCurrentUser(await get_with_token(url));
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);
  const userID = currentUser.id;

  const teachersInformation = props.teachersInformation;
  const [fundInformations, setFundInformations] = useState<FundInformation[]>(
    props.fundInformation,
  );
  const switchCheck = (isChecked: boolean, id: number, input: string) => {
    setFundInformations(
      fundInformations.map((fundItem: any) =>
        fundItem.id === id ? { ...fundItem, [input]: !isChecked } : fundItem,
      ),
    );
  };
  const submit = async (id: number) => {
    const putUrl = process.env.CSR_API_URI + '/fund_informations/' + id;
    for (let i = 0; i < fundInformations.length; i++) {
      if (fundInformations[i].id == id) {
        const fundInformation = fundInformations[i];
        await put(putUrl, fundInformation);
      }
    }
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
                <OpenAddModalButton
                  teachersInformation={teachersInformation}
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
                {fundInformations.map((fundItem) => (
                  <Tr key={fundItem.id} onUnload={submit(fundItem.id)}>
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
                      <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                        <GridItem>
                          <Center>
                            <OpenEditModalButton
                              id={fundItem.id}
                              teachersInformation={teachersInformation}
                              currentUser={currentUser}
                            />
                          </Center>
                        </GridItem>
                        <GridItem>
                          <Center>
                            <OpenDeleteModalButton
                              id={fundItem.id}
                              teacher_id={fundItem.teacher_id}
                              user_id={fundItem.user_id}
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
