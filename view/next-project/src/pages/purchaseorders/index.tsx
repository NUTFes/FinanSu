import Head from 'next/head';
import React, { useState } from 'react';
import { useGlobalContext } from '@components/global/context';
import { get } from '@api/api_methods';
import OpenEditModalButton from '@components/purchaseorders/OpenEditModalButton';
import OpenDeleteModalButton from '@components/purchaseorders/OpenDeleteModalButton';
import DetailModal from '@components/purchaseorders/DetailModal';
import MainLayout from '@components/layout/MainLayout';
import clsx from 'clsx';
import OpenAddModalButton from '@components/purchaseorders/OpenAddModalButton';
import { Card, Title, Checkbox, EditButton, DeleteButton } from '@components/common';

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
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

interface PurchaseOrderView {
  purchase_order: PurchaseOrder;
  user: User;
  purchase_item: PurchaseItem[];
}

interface Props {
  user: User;
  purchaseOrder: PurchaseOrder[];
  purchaseOrderView: PurchaseOrderView[];
}
export async function getServerSideProps() {
  const getPurchaseOrderUrl = process.env.SSR_API_URI + '/purchaseorders';
  const getPurchaseOrderViewUrl = process.env.SSR_API_URI + '/get_purchaseorders_for_view';
  const purchaseOrderRes = await get(getPurchaseOrderUrl);
  const purchaseOrderViewRes = await get(getPurchaseOrderViewUrl);
  return {
    props: {
      purchaseOrder: purchaseOrderRes,
      purchaseOrderView: purchaseOrderViewRes,
    },
  };
}

export default function PurchaseOrder(props: Props) {
  const state = useGlobalContext();
  const [purchaseOrderID, setPurchaseOrderID] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = (purchaseOrderID: number) => {
    setPurchaseOrderID(purchaseOrderID);
    setIsOpen(true);
  }
  const onClose = () => {
    setIsOpen(false);
  }

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

  const [showModal, setShowModal] = useState(false);
  const ShowModal = () => {
    setShowModal(true);
  };

  return (
    <MainLayout>
      <Head>
        <title>購入申請一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className={clsx('mt-10 mx-5')}>
          <div className={clsx('flex')}>
            <Title title={'購入申請一覧'} />
            <select className={clsx('w-100 ')}>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className={clsx('flex justify-end')}>
            <OpenAddModalButton>
              申請登録
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
                  <div className={clsx('text-center text-sm text-black-600')}>申請した局</div>
                </th>
                <th className={clsx('w-2/12 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>申請日</div>
                </th>
                <th className={clsx('w-2/12 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入期限</div>
                </th>
                <th className={clsx('w-3/12 pb-2 border-b-primary-1')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入物品</div>
                </th>
                <th className={clsx('w-1/12 pb-2 border-b-primary-1')}></th>
              </tr>
            </thead>
            <tbody className={clsx('border-b-primary-1 border border-t-white-0 border-x-white-0')}>
              {props.purchaseOrderView.map((purchaseOrderViewItem, index) => (
                <tr key={purchaseOrderViewItem.purchase_order.id}>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {state.user.role_id === 3 ? (
                        changeableCheckboxContent(
                          // purchaseOrderViewItem.finance_check,
                          true,
                        )) : (
                        unChangeableCheckboxContent(
                          // purchaseOrderViewItem.finance_check,
                          true,
                        ))}
                    </div>
                  </td>
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === props.purchaseOrder.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseOrderViewItem.purchase_order.id) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseOrderViewItem.user.bureau_id === 1 && '総務局'}
                      {purchaseOrderViewItem.user.bureau_id === 2 && '渉外局'}
                      {purchaseOrderViewItem.user.bureau_id === 3 && '財務局'}
                      {purchaseOrderViewItem.user.bureau_id === 4 && '企画局'}
                      {purchaseOrderViewItem.user.bureau_id === 5 && '政策局'}
                      {purchaseOrderViewItem.user.bureau_id === 6 && '情報局'}
                    </div>
                  </td>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen}> */}
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === props.purchaseOrder.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseOrderViewItem.purchase_order.id) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {formatDate(purchaseOrderViewItem.purchase_order.created_at)}
                    </div>
                  </td>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen}> */}
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === props.purchaseOrder.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseOrderViewItem.purchase_order.id) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseOrderViewItem.purchase_order.deadline}
                    </div>
                  </td>
                  {/* <td className={clsx('px-4 py-2')} onClick={onOpen}> */}
                  <td className={clsx('px-1', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === props.purchaseOrder.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))} onClick={() => { onOpen(purchaseOrderViewItem.purchase_order.id) }}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {props.purchaseOrderView[index].purchase_item && props.purchaseOrderView[index].purchase_item[0].item}, ...
                    </div>
                  </td>
                  <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === props.purchaseOrder.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                    <div className={clsx('grid grid-cols-2 gap-3')}>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        <EditButton />
                      </div>
                      <div className={clsx('mx-1')}>
                        <DeleteButton />
                      </div>
                    </div>
                  </td>
                </tr >
              ))
              }
            </tbody >
          </table >
        </div >
      </Card >
      {isOpen &&
        <DetailModal
          id={purchaseOrderID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      }
    </MainLayout >
  );
}
