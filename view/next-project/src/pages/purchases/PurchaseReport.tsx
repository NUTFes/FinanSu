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

const PurchaseReport: NextPage = () => {
  const purchaseReport = [
    {
      id: 1,
      name: '荷締めベルト',
      number: '60',
      unitCost: 240,
      value: 14400,
      purchaseDate: '2021/11/12',
      buyer: '政木架',
      note: '',
      documentNumber: '総-1',
    },
    {
      id: 2,
      name: 'ボールペン',
      number: '100',
      unitCost: 110,
      value: 11000,
      purchaseDate: '2021/11/12',
      buyer: '政木架',
      note: '',
      documentNumber: '',
    },
    {
      id: 3,
      name: 'スティックのり',
      number: '5',
      unitCost: 90,
      value: 450,
      purchaseDate: '2021/11/12',
      buyer: '政木架',
      note: '',
      documentNumber: '',
    },
    {
      id: 4,
      name: '保険',
      number: '1',
      unitCost: 15000,
      value: 15000,
      purchaseDate: '2021/11/12',
      buyer: '齋藤博起',
      note: '',
      documentNumber: '',
    },
    {
      id: 5,
      name: '検便',
      number: '50',
      unitCost: 500,
      value: 25000,
      purchaseDate: '2021/11/12',
      buyer: '杉本真実',
      note: '',
      documentNumber: '',
    },
    {
      id: 6,
      name: 'トラックレンタル代',
      number: '1',
      unitCost: 8000,
      value: 8000,
      purchaseDate: '2021/11/12',
      buyer: '政木架',
            note: '',
      documentNumber: '',
    },
  ];

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
                    <Center color='black.600'>
                      購入日
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>
                      購入者
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center color='black.600'>
                      資料番号
                    </Center>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {purchaseReport.map((purchaseItem) => (
                  <Tr key={purchaseItem.id}>
                    <Td>
                      <Center color='black.300'>{purchaseItem.id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.name}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.number}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseItem.unitCost}</Center>
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
                      <Center color='black.300'>{purchaseItem.documentNumber}</Center>
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

export default PurchaseReport;
