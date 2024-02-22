import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import clsx from 'clsx';
import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import { RiAddCircleLine } from 'react-icons/ri';

import { useRecoilValue } from 'recoil';
import OpenExpenseAddModalButton from '@/components/budgets/OpenExpenseAddModalButton';
import OpenExpenseDeleteModalButton from '@/components/budgets/OpenExpenseDeleteModalButton';
import OpenExpenseEditModalButton from '@/components/budgets/OpenExpenseEditModalButton';
import { authAtom } from '@/store/atoms';
import { getCurrentUser } from '@/utils/api/currentUser';
import { get } from '@api/api_methods';
import DetailModal from '@components/budgets/DetailModal';
import OpenAddModalButton from '@components/budgets/OpenAddModalButton';
import OpenDeleteModalButton from '@components/budgets/OpenDeleteModalButton';
import OpenEditModalButton from '@components/budgets/OpenEditModalButton';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import { BudgetView, Source, Year, ExpenseView, User } from '@type/common';

interface Props {
  budgets: BudgetView[];
  sources: Source[];
  years: Year[];
  expenses: ExpenseView[];
}

const date = new Date();

export async function getServerSideProps() {
  const getYearUrl = process.env.SSR_API_URI + '/years';
  const periodsRes = await get(getYearUrl);
  const getBudgetUrl =
    process.env.SSR_API_URI +
    '/budgets/details/' +
    (periodsRes ? String(periodsRes[periodsRes.length - 1].year) : String(date.getFullYear()));
  const getSourceUrl = process.env.SSR_API_URI + '/sources';
  const getExpenseUrl =
    process.env.SSR_API_URI +
    '/expenses/details/' +
    (periodsRes ? String(periodsRes[periodsRes.length - 1].year) : String(date.getFullYear()));

  const budgetRes = await get(getBudgetUrl);
  const sourceRes = await get(getSourceUrl);
  const yearRes = await get(getYearUrl);
  const expenseRes = await get(getExpenseUrl);
  return {
    props: {
      budgets: budgetRes,
      sources: sourceRes,
      years: yearRes,
      expenses: expenseRes,
    },
  };
}

export default function BudgetList(props: Props) {
  const { budgets, sources, years, expenses } = props;
  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User>();
  const [budgetViews, setBudgetViews] = useState<BudgetView[]>(props.budgets);
  const [expenseViews, setExpenseViews] = useState<ExpenseView[]>(props.expenses);

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser(auth);
      setCurrentUser(res);
    };
    getUser();
  }, [auth]);

  const isDisabled = useMemo(() => {
    if (currentUser) {
      return !(currentUser.roleID === 2 || currentUser.roleID === 3);
    }
    return true;
  }, [currentUser]);

  const [forcusExpense, setForcusExpense] = useState<ExpenseView>(props.expenses[0]);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = (expenseID: number, expenseView: ExpenseView) => {
    setForcusExpense(expenseView);
    setIsOpen(true);
  };

  const [selectedYear, setSelectedYear] = useState<string>(
    years ? String(years[years.length - 1].year) : String(date.getFullYear()),
  );

  const [selectedExpenseYear, setSelectedExpenseYear] = useState<string>(
    years ? String(years[years.length - 1].year) : String(date.getFullYear()),
  );

  const getBudgets = async () => {
    const getBudgtesByYearsURL = process.env.CSR_API_URI + '/budgets/details/' + selectedYear;
    const getBudgetsByYears = await get(getBudgtesByYearsURL);
    setBudgetViews(getBudgetsByYears);
  };

  const getExpenses = async () => {
    const getExpensesByYearsURL =
      process.env.CSR_API_URI + '/expenses/details/' + selectedExpenseYear;
    const getExpensesByYears = await get(getExpensesByYearsURL);
    setExpenseViews(getExpensesByYears);
  };

  useEffect(() => {
    getBudgets();
  }, [selectedYear]);

  useEffect(() => {
    getExpenses();
  }, [selectedExpenseYear]);

  // 合計金額用の変数
  const budgetsTotalFee =
    budgetViews &&
    budgetViews.reduce((prev, current) => {
      return prev + current.budget.price;
    }, 0);

  const expensesTotalFee =
    expenseViews &&
    expenseViews.reduce((prev, current) => {
      return prev + current.expense.totalPrice;
    }, 0);

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(10, datetime.length - 20);
    return datetime2;
  };

  return (
    <MainLayout>
      <Head>
        <title>予算一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Tabs variant='soft-rounded' className='primary-1'>
        <TabList className='mx-5 mt-10 md:mx-20'>
          <Tab>収入</Tab>
          <Tab>支出</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card>
              <div className='mx-5 mt-10'>
                <div className='flex'>
                  <Title title={'収入一覧'} />
                  <select
                    className='w-100'
                    defaultValue={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <option key={year.year} value={year.year}>
                        {year.year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='hidden justify-end md:flex'>
                  <OpenAddModalButton sources={sources} years={years}>
                    収入登録
                  </OpenAddModalButton>
                </div>
                <div className='mb-2 mt-4 overflow-scroll md:p-5'>
                  <table className='mb-5 w-max table-auto border-collapse md:w-full'>
                    <thead>
                      <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 text-sm text-black-600'>
                        <th className='pb-3'>
                          <div>収入元</div>
                        </th>
                        <th className='pb-3'>
                          <div>年度</div>
                        </th>
                        <th className='pb-3'>
                          <div>金額</div>
                        </th>
                        <th className='pb-3'>
                          <div>作成日時</div>
                        </th>
                        <th className='pb-3'>
                          <div>更新日時</div>
                        </th>
                        <th className='pb-3' />
                      </tr>
                    </thead>
                    <tbody>
                      {budgetViews &&
                        budgetViews.map((budgetView, index) => (
                          <tr
                            key={budgetView.budget.id}
                            className={clsx(
                              budgetViews && index !== budgetViews.length - 1 && 'border-b',
                              'py-3 text-black-600',
                            )}
                          >
                            <td className='py-3 text-center'>{budgetView.source.name}</td>
                            <td className='py-3 text-center'>{budgetView.year.year}</td>
                            <td className='py-3 text-center'>{budgetView.budget.price}</td>
                            <td className='py-3 text-center'>
                              {formatDate(
                                budgetView.budget.createdAt ? budgetView.budget.createdAt : '',
                              )}
                            </td>
                            <td className='py-3 text-center'>
                              {formatDate(
                                budgetView.budget.updatedAt ? budgetView.budget.updatedAt : '',
                              )}
                            </td>
                            <td className='flex items-center justify-center gap-3 py-3'>
                              <OpenEditModalButton
                                id={budgetView.budget.id ? budgetView.budget.id : 0}
                                sources={sources}
                                years={years}
                                isDisabled={isDisabled}
                              />
                              <OpenDeleteModalButton
                                id={budgetView.budget.id ? budgetView.budget.id : 0}
                                isDisabled={isDisabled}
                              />
                            </td>
                          </tr>
                        ))}
                      {!budgetViews && (
                        <tr>
                          <td colSpan={6} className='py-3 text-center text-sm text-black-600'>
                            データがありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {budgetViews && budgetViews.length > 0 && (
                      <tfoot
                        className={clsx(
                          'border border-x-white-0 border-b-white-0 border-t-primary-1',
                        )}
                      >
                        <tr>
                          <th />
                          <th className='py-3 pb-3 pt-4 text-center text-black-600'>合計金額</th>
                          <th className='py-3 pb-3 pt-4 text-center text-black-600'>
                            {budgetsTotalFee}
                          </th>
                          <th />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </Card>
            <div className='fixed bottom-4 right-4 md:hidden'>
              <OpenAddModalButton sources={sources} years={years}>
                <RiAddCircleLine size={20} />
              </OpenAddModalButton>
            </div>
          </TabPanel>
          <TabPanel>
            <Card>
              <div className='mx-5 mt-10'>
                <div className='flex'>
                  <Title title={'支出一覧'} />
                  <select
                    className='w-100 '
                    defaultValue={selectedYear}
                    onChange={(e) => setSelectedExpenseYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <option key={year.year} value={year.year}>
                        {year.year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='mb-2 mt-4 overflow-scroll md:p-5'>
                  <table className='mb-5 w-max table-auto border-collapse md:w-full'>
                    <thead>
                      <tr
                        className={clsx(
                          'border border-x-white-0 border-b-primary-1 border-t-white-0 text-sm text-black-600',
                        )}
                      >
                        <th className='pb-3'>
                          <div>支出元</div>
                        </th>
                        <th className='pb-3'>
                          <div className='text-center'>金額</div>
                        </th>
                        <th className='pb-3'>
                          <div className='text-center'>作成日時</div>
                        </th>
                        <th className='pb-3'>
                          <div className='text-center'>更新日時</div>
                        </th>
                        <th className='pb-3' />
                      </tr>
                    </thead>
                    <tbody>
                      {expenseViews &&
                        expenseViews.map((expenseView, index) => (
                          <tr
                            key={expenseView.expense.id}
                            className={clsx(
                              expenseViews && index !== expenseViews.length - 1 && 'border-b',
                              'py-3 text-black-600',
                            )}
                          >
                            <td
                              className='py-3 text-center'
                              onClick={() => onOpen(expenseView.expense.id || 0, expenseView)}
                            >
                              {expenseView.expense.name}
                            </td>
                            <td
                              onClick={() => onOpen(expenseView.expense.id || 0, expenseView)}
                              className='py-3 text-center'
                            >
                              {expenseView.expense.totalPrice}
                            </td>
                            <td
                              onClick={() => onOpen(expenseView.expense.id || 0, expenseView)}
                              className='py-3 text-center'
                            >
                              {formatDate(
                                expenseView.expense.createdAt ? expenseView.expense.createdAt : '',
                              )}
                            </td>
                            <td
                              onClick={() => onOpen(expenseView.expense.id || 0, expenseView)}
                              className='py-3 text-center'
                            >
                              {formatDate(
                                expenseView.expense.updatedAt ? expenseView.expense.updatedAt : '',
                              )}
                            </td>
                            <td className='flex justify-center gap-3 py-3'>
                              <OpenExpenseEditModalButton
                                disabled={isDisabled}
                                id={expenseView.expense.id ? expenseView.expense.id : 0}
                                expense={expenseView.expense}
                              />
                              <OpenExpenseDeleteModalButton
                                disabled={isDisabled}
                                id={expenseView.expense.id ? expenseView.expense.id : 0}
                              />
                            </td>
                          </tr>
                        ))}
                      {!expenseViews && (
                        <tr>
                          <td colSpan={6} className='py-3 text-center text-sm text-black-600'>
                            データがありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {expenseViews && expenseViews.length > 0 && (
                      <tfoot
                        className={clsx(
                          'border border-x-white-0 border-b-white-0 border-t-primary-1',
                        )}
                      >
                        <tr>
                          <th className='py-3 pb-3 pt-4 text-center text-black-600'>合計金額</th>
                          <th className='py-3 pb-3 pt-4 text-center text-black-600'>
                            {expensesTotalFee}
                          </th>
                          <th />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </Card>
            <div className='fixed bottom-4 right-4 md:hidden'>
              <OpenExpenseAddModalButton years={years} disabled={isDisabled} />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
      {isOpen && <DetailModal setIsOpen={setIsOpen} expenseView={forcusExpense} />}
    </MainLayout>
  );
}
