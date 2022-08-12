import React, { useState } from 'react';
import { get } from '@api/api_methods';
import Head from 'next/head';
import OpenAddModalButton from '@components/purchasereports/OpenAddModalButton';
import OpenEditModalButton from '@components/purchasereports/OpenEditModalButton';
import OpenDeleteModalButton from '@components/purchasereports/OpenDeleteModalButton';
import DetailModal from '@components/purchasereports/DetailModal';
import MainLayout from '@components/layout/MainLayout';
import clsx from 'clsx';
import { Card, Title, Checkbox } from '@components/common';
import { useGlobalContext } from '@components/global/context';

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
  }

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

  // 日付のフォーマットを変更
  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(5, datetime.length - 10).replace('-', '/');
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
            <Title title={'購入報告一覧'} />
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
          <table className={clsx('table-fixed border-collapse: collapse w-full mb-5')}>
            <thead>
              <tr
                className={clsx('py-3 border-b-primary-1 border border-t-white-0 border-x-white-0')}
              >
                <th className={clsx('w-2/12 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>財務局長チェック</div>
                </th>
                <th className={clsx('w-2/12 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>報告した局</div>
                </th>
                <th className={clsx('w-1/12 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>報告日</div>
                </th>
                <th className={clsx('w-1/12 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>期限日</div>
                </th>
                <th className={clsx('w-5/12 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入物品</div>
                </th>
                <th className={clsx('w-1/12 pb-2 border-b-primary-1')}></th>
              </tr>
            </thead>
            <tbody className={clsx('border-b-primary-1 border border-t-white-0 border-x-white-0')}>
              {props.purchaseReportView.map((purchaseReportViewItem, index) => (
                <tr key={purchaseReportViewItem.purchasereport.id}>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {state.user.role_id === 3 ? (
                        changeableCheckboxContent(
                          purchaseReportViewItem.purchasereport.finance_check,
                        )) : (
                        unChangeableCheckboxContent(
                          purchaseReportViewItem.purchasereport.finance_check,
                        ))}
                    </div>
                  </td>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseReportViewItem.order_user.bureau_id === 1 && '総務局'}
                      {purchaseReportViewItem.order_user.bureau_id === 2 && '渉外局'}
                      {purchaseReportViewItem.order_user.bureau_id === 3 && '財務局'}
                      {purchaseReportViewItem.order_user.bureau_id === 4 && '企画局'}
                      {purchaseReportViewItem.order_user.bureau_id === 5 && '政策局'}
                      {purchaseReportViewItem.order_user.bureau_id === 6 && '情報局'}
                    </div>
                  </td>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {formatDate(purchaseReportViewItem.purchasereport.created_at)}
                    </div>
                  </td>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseReportViewItem.purchaseorder.deadline}
                    </div>
                  </td>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem) }}>
                    <div className={clsx('text-center text-sm text-black-600 text-ellipsis overflow-hidden whitespace-nowrap')}>
                      {purchaseReportViewItem.purchaseitems && (
                        purchaseReportViewItem.purchaseitems.map((purchaseItem: PurchaseItem, index: number) => (
                          <>
                            {purchaseReportViewItem.purchaseitems.length - 1 === index ? (
                              <>
                                {purchaseItem.item}
                              </>
                            ) : (
                              <>
                                {purchaseItem.item},
                              </>
                            )}
                          </>
                        ))
                      )}
                    </div>
                  </td>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseReports.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseReportViewItem.purchasereport.id, purchaseReportViewItem) }}>
                    <div className={clsx('flex')}>
                      <div className={clsx('mx-1')}>
                        <OpenEditModalButton id={purchaseReportViewItem.purchasereport.id} isDisabled={state.user.bureau_id === 2 || state.user.bureau_id === 3 || state.user.id === purchaseReportViewItem.report_user.id} />
                      </div>
                      <div className={clsx('mx-1')}>
                        <OpenDeleteModalButton id={purchaseReportViewItem.purchasereport.id} isDisabled={state.user.bureau_id === 2 || state.user.bureau_id === 3 || state.user.id === purchaseReportViewItem.report_user.id } />
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
    </MainLayout >
  );
}
