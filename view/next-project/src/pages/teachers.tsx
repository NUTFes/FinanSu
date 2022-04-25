import Head from 'next/head';
import { Box, ChakraProvider } from '@chakra-ui/react';
import EditButton from '@components/General/EditButton';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Spacer,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import theme from '@assets/theme';
import { Center } from '@chakra-ui/react';
import { RiAddCircleLine } from 'react-icons/ri';
import Header from '@components/Header';
import { get } from '@api/fundInformations';
import { useState } from 'react';

interface TeachersInformations {
  id: number;
  name: string;
  position: string;
  department_id: number;
  room: string;
  is_black: boolean;
  remark: string;
  created_at: string;
  updated_at: string;
}
interface Props {
  teachersinformations: TeachersInformations[];
}
export const getStaticProps = async () => {
  const getTeachersinformationsUrl = process.env.SSR_API_URI + '/teachers';
  const teachersinformationsRes = await get(getTeachersinformationsUrl);
  return {
    props: {
      teachersinformations: teachersinformationsRes,
    },
  };
};
export default function TeachersList(props: Props) {
  const [teachersList, setTeachersList] = useState<TeachersInformations[]>(
    props.teachersinformations,
  );
  const allTeachersList = () => {
    setTeachersList(props.teachersinformations);
  };
  const investorList = () => {
    setTeachersList(props.teachersinformations.filter((teacher) => teacher.is_black == false));
  };
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>FinanSu | 教員一覧</title>
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
                教員一覧
              </Center>
            </Flex>
            <Flex>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row'>
                  <Radio color='primary.2' value='1' onClick={allTeachersList}>
                    全教員
                  </Radio>
                  <Radio color='primary.2' value='2' onClick={investorList}>
                    募金先教員
                  </Radio>
                </Stack>
              </RadioGroup>
              <Spacer />
              <Box>
                <Button
                  textColor='white'
                  leftIcon={<RiAddCircleLine color={'white'} />}
                  bgGradient='linear(to-br, primary.1, primary.2)'
                >
                  教員登録
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
                      氏名
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      職位
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      学科
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      居室
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      備考
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'></Th>
                </Tr>
              </Thead>
              <Tbody>
                {teachersList.map((teachersItem) => (
                  <Tr key={teachersItem.name}>
                    <Td>
                      {teachersItem.is_black && (
                        <Center color='black.900'>{teachersItem.name}</Center>
                      )}
                      {!teachersItem.is_black && (
                        <Center color='black.300'>{teachersItem.name}</Center>
                      )}
                    </Td>
                    <Td>
                      <Center color='black.300'>{teachersItem.position}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{teachersItem.department_id}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{teachersItem.room}</Center>
                    </Td>
                    <Td>
                      <Center color='black.300'>{teachersItem.remark}</Center>
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
}
