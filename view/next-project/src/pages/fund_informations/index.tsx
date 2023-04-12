import clsx from 'clsx';
import Head from 'next/head';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { authAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { getCurrentUser } from '@api/currentUser';
import { put } from '@api/fundInformations';
import { Title, Card } from '@components/common';
import OpenAddModalButton from '@components/fund_information/OpenAddModalButton';
import OpenDeleteModalButton from '@components/fund_information/OpenDeleteModalButton';
import OpenEditModalButton from '@components/fund_information/OpenEditModalButton';
import MainLayout from '@components/layout/MainLayout';
import { Department, FundInformation, Teacher, User } from '@type/common';

interface FundInformationView {
  fundInformation: FundInformation;
  user: User;
  teacher: Teacher;
}

interface Props {
  teachers: Teacher[];
  departments: Department[];
  fundInformation: FundInformation[];
  fundInformationView: FundInformationView[];
  users: User[];
}

export const getServerSideProps = async () => {
  const getTeachersInformationURL = process.env.SSR_API_URI + '/teachers';
  const getDepartmentURL = process.env.SSR_API_URI + '/departments';
  const getFundInformationURL = process.env.SSR_API_URI + '/fund_informations';
  const getFundInformationViewURL = process.env.SSR_API_URI + '/fund_informations/details';
  const getUserURL = process.env.SSR_API_URI + '/users';
  const teachersInformationRes = await get(getTeachersInformationURL);
  const fundInformationRes = await get(getFundInformationURL);
  const departmentRes = await get(getDepartmentURL);
  const fundInformationViewRes = await get(getFundInformationViewURL);
  const userRes = await get(getUserURL);

  return {
    props: {
      teachers: teachersInformationRes,
      departments: departmentRes,
      fundInformation: fundInformationRes,
      fundInformationView: fundInformationViewRes,
      users: userRes,
    },
  };
};

export default function FundInformations(props: Props) {
  // 教員一覧
  const teachers: Teacher[] = props.teachers;
  const users: User[] = props.users;
  const departments: Department[] = [
    {
      id: 1,
      name: '電気電子情報',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      name: '生物機能',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 3,
      name: '機械創造',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 4,
      name: '物質材料',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 5,
      name: '環境社会基盤',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 6,
      name: '情報・経営システム',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 7,
      name: '基盤共通教育',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 8,
      name: '原子力システム安全',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 9,
      name: '技術科学イノベーション',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 10,
      name: 'システム安全',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 11,
      name: '技術支援',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 12,
      name: '産学融合',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 13,
      name: '学長・事務',
      createdAt: '',
      updatedAt: '',
    },
  ];

  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User>();

  // 募金一覧
  const [fundInformation, setFundInformation] = useState<FundInformation[]>(props.fundInformation);
  const fundInformationView: FundInformationView[] = props.fundInformationView;

  // ログイン中のユーザの権限
  const isUser = useMemo(() => {
    if (currentUser?.roleID == 1) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  const isDeveloper = useMemo(() => {
    if (currentUser?.roleID == 2) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  const isFinanceDirector = useMemo(() => {
    if (currentUser?.roleID == 3) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  const isFinanceStaff = useMemo(() => {
    if (currentUser?.roleID == 4) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  const isDisabled = useCallback(
    (fundViewItem: FundInformationView) => {
      if (
        fundViewItem.fundInformation.userID == currentUser?.id ||
        isDeveloper ||
        isFinanceStaff ||
        isFinanceDirector
      ) {
        return true;
      } else {
        return false;
      }
    },
    [currentUser?.id, isDeveloper, isFinanceStaff, isFinanceDirector],
  );

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser(auth);
      setCurrentUser(res);
    };
    getUser();
  }, []);

  // チェック済みの合計金額用のステート
  const totalFee = useMemo(() => {
    return fundInformation.reduce((sum, fundInformation) => {
      if (fundInformation.isLastCheck) {
        return sum + fundInformation.price;
      } else {
        return sum;
      }
    }, 0);
  }, [fundInformation]);

  // チェックの切り替え
  const switchCheck = async (
    isChecked: boolean,
    id: number,
    input: string,
    fundItem: FundInformation,
  ) => {
    if (input == 'isLastCheck') {
      const initFundInformation: FundInformation = {
        id: id,
        userID: fundItem.userID,
        teacherID: fundItem.teacherID,
        price: fundItem.price,
        remark: fundItem.remark,
        isFirstCheck: fundItem.isFirstCheck,
        isLastCheck: !isChecked,
        createdAt: fundItem.createdAt,
        updatedAt: fundItem.updatedAt,
      };
    }
    setFundInformation(
      fundInformation.map((fundItem: FundInformation) =>
        fundItem.id === id ? { ...fundItem, [input]: !isChecked } : fundItem,
      ),
    );
  };

  // checkboxの値が変わったときに更新
  const submit = async (id: number, fundItem: FundInformation) => {
    const putURL = process.env.CSR_API_URI + '/fund_informations/' + id;
    await put(putURL, fundItem);
  };

  // 変更可能なcheckboxの描画
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
            <input
              type='checkbox'
              defaultChecked
              onChange={() => {
                switchCheck(isChecked, id, input, fundItem);
                submit(id, fundItem);
              }}
            />
          </>
        );
      } else {
        return (
          <>
            <input
              type='checkbox'
              onChange={() => {
                switchCheck(isChecked, id, input, fundItem);
                submit(id, fundItem);
              }}
            />
          </>
        );
      }
    }
  };

  // 変更不可能なcheckboxの描画
  const unChangeableCheckboxContent = (isChecked: boolean) => {
    {
      if (isChecked) {
        return (
          <>
            <input type='checkbox' defaultChecked disabled></input>
          </>
        );
      } else {
        return (
          <>
            <input type='checkbox' disabled></input>
          </>
        );
      }
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>学内募金一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'学内募金一覧'} />
            <select className='w-100 '>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className='flex justify-end'>
            <OpenAddModalButton teachers={teachers} departments={departments} users={users}>
              学内募金登録
            </OpenAddModalButton>
          </div>
        </div>
        <div className='w-100 mb-2 p-5'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>財務局員確認</div>
                </th>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>財務局長確認</div>
                </th>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>教員名</div>
                </th>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>居室</div>
                </th>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>担当者</div>
                </th>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>金額</div>
                </th>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>備考</div>
                </th>
                <th className='w-2/12 pb-2'></th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {fundInformationView &&
                fundInformationView.map((fundViewItem: FundInformationView, index) => (
                  <tr 
                    key={fundViewItem.fundInformation.id}
                    className={clsx(index !== fundInformationView.length - 1 && 'border-b')}
                  >
                    <td className='py-3'>
                      <div className='text-center text-sm text-black-600'>
                        {isFinanceDirector &&
                          changeableCheckboxContent(
                            fundInformation[index].isFirstCheck,
                            fundViewItem.fundInformation.id ? fundViewItem.fundInformation.id : 0,
                            'isFirstCheck',
                            fundInformation[index],
                          )}
                        {isFinanceStaff &&
                          changeableCheckboxContent(
                            fundInformation[index].isFirstCheck,
                            fundViewItem.fundInformation.id ? fundViewItem.fundInformation.id : 0,
                            'isFirstCheck',
                            fundInformation[index],
                          )}
                        {isDeveloper &&
                          unChangeableCheckboxContent(fundInformation[index].isFirstCheck)}
                        {isUser && unChangeableCheckboxContent(fundInformation[index].isFirstCheck)}
                      </div>
                    </td>
                    <td>
                      <div className='text-center text-sm text-black-600'>
                        {isFinanceDirector &&
                          changeableCheckboxContent(
                            fundInformation[index].isLastCheck,
                            fundViewItem.fundInformation.id ? fundViewItem.fundInformation.id : 0,
                            'isLastCheck',
                            fundInformation[index],
                          )}
                        {isFinanceStaff &&
                          unChangeableCheckboxContent(fundInformation[index].isLastCheck)}
                        {isDeveloper &&
                          unChangeableCheckboxContent(fundInformation[index].isLastCheck)}
                        {isUser && unChangeableCheckboxContent(fundInformation[index].isLastCheck)}
                      </div>
                    </td>
                    <td>
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.teacher.name}
                      </div>
                    </td>
                    <td>
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.teacher.room}
                      </div>
                    </td>
                    <td>
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.user.name}
                      </div>
                    </td>
                    <td>
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.fundInformation.price}
                      </div>
                    </td>
                    <td>
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.fundInformation.remark}
                      </div>
                    </td>
                    <td>
                      <div className='flex gap-3'>
                        <OpenEditModalButton
                          fundInformation={fundViewItem.fundInformation}
                          teachers={teachers}
                          users={users}
                          departments={departments}
                          isDisabled={isDisabled(fundViewItem)}
                        />
                        <OpenDeleteModalButton
                          id={fundViewItem.fundInformation.id ? fundViewItem.fundInformation.id : 0}
                          isDisabled={isDisabled(fundViewItem)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <th />
                <th />
                <th />
                <th />
                <th className='text-center text-sm text-black-600'>合計金額</th>
                <th className='text-center text-sm text-black-600'>{totalFee}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
