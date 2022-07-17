import { get } from '@api/purchaseReport';
import Head from 'next/head';
import { Box, ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Flex, Spacer, Select } from '@chakra-ui/react';
import theme from '@assets/theme';
import { Center } from '@chakra-ui/react';
import { RiAddCircleLine } from 'react-icons/ri';
<<<<<<< HEAD:view/next-project/src/pages/purchasereports/index.tsx
import Header from '@components/common/Header';
import OpenEditModalButton from '@components/purchasereports/OpenEditModalButton';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';
=======
import Header from '@components/Header';
import OpenEditModalButton from '@components/purchasereport/OpenEditModalButton';
import OpenDeleteModalButton from '@components/purchasereport/OpenDeleteModalButton';
>>>>>>> main:view/next-project/src/pages/purchasereport.tsx
import MainLayout from '@components/layout/MainLayout';

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

export async function getServerSideProps({ params }: any) {
  const getPurchaseReportUrl = process.env.SSR_API_URI + '/purchasereports';
  const purchaseReportRes = await get(getPurchaseReportUrl);
  return {
    props: {
      purchaseReport: purchaseReportRes,
    },
  };
}

export default function PurchaseReport(props: Props) {
  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 5);
    return datetime2;
  };

  return (
    <MainLayout>
      <Flex justify='center' align='center'>
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
                  購入報告登録
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
                    <Center fontSize='sm' color='black.600'>
                      報告者
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' mr='1' color='black.600'>
                      報告日
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
                </Tr>
              </Thead>
              <Tbody>
                {props.purchaseReport.map((purchaseReportItem) => (
                  <Tr key={purchaseReportItem.id}>
                    <Td>
                      <Center color='black.300'>{purchaseReportItem.id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{purchaseReportItem.user_id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{formatDate(purchaseReportItem.created_at)}</Center>
                    </Td>
                    <Td></Td>
                    <Td>
                      <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                        <GridItem>
                          <Center>
                            <OpenEditModalButton id={purchaseReportItem.id} />
                          </Center>
                        </GridItem>
                        <GridItem>
                          <Center>
                            <OpenDeleteModalButton id={purchaseReportItem.id} />
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
      </Flex>
    </MainLayout>
  );
}
