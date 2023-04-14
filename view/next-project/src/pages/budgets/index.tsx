import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import clsx from 'clsx';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';

import { get } from '@api/api_methods';
import OpenAddModalButton from '@components/budgets/OpenAddModalButton';
import OpenDeleteModalButton from '@components/budgets/OpenDeleteModalButton';
import OpenEditModalButton from '@components/budgets/OpenEditModalButton';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import { BudgetView, Source, Year, ExpenseView } from '@type/common';
import DetailModal from '@components/budgets/DetailModal';
import { useState } from 'react';
import { formatDate } from '@utils/formatDate';

interface Props {
  budgets: BudgetView[];
  sources: Source[];
  years: Year[];
  expenses: ExpenseView[];
}

export async function getServerSideProps() {
  const getBudgetUrl = process.env.SSR_API_URI + '/budgets/details';
  const getSourceUrl = process.env.SSR_API_URI + '/sources';
  const getYearUrl = process.env.SSR_API_URI + '/years';
  const getExpenseUrl = process.env.SSR_API_URI + '/expenses/details';

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

  const [expenseView, setExpenseView] = useState<ExpenseView>(props.expenses[0]);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = (expenseID: number, expenseView: ExpenseView) => {
    setExpenseView(expenseView);
    setIsOpen(true);
  };

  // 合計金額用の変数
  const budgetsTotalFee = budgets.reduce((prev, current) => {
    return prev + current.budget.price;
  }, 0);

  const expensesTotalFee = expenses.reduce((prev, current) => {
    return prev + current.expense.totalPrice;
  }, 0);

  return (
    <MainLayout>
      <Head>
        <title>予算一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Tabs variant='soft-rounded' className='primary-1'>
        <TabList className='mx-20 mt-10'>
          <Tab>収入</Tab>
          <Tab>支出</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card>
              <div className='mx-5 mt-10'>
                <div className='flex'>
                  <Title title={'収入一覧'} />
                  <select className='w-100 '>
                    <option value='2021'>2021</option>
                    <option value='2022'>2022</option>
                  </select>
                </div>
                <div className='flex justify-end'>
                  <OpenAddModalButton sources={sources} years={years}>
                    <RiAddCircleLine
                      size={20}
                      style={{
                        marginRight: 5,
                      }}
                    />
                    収入登録
                  </OpenAddModalButton>
                </div>
                <div className='w-100 mb-2 p-5'>
                  <table className='mb-5 w-full table-fixed border-collapse'>
                    <thead>
                      <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>収入元</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>年度</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>金額</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>作成日時</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>更新日時</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgets.map((budgetView, index) => (
                        <tr key={budgetView.budget.id}
                          className={clsx(index !== budgets.length-1 && 'border-b')}
                        >
                          <td
                            className='py-3 pt-4 pb-3 text-center text-black-600'
                          >
                            {budgetView.source.name}
                          </td>
                          <td
                            className='py-3 pt-4 pb-3 text-center text-black-600'
                          >
                            {budgetView.year.year}
                          </td>
                          <td className='py-3 pt-4 pb-3 text-center text-black-600'>
                            {budgetView.budget.price}
                          </td>
                          <td className='py-3 pt-4 pb-3 text-center text-black-600'>
                            {formatDate(budgetView.budget.createdAt ? budgetView.budget.createdAt : '')}
                          </td>
                          <td className='py-3 pt-4 pb-3 text-center text-black-600'>
                            {formatDate(budgetView.budget.updatedAt ? budgetView.budget.updatedAt : '')}
                          </td>
                          <td className='content-center p-3 text-black-600'>
                            <div className='flex text-center'>
                              <div className='flex-auto'>
                                <OpenEditModalButton
                                  id={budgetView.budget.id ? budgetView.budget.id : 0}
                                  sources={sources}
                                  years={years}
                                />
                              </div>
                              <div className='flex-auto'>
                                <OpenDeleteModalButton id={budgetView.budget.id ? budgetView.budget.id : 0} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot
                      className={clsx(
                        'border border-x-white-0 border-t-primary-1 border-b-white-0',
                      )}
                    >
                      <tr>
                        <th />
                        <th className='py-3 pt-4 pb-3 text-center text-black-600'>
                          合計金額
                        </th>
                        <th className='py-3 pt-4 pb-3 text-center text-black-600'>
                          {budgetsTotalFee}
                        </th>
                        <th />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <div className='mx-5 mt-10'>
                <div className='flex'>
                  <Title title={'支出一覧'} />
                  <select className='w-100 '>
                    <option value='2021'>2021</option>
                    <option value='2022'>2022</option>
                  </select>
                </div>
                <div className='w-100 mb-2 p-5'>
                  <table className='mb-5 w-full table-fixed border-collapse'>
                    <thead>
                      <tr
                        className={clsx(
                          'border border-x-white-0 border-b-primary-1 border-t-white-0 py-3',
                        )}
                      >
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>支出元</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>金額</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>作成日時</div>
                        </th>
                        <th className='w-1/6 border-b-primary-1 pb-2'>
                          <div className='text-center text-sm text-black-600'>更新日時</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expenseView, index) => (
                        <tr 
                          key={expenseView.expense.id}
                          className={clsx(index !== expenses.length-1 && 'border-b')} 
                          onClick={() => onOpen(expenseView.expense.id || 0, expenseView)}
                        >
                          <td className='py-3 pt-4 pb-3 text-center text-black-600'>
                            {expenseView.expense.name}
                          </td>
                          <td className='py-3 pt-4 pb-3 text-center text-black-600'>
                            {expenseView.expense.totalPrice}
                          </td>
                          <td className='py-3 pt-4 pb-3 text-center text-black-600'>
                            {formatDate(expenseView.expense.createdAt ? expenseView.expense.createdAt : '')}
                          </td>
                          <td className='py-3 pt-4 pb-3 text-center text-black-600'>
                            {formatDate(expenseView.expense.updatedAt ? expenseView.expense.updatedAt : '')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot
                      className={clsx(
                        'border border-x-white-0 border-t-primary-1 border-b-white-0',
                      )}
                    >
                      <tr>
                        <th />
                        <th className='py-3 pt-4 pb-3 text-center text-black-600'>
                          合計金額
                        </th>
                        <th className='py-3 pt-4 pb-3 text-center text-black-600'>
                          {expensesTotalFee}
                        </th>
                        <th />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
      {isOpen && (
        <DetailModal
          setIsOpen={setIsOpen}
          expenseView={expenseView}
        />
      )}
    </MainLayout>
  );
}
