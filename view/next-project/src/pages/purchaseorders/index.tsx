import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';
import { get } from '@api/purchaseOrder';
import OpenEditModalButton from '@components/purchaseorders/OpenEditModalButton';
import OpenDeleteModalButton from '@components/purchaseorders/OpenDeleteModalButton';
import { useState } from 'react';
import DetailModal from '@components/purchaseorders/DetailModal';
import * as React from 'react';
import MainLayout from '@components/layout/MainLayout';
import clsx from 'clsx';
import Button from '@components/common/Button';

interface User {
  id: number;
  name: string;
}

interface PurchaseOrder {
  id: number;
  deadline: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  user: User;
  purchaseOrder: PurchaseOrder[];
}
export async function getServerSideProps() {
  const getPurchaseOrderUrl = process.env.SSR_API_URI + '/purchaseorders';
  const purchaseOrderRes = await get(getPurchaseOrderUrl);
  return {
    props: {
      purchaseOrder: purchaseOrderRes,
    },
  };
}

export default function PurchaseOrder(props: Props) {
  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 4);
    return datetime2;
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
      <div className={clsx('flex justify-center align-center')}>
        <div className={clsx('m-10 px-10 shadow rounded-lg')}>
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
              <Button>
                <RiAddCircleLine className={clsx("text-white-0 mr-2")} />
                購入申請
              </Button>
            </div>
          </div>
          <div className={clsx('mb-2 p-5 w-100')}>
            <table className={clsx('table-fixed border-collapse: collapse')}>
              <thead>
                <tr className={clsx('py-3 border-b-primary-1 border border-t-white-0 border-x-white-0')} >
                  <th className={clsx('px-6 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      ID
                    </div>
                  </th>
                  <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      購入期限日
                    </div>
                  </th>
                  <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      申請者
                    </div>
                  </th>
                  <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      申請日
                    </div>
                  </th>
                  <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                    <div className={clsx('text-center text-sm text-black-600')}>
                      金額
                    </div>
                  </th>
                  <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                  </th>
                </tr>
              </thead>
              <tbody className={clsx('border-b-primary-1 border border-t-white-0 border-x-white-0')}>
                {props.purchaseOrder.map((purchaseOrderItem) => (
                  <tr key={purchaseOrderItem.id} >
                    <td className={clsx('px-4 py-2')} onClick={() => ShowModal()}>
                      <div className={clsx('text-center text-sm text-black-600')}>{purchaseOrderItem.id}
                      </div>
                    </td>
                    <td className={clsx('px-4 py-2')} onClick={() => ShowModal()}>
                      <div className={clsx('text-center text-sm text-black-600')}>{purchaseOrderItem.deadline}
                      </div>
                    </td>
                    <td className={clsx('px-4 py-2')} onClick={() => ShowModal()}>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {purchaseOrderItem.user_id}
                      </div>
                    </td>
                    <td className={clsx('px-4 py-2')} onClick={() => ShowModal()}>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {formatDate(purchaseOrderItem.created_at)}
                      </div>
                    </td>
                    <td className={clsx('px-4 py-2')} onClick={() => ShowModal()} />
                    <td className={clsx('px-4 py-2')}>
                      <div className={clsx('grid grid-cols-2 gap-1')}>
                        <div className={clsx('text-center text-sm text-black-600')}>
                          <OpenEditModalButton id={purchaseOrderItem.id} />
                        </div>
                        <div className={clsx('text-center text-sm text-black-600')}>
                          <OpenDeleteModalButton id={purchaseOrderItem.id} />
                        </div>
                      </div>
                    </td>
                    <DetailModal
                      id={purchaseOrderItem.id}
                      openModal={showModal}
                      setShowModal={setShowModal}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout >
  );
}
