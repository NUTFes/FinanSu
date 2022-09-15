import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { get } from '@api/api_methods';
import { Modal, Radio, PrimaryButton, OutlinePrimaryButton, CloseButton } from '@components/common';
import { useUI } from '@components/ui/context';
import PurchaseReportAddModal from './PurchaseReportAddModal';

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

interface PurchaseOrderView {
  purchase_order: PurchaseOrder;
  user: User;
  purchase_item: PurchaseItem[];
}

export default function PurchaseItemNumModal() {
  const router = useRouter();
  const { setModalView, openModal, closeModal } = useUI();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = () => {
    setIsOpen(true);
  };

  const [purchaseOrderView, setPurchaseOrderView] = useState<PurchaseOrderView[]>([]);

  const [purchaseOrderId, setPurchaseOrderId] = useState<number>(1);
  const [purchaseItemNum, setPurchaseItemNum] = useState<number>(0);

  useEffect(() => {
    if (router.isReady) {
      const getPurchaseOrderViewUrl = process.env.CSR_API_URI + '/get_purchaseorders_for_view';

      const getPurchaseOrderView = async (url: string) => {
        const purchaseOrderViewRes: PurchaseOrderView[] = await get(url);
        setPurchaseOrderView(purchaseOrderViewRes);
      };
      getPurchaseOrderView(getPurchaseOrderViewUrl);
    }
  }, [router]);

  // 日付のフォーマットを変更
  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };

  // 合計金額を計算
  const calcTotalFee = (purchaseItems: PurchaseItem[]) => {
    let totalFee = 0;
    for (let i: number = 0; i < purchaseItems.length; i++) {
      totalFee += purchaseItems[i].price * purchaseItems[i].quantity;
    }
    return totalFee;
  };

  // 報告する申請のID
  const handler = (purchaseItemNum: number) => (e: any) => {
    setPurchaseOrderId(Number(e.target.value));
    setPurchaseItemNum(Number(purchaseItemNum));
  };

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 grid w-full justify-items-end')}>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
        購入申請
      </div>
      <div className={clsx('mb-4 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-1 grid')} />
        <div className={clsx('col-span-10 grid')}>
          <div className={clsx('w-100 mb-2 p-5')}>
            <table className={clsx('border-collapse: collapse table-fixed')}>
              <thead>
                <tr
                  className={clsx(
                    'border border-x-white-0 border-b-primary-1 border-t-white-0 py-3',
                  )}
                >
                  <th className={clsx('px-6 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>選択</div>
                  </th>
                  <th className={clsx('border-b-primary-1 px-6 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>局</div>
                  </th>
                  <th className={clsx('border-b-primary-1 px-6 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>金額</div>
                  </th>
                  <th className={clsx('border-b-primary-1 px-6 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>物品名</div>
                  </th>
                  <th className={clsx('border-b-primary-1 px-6 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>品数</div>
                  </th>
                  <th className={clsx('border-b-primary-1 px-6 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>申請日</div>
                  </th>
                </tr>
              </thead>
              <tbody
                className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0')}
              >
                {purchaseOrderView.map((purchaseOrderItem, index) => (
                  <tr key={purchaseOrderItem.purchase_order.id}>
                    <td
                      className={clsx(
                        'px-4',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                    >
                      {/* <div className={clsx('text-center text-sm text-black-600')} onClick={handler}> */}
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {purchaseOrderItem.purchase_item && (
                          <Radio
                            value={purchaseOrderItem.purchase_order.id}
                            onClick={handler(purchaseOrderItem.purchase_item.length)}
                          />
                        )}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-4',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {purchaseOrderItem.user.bureau_id === 1 && '総務局'}
                        {purchaseOrderItem.user.bureau_id === 2 && '渉外局'}
                        {purchaseOrderItem.user.bureau_id === 3 && '財務局'}
                        {purchaseOrderItem.user.bureau_id === 4 && '企画局'}
                        {purchaseOrderItem.user.bureau_id === 5 && '政策局'}
                        {purchaseOrderItem.user.bureau_id === 6 && '情報局'}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-4',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {purchaseOrderItem.purchase_item &&
                          calcTotalFee(purchaseOrderItem.purchase_item)}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-4',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {purchaseOrderItem.purchase_item.length === 1 ? (
                          <>
                            {purchaseOrderItem.purchase_item &&
                              purchaseOrderItem.purchase_item[0].item}
                          </>
                        ) : (
                          <>
                            {purchaseOrderItem.purchase_item &&
                              purchaseOrderItem.purchase_item[0].item}
                            , ...
                          </>
                        )}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-4',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {purchaseOrderItem.purchase_item && purchaseOrderItem.purchase_item.length}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-4',
                        index === 0 ? 'pt-4 pb-3' : 'py-3',
                        index === purchaseOrderView.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                      )}
                    >
                      <div className={clsx('text-center text-sm text-black-600')}>
                        {formatDate(purchaseOrderItem.purchase_order.created_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={clsx('col-span-1 grid ')} />
      </div>
      <div className={clsx('grid w-full grid-cols-12 pb-5')}>
        <div className={clsx('h-100 col-span-1 grid')} />
        <div
          className={clsx(
            'text-md h-100 col-span-10 grid w-full justify-items-center pr-3 text-black-600',
          )}
        >
          <div
            className={clsx('text-md h-100 grid w-full justify-items-center pb-3 text-black-600')}
          >
            申請を選択してください
          </div>
          <div className={clsx('flex')}>
            <div className={clsx('mx-2')}>
              <OutlinePrimaryButton
                onClick={() => {
                  setModalView('PURCHASE_REPORT_ADD_MODAL');
                  openModal();
                }}
              >
                戻る
              </OutlinePrimaryButton>
            </div>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  onOpen();
                }}
              >
                報告へ進む
              </PrimaryButton>
              {isOpen && (
                <PurchaseReportAddModal
                  purchaseOrderId={purchaseOrderId}
                  purchaseItemNum={purchaseItemNum}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  isOnlyReported={false}
                />
              )}
            </div>
          </div>
        </div>
        <div className={clsx('h-100 col-span-1 grid')} />
      </div>
      <div className={clsx('grid justify-items-center px-1')}></div>
    </Modal>
  );
}
