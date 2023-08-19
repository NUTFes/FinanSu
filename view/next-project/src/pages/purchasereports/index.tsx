import clsx from 'clsx';
import Head from 'next/head';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import PrimaryButton from '@/components/common/OutlinePrimaryButton/OutlinePrimaryButton';

import { authAtom } from '@/store/atoms';
import { put } from '@/utils/api/api_methods';
import { createPurchaseReportCsv } from '@/utils/createPurchaseReportCsv';
import { downloadFile } from '@/utils/downloadFile';
import { get } from '@api/api_methods';
import { getCurrentUser } from '@api/currentUser';
import { Card, Checkbox, Title, BureauLabel } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/purchasereports/DetailModal';
import OpenAddModalButton from '@components/purchasereports/OpenAddModalButton';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';
import OpenEditModalButton from '@components/purchasereports/OpenEditModalButton';
import { PurchaseItem, PurchaseOrder, PurchaseReport, User, Expense } from '@type/common';

export interface PurchaseReportView {
  purchaseReport: PurchaseReport;
  reportUser: User;
  purchaseOrder: PurchaseOrder;
  orderUser: User;
  purchaseItems: PurchaseItem[];
}

interface Props {
  purchaseReports: PurchaseReport[];
  purchaseReportViews: PurchaseReportView[];
  user: User;
  purchaseOrder: PurchaseOrder[];
  expenses: Expense[];
}

export async function getServerSideProps() {
  const getPurchaseReportsUrl = process.env.SSR_API_URI + '/purchasereports';
  const getPurchaseReportViewUrl = process.env.SSR_API_URI + '/purchasereports/details';
  const getExpenseUrl = process.env.SSR_API_URI + '/expenses';
  const purchaseReportsRes = await get(getPurchaseReportsUrl);
  const purchaseReportViewRes = await get(getPurchaseReportViewUrl);
  const expenseRes = await get(getExpenseUrl);
  return {
    props: {
      purchaseReports: purchaseReportsRes,
      purchaseReportViews: purchaseReportViewRes,
      expenses: expenseRes,
    },
  };
}

const formatYYYYMMDD = (date: Date) => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

export default function PurchaseReports(props: Props) {
  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User>();

  const [purchaseReportID, setPurchaseReportID] = useState<number>(1);
  const [purchaseReportViewItem, setPurchaseReportViewItem] = useState<PurchaseReportView>();
  const [purchaseReportViews, setPurchaseReportViews] = useState<PurchaseReportView[]>(
    props.purchaseReportViews,
  );

  const [purchaseReportChecks, setPurchaseReportChecks] = useState<boolean[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = (purchaseOrderID: number, purchaseReportViewItem: PurchaseReportView) => {
    setPurchaseReportID(purchaseOrderID);
    setPurchaseReportViewItem(purchaseReportViewItem);
    setIsOpen(true);
  };

  const formatDate = useCallback((date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(5, datetime.length - 10).replace('-', '/');
    return datetime2;
  }, []);

  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  const filteredPurchaseReportViews = useMemo(() => {
    return purchaseReportViews.filter((purchaseReportViewItem) => {
      return purchaseReportViewItem.purchaseOrder.createdAt?.includes(selectedYear);
    });
  }, [purchaseReportViews, selectedYear]);

  const TotalFee = useCallback((purchaseReport: PurchaseReport, purchaseItems: PurchaseItem[]) => {
    let totalFee = 0;
    purchaseItems.map((purchaseItem: PurchaseItem) => {
      if (purchaseItem.financeCheck) {
        totalFee += purchaseItem.price * purchaseItem.quantity;
      }
    });
    totalFee += purchaseReport.addition - purchaseReport.discount;
    return totalFee;
  }, []);

  // すべてのpurchaseReportの合計金額
  const totalReportFee = useMemo(() => {
    if (filteredPurchaseReportViews) {
      let totalFee = 0;
      filteredPurchaseReportViews.map((purchaseReportView: PurchaseReportView) => {
        totalFee += TotalFee(purchaseReportView.purchaseReport, purchaseReportView.purchaseItems);
      });
      return totalFee;
    }
    return 0;
  }, [filteredPurchaseReportViews]);

  const isDisabled = useCallback(
    (purchaseReportView: PurchaseReportView) => {
      if (
        !purchaseReportView.purchaseReport.financeCheck &&
        (currentUser?.roleID === 2 ||
          currentUser?.roleID === 3 ||
          currentUser?.id === purchaseReportView.purchaseReport.userID)
      ) {
        return false;
      } else {
        return true;
      }
    },
    [currentUser?.roleID, currentUser?.id, purchaseReportViews],
  );

  const updatePurchaseReport = async (purchaseReportID: number, purchaseReport: PurchaseReport) => {
    const url = process.env.CSR_API_URI + '/purchasereports/' + purchaseReportID;
    const res: PurchaseReport = await put(url, purchaseReport);
    const newPurchaseReportViews = purchaseReportViews.map((purchaseReportView) => {
      if (purchaseReportView.purchaseReport.id === purchaseReportID) {
        purchaseReportView.purchaseReport = res;
      }
      return purchaseReportView;
    });
    setPurchaseReportViews(newPurchaseReportViews);
  };

  useEffect(() => {
    if (filteredPurchaseReportViews) {
      const purchaseReportChecks = filteredPurchaseReportViews.map((purchaseReportView) => {
        return purchaseReportView.purchaseReport.financeCheck;
      });
      setPurchaseReportChecks(purchaseReportChecks);
    }
  }, [filteredPurchaseReportViews]);

  const isFinanceDirector = useMemo(() => {
    if (currentUser?.roleID === 3) {
      return true;
    } else {
      return false;
    }
  }, [currentUser?.roleID]);

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser(auth);
      setCurrentUser(res);
    };
    getUser();
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>購入報告一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card w='w-full'>
        <div className='mx-5 mt-10'>
          <div className='flex gap-4'>
            <Title title={'購入報告一覧'} />
            <select
              className='w-100 '
              defaultValue={currentYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
              <option value='2023'>2023</option>
            </select>
            <PrimaryButton
              className='hidden md:block'
              onClick={async () => {
                downloadFile({
                  downloadContent: await createPurchaseReportCsv(
                    filteredPurchaseReportViews,
                    props.expenses,
                  ),
                  fileName: `購入申請一覧(${selectedYear})_${formatYYYYMMDD(new Date())}.csv`,
                  isBomAdded: true,
                });
              }}
            >
              CSVダウンロード
            </PrimaryButton>
          </div>
          <div className='hidden justify-end md:flex'>
            <OpenAddModalButton>報告登録</OpenAddModalButton>
          </div>
        </div>
        <div className='w-100 mb-2 overflow-scroll p-5'>
          <table className='mb-5 w-max table-auto border-collapse md:w-full md:table-fixed'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-fit pb-2'>
                  <div className='text-center text-sm text-black-600'>財務局長チェック</div>
                </th>
                <th className='w-1/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>ID</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>購入した局</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>報告日</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>期限日</div>
                </th>
                <th className='w-2/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>購入物品 (個数)</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>合計金額</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>備考</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>購入者</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'></th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {filteredPurchaseReportViews &&
                filteredPurchaseReportViews.map((purchaseReportViewItem, index) => (
                  <tr className='border-b' key={purchaseReportViewItem.purchaseReport.id}>
                    <td
                      className={clsx('px-1', index === 0 ? 'pb-3 pt-4' : 'py-3', 'border-b py-3')}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>
                        <Checkbox
                          checked={purchaseReportChecks[index]}
                          disabled={!isFinanceDirector}
                          onChange={() => {
                            updatePurchaseReport(purchaseReportViewItem.purchaseReport.id || 0, {
                              ...purchaseReportViewItem.purchaseReport,
                              financeCheck: !purchaseReportChecks[index],
                            });
                          }}
                        />
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {purchaseReportViewItem.purchaseReport.id}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div className={clsx('flex justify-center')}>
                        <BureauLabel
                          bureauName={
                            props.expenses.find(
                              (expense) =>
                                expense.id === purchaseReportViewItem.purchaseOrder.expenseID,
                            )?.name || ''
                          }
                        />
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {formatDate(
                          purchaseReportViewItem.purchaseReport.createdAt
                            ? purchaseReportViewItem.purchaseReport.createdAt
                            : '',
                        )}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {purchaseReportViewItem.purchaseOrder.deadline}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div
                        className={clsx(
                          'overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm text-black-600',
                        )}
                      >
                        {/* name (個数/finasucheck) */}
                        {purchaseReportViewItem.purchaseItems.map((purchaseItem, index) => (
                          <div key={index}>
                            {`${purchaseItem.financeCheck ? '○' : 'x'} ${purchaseItem.item} (${
                              purchaseItem.quantity
                            })`}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {TotalFee(
                          purchaseReportViewItem.purchaseReport,
                          purchaseReportViewItem.purchaseItems,
                        )}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {purchaseReportViewItem.purchaseReport.remark || '無し'}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        onOpen(
                          purchaseReportViewItem.purchaseOrder.id || 0,
                          purchaseReportViewItem,
                        );
                      }}
                    >
                      <div className='text-center text-sm text-black-600'>
                        {purchaseReportViewItem.purchaseReport.buyer || ''}
                      </div>
                    </td>
                    <td>
                      <div className='flex'>
                        <div className='mx-1'>
                          <OpenEditModalButton
                            id={
                              purchaseReportViewItem.purchaseReport.id
                                ? purchaseReportViewItem.purchaseReport.id
                                : 0
                            }
                            isDisabled={isDisabled(purchaseReportViewItem)}
                          />
                        </div>
                        <div className='mx-1'>
                          <OpenDeleteModalButton
                            id={
                              purchaseReportViewItem.purchaseReport.id
                                ? purchaseReportViewItem.purchaseReport.id
                                : 0
                            }
                            isDisabled={isDisabled(purchaseReportViewItem)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              {filteredPurchaseReportViews.length > 0 && (
                <tr>
                  <td className='border-b border-primary-1 px-1 py-3' colSpan={6}>
                    <div className='text-right text-sm text-black-600'>合計</div>
                  </td>
                  <td className='border-b border-primary-1 px-1 py-3'>
                    <div className='text-center text-sm text-black-600'>{totalReportFee}</div>
                  </td>
                  <td className='border-b border-primary-1 px-1 py-3' colSpan={2}>
                    <div className='text-center text-sm text-black-600' />
                  </td>
                </tr>
              )}
              {!filteredPurchaseReportViews.length && (
                <tr>
                  <td className='border-b border-primary-1 px-1 py-3' colSpan={9}>
                    <div className='text-center text-sm text-black-600'>データがありません</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {isOpen && purchaseReportViewItem && (
        <DetailModal
          id={purchaseReportID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          expenses={props.expenses}
          purchaseReportViewItem={purchaseReportViewItem}
          isDelete={false}
        />
      )}
      <div className='fixed bottom-4 right-4 md:hidden'>
        <OpenAddModalButton />
      </div>
    </MainLayout>
  );
}
