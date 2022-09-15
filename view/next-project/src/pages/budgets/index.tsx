import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
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
import { RiAddCircleLine } from 'react-icons/ri';

import { get } from '@api/budget';
import OpenAddModalButton from '@components/budgets/OpenAddModalButton';
import OpenDeleteModalButton from '@components/budgets/OpenDeleteModalButton';
import OpenEditModalButton from '@components/budgets/OpenEditModalButton';
import MainLayout from '@components/layout/MainLayout';

interface Budget {
  id: number;
  price: number;
  year_id: number;
  source_id: number;
  source: string;
  created_at: string;
  updated_at: string;
}

interface Source {
  id: number;
  name: string;
}

interface Year {
  id: number;
  year: number;
}

interface Props {
  budgets: Budget[];
  sources: Source[];
  years: Year[];
}

export async function getServerSideProps() {
  const getBudgetUrl = process.env.SSR_API_URI + '/budgets';
  const getSourceUrl = process.env.SSR_API_URI + '/sources';
  const getYearUrl = process.env.SSR_API_URI + '/years';
  const getUrl = process.env.SSR_API_URI + '/budgetyearsources/1';

  const budgetRes = await get(getBudgetUrl);
  const sourceRes = await get(getSourceUrl);
  const yearRes = await get(getYearUrl);
  const getRes = await get(getUrl);
  return {
    props: {
      budgets: budgetRes,
      sources: sourceRes,
      years: yearRes,
      res: getRes,
    },
  };
}

export default function BudgetList(props: Props) {
  const sources = props.sources;
  const years = props.years;

  // 合計金額用の変数
  let totalFee = 0;

  // year_idからyearを取得するための処理（後々APIから取得する）
  // 合計金額を計算するための処理
  for (let i = 0; i < props.budgets.length; i++) {
    for (let j = 0; j < years.length; j++) {
      if (props.budgets[i].year_id == years[j].id) {
        props.budgets[i].year_id = years[j].year;
      }
    }

    for (let j = 0; j < sources.length; j++) {
      if (props.budgets[i].source_id == sources[j].id) {
        props.budgets[i].source = sources[j].name;
      }
    }
    // 合計金額を計算
    totalFee += props.budgets[i].price;
  }

  return (
    <MainLayout>
      <Flex justify='center' align='center'>
        <Box m='10' px='10' boxShadow='base' rounded='lg'>
          <Box mt='10' mx='5'>
            <Flex>
              <Center mr='5' fontSize='2xl' fontWeight='100' color='black.0'>
                予算一覧
              </Center>
              <Select variant='flushed' w='100'>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </Select>
            </Flex>
            <Flex>
              <Spacer />
              <Box>
                <OpenAddModalButton sources={sources} years={years}>
                  <RiAddCircleLine
                    size={20}
                    style={{
                      marginRight: 5,
                    }}
                  />
                  予算登録
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
                      ID
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7' isNumeric>
                    <Center fontSize='sm' color='black.600'>
                      項目
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      年度
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7' isNumeric>
                    <Center fontSize='sm' color='black.600'>
                      金額
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center></Center>
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
                {props.budgets.map((budgetItem) => (
                  <Tr key={budgetItem.id}>
                    <Td>
                      <Center color='black.300'>{budgetItem.id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{budgetItem.source}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{budgetItem.year_id}</Center>
                    </Td>
                    <Td isNumeric color='black.300'>
                      {budgetItem.price}
                    </Td>
                    <Td>
                      <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                        <GridItem>
                          <Center>
                            <OpenEditModalButton
                              id={budgetItem.id}
                              sources={sources}
                              years={years}
                            />
                          </Center>
                        </GridItem>
                        <GridItem>
                          <Center>
                            <OpenDeleteModalButton id={budgetItem.id} />
                          </Center>
                        </GridItem>
                      </Grid>
                    </Td>
                    <Td>
                      <Center color='black.300'>{budgetItem.created_at}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{budgetItem.updated_at}</Center>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th />
                  <Th />
                  <Th>
                    <Center fontSize='sm' fontWeight='500' color='black.600'>
                      合計金額
                    </Center>
                  </Th>
                  <Th isNumeric fontSize='sm' fontWeight='500' color='black.300'>
                    {totalFee}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </Box>
        </Box>
      </Flex>
    </MainLayout>
  );
}
