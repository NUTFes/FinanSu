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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import theme from '@assets/theme';
import Header from '@components/Header';
import OpenEditModalButton from '@components/user/OpenEditModalButton';
import OpenDeleteModalButton from '@components/user/OpenDeleteModalButton';
import { get, get_with_token } from '@api/api_methods';

interface Department {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  department_id: number | string;
  role_id: number;
}

interface Props {
  departments: Department[];
  users: User[];
  currentUser: User;
  roles: Role[];
}

export const getServerSideProps = async () => {
  const getDepartmentURL = process.env.SSR_API_URI + '/departments';
  const getUserURL = process.env.SSR_API_URI + '/users';
  const departmentRes = await get(getDepartmentURL);
  const userRes = await get(getUserURL);

  return {
    props: {
      departments: departmentRes,
      users: userRes,
    },
  };
};

export default function Users(props: Props) {
  const users = props.users;
  const departments = props.departments;

  // ログイン中のユーザ
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    department_id: 1,
    role_id: 1,
  });

  // ログイン中のユーザの権限
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);

  const router = useRouter();

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      // current_userの取得とセット
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const currentUserRes = await get_with_token(url);
        setCurrentUser(currentUserRes);

        // current_userの権限を開発者に設定
        if (currentUserRes.role_id == 2) {
          setIsDeveloper(true);
        }
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);

  for (let i = 0; i < props.users.length; i++) {
    for (let j = 0; j < props.departments.length; j++) {
      if (props.users[i].department_id == props.departments[j].id) {
        props.users[i].department_id = props.departments[j].name;
      }
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>FinanSu | ユーザ一覧</title>
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
                ユーザ一覧
              </Center>
              <Select variant='flushed' w='100'>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </Select>
            </Flex>
            <Flex>
              <Spacer />
              <Box></Box>
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
                      学科
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      権限
                    </Center>
                  </Th>
                  {isDeveloper && <Th borderBottomColor='#76E4F7'></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user: User) => (
                  <Tr key={user.id}>
                    <Td>
                      <Center color='black.300'>{user.name}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{user.department_id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{user.role_id}</Center>
                    </Td>
                    <Td>
                      {/* developerなら編集・削除可能 */}
                      {isDeveloper && (
                        <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                          <GridItem>
                            <Center>
                              <OpenEditModalButton id={user.id} departments={departments} />
                            </Center>
                          </GridItem>
                          <GridItem>
                            <Center>
                              <OpenDeleteModalButton id={user.id} departments={departments} />
                            </Center>
                          </GridItem>
                        </Grid>
                      )}
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
  // }
}
