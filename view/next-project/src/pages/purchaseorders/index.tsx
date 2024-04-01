import Head from 'next/head';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';
import { authAtom } from '@/store/atoms';
import { put } from '@/utils/api/purchaseOrder';
import { createPurchaseOrdersCsv } from '@/utils/createPurchaseOrdersCsv';
import { downloadFile } from '@/utils/downloadFile';
import { get } from '@api/api_methods';
import { getCurrentUser } from '@api/currentUser';
import { Card, Checkbox, Title, BureauLabel } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/purchaseorders/DetailModal';
import OpenAddModalButton from '@components/purchaseorders/OpenAddModalButton';
import OpenDeleteModalButton from '@components/purchaseorders/OpenDeleteModalButton';
import OpenEditModalButton from '@components/purchaseorders/OpenEditModalButton';
import {
  PurchaseItem,
  PurchaseOrder,
  User,
  PurchaseOrderView,
  Expense,
  YearPeriod,
} from '@type/common';

interface Props {
  user: User;
  purchaseOrderView: PurchaseOrderView[];
  expenses: Expense[];
  yearPeriods: YearPeriod[];
  expenseByPeriods: Expense[];
}

const date = new Date();

export async function getServerSideProps() {
  const getPeriodsUrl = process.env.SSR_API_URI + '/years/periods';
  const periodsRes = await get(getPeriodsUrl);
  const getPurchaseOrderViewUrl =
    process.env.SSR_API_URI +
    '/purchaseorders/details/' +
    (periodsRes ? String(periodsRes[periodsRes.length - 1].year) : String(date.getFullYear()));
    const purchaseOrderViewRes = await get(getPurchaseOrderViewUrl);
  const getExpenseUrl = process.env.SSR_API_URI + '/expenses';
  const expenseRes = await get(getExpenseUrl);
  const getExpenseByPeriodsUrl =
    process.env.SSR_API_URI +
    '/expenses/fiscalyear/' +
    (periodsRes ? String(periodsRes[periodsRes.length - 1].year) : String(date.getFullYear()));
  const expenseByPeriodsRes = await get(getExpenseByPeriodsUrl);

  return {
    props: {
      purchaseOrderView: purchaseOrderViewRes,
      expenses: expenseRes,
      yearPeriods: periodsRes,
      expenseByPeriods: expenseByPeriodsRes,
    },
  };
}

const formatYYYYMMDD = (date: Date) => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

export default function PurchaseOrders(props: Props) {
  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User>();
  const [purchaseOrderChecks, setPurchaseOrderChecks] = useState<boolean[]>([]);
  const [purchaseOrderID, setPurchaseOrderID] = useState<number>(1);
  const [purchaseOrderViews, setPurchaseOrderViews] = useState<PurchaseOrderView[]>(
    props.purchaseOrderView,
  );
  const [purchaseOrderViewItem, setPurchaseOrderViewItem] = useState<PurchaseOrderView>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = (purchaseOrderID: number, purchaseOrderViewItem: PurchaseOrderView) => {
    setPurchaseOrderID(purchaseOrderID);
    setPurchaseOrderViewItem(purchaseOrderViewItem);
    setIsOpen(true);
  };

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(5, datetime.length - 10).replace('-', '/');
    return datetime2;
  };

  const yearPeriods = props.yearPeriods;
  const [selectedYear, setSelectedYear] = useState<string>(
    yearPeriods ? String(yearPeriods[yearPeriods.length - 1].year) : String(date.getFullYear()),
  );

  const getPurchaseOrders = async () => {
    const getPurchaseOrderViewUrlByYear =
      process.env.CSR_API_URI + '/purchaseorders/details/' + selectedYear;
    console.log(getPurchaseOrderViewUrlByYear);
    const getPurchaseOrderByYears = await get(getPurchaseOrderViewUrlByYear);
    setPurchaseOrderViews(getPurchaseOrderByYears);
  };

  // 購入申請の合計金額を計算
  // // 申請を出した時点では購入物品のチェックはfalseなので、finance_check関係なく計算
  const TotalFee = (purchaseItems: PurchaseItem[]) => {
    let totalFee = 0;
    purchaseItems?.map((purchaseItem: PurchaseItem) => {
      totalFee += purchaseItem.price * purchaseItem.quantity;
    });
    return totalFee;
  };

  // 全ての購入申請の合計金額を計算
  const totalPurchaseOrderFee = useMemo(() => {
    if (purchaseOrderViews) {
      let totalFee = 0;
      purchaseOrderViews.map((purchaseOrderView: PurchaseOrderView) => {
        totalFee += TotalFee(purchaseOrderView.purchaseItem);
      });
      return totalFee;
    }
    return 0;
  }, [purchaseOrderViews]);

  useEffect(() => {
    getPurchaseOrders();
  }, [selectedYear]);

  useEffect(() => {
    if (purchaseOrderViews) {
      const purchaseOrderChecks = purchaseOrderViews.map((purchaseOrderView) => {
        return purchaseOrderView.purchaseOrder.financeCheck;
      });
      setPurchaseOrderChecks(purchaseOrderChecks);
    }
  }, [purchaseOrderViews]);

  const updatePurchaseOrder = async (purchaseOrderID: number, purchaseOrder: PurchaseOrder) => {
    const url = process.env.CSR_API_URI + '/purchaseorders/' + purchaseOrderID;
    const res: PurchaseOrder = await put(url, purchaseOrder);
    const newPurchaseOrderViews = purchaseOrderViews.map((purchaseOrderView) => {
      if (purchaseOrderView.purchaseOrder.id === res.id) {
        purchaseOrderView.purchaseOrder = res;
      }
      return purchaseOrderView;
    });
    setPurchaseOrderViews(newPurchaseOrderViews);
  };

  const isFinanceDirector = useMemo(() => {
    if (currentUser?.roleID === 3) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  const isDisabled = useCallback(
    (purchaseOrderViewItem: PurchaseOrderView) => {
      if (
        !purchaseOrderViewItem.purchaseOrder.financeCheck &&
        (currentUser?.roleID === 2 ||
          currentUser?.roleID === 3 ||
          currentUser?.id === purchaseOrderViewItem.purchaseOrder.userID)
      ) {
        return false;
      } else {
        return true;
      }
    },
    [currentUser?.id, currentUser?.roleID, purchaseOrderViews],
  );

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser(auth);
      setCurrentUser(res);
    };
    getUser();
  }, []);

  console.log(props.expenseByPeriods);

  return (
    <MainLayout>
      <Head>
        <title>購入申請一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex gap-4'>
            <Title title={'購入申請一覧'} />
            <select
              className='w-100'
              defaultValue={selectedYear}
              onChange={async (e) => {
                setSelectedYear(e.target.value);
              }}
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
            <PrimaryButton
              className='hidden md:block'
              onClick={async () => {
                downloadFile({
                  downloadContent: await createPurchaseOrdersCsv(
                    purchaseOrderViews,
                    props.expenses,
                  ),
                  fileName: `購入申請一覧(${selectedYear})_${formatYYYYMMDD(date)}.csv`,
                  isBomAdded: true,
                });
              }}
            >
              CSVダウンロード
            </PrimaryButton>
          </div>
          <div className='hidden justify-end md:flex'>
            <OpenAddModalButton expenses={props.expenses} expenseByPeriods={props.expenseByPeriods} yearPeriods={yearPeriods}>
              申請登録
            </OpenAddModalButton>
          </div>
        </div>
        <div className='w-100 mb-2 overflow-scroll p-5'>
          <table className='mb-5 w-max table-auto border-collapse md:w-full md:table-fixed'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-1/12 pb-2'>
                  <div className='text-center text-sm text-black-600'></div>
                </th>
                <th className='w-2/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>購入したい局</div>
                </th>
                <th className='w-2/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>申請日</div>
                </th>
                <th className='w-2/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>購入期限</div>
                </th>
                <th className='w-3/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>購入物品</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>合計金額</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'></th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {purchaseOrderViews &&
                purchaseOrderViews.map((purchaseOrderViewItem, index) => (
                  <tr className='border-b' key={purchaseOrderViewItem.purchaseOrder.id}>
                    <td className='py-3'>
                      <div className='text-center text-sm text-black-600'>
                        <Checkbox
                          checked={purchaseOrderChecks[index]}
                          disabled={!isFinanceDirector}
                          onChange={() => {
                            updatePurchaseOrder(purchaseOrderViewItem.purchaseOrder.id || 0, {
                              ...purchaseOrderViewItem.purchaseOrder,
                              financeCheck: !purchaseOrderChecks[index],
                            });
                          }}
                        />
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(purchaseOrderViewItem.purchaseOrder.id || 0, purchaseOrderViewItem);
                      }}
                    >
                      <div className='flex justify-center'>
                        <BureauLabel
                          bureauName={
                            props.expenses.find(
                              (expense) =>
                                expense.id === purchaseOrderViewItem.purchaseOrder.expenseID,
                            )?.name || ''
                          }
                        />
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(purchaseOrderViewItem.purchaseOrder.id || 0, purchaseOrderViewItem);
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {formatDate(
                          purchaseOrderViewItem.purchaseOrder.createdAt
                            ? purchaseOrderViewItem.purchaseOrder.createdAt
                            : '',
                        )}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(purchaseOrderViewItem.purchaseOrder.id || 0, purchaseOrderViewItem);
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {purchaseOrderViewItem.purchaseOrder.deadline}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(purchaseOrderViewItem.purchaseOrder.id || 0, purchaseOrderViewItem);
                      }}
                    >
                      <div className='overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm text-black-600'>
                        {purchaseOrderViewItem.purchaseItem &&
                          purchaseOrderViewItem.purchaseItem.map(
                            (purchaseItem: PurchaseItem, index: number) => (
                              <>
                                {purchaseOrderViewItem.purchaseItem.length - 1 === index ? (
                                  <>{purchaseItem.item}</>
                                ) : (
                                  <>{purchaseItem.item},</>
                                )}
                              </>
                            ),
                          )}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(purchaseOrderViewItem.purchaseOrder.id || 0, purchaseOrderViewItem);
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {TotalFee(purchaseOrderViewItem.purchaseItem)}
                      </div>
                    </td>
                    <td>
                      <div className='flex'>
                        <div className='mx-1'>
                          <OpenEditModalButton
                            id={
                              purchaseOrderViewItem.purchaseOrder.id
                                ? purchaseOrderViewItem.purchaseOrder.id
                                : 0
                            }
                            purchaseItems={purchaseOrderViewItem.purchaseItem}
                            isDisabled={isDisabled(purchaseOrderViewItem)}
                          />
                        </div>
                        <div className='mx-1'>
                          <OpenDeleteModalButton
                            id={
                              purchaseOrderViewItem.purchaseOrder.id
                                ? purchaseOrderViewItem.purchaseOrder.id
                                : 0
                            }
                            isDisabled={isDisabled(purchaseOrderViewItem)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              {purchaseOrderViews && purchaseOrderViews.length > 0 && (
                <tr className='border-b border-primary-1'>
                  <td className='px-1 py-3' colSpan={5}>
                    <div className='flex justify-end'>
                      <div className='text-sm text-black-600'>合計</div>
                    </div>
                  </td>
                  <td className='px-1 py-3'>
                    <div className='text-center text-sm text-black-600'>
                      {totalPurchaseOrderFee}
                    </div>
                  </td>
                </tr>
              )}
              {!purchaseOrderViews && (
                <tr className='border-b border-primary-1'>
                  <td className='px-1 py-3' colSpan={7}>
                    <div className='flex justify-center'>
                      <div className='text-sm text-black-600'>データがありません</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {isOpen && purchaseOrderViewItem && (
        <DetailModal
          id={purchaseOrderID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          purchaseOrderViewItem={purchaseOrderViewItem}
          expenses={props.expenses}
          isDelete={false}
        />
      )}
      <div className='fixed bottom-4 right-4 md:hidden'>
        <OpenAddModalButton expenses={props.expenses} expenseByPeriods={props.expenseByPeriods} yearPeriods={yearPeriods}/>
      </div>
    </MainLayout>
  );
}
