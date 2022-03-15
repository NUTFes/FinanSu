import type { NextPage } from 'next';
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

interface PurchaseItem {
  id: number;
  item: string;
  price: number;
  quantity: number;
  detail: string;
  url: string;
  purchase_order_id: number;
}

const PurchaseItem: NextPage = () => {
  const purchaseItem = [
    {
      id: 1,
      item: '荷締めベルト',
      quantity: 60,
      price: 240,
      detail: '',
    },
    {
      id: 2,
      item: 'ボールペン',
      quantity: 100,
      price: 110,
      detail: '',
    },
    {
      id: 3,
      item: 'スティックのり',
      quantity: 5,
      price: 90,
      detail: '',
    },
    {
      id: 4,
      item: '保険',
      quantity: 1,
      price: 15000,
      detail: '',
    },
    {
      id: 5,
      item: '検便',
      quantity: 50,
      price: 500,
      detail: '',
    },
    {
      id: 6,
      item: 'トラックレンタル代',
      quantity: 1,
      price: 8000,
      detail: '',
    },
  ];

  // 日付整形
  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 5);
    return datetime2;
  };

  // 合計金額計算
  let totalPriceArray = [];
  const calcItemTotalPrice = (quantity: number, price: number) => {
    // 合計金額の計算
    const totalPrice = quantity * price;
    totalPriceArray.push(totalPrice);
    return totalPrice;
  }

  // 合計金額計算
  const calcTotalPrice = () => {
    // 合計金額用の変数
    let totalPrice = 0;

    // 合計金額を計算
    for (let i = 0; i < totalPriceArray.length; i++) {
      totalPrice += totalPriceArray[i];
    }
    return totalPrice;
  }

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>FinanSu | 購入物品一覧</title>
        <meta item='description' content='ja' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <hr />
      <Center>
        <Box m='10' px='10' boxShadow='base' rounded='lg'>
          <Box mt='10' mx='5'>
            <Flex>
              <Center mr='5' fontSize='2xl' fontWeight='100' color='black.0'>
                購入物品一覧
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
                    <Center fontSize='sm' color='black.600'>
                      備考
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>申請者</Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center></Center>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {purchaseItem.map((purchaseItem) => (
                  <Tr key={purchaseItem.id}>
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
                      <Center color='black.300'>{calcItemTotalPrice(purchaseItem.quantity, purchaseItem.price)}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.detail}</Center>
                    </Td>
                    <Td>
                    </Td>
                    <Td>
                      <Center>
                        <EditButton />
                      </Center>
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
                    {calcTotalPrice()}
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

export default PurchaseItem;
