import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { BUREAUS } from '@/constants/bureaus';
import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import theme from '@assets/theme';
import Header from '@components/common/Header';
import OpenDeleteModalButton from '@components/users/OpenDeleteModalButton';
import OpenEditModalButton from '@components/users/OpenEditModalButton';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  bureau_id: number | string;
  role_id: number;
}

interface Bureau {
  id: number;
  name: string;
}

interface Props {
  // bureaus: Bureau[];
  users: User[];
  currentUser: User;
  roles: Role[];
}

export const getServerSideProps = async () => {
  const getUserURL = process.env.SSR_API_URI + '/users';
  const userRes = await get(getUserURL);

  return {
    props: {
      users: userRes,
    },
  };
};

export default function Users(props: Props) {
  const users = props.users;

  const user = useRecoilValue(userAtom);

  // ログイン中のユーザの権限
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);

  const router = useRouter();

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      // current_userの権限を開発者に設定
      if (user.roleID == 2) {
        setIsDeveloper(true);
      }
    }
  }, [router]);

  for (let i = 0; i < props.users.length; i++) {
    for (let j = 0; j < BUREAUS.length; j++) {
      if (props.users[i].bureau_id == BUREAUS[j].id) {
        props.users[i].bureau_id = BUREAUS[j].name;
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
                      <Center color='black.300'>{user.bureau_id}</Center>
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
                              <OpenEditModalButton id={user.id} bureaus={BUREAUS} />
                            </Center>
                          </GridItem>
                          <GridItem>
                            <Center>
                              <OpenDeleteModalButton id={user.id} bureaus={BUREAUS} />
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
