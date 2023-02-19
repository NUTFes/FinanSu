import clsx from 'clsx';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';

import { get } from '@api/budget';
import OpenAddModalButton from '@components/budgets/OpenAddModalButton';
import OpenDeleteModalButton from '@components/budgets/OpenDeleteModalButton';
import OpenEditModalButton from '@components/budgets/OpenEditModalButton';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import { Budget, Source, Year } from '@type/common';

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

  // yearIDからyearを取得するための処理（後々APIから取得する）
  // 合計金額を計算するための処理
  for (let i = 0; i < props.budgets.length; i++) {
    for (let j = 0; j < years.length; j++) {
      if (props.budgets[i].yearID == years[j].id) {
        props.budgets[i].yearID = years[j].year;
      }
    }

    // for (let j = 0; j < sources.length; j++) {
    //   if (props.budgets[i].sourceID == sources[j].id) {
    //     props.budgets[i].source = sources[j].name;
    //   }
    // }
    // 合計金額を計算
    totalFee += props.budgets[i].price;
  }

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
      <Card>
        <div className={clsx('mx-5 mt-10')}>
          <div className={clsx('flex')}>
            <Title title={'予算一覧'} />
            <select className={clsx('w-100 ')}>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className={clsx('flex justify-end')}>
            <OpenAddModalButton sources={sources} years={years}>
              <RiAddCircleLine
                size={20}
                style={{
                  marginRight: 5,
                }}
              />
              予算登録
            </OpenAddModalButton>
          </div>
          <div className={clsx('w-100 mb-2 p-5')}>
            <table className={clsx('mb-5 w-full table-fixed border-collapse')}>
              <thead>
                <tr
                  className={clsx(
                    'border border-x-white-0 border-b-primary-1 border-t-white-0 py-3',
                  )}
                >
                  <th className={clsx('w-1/6 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>項目</div>
                  </th>
                  <th className={clsx('w-1/6 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>年度</div>
                  </th>
                  <th className={clsx('w-1/6 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>金額</div>
                  </th>
                  <th className={clsx('w-1/6 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>作成日時</div>
                  </th>
                  <th className={clsx('w-1/6 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>更新日時</div>
                  </th>
                  <th className={clsx('w-1/6 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.budgets.map((budgetItem, index) => (
                  <tr key={budgetItem.id}>
                    {props.sources.map((sourceItem) => (
                      <td
                        key={sourceItem.id}
                        className={clsx('py-3 pt-4 pb-3 text-center text-black-600')}
                      >
                        {sourceItem.name}
                      </td>
                    ))}
                    {props.years.map((yearItem) => (
                      <td
                        key={yearItem.id}
                        className={clsx('py-3 pt-4 pb-3 text-center text-black-600')}
                      >
                        {yearItem.year}
                      </td>
                    ))}
                    <td className={clsx('py-3 pt-4 pb-3 text-center text-black-600')}>
                      {budgetItem.price}
                    </td>
                    <td className={clsx('py-3 pt-4 pb-3 text-center text-black-600')}>
                      {formatDate(budgetItem.createdAt ? budgetItem.createdAt : '')}
                    </td>
                    <td className={clsx('py-3 pt-4 pb-3 text-center text-black-600')}>
                      {formatDate(budgetItem.updatedAt ? budgetItem.updatedAt : '')}
                    </td>
                    <td className={clsx('content-center p-3 text-black-600')}>
                      <div className={clsx('flex text-center')}>
                        <div className={clsx('flex-auto')}>
                          <OpenEditModalButton
                            id={budgetItem.id ? budgetItem.id : 0}
                            sources={sources}
                            years={years}
                          />
                        </div>
                        <div className={clsx('flex-auto')}>
                          <OpenDeleteModalButton id={budgetItem.id ? budgetItem.id : 0} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot
                className={clsx('border border-x-white-0 border-t-primary-1 border-b-white-0')}
              >
                <tr>
                  <th />
                  <th className={clsx('py-3 pt-4 pb-3 text-center text-black-600')}>合計金額</th>
                  <th className={clsx('py-3 pt-4 pb-3 text-center text-black-600')}>{totalFee}</th>
                  <th />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}
