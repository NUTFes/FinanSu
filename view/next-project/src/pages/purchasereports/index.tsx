import clsx from 'clsx';
import Head from 'next/head';
import { useState, useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { Card, Checkbox, Title, BureauLabel } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/purchasereports/DetailModal';
import OpenAddModalButton from '@components/purchasereports/OpenAddModalButton';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';
import OpenEditModalButton from '@components/purchasereports/OpenEditModalButton';
import { PurchaseItem, PurchaseOrder, PurchaseReport, User } from '@type/common';

export interface PurchaseReportView {
  purchaseReport: PurchaseReport;
  reportUser: User;
  purchaseOrder: PurchaseOrder;
  orderUser: User;
  purchaseItems: PurchaseItem[];
}

interface Props {
  purchaseReport: PurchaseReport[];
  purchaseReportView: PurchaseReportView[];
  user: User;
  purchaseOrder: PurchaseOrder[];
}

export async function getServerSideProps() {
  const getPurchaseReportUrl = process.env.SSR_API_URI + '/purchasereports';
  const getPurchaseReportViewUrl = process.env.SSR_API_URI + '/purchasereports/details';
  const purchaseReportRes = await get(getPurchaseReportUrl);
  const purchaseReportViewRes = await get(getPurchaseReportViewUrl);
  return {
    props: {
      purchaseReport: purchaseReportRes,
      purchaseReportView: purchaseReportViewRes,
    },
  };
}

export default function PurchaseReports(props: Props) {
  const [user] = useRecoilState(userAtom);

  const [purchaseReportID, setPurchaseReportID] = useState<number>(1);
  const [purchaseReportViewItem, setPurchaseReportViewItem] = useState<PurchaseReportView>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = (purchaseOrderID: number, purchaseReportViewItem: PurchaseReportView) => {
    setPurchaseReportID(purchaseOrderID);
    setPurchaseReportViewItem(purchaseReportViewItem);
    setIsOpen(true);
  };

  // 購入報告
  const initPurchaseReportList = [];
  for (let i = 0; i < props.purchaseReportView.length; i++) {
    initPurchaseReportList.push(props.purchaseReportView[i].purchaseReport);
  }
  const purchaseReports: PurchaseReport[] = initPurchaseReportList;

  // // 購入申請
  // const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
  //   const initPurchaseOederList = [];
  //   for (let i = 0; i < props.purchaseReportView.length; i++) {
  //     initPurchaseOederList.push(props.purchaseReportView[i].purchaseOrder);
  //   }
  //   return initPurchaseOederList;
  // });
  // // 購入申請者
  // const [orderUsers, setOrderUsers] = useState<User[]>(() => {
  //   const initOederUserList = [];
  //   for (let i = 0; i < props.purchaseReportView.length; i++) {
  //     initOederUserList.push(props.purchaseReportView[i].orderUser);
  //   }
  //   return initOederUserList;
  // });

  // 日付のフォーマットを変更
  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(5, datetime.length - 10).replace('-', '/');
    return datetime2;
  };

  // 購入報告の合計金額を計算
  const TotalFee = (purchaseReport: PurchaseReport, purchaseItems: PurchaseItem[]) => {
    let totalFee = 0;
    purchaseItems.map((purchaseItem: PurchaseItem) => {
      totalFee += purchaseItem.price * purchaseItem.quantity;
    });
    totalFee += purchaseReport.addition - purchaseReport.discount;
    return totalFee;
  };

  // 変更可能なcheckboxの描画
  const changeableCheckboxContent = (isChecked: boolean) => {
    {
      if (isChecked) {
        return <Checkbox checked={true} disabled={false} />;
      } else {
        return <Checkbox disabled={false} />;
      }
    }
  };

  // 変更不可能なcheckboxの描画
  const unChangeableCheckboxContent = (isChecked: boolean) => {
    {
      if (isChecked) {
        return <Checkbox checked={isChecked} disabled={true} />;
      } else {
        return <Checkbox disabled={true} />;
      }
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>購入報告一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'購入報告一覧'} />
            <select className='w-100 '>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className='flex justify-end'>
            <OpenAddModalButton>報告登録</OpenAddModalButton>
          </div>
        </div>
        <div className='w-100 mb-2 p-5'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-1/12 pb-2'>
                  <div className='text-center text-sm text-black-600'>財務局長チェック</div>
                </th>
                <th className='w-2/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>報告した局</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>報告日</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>期限日</div>
                </th>
                <th className='w-3/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>購入物品</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>合計金額</div>
                </th>
                <th className='w-2/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>備考</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'></th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {props.purchaseReportView.map((purchaseReportViewItem, index) => (
                <tr key={purchaseReportViewItem.purchaseReport.id}>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseReportViewItem.purchaseReport.id
                          ? purchaseReportViewItem.purchaseReport.id
                          : 0,
                        purchaseReportViewItem,
                      );
                    }}
                  >
                    <div className='text-center text-sm text-black-600'>
                      {user.roleID === 3
                        ? changeableCheckboxContent(
                            purchaseReportViewItem.purchaseReport.financeCheck,
                          )
                        : unChangeableCheckboxContent(
                            purchaseReportViewItem.purchaseReport.financeCheck,
                          )}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseReportViewItem.purchaseReport.id
                          ? purchaseReportViewItem.purchaseReport.id
                          : 0,
                        purchaseReportViewItem,
                      );
                    }}
                  >
                    <div className={clsx('flex justify-center')}>
                      <BureauLabel bureauID={purchaseReportViewItem.orderUser.bureauID} />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseReportViewItem.purchaseReport.id
                          ? purchaseReportViewItem.purchaseReport.id
                          : 0,
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
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseReportViewItem.purchaseReport.id
                          ? purchaseReportViewItem.purchaseReport.id
                          : 0,
                        purchaseReportViewItem,
                      );
                    }}
                  >
                    <div className='text-center text-sm text-black-600'>
                      {purchaseReportViewItem.purchaseOrder.deadline}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseReportViewItem.purchaseReport.id
                          ? purchaseReportViewItem.purchaseReport.id
                          : 0,
                        purchaseReportViewItem,
                      );
                    }}
                  >
                    <div
                      className={clsx(
                        'overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm text-black-600',
                      )}
                    >
                      {purchaseReportViewItem.purchaseItems &&
                        purchaseReportViewItem.purchaseItems.map(
                          (purchaseItem: PurchaseItem, index: number) => (
                            <div key={index}>
                              {purchaseReportViewItem.purchaseItems.length - 1 === index ? (
                                <>{purchaseItem.item}</>
                              ) : (
                                <>{purchaseItem.item},</>
                              )}
                            </div>
                          ),
                        )}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseReportViewItem.purchaseReport.id
                          ? purchaseReportViewItem.purchaseReport.id
                          : 0,
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
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseReportViewItem.purchaseReport.id
                          ? purchaseReportViewItem.purchaseReport.id
                          : 0,
                        purchaseReportViewItem,
                      );
                    }}
                  >
                    <div className='text-center text-sm text-black-600'>
                      {purchaseReportViewItem.purchaseReport.remark || '無し'}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className='flex'>
                      <div className='mx-1'>
                        <OpenEditModalButton
                          id={
                            purchaseReportViewItem.purchaseReport.id
                              ? purchaseReportViewItem.purchaseReport.id
                              : 0
                          }
                          isDisabled={
                            !purchaseReportViewItem.purchaseOrder.financeCheck &&
                            (user.roleID === 2 ||
                              user.roleID === 3 ||
                              user.id === purchaseReportViewItem.purchaseOrder.userID)
                          }
                        />
                      </div>
                      <div className='mx-1'>
                        <OpenDeleteModalButton
                          id={
                            purchaseReportViewItem.purchaseReport.id
                              ? purchaseReportViewItem.purchaseReport.id
                              : 0
                          }
                          isDisabled={
                            !purchaseReportViewItem.purchaseOrder.financeCheck &&
                            (user.roleID === 2 ||
                              user.roleID === 3 ||
                              user.id === purchaseReportViewItem.purchaseOrder.userID)
                          }
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isOpen && purchaseReportViewItem && (
        <DetailModal
          id={purchaseReportID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          purchaseReportViewItem={purchaseReportViewItem}
          isDelete={false}
        />
      )}
    </MainLayout>
  );
}
