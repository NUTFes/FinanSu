import {
  Box,
  Center,
  ChakraProvider,
  Flex,
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
import { RiAddCircleLine } from 'react-icons/ri';

import { get } from '@api/sponsorship';
import theme from '@assets/theme';
import EditButton from '@components/common/EditButton';
import Header from '@components/common/Header';
import RegistButton from '@components/common/RegistButton';
import MainLayout from '@/components/layout/MainLayout';

interface SponsorStyle {
  id: number;
  scale: string;
  is_color: boolean;
  price: number;
  created_at: string;
  updated_at: string;
}
interface Props {
  sponsorstyles: SponsorStyle[];
}
export const getServerSideProps = async () => {
  const getSponsorstylesUrl = process.env.SSR_API_URI + '/sponsorstyles';
  const sponsorstylesRes = await get(getSponsorstylesUrl);
  return {
    props: {
      sponsorstyles: sponsorstylesRes,
    },
  };
};
export default function SponsorList(props: Props) {
  const sponsorList: SponsorStyle[] = props.sponsorstyles;
  return (
    <MainLayout>
      <Head>
        <title>協賛スタイル一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Center>
        <Box m='10' px='10' boxShadow='base' rounded='lg'>
          <Box mt='10' mx='5'>
            <Flex>
              <Center mr='5' fontSize='2xl' fontWeight='100' color='black.0'>
                協賛スタイル一覧
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
                      広告サイズ
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' mr='1' color='black.600'>
                      カラー，モノクロ
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      金額
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'></Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>作成日時</Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>更新日時</Center>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sponsorList.map((sponsorStyleItem) => (
                  <Tr key={sponsorStyleItem.id}>
                    <Td>
                      <Center color='black.300'>{sponsorStyleItem.id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{sponsorStyleItem.scale}</Center>
                    </Td>
                    <Td>
                      {sponsorStyleItem.is_color && <Center color='black.300'>カラー</Center>}
                      {!sponsorStyleItem.is_color && <Center color='black.300'>モノクロ</Center>}
                    </Td>
                    <Td isNumeric color='black.300'>
                      {sponsorStyleItem.price}
                    </Td>
                    <Td>
                      <Center>
                        <EditButton />
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{sponsorStyleItem.created_at}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{sponsorStyleItem.updated_at}</Center>
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
