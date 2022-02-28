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
import { get } from '@api/fundInformations';
import { useEffect } from 'react';

interface FundInformations {
  id: number;
  teacher_id: number;
  user_id: number;
  price: number;
  remark: string;
  is_first_check: boolean;
  is_last_check: boolean;
  created_at: string;
  updated_at: string;
}
interface Props {
  fundinformations: FundInformations[]
}
export const getStaticProps = async() => {
 const fundinformationsUrl = "http://nutfes-finansu-api:1323/fund_informations"
 const fundinformationsRes = await get(fundinformationsUrl)
 return {
   props: {
     fundinformations: fundinformationsRes
   }
 }
}
export default function FundList(props: Props) {
  const fundList = props.fundinformations
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>FinanSu | 募金一覧</title>
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
                募金一覧
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
                  学内募金登録
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
                      教員名
                    </Center>
                  </Th><Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      居室
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      担当者
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7' isNumeric>
                    <Center fontSize='sm' color='black.600'>
                      金額
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      受領日時
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      局長チェック
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      財務局長チェック
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      備考
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center></Center>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {fundList.map((fundItem) => (
                  <Tr key={fundItem.id}>
                    <Td>
                      <Center color='black.300'>會田英雄</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>機械・建設1号棟629</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundItem.user_id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundItem.price}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundItem.created_at}</Center>
                    </Td>
                    <Td>
                      {fundItem.is_first_check && <Center color='black.300'>確認済み</Center>}
                      {!fundItem.is_first_check && <Center color='black.300'>未確認</Center>}
                    </Td>
                    <Td>
                        {fundItem.is_first_check && <Center color='black.300'>確認済み</Center>}
                        {!fundItem.is_first_check && <Center color='black.300'>未確認</Center>}
                    </Td>
                    <Td>
                      <Center color='black.300'>{fundItem.remark}</Center>
                    </Td>
                    <Td>
                      <Center>
                        <EditButton />
                      </Center>
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
};
