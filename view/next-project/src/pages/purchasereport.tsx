import type { NextPage } from 'next';
import { get, post, put, del } from '@api/purchaseReport';
import Head from 'next/head';
import { Box, ChakraProvider } from '@chakra-ui/react';
import EditButton from '@components/General/EditButton';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Spacer,
  Select,
} from '@chakra-ui/react';
import theme from '@assets/theme';
import { Center } from '@chakra-ui/react';
import { RiAddCircleLine } from 'react-icons/ri';
import Header from '@components/Header';

interface PurchaseReport {
  id: number;
  user_id: number;
  purchase_order_id: number;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
}

interface PurchaseOrder {
  id: number;
  deadline: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  purchaseReport: PurchaseReport[];
  user: User;
  purchaseOrder: PurchaseOrder[];
}

export async function getServerSideProps({params}: any) {
  const getPurchaseReportUrl = process.env.SSR_API_URI + '/purchasereports';
  const getPurchaseOrderUrl = process.env.SSR_API_URI + '/purchaseorders';
  const getUserUrl= process.env.SSR_API_URI + '/users';
  const purchaseReportRes = await get(getPurchaseReportUrl);
  const purchaseOrderRes = await get(getPurchaseOrderUrl);
  const userRes = await get(getUserUrl);
  return {
    props:{
      purchaseReport: purchaseReportRes,
      purchaseOrder: purchaseOrderRes,
      user: userRes,
    }
  };
}

export default function Purchasereport(props: Props){
  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 5);
    return datetime2;
  };

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>FinanSu | 購入報告一覧</title>
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
                購入報告一覧
              </Center>
              <Select variant='flushed' w='100'>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </Select>
            </Flex>
            <Flex>
              <Spacer />
              <Box>
                <Button
                  textColor='white'
                  leftIcon={<RiAddCircleLine color={'white'} />}
                  bgGradient='linear(to-br, primary.1, primary.2)'
                >
                  購入物品登録
                </Button>
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
                    <Center fontSize='sm' mr='1' color='black.600'>
                      購入物品名
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      個数
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7' isNumeric>
                    <Center fontSize='sm' color='black.600'>
                      単価
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      金額
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center></Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>購入日</Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>購入者</Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>備考</Center>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.purchaseOrder.map((purchaseItem) => (
                  <Tr key={purchaseItem.id}>
                    <Td>
                      <Center color='black.300'>{purchaseItem.id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.item}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.quantity}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.price}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.value}</Center>
                    </Td>
                    <Td>
                      <Center>
                        <EditButton />
                      </Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.purchaseDate}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.buyer}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.remarks}</Center>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                  <Th>
                    <Center fontSize='sm' fontWeight='500' color='black.600'>
                      合計
                    </Center>
                  </Th>
                  <Th isNumeric fontSize='sm' fontWeight='500' color='black.300'>
                    2400000
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </Box>
        </Box>
      </Center>
    </ChakraProvider>
  );
};
