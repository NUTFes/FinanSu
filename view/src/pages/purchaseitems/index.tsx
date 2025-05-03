import {
  Box,
  Button,
  Center,
  Flex,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';

import { get } from '@api/api_methods';
import EditButton from '@components/common/EditButton';
import MainLayout from '@components/layout/MainLayout';
import { PurchaseItem } from '@type/common';

interface Props {
  purchaseItem: PurchaseItem[];
}
export async function getServerSideProps() {
  const getPurchaseItemUrl = process.env.SSR_API_URI + '/purchaseitems';
  const purchaseItemRes = await get(getPurchaseItemUrl);
  return {
    props: {
      purchaseItem: purchaseItemRes,
    },
  };
}

export default function PurchaseItems(props: Props) {
  // 合計金額計算
  const totalPriceArray: number[] = [];
  const calcItemTotalPrice = (quantity: number, price: number) => {
    // 合計金額の計算
    const totalPrice = quantity * price;
    totalPriceArray.push(totalPrice);
    return totalPrice;
  };

  // 合計金額計算
  const calcTotalPrice = () => {
    // 合計金額用の変数
    let totalPrice = 0;

    // 合計金額を計算
    for (let i = 0; i < totalPriceArray.length; i++) {
      totalPrice += totalPriceArray[i];
    }
    return totalPrice;
  };

  return (
    <>
      <MainLayout>
        <Head>
          <title>協賛物品一覧</title>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <Flex justify='center' align='center'>
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
                    {props.purchaseItem.map((purchaseItem) => (
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
                          <Center color='black.300'>
                            {calcItemTotalPrice(purchaseItem.quantity, purchaseItem.price)}
                          </Center>
                        </Td>
                        <Td>
                          <Center color='black.300'>{purchaseItem.detail}</Center>
                        </Td>
                        <Td></Td>
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
        </Flex>
      </MainLayout>
    </>
  );
}
