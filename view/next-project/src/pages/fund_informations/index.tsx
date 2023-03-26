import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { get, get_with_token } from '@api/api_methods';
import { put } from '@api/fundInformations';
import { Title, Card } from '@components/common';
import DisabledDeleteModalButton from '@components/fund_information/DisabledDeleteModalButton';
import DisabledEditModalButton from '@components/fund_information/DisabledEditModalButton';
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
  currentUser: User;
  totalFee: number;
}

export const getServerSideProps = async () => {
  const getTeachersInformationURL = process.env.SSR_API_URI + '/teachers';
  const getDepartmentURL = process.env.SSR_API_URI + '/departments';
  const getFundInformationURL = process.env.SSR_API_URI + '/fund_informations';
  const getFundInformationViewURL = process.env.SSR_API_URI + '/fund_informations/details';
  const teachersInformationRes = await get(getTeachersInformationURL);
  const fundInformationRes = await get(getFundInformationURL);
  const departmentRes = await get(getDepartmentURL);
  const fundInformationViewRes = await get(getFundInformationViewURL);

  // 合計金額の計算
  let totalFee = 0;
  fundInformationRes.map((fundItemRes: FundInformation) => {
    if (fundItemRes.isLastCheck) {
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
  // 教員一覧
  const teachers: Teacher[] = props.teachers;
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

  // 募金一覧
  const [fundInformation, setFundInformation] = useState<FundInformation[]>(props.fundInformation);
  const fundInformationView: FundInformationView[] = props.fundInformationView;
  // ログイン中のユーザ
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    bureauID: 1,
    roleID: 1,
    createdAt: '',
    updatedAt: '',
  });

  // ログイン中のユーザの権限
  const [isFinanceDirector, setIsFinanceDirector] = useState<boolean>(false);
  const [isFinanceStaff, setIsFinanceStaff] = useState<boolean>(false);
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      // current_userの取得とセット
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const currentUserRes = await get_with_token(url);
        setCurrentUser(currentUserRes);

        // current_userの権限をユーザに設定
        if (currentUserRes.roleID == 1) {
          setIsUser(true);
        }
        // current_userの権限を開発者に設定
        else if (currentUserRes.roleID == 2) {
          setIsDeveloper(true);
        }
        // current_userの権限を財務局長に設定
        else if (currentUserRes.roleID == 3) {
          setIsFinanceDirector(true);
        }
        // current_userの権限を財務局員に設定
        else if (currentUserRes.roleID == 4) {
          setIsFinanceStaff(true);
        }
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);

  // Modal用にuserIDを設定
  const userID = currentUser.id;

  // チェック済みの合計金額用のステート
  const [totalFee, setTotalFee] = useState(props.totalFee);

  const calcTotalFee = (initFundInformation: FundInformation) => {
    if (initFundInformation.isLastCheck) {
      setTotalFee(totalFee + initFundInformation.price);
    } else {
      setTotalFee(totalFee - initFundInformation.price);
    }
  };

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
      calcTotalFee(initFundInformation);
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
        <title>募金一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'購入申請一覧'} />
            <select className='w-100 '>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className='flex justify-end'>
            <OpenAddModalButton
              teachersInformation={teachers}
              departments={departments}
              currentUser={currentUser}
              userID={userID ? userID : 0}
            >
              学内募金登録
            </OpenAddModalButton>
          </div>
        </div>
        <div className='w-100 mb-2 p-5'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3 '>
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
                    // onChange={submit(fundViewItem.fundInformation.id, fundInformation[index])}
                  >
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.fundInformationView.length - 1
                          ? 'pb-4 pt-3'
                          : 'border-b py-3',
                      )}
                    >
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
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.fundInformationView.length - 1
                          ? 'pb-4 pt-3'
                          : 'border-b py-3',
                      )}
                    >
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
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.fundInformationView.length - 1
                          ? 'pb-4 pt-3'
                          : 'border-b py-3',
                      )}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.teacher.name}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.fundInformationView.length - 1
                          ? 'pb-4 pt-3'
                          : 'border-b py-3',
                      )}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.teacher.room}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.fundInformationView.length - 1
                          ? 'pb-4 pt-3'
                          : 'border-b py-3',
                      )}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.user.name}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.fundInformationView.length - 1
                          ? 'pb-4 pt-3'
                          : 'border-b py-3',
                      )}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.fundInformation.price}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-1',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === props.fundInformationView.length - 1
                          ? 'pb-4 pt-3'
                          : 'border-b py-3',
                      )}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {fundViewItem.fundInformation.remark}
                      </div>
                    </td>
                    {!isUser || fundViewItem.fundInformation.userID == currentUser.id ? (
                      <td
                        className={clsx(
                          'px-1',
                          index === 0 ? 'pt-4 pb-3' : 'py-3',
                          index === props.fundInformationView.length - 1
                            ? 'pb-4 pt-3'
                            : 'border-b py-3',
                        )}
                      >
                        <div className='flex gap-3'>
                          <OpenEditModalButton
                            id={
                              fundViewItem.fundInformation.id ? fundViewItem.fundInformation.id : 0
                            }
                            teachers={teachers}
                            currentUser={currentUser}
                          />
                          <OpenDeleteModalButton
                            id={
                              fundViewItem.fundInformation.id ? fundViewItem.fundInformation.id : 0
                            }
                            teacherID={fundViewItem.fundInformation.teacherID}
                            userID={Number(fundViewItem.fundInformation.userID)}
                          />
                        </div>
                      </td>
                    ) : (
                      <td
                        className={clsx(
                          'px-1',
                          index === 0 ? 'pt-4 pb-3' : 'py-3',
                          index === props.fundInformationView.length - 1
                            ? 'pb-4 pt-3'
                            : 'border-b py-3',
                        )}
                      >
                        <div className='flex gap-3'>
                          <DisabledEditModalButton />
                          <DisabledDeleteModalButton />
                        </div>
                      </td>
                    )}
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
