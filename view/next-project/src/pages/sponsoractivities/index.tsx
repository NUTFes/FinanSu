import { Table, Thead, Tbody, Tr, Th, Td, Flex, Spacer, Select } from '@chakra-ui/react';
import { Center, Box } from '@chakra-ui/react';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';

import MainLayout from '@/components/layout/MainLayout';
import EditButton from '@components/common/EditButton';
import RegistButton from '@components/common/RegistButton';

import type { NextPage } from 'next';

interface activity {
  id: number;
  sponsor_id: number;
  sponsor_style_id: number;
  user_id: number;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

const activity: NextPage = () => {
  const activity = [
    {
      id: 1,
      sponsor_id: 1,
      sponsor_style_id: 1,
      user_id: 1,
      is_done: true,
      created_at: '2022/3/1',
      updated_at: '2022/3/2',
    },
    {
      id: 2,
      sponsor_id: 2,
      sponsor_style_id: 2,
      user_id: 2,
      is_done: false,
      created_at: '2022/3/1',
      updated_at: '2022/3/2',
    },
  ];
  return (
    <MainLayout>
      <Head>
        <title>協賛活動一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Center>
        <Box m='10' px='10' boxShadow='base' rounded='lg'>
          <Box mt='10' mx='5'>
            <Flex>
              <Center mr='5' fontSize='2xl' fontWeight='100' color='black.0'>
                協賛金回収状況
              </Center>
              <Select variant='flushed' w='100'>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </Select>
            </Flex>
            <Flex>
              <Spacer />
              <Box>
                <RegistButton>
                  <RiAddCircleLine
                    size={20}
                    style={{
                      marginRight: 5,
                    }}
                  />
                  協賛スタイル登録
                </RegistButton>
              </Box>
            </Flex>
          </Box>
          <Box p='5' mb='2'>
            <Table>
              <Thead>
                <Tr>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ID
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      協賛ID
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' mr='1' color='black.600'>
                      協賛スタイルID
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ユーザーID
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      回収状況
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'></Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      作成日時
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      更新日時
                    </Center>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {activity.map((activityItem) => (
                  <Tr key={activityItem.id}>
                    <Td>
                      <Center color='black.300'>{activityItem.id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{activityItem.sponsor_id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{activityItem.sponsor_style_id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{activityItem.user_id}</Center>
                    </Td>
                    <Td>
                      {activityItem.is_done && <Center color='black.300'>回収完了</Center>}
                      {!activityItem.is_done && <Center color='black.300'>未回収</Center>}
                    </Td>
                    <Td>
                      <Center>
                        <EditButton />
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{activityItem.created_at}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{activityItem.updated_at}</Center>
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
};

export default activity;
