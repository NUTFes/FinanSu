import clsx from 'clsx';
import Head from 'next/head';
import { useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { put } from '@api/fundInformations';
import { Title, Card } from '@components/common';
import { Checkbox } from '@components/common';
import OpenAddModalButton from '@components/fund_information/OpenAddModalButton';
import OpenDeleteModalButton from '@components/fund_information/OpenDeleteModalButton';
import OpenEditModalButton from '@components/fund_information/OpenEditModalButton';
import MainLayout from '@components/layout/MainLayout';
import { Department, FundInformation, Teacher, User, YearPeriod } from '@type/common';

interface FundInformationView {
  fundInformation: FundInformation;
  user: User;
  teacher: Teacher;
  department: Department;
}

interface Props {
  teachers: Teacher[];
  departments: Department[];
  fundInformation: FundInformation[];
  fundInformationView: FundInformationView[];
  users: User[];
  yearPeriods: YearPeriod[];
}

const date = new Date();

export const getServerSideProps = async () => {
  const getPeriodsUrl = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getPeriodsUrl);
  const getTeachersInformationURL = process.env.SSR_API_URI + '/teachers';
  const getDepartmentURL = process.env.SSR_API_URI + '/departments';
  const getFundInformationURL = process.env.SSR_API_URI + '/fund_informations';
  const getFundInformationViewURL =
    process.env.SSR_API_URI +
    '/fund_informations/details/' +
    (periodsRes ? String(periodsRes[periodsRes.length - 1].year) : String(date.getFullYear()));
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
      yearPeriods: periodsRes,
    },
  };
};

export default function FundInformations(props: Props) {
  // 教員一覧
  const teachers: Teacher[] = props.teachers;
  const users: User[] = props.users;
  const departments: Department[] = props.departments;
  const user = useRecoilValue(userAtom);
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    setCurrentUser(user);
  }, []);

  // 募金一覧
  const [fundInformationViews, setFundInformationViews] = useState<FundInformationView[]>(
    props.fundInformationView,
  );

  //年の指定
  const yearPeriods = props.yearPeriods;
  const [selectedYear, setSelectedYear] = useState<string>(
    yearPeriods ? String(yearPeriods[yearPeriods.length - 1].year) : String(date.getFullYear()),
  );

  //年度を指定して募金を取得し、fundInformationViewsにset
  const getFundInformations = async () => {
    const getFundInformationsURL =
      process.env.CSR_API_URI + '/fund_informations/details/' + selectedYear;
    const getFundInformationsByYears = await get(getFundInformationsURL);
    setFundInformationViews(getFundInformationsByYears);
  };
  // 選択年が変更された際に募金データを取得
  useEffect(() => {
    getFundInformations();
  }, [selectedYear]);

  // checkしたかどうか
  const [isFirstChecks, setIsFirstChecks] = useState<boolean[]>([]);
  const [isLastChecks, setIsLastChecks] = useState<boolean[]>([]);

  const isDeveloper = currentUser?.roleID == 2;
  const isFinanceDirector = currentUser?.roleID == 3;
  const isFinanceStaff = currentUser?.bureauID == 3 || currentUser?.bureauID == 4;

  const isDisabled = (fundViewItem: FundInformationView) => {
    return !(
      fundViewItem.fundInformation.userID == currentUser?.id ||
      isDeveloper ||
      isFinanceStaff ||
      isFinanceDirector
    );
  };

  useEffect(() => {
    if (fundInformationViews) {
      const firstChecks = fundInformationViews.map((fundInformationView) => {
        return fundInformationView.fundInformation.isFirstCheck;
      });
      const lastChecks = fundInformationViews.map((fundInformationView) => {
        return fundInformationView.fundInformation.isLastCheck;
      });
      setIsFirstChecks(firstChecks);
      setIsLastChecks(lastChecks);
    }
  }, [fundInformationViews]);

  // チェック済みの合計金額用のステート
  const totalFee = useMemo(() => {
    return (
      fundInformationViews &&
      fundInformationViews.reduce((sum, fundInformationView) => {
        if (
          fundInformationView.fundInformation.isLastCheck &&
          fundInformationView.fundInformation.isFirstCheck
        ) {
          return sum + fundInformationView.fundInformation.price;
        } else {
          return sum;
        }
      }, 0)
    );
  }, [fundInformationViews]);

  // checkboxの値が変わったときに更新
  const submit = async (id: number, fundItem: FundInformation) => {
    const putURL = process.env.CSR_API_URI + '/fund_informations/' + id;
    await put(putURL, fundItem);

    const newFundInformationViews = fundInformationViews.map((fundInformationView) => {
      if (fundInformationView.fundInformation.id == id) {
        return {
          ...fundInformationView,
          fundInformation: fundItem,
        };
      } else {
        return fundInformationView;
      }
    });
    setFundInformationViews(newFundInformationViews);
  };

  return (
    <MainLayout>
      <Head>
        <title>学内募金一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-4 my-4'>
          <div className='flex'>
            <Title title={'学内募金一覧'} />
            <select
              className='w-50 md:w-100'
              defaultValue={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {props.yearPeriods &&
                props.yearPeriods.map((year) => {
                  return (
                    <option value={year.year} key={year.id}>
                      {year.year}年度
                    </option>
                  );
                })}
            </select>
          </div>
          <div className='hidden justify-end md:flex '>
            <OpenAddModalButton
              teachers={teachers}
              departments={departments}
              users={users}
              currentUser={currentUser}
            >
              学内募金登録
            </OpenAddModalButton>
          </div>
          <div className='md:hidden'>
            <OpenAddModalButton
              teachers={teachers}
              departments={departments}
              users={users}
              currentUser={currentUser}
            ></OpenAddModalButton>
          </div>
        </div>
        <div className='mb-4 md:hidden'>
          {fundInformationViews &&
            fundInformationViews.map((fundViewItem: FundInformationView) => (
              <Card key={fundViewItem.fundInformation.id}>
                <div className='flex flex-col gap-2 p-4'>
                  <div>
                    <div className='mt-2'>
                      {fundViewItem.fundInformation.isLastCheck &&
                        fundViewItem.fundInformation.isFirstCheck && (
                          <div className='flex items-center gap-1'>
                            <div className='h-4 w-4 rounded-full bg-[#7087FF]' />
                            <p>確認済</p>
                          </div>
                        )}
                      {!fundViewItem.fundInformation.isLastCheck &&
                        fundViewItem.fundInformation.isFirstCheck && (
                          <div className='flex items-center gap-1'>
                            <div className='h-4 w-4 rounded-full bg-[#4FDE6E]' />
                            <p>受取済</p>
                          </div>
                        )}
                      {!fundViewItem.fundInformation.isFirstCheck && (
                        <div className='flex items-center gap-1'>
                          <div className='h-4 w-4 rounded-full bg-[#FFA53C]' />
                          <p>未受取</p>
                        </div>
                      )}
                    </div>
                    <div className='ml-6 flex flex-col text-sm'>
                      <div className='mb-4 text-lg font-medium'>{fundViewItem.teacher.name}</div>
                      <div>{fundViewItem.department.name}</div>
                      <div>{fundViewItem.teacher.room}</div>
                      <div>担当 : {fundViewItem.user.name}</div>
                      <div>金額 : {fundViewItem.fundInformation.price}円</div>
                    </div>
                  </div>
                  <div className='ml-auto flex gap-4'>
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
                </div>
              </Card>
            ))}
        </div>
        <div className='w-100 mb-2 hidden p-5 md:block'>
          <table className='w-full table-fixed border-collapse md:mb-5'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>財務局員確認</div>
                </th>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>財務局長確認</div>
                </th>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>教員名</div>
                </th>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>居室</div>
                </th>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>担当者</div>
                </th>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>金額</div>
                </th>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>受け取り日時</div>
                </th>
                <th className='w-2/14 pb-2'>
                  <div className='text-center text-sm text-black-600'>備考</div>
                </th>
                <th className='w-2/14 pb-2'></th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {fundInformationViews &&
                fundInformationViews.map((fundViewItem: FundInformationView, index) => (
                  <tr
                    key={fundViewItem.fundInformation.id}
                    className={clsx(index !== fundInformationViews.length - 1 && 'border-b')}
                  >
                    <td className='py-3'>
                      <div className='text-center text-sm text-black-600'>
                        <Checkbox
                          checked={isFirstChecks[index]}
                          disabled={!isFinanceStaff}
                          onChange={() => {
                            const fund_information = {
                              ...fundViewItem.fundInformation,
                              isFirstCheck: !isFirstChecks[index],
                            };
                            submit(fund_information.id || 0, fund_information);
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className='text-center text-sm text-black-600'>
                        <Checkbox
                          checked={isLastChecks[index]}
                          disabled={!isFinanceDirector}
                          onChange={() => {
                            const fund_information = {
                              ...fundViewItem.fundInformation,
                              isLastCheck: !isLastChecks[index],
                            };
                            submit(fund_information.id || 0, fund_information);
                          }}
                        />
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
                        {fundViewItem.fundInformation.receivedAt}
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
              {!fundInformationViews && (
                <tr className='border-b border-primary-1'>
                  <td className='px-1 py-3' colSpan={8}>
                    <div className='flex justify-center'>
                      <div className='text-sm text-black-600'>データがありません</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              {fundInformationViews && (
                <tr>
                  <th />
                  <th />
                  <th />
                  <th />
                  <th className='text-center text-sm text-black-600'>合計金額</th>
                  <th className='text-center text-sm text-black-600'>{totalFee}</th>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
