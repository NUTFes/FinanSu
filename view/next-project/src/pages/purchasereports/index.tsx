import React, { useState } from 'react';
import { get } from '@api/api_methods';
import { put } from '@api/purchaseReport';
import Head from 'next/head';
import OpenAddModalButton from '@components/purchasereports/OpenAddModalButton';
import OpenEditModalButton from '@components/purchasereports/OpenEditModalButton';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';
import MainLayout from '@components/layout/MainLayout';
import clsx from 'clsx';
import { Card, Checkbox } from '@components/common';
import { useGlobalContext } from '@components/global/context';

interface PurchaseReport {
  [x: string]: any;
  id: number;
  user_id: number;
  purchase_order_id: number;
  created_at: string;
  updated_at: string;
}

interface PurchaseOrder {
  id: number;
  deadline: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface PurchaseItem {
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

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}

interface PurchaseReportView {
  purchaseReport: PurchaseReport;
  reportUser: User;
  purchaseOrder: PurchaseOrder;
  orderUser: User;
  purchaseItems: PurchaseItem[];
}

interface Props {
  purchaseReport: PurchaseReport[];
  purchaseReportView: PurchaseReport[];
  user: User;
  purchaseOrder: PurchaseOrder[];
}

export async function getServerSideProps({ params }: any) {
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
  // 購入報告
  const [purchaseReports, setPurchaseReports] = useState<PurchaseReport[]>(() => {
    let initPurchaseReportList = [];
    for (let i = 0; i < props.purchaseReportView.length; i++) {
      initPurchaseReportList.push(props.purchaseReportView[i].purchasereport);
    }
    return initPurchaseReportList;
  });
  // 購入申請
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    let initPurchaseOederList = [];
    for (let i = 0; i < props.purchaseReportView.length; i++) {
      initPurchaseOederList.push(props.purchaseReportView[i].purchaseorder);
    }
    return initPurchaseOederList;
  });
  // 購入申請者
  const [orderUsers, setOrderUsers] = useState<User[]>(() => {
    let initOederUserList = [];
    for (let i = 0; i < props.purchaseReportView.length; i++) {
      initOederUserList.push(props.purchaseReportView[i].order_user);
    }
    return initOederUserList;
  });
  // 購入物品
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(() => {
    let initPurchaseItemList = [];
    for (let i = 0; i < props.purchaseReportView.length; i++) {
      initPurchaseItemList.push(props.purchaseReportView[i].purchaseitems);
    }
    return initPurchaseItemList;
  });

  // 日付のフォーマットを変更
  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 4);
    return datetime2;
  };

  // 変更可能なcheckboxの描画
  const changeableCheckboxContent = (
    isChecked: boolean,
  ) => {
    {
      if (isChecked) {
        return (
          <Checkbox checked={true} disabled={false} />
        );
      } else {
        return (
          <Checkbox disabled={false} />
        );
      }
    }
  };

  // 変更不可能なcheckboxの描画
  const unChangeableCheckboxContent = (isChecked: boolean) => {
    {
      if (isChecked) {
        return (
          <Checkbox checked={isChecked} disabled={true} />
        );
      } else {
        return (
          <Checkbox disabled={true} />
        );
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
        <div className={clsx('mt-10 mx-5')}>
          <div className={clsx('flex')}>
            <h1 className={clsx('text-2xl font-thin mr-5 mt-1 text-gray-900 align-text-bottom')}>
              購入申請一覧
            </h1>
            <select className={clsx('w-100 ')}>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className={clsx('flex justify-end')}>
            <OpenAddModalButton>
              報告登録
            </OpenAddModalButton>
          </div>
        </div>
        <div className={clsx('mb-2 p-5 w-100')}>
          <table className={clsx('table-fixed border-collapse: collapse')}>
            <thead>
              <tr
                className={clsx('py-3 border-b-primary-1 border border-t-white-0 border-x-white-0')}
              >
                <th className={clsx('px-6 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>財務局長チェック</div>
                </th>
                <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>申請した局</div>
                </th>
                <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>申請日</div>
                </th>
                <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入期限日</div>
                </th>
                <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入物品</div>
                </th>
                <th className={clsx('px-6 pb-2 border-b-primary-1')}></th>
              </tr>
            </thead>
            <tbody className={clsx('border-b-primary-1 border border-t-white-0 border-x-white-0')}>
              {purchaseReports.map((purchaseReport, index) => (
                <tr key={purchaseReport.id}>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen}> */}
                  <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {state.user.role_id === 3 ? (
                        changeableCheckboxContent(
                          // purchaseReport.is_first_check,
                          true,
                        )) : (
                        unChangeableCheckboxContent(
                          // purchaseReport.is_first_check,
                          true,
                        ))}
                    </div>
                  </td>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen}> */}
                  <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {orderUsers[index].bureau_id === 1 && '総務局'}
                      {orderUsers[index].bureau_id === 2 && '渉外局'}
                      {orderUsers[index].bureau_id === 3 && '財務局'}
                      {orderUsers[index].bureau_id === 4 && '企画局'}
                      {orderUsers[index].bureau_id === 5 && '政策局'}
                      {orderUsers[index].bureau_id === 6 && '情報局'}
                    </div>
                  </td>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen}> */}
                  <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {formatDate(purchaseOrders[index].created_at)}
                    </div>
                  </td>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen}> */}
                  <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseOrders[index].deadline}
                    </div>
                  </td>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen} /> */}
                  <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseItems[index][0].item}, ...
                    </div>
                  </td>
                  <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('grid grid-cols-2 gap-3')}>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        <OpenEditModalButton id={purchaseReport.id} />
                      </div>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        <OpenDeleteModalButton id={purchaseReport.id} />
                      </div>
                    </div>
                  </td>
                  {/* <DetailModal
                      id={purchaseOrderItem.id}
                      openModal={isOpen}
                      setShowModal={setShowModal}
                    /> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout >
  );
}
