import clsx from 'clsx';
import Head from 'next/head';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { Card, Checkbox, Title, BureauLabel } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import DetailModal from '@components/purchaseorders/DetailModal';
import OpenAddModalButton from '@components/purchaseorders/OpenAddModalButton';
import OpenDeleteModalButton from '@components/purchaseorders/OpenDeleteModalButton';
import OpenEditModalButton from '@components/purchaseorders/OpenEditModalButton';
import { PurchaseItem, PurchaseOrder, User, PurchaseOrderView } from '@type/common';

interface Props {
  user: User;
  purchaseOrder: PurchaseOrder[];
  purchaseOrderView: PurchaseOrderView[];
}
export async function getServerSideProps() {
  const getPurchaseOrderUrl = process.env.SSR_API_URI + '/purchaseorders';
  const getPurchaseOrderViewUrl = process.env.SSR_API_URI + '/purchaseorders/details';
  const purchaseOrderRes = await get(getPurchaseOrderUrl);
  const purchaseOrderViewRes = await get(getPurchaseOrderViewUrl);
  return {
    props: {
      purchaseOrder: purchaseOrderRes,
      purchaseOrderView: purchaseOrderViewRes,
    },
  };
}

export default function PurchaseOrders(props: Props) {
  const [user] = useRecoilState(userAtom);
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
        <title>購入申請一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className={clsx('mx-5 mt-10')}>
          <div className={clsx('flex')}>
            <Title title={'購入申請一覧'} />
            <select className={clsx('w-100 ')}>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className={clsx('flex justify-end')}>
            <OpenAddModalButton>申請登録</OpenAddModalButton>
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
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>申請した局</div>
                </th>
                <th className={clsx('w-2/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>申請日</div>
                </th>
                <th className={clsx('w-2/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入期限</div>
                </th>
                <th className={clsx('w-3/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>購入物品</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>合計金額</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}></th>
              </tr>
            </thead>
            <tbody className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0')}>
              {props.purchaseOrderView.map((purchaseOrderViewItem, index) => (
                <tr key={purchaseOrderViewItem.purchaseOrder.id}>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {user.roleID === 3
                        ? changeableCheckboxContent(
                            purchaseOrderViewItem.purchaseOrder.financeCheck,
                          )
                        : unChangeableCheckboxContent(
                            purchaseOrderViewItem.purchaseOrder.financeCheck,
                          )}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseOrderViewItem.purchaseOrder.id
                          ? purchaseOrderViewItem.purchaseOrder.id
                          : 0,
                        purchaseOrderViewItem,
                      );
                    }}
                  >
                    <div className={clsx('flex justify-center')}>
                      <BureauLabel bureauID={purchaseOrderViewItem.user.bureauID} />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseOrderViewItem.purchaseOrder.id
                          ? purchaseOrderViewItem.purchaseOrder.id
                          : 0,
                        purchaseOrderViewItem,
                      );
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {formatDate(
                        purchaseOrderViewItem.purchaseOrder.createdAt
                          ? purchaseOrderViewItem.purchaseOrder.createdAt
                          : '',
                      )}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseOrderViewItem.purchaseOrder.id
                          ? purchaseOrderViewItem.purchaseOrder.id
                          : 0,
                        purchaseOrderViewItem,
                      );
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {purchaseOrderViewItem.purchaseOrder.deadline}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseOrderViewItem.purchaseOrder.id
                          ? purchaseOrderViewItem.purchaseOrder.id
                          : 0,
                        purchaseOrderViewItem,
                      );
                    }}
                  >
                    <div
                      className={clsx(
                        'overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm text-black-600',
                      )}
                    >
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
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                    onClick={() => {
                      onOpen(
                        purchaseOrderViewItem.purchaseOrder.id
                          ? purchaseOrderViewItem.purchaseOrder.id
                          : 0,
                        purchaseOrderViewItem,
                      );
                    }}
                  >
                    <div className={clsx('text-center text-sm text-black-600')}>
                      {TotalFee(purchaseOrderViewItem.purchaseItem)}
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-4',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === props.purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className={clsx('grid grid-cols-2 gap-3')}>
                      <div className={clsx('text-center text-sm text-black-600')}>
                        <OpenEditModalButton
                          id={
                            purchaseOrderViewItem.purchaseOrder.id
                              ? purchaseOrderViewItem.purchaseOrder.id
                              : 0
                          }
                          purchaseItems={purchaseOrderViewItem.purchaseItem}
                          isDisabled={
                            !purchaseOrderViewItem.purchaseOrder.financeCheck &&
                            (user.roleID === 2 ||
                              user.roleID === 3 ||
                              user.id === purchaseOrderViewItem.purchaseOrder.userID)
                          }
                        />
                      </div>
                      <div className={clsx('mx-1')}>
                        <OpenDeleteModalButton
                          id={
                            purchaseOrderViewItem.purchaseOrder.id
                              ? purchaseOrderViewItem.purchaseOrder.id
                              : 0
                          }
                          purchaseOrderViewItem={purchaseOrderViewItem}
                          isDisabled={
                            !purchaseOrderViewItem.purchaseOrder.financeCheck &&
                            (user.roleID === 2 ||
                              user.roleID === 3 ||
                              user.id === purchaseOrderViewItem.purchaseOrder.userID)
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
      {isOpen && purchaseOrderViewItem && (
        <DetailModal
          id={purchaseOrderID}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          purchaseOrderViewItem={purchaseOrderViewItem}
          isDelete={false}
        />
      )}
    </MainLayout>
  );
}
