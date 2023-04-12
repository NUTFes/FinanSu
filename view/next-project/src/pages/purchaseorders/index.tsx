import clsx from 'clsx';
import Head from 'next/head';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { authAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { put } from '@/utils/api/purchaseOrder';
import { getCurrentUser } from '@api/currentUser';
import { Card, Checkbox, Title, BureauLabel } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/purchaseorders/DetailModal';
import OpenAddModalButton from '@components/purchaseorders/OpenAddModalButton';
import OpenDeleteModalButton from '@components/purchaseorders/OpenDeleteModalButton';
import OpenEditModalButton from '@components/purchaseorders/OpenEditModalButton';
import { PurchaseItem, PurchaseOrder, User, PurchaseOrderView, Expense } from '@type/common';

interface Props {
  user: User;
  purchaseOrders: PurchaseOrder[];
  purchaseOrderView: PurchaseOrderView[];
  expenses: Expense[];
}
export async function getServerSideProps() {
  const getPurchaseOrdersUrl = process.env.SSR_API_URI + '/purchaseorders';
  const getPurchaseOrderViewUrl = process.env.SSR_API_URI + '/purchaseorders/details';
  const getExpenseUrl = process.env.SSR_API_URI + '/expenses';
  const purchaseOrdersRes = await get(getPurchaseOrdersUrl);
  const purchaseOrderViewRes = await get(getPurchaseOrderViewUrl);
  const expenseRes = await get(getExpenseUrl);

  return {
    props: {
      purchaseOrders: purchaseOrdersRes,
      purchaseOrderView: purchaseOrderViewRes,
      expenses: expenseRes,
    },
  };
}

export default function PurchaseOrders(props: Props) {
  const auth = useRecoilValue(authAtom);
  const [currentUser, setCurrentUser] = useState<User>();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(props.purchaseOrders);
  const [purchaseOrderChecks, setPurchaseOrderChecks] = useState<boolean[]>([]);
  const [purchaseOrderID, setPurchaseOrderID] = useState<number>(1);
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
    let totalFee = 0;
    props.purchaseOrderView?.map((purchaseOrderView: PurchaseOrderView) => {
      totalFee += TotalFee(purchaseOrderView.purchaseItem);
    });
    return totalFee;
  }, [props.purchaseOrderView]);

  useEffect(() => {
    const purchaseOrderChecks = purchaseOrders.map((purchaseOrder) => {
      return purchaseOrder.financeCheck;
    });
    setPurchaseOrderChecks(purchaseOrderChecks);
  }, [purchaseOrders, setPurchaseOrders]);

  const updatePurchaseOrder = async (purchaseOrderID: number, purchaseOrder: PurchaseOrder) => {
    const url = process.env.CSR_API_URI + '/purchaseorders/' + purchaseOrderID;
    const res = await put(url, purchaseOrder);
    const newPurchaseOrders = purchaseOrders.map((purchaseOrder) => {
      return purchaseOrder.id === purchaseOrderID ? res : purchaseOrder;
    });
    setPurchaseOrders(newPurchaseOrders);
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
        return true;
      } else {
        return false;
      }
    },
    [currentUser?.roleID, currentUser?.id, currentUser],
  );

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
        <title>購入申請一覧</title>
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
            <OpenAddModalButton expenses={props.expenses}>申請登録</OpenAddModalButton>
          </div>
        </div>
        <div className='w-100 mb-2 p-5'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-2/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>財務局長チェック</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
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
              {props.purchaseOrderView.map((purchaseOrderViewItem, index) => (
                <tr 
                  className='border-b'
                  key={purchaseOrderViewItem.purchaseOrder.id}
                  onClick={() => {
                    onOpen(
                      purchaseOrderViewItem.purchaseOrder.id || 0,
                      purchaseOrderViewItem,
                    );
                  }}
                >
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>
                      <Checkbox
                        checked={purchaseOrderChecks[index]}
                        disabled={!isFinanceDirector}
                        onChange={() => {
                          updatePurchaseOrder(
                            purchaseOrderViewItem.purchaseOrder.id || 0,
                            {...purchaseOrderViewItem.purchaseOrder, financeCheck: !purchaseOrderChecks[index]},
                          );
                        }}
                      />
                    </div>
                  </td>
                  <td
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
                  >
                    <div className='text-center text-sm text-black-600'>
                      {formatDate(
                        purchaseOrderViewItem.purchaseOrder.createdAt
                          ? purchaseOrderViewItem.purchaseOrder.createdAt
                          : '',
                      )}
                    </div>
                  </td>
                  <td>
                    <div className='text-center text-sm text-black-600'>
                      {purchaseOrderViewItem.purchaseOrder.deadline}
                    </div>
                  </td>
                  <td>
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
                  <td>
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
    </MainLayout>
  );
}
