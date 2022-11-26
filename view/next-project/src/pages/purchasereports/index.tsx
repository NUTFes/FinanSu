import clsx from 'clsx';
import Head from 'next/head';
import React, { useState } from 'react';

import { get } from '@api/api_methods';
import { Card, Title, Checkbox } from '@components/common';
import { useGlobalContext } from '@components/global/context';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/purchasereports/DetailModal';
import OpenAddModalButton from '@components/purchasereports/OpenAddModalButton';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';
import OpenEditModalButton from '@components/purchasereports/OpenEditModalButton';

// 他コンポーネントで使うためにexport
export interface PurchaseReport {
  id: number;
  user_id: number;
  discount: number;
  addition: number;
  finance_check: boolean;
  remark: string;
  purchase_order_id: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: number;
  deadline: string;
  user_id: number;
  finance_check: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: number;
  item: string;
  price: number;
  quantity: number;
  detail: string;
  url: string;
  purchase_order_id: number;
  finance_check: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseReportView {
  purchasereport: PurchaseReport;
  report_user: User;
  purchaseorder: PurchaseOrder;
  order_user: User;
  purchaseitems: PurchaseItem[];
}

interface Props {
  purchaseReport: PurchaseReport[];
  purchaseReportView: PurchaseReportView[];
  user: User;
  purchaseOrder: PurchaseOrder[];
}

export async function getServerSideProps() {
  const getPurchaseReportUrl = process.env.SSR_API_URI + '/purchasereports';
  const getPurchaseReportViewUrl = process.env.SSR_API_URI + '/get_purchasereports_for_view';
  const purchaseReportRes = await get(getPurchaseReportUrl);
  const purchaseReportViewRes = await get(getPurchaseReportViewUrl);
  return {
    props: {
      purchaseReport: purchaseReportRes,
      purchaseReportView: purchaseReportViewRes,
    },
  };
}

export default function PurchaseReport(props: Props) {
  const state = useGlobalContext();
  const [purchaseReportID, setPurchaseReportID] = useState<number>(1);
  const [purchaseReportViewItem, setPurchaseReportViewItem] = useState<PurchaseReportView>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = (purchaseOrderID: number, purchaseReportViewItem: PurchaseReportView) => {
    setPurchaseReportID(purchaseOrderID);
    setPurchaseReportViewItem(purchaseReportViewItem);
    setIsOpen(true);
  };

  // 購入報告
  const [purchaseReports, setPurchaseReports] = useState<PurchaseReport[]>(() => {
    const initPurchaseReportList = [];
    for (let i = 0; i < props.purchaseReportView.length; i++) {
      initPurchaseReportList.push(props.purchaseReportView[i].purchasereport);
    }
    return initPurchaseReportList;
  });
  // 購入申請
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const initPurchaseOederList = [];
    for (let i = 0; i < props.purchaseReportView.length; i++) {
      initPurchaseOederList.push(props.purchaseReportView[i].purchaseorder);
    }
    return initPurchaseOederList;
  });
  // 購入申請者
  const [orderUsers, setOrderUsers] = useState<User[]>(() => {
    const initOederUserList = [];
    for (let i = 0; i < props.purchaseReportView.length; i++) {
      initOederUserList.push(props.purchaseReportView[i].order_user);
    }
    return initOederUserList;
  });

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
        <div className={clsx('mx-5 mt-10')}>
          <div className={clsx('flex')}>
            <Title title={'購入報告一覧'} />
            <select className={clsx('w-100 ')}>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className={clsx('flex justify-end')}>
            <OpenAddModalButton>報告登録</OpenAddModalButton>
          </div>
        </div>
        <div className={clsx('w-100 mb-2 p-5')}>
          <table className={clsx('mb-5 w-full table-fixed border-collapse')}>
            <thead>
              <tr
                className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0 py-3')}
              >
                <th className={clsx('w-2/12 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>財務局長チェック</div>
                </th>
                <th className={clsx('w-2/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>報告した局</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>報告日</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>期限日</div>
                </th>
                <th className={clsx('w-4/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入物品</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>合計金額</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}></th>
              </tr>
            </thead>
            <tbody className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0')}>
              {props.purchaseReportView.map((purchaseReportViewItem, index) => (
                <tr key={purchaseReportViewItem.purchasereport.id}>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem);
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {state.user.role_id === 3
                        ? changeableCheckboxContent(
                            purchaseReportViewItem.purchasereport.finance_check,
                          )
                        : unChangeableCheckboxContent(
                            purchaseReportViewItem.purchasereport.finance_check,
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
                      onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem);
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseReportViewItem.order_user.bureau_id === 1 && '総務局'}
                      {purchaseReportViewItem.order_user.bureau_id === 2 && '渉外局'}
                      {purchaseReportViewItem.order_user.bureau_id === 3 && '財務局'}
                      {purchaseReportViewItem.order_user.bureau_id === 4 && '企画局'}
                      {purchaseReportViewItem.order_user.bureau_id === 5 && '政策局'}
                      {purchaseReportViewItem.order_user.bureau_id === 6 && '情報局'}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem);
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {formatDate(purchaseReportViewItem.purchasereport.created_at)}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem);
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseReportViewItem.purchaseorder.deadline}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem);
                    }}
                  >
                    <div
                      className={clsx(
                        'overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm text-black-600',
                      )}
                    >
                      {purchaseReportViewItem.purchaseitems &&
                        purchaseReportViewItem.purchaseitems.map(
                          (purchaseItem: PurchaseItem, index: number) => (
                            <>
                              {purchaseReportViewItem.purchaseitems.length - 1 === index ? (
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
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem);
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {TotalFee(
                        purchaseReportViewItem.purchasereport,
                        purchaseReportViewItem.purchaseitems,
                      )}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className={clsx('flex')}>
                      <div className={clsx('mx-1')}>
                        <OpenEditModalButton
                          id={purchaseReportViewItem.purchasereport.id}
                          isDisabled={
                            !purchaseReportViewItem.purchasereport.finance_check &&
                            (state.user.bureau_id === 2 ||
                              state.user.bureau_id === 3 ||
                              state.user.id === purchaseReportViewItem.report_user.id)
                          }
                        />
                      </div>
                      <div className={clsx('mx-1')}>
                        <OpenDeleteModalButton
                          id={purchaseReportViewItem.purchasereport.id}
                          isDisabled={
                            !purchaseReportViewItem.purchasereport.finance_check &&
                            (state.user.bureau_id === 2 ||
                              state.user.bureau_id === 3 ||
                              state.user.id === purchaseReportViewItem.report_user.id)
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
