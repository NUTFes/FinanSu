import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  Checkbox,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import OpenAddModalButton from '@components/fund_information/OpenAddModalButton';
import OpenEditModalButton from '@components/fund_information/OpenEditModalButton';
import OpenDeleteModalButton from '@components/fund_information/OpenDeleteModalButton';
import DisabledEditModalButton from '@components/fund_information/DisabledEditModalButton';
import DisabledDeleteModalButton from '@components/fund_information/DisabledDeleteModalButton';
import { put } from '@api/fundInformations';
import { get, get_with_token } from '@api/api_methods';
import MainLayout from '@components/layout/MainLayout';

interface FundInformation {
  id: number;
  user_id: number;
  teacher_id: number;
  price: number;
  remark: string;
  is_first_check: boolean;
  is_last_check: boolean;
  created_at: string;
  updated_at: string;
}

interface Department {
  id: number;
  name: string;
}

interface Teacher {
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

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

interface FundInformationView {
  fund_information: FundInformation;
  user: User;
  teacher: Teacher;
}

interface Props {
  teachers: Teacher[];
  departments: Department[];
  fundInformation: FundInformation[];
  fundInformationView: FundInformationView[];
  currentUser: User;
  totalFee: number;
}

export const getServerSideProps = async () => {
  const getTeachersInformationURL = process.env.SSR_API_URI + '/teachers';
  const getDepartmentURL = process.env.SSR_API_URI + '/departments';
  const getFundInformationURL = process.env.SSR_API_URI + '/fund_informations';
  const getFundInformationViewURL = process.env.SSR_API_URI + '/get_fund_informations_for_view';
  const teachersInformationRes = await get(getTeachersInformationURL);
  const fundInformationRes = await get(getFundInformationURL);
  const departmentRes = await get(getDepartmentURL);
  const fundInformationViewRes = await get(getFundInformationViewURL);

  // ?????????????????????
  let totalFee = 0;
  fundInformationRes.map((fundItemRes: FundInformation) => {
    if (fundItemRes.is_last_check) {
      totalFee += fundItemRes.price;
    }
  });

  return {
    props: {
      teachers: teachersInformationRes,
      departments: departmentRes,
      fundInformation: fundInformationRes,
      fundInformationView: fundInformationViewRes,
      totalFee: totalFee,
    },
  };
};

export default function FundInformations(props: Props) {
  // ????????????
  const teachers: Teacher[] = props.teachers;
  const departments: Department[] = [
    {
      id: 1,
      name: '??????????????????',
    },
    {
      id: 2,
      name: '????????????',
    },
    {
      id: 3,
      name: '????????????',
    },
    {
      id: 4,
      name: '????????????',
    },
    {
      id: 5,
      name: '??????????????????',
    },
    {
      id: 6,
      name: '???????????????????????????',
    },
    {
      id: 7,
      name: '??????????????????',
    },
    {
      id: 8,
      name: '???????????????????????????',
    },
    {
      id: 9,
      name: '?????????????????????????????????',
    },
    {
      id: 10,
      name: '??????????????????',
    },
    {
      id: 11,
      name: '????????????',
    },
    {
      id: 12,
      name: '????????????',
    },
    {
      id: 13,
      name: '???????????????',
    },
  ];

  // ????????????
  const [fundInformation, setFundInformation] = useState<FundInformation[]>(props.fundInformation);
  const [fundInformationView, setFundInformationView] = useState<FundInformationView[]>(
    props.fundInformationView,
  );

  // ???????????????????????????
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    bureau_id: 1,
    role_id: 1,
  });

  // ????????????????????????????????????
  const [isFinanceDirector, setIsFinanceDirector] = useState<boolean>(false);
  const [isFinanceStaff, setIsFinanceStaff] = useState<boolean>(false);
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  const router = useRouter();

  // ???????????????????????????current_user?????????
  useEffect(() => {
    if (router.isReady) {
      // current_user?????????????????????
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const currentUserRes = await get_with_token(url);
        setCurrentUser(currentUserRes);

        // current_user??????????????????????????????
        if (currentUserRes.role_id == 1) {
          setIsUser(true);
        }
        // current_user??????????????????????????????
        else if (currentUserRes.role_id == 2) {
          setIsDeveloper(true);
        }
        // current_user?????????????????????????????????
        else if (currentUserRes.role_id == 3) {
          setIsFinanceDirector(true);
        }
        // current_user?????????????????????????????????
        else if (currentUserRes.role_id == 4) {
          setIsFinanceStaff(true);
        }
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);

  // Modal??????userID?????????
  const userID = currentUser.id;

  // ???????????????????????????????????????????????????
  const [totalFee, setTotalFee] = useState(props.totalFee);

  const calcTotalFee = (initFundInformation: FundInformation) => {
    if (initFundInformation.is_last_check) {
      setTotalFee(totalFee + initFundInformation.price);
    } else {
      setTotalFee(totalFee - initFundInformation.price);
    }
  };

  // ???????????????????????????
  const switchCheck = async (
    isChecked: boolean,
    id: number,
    input: string,
    fundItem: FundInformation,
  ) => {
    if (input == 'is_last_check') {
      const initFundInformation: FundInformation = {
        id: id,
        user_id: fundItem.user_id,
        teacher_id: fundItem.teacher_id,
        price: fundItem.price,
        remark: fundItem.remark,
        is_first_check: fundItem.is_first_check,
        is_last_check: !isChecked,
        created_at: fundItem.created_at,
        updated_at: fundItem.updated_at,
      };
      calcTotalFee(initFundInformation);
    }
    setFundInformation(
      fundInformation.map((fundItem: FundInformation) =>
        fundItem.id === id ? { ...fundItem, [input]: !isChecked } : fundItem,
      ),
    );
  };

  // checkbox????????????????????????????????????
  const submit = async (id: number, fundItem: FundInformation) => {
    const putURL = process.env.CSR_API_URI + '/fund_informations/' + id;
    await put(putURL, fundItem);
  };

  // ???????????????checkbox?????????
  const changeableCheckboxContent = (
    isChecked: boolean,
    id: number,
    input: string,
    fundItem: FundInformation,
  ) => {
    {
      if (isChecked) {
        return (
          <>
            <Checkbox
              defaultChecked
              onChange={() => {
                switchCheck(isChecked, id, input, fundItem);
                submit(id, fundItem);
              }}
            ></Checkbox>
          </>
        );
      } else {
        return (
          <>
            <Checkbox
              onChange={() => {
                switchCheck(isChecked, id, input, fundItem);
                submit(id, fundItem);
              }}
            ></Checkbox>
          </>
        );
      }
    }
  };

  // ??????????????????checkbox?????????
  const unChangeableCheckboxContent = (isChecked: boolean, id: number, input: string) => {
    {
      if (isChecked) {
        return (
          <>
            <Checkbox defaultChecked isDisabled></Checkbox>
          </>
        );
      } else {
        return (
          <>
            <Checkbox isDisabled></Checkbox>
          </>
        );
      }
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>????????????</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <Flex justify='center' align='center'>
        <Box m='10' px='10' boxShadow='base' rounded='lg'>
          <Box mt='10' mx='5'>
            <Flex>
              <Center mr='5' fontSize='2xl' fontWeight='100' color='black.0'>
                ????????????
              </Center>
              <Select variant='flushed' w='100'>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
              </Select>
            </Flex>
            <Flex>
              <Spacer />
              <Box>
                <OpenAddModalButton
                  teachersInformation={teachers}
                  departments={departments}
                  currentUser={currentUser}
                  userID={userID}
                >
                  ??????????????????
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
                      ??????????????????
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ??????????????????
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ?????????
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ??????
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ?????????
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ??????
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'>
                    <Center fontSize='sm' color='black.600'>
                      ??????
                    </Center>
                  </Th>
                  <Th borderBottomColor='#76E4F7'></Th>
                </Tr>
              </Thead>
              <Tbody>
                {fundInformationView &&
                  fundInformationView.map((fundViewItem: FundInformationView, index) => (
                    <Tr
                      key={fundViewItem.fund_information.id}
                      onUnload={submit(fundViewItem.fund_information.id, fundInformation[index])}
                    >
                      <Td>
                        <Center color='black.300'>
                          {isFinanceDirector &&
                            changeableCheckboxContent(
                              fundInformation[index].is_first_check,
                              fundViewItem.fund_information.id,
                              'is_first_check',
                              fundInformation[index],
                            )}
                          {isFinanceStaff &&
                            changeableCheckboxContent(
                              fundInformation[index].is_first_check,
                              fundViewItem.fund_information.id,
                              'is_first_check',
                              fundInformation[index],
                            )}
                          {isDeveloper &&
                            unChangeableCheckboxContent(
                              fundInformation[index].is_first_check,
                              fundViewItem.fund_information.id,
                              'is_first_check',
                            )}
                          {isUser &&
                            unChangeableCheckboxContent(
                              fundInformation[index].is_first_check,
                              fundViewItem.fund_information.id,
                              'is_first_check',
                            )}
                        </Center>
                      </Td>
                      <Td>
                        <Center color='black.300'>
                          {isFinanceDirector &&
                            changeableCheckboxContent(
                              fundInformation[index].is_last_check,
                              fundViewItem.fund_information.id,
                              'is_last_check',
                              fundInformation[index],
                            )}
                          {isFinanceStaff &&
                            unChangeableCheckboxContent(
                              fundInformation[index].is_last_check,
                              fundViewItem.fund_information.id,
                              'is_last_check',
                            )}
                          {isDeveloper &&
                            unChangeableCheckboxContent(
                              fundInformation[index].is_last_check,
                              fundViewItem.fund_information.id,
                              'is_last_check',
                            )}
                          {isUser &&
                            unChangeableCheckboxContent(
                              fundInformation[index].is_last_check,
                              fundViewItem.fund_information.id,
                              'is_last_check',
                            )}
                        </Center>
                      </Td>
                      <Td>
                        <Center color='black.300'>{fundViewItem.teacher.name}</Center>
                      </Td>
                      <Td>
                        <Center color='black.300'>{fundViewItem.teacher.room}</Center>
                      </Td>
                      <Td>
                        <Center color='black.300'>{fundViewItem.user.name}</Center>
                      </Td>
                      <Td>
                        <Center color='black.300'>{fundViewItem.fund_information.price}</Center>
                      </Td>
                      <Td>
                        <Center color='black.300'>{fundViewItem.fund_information.remark}</Center>
                      </Td>
                      {(() => {
                        if (!isUser || fundViewItem.fund_information.user_id == currentUser.id) {
                          return (
                            <Td>
                              <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                                <GridItem>
                                  <Center>
                                    <OpenEditModalButton
                                      id={fundViewItem.fund_information.id}
                                      teachers={teachers}
                                      currentUser={currentUser}
                                    />
                                  </Center>
                                </GridItem>
                                <GridItem>
                                  <Center>
                                    <OpenDeleteModalButton
                                      id={fundViewItem.fund_information.id}
                                      teacher_id={fundViewItem.fund_information.teacher_id}
                                      user_id={Number(fundViewItem.fund_information.user_id)}
                                    />
                                  </Center>
                                </GridItem>
                              </Grid>
                            </Td>
                          );
                        } else {
                          return (
                            <Td>
                              <Grid templateColumns='repeat(2, 1fr)' gap={3}>
                                <GridItem>
                                  <Center>
                                    <DisabledEditModalButton />
                                  </Center>
                                </GridItem>
                                <GridItem>
                                  <Center>
                                    <DisabledDeleteModalButton />
                                  </Center>
                                </GridItem>
                              </Grid>
                            </Td>
                          );
                        }
                      })()}
                    </Tr>
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th />
                  <Th />
                  <Th />
                  <Th />
                  <Th>
                    <Center fontSize='sm' fontWeight='500' color='black.600'>
                      ????????????
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
