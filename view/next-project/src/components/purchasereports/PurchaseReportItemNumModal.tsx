import clsx from 'clsx';
import React, { useState } from 'react';

import * as purchaseItemAPI from '@api/purchaseItem';
import { post } from '@api/purchaseOrder';
import {
  Modal,
  OutlinePrimaryButton,
  PullDown,
  PrimaryButton,
  CloseButton,
} from '@components/common';
import { useGlobalContext } from '@components/global/context';
import PurchaseReportAddModal from '@components/purchasereports/PurchaseReportAddModal';
import { useUI } from '@components/ui/context';
import { PurchaseItem } from '@pages/purchasereports';

interface FormData {
  deadline: string;
  user_id: number;
  finance_check: boolean;
}

export default function PurchaseReportItemNumModal() {
  // グローバルステートを呼び出し
  const state = useGlobalContext();
  const { setModalView, openModal, closeModal } = useUI();

  // 購入物品数用の配列
  const purchaseItemNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // 購入申請の追加モーダル開閉用変数
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };

  // 購入物品数
  const [purchaseItemNum, setPurchaseItemNum] = useState({
    value: 1,
  });
  // 購入申請ID
  const [purchaseOrderId, setPurchaseOrderId] = useState(1);

  // 購入物品数用のhandler
  const purchaseItemNumHandler = (input: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPurchaseItemNum({ ...purchaseItemNum, [input]: e.target.value });
  };

  // 購入報告は購入申請に紐づいているので、購入申請を追加
  const addPurchaseOrder = async () => {
    //年・月・日を取得する
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    let monthStr = '';
    let dayStr = '';
    if (month < 10) {
      monthStr = '0' + String(month);
    } else {
      monthStr = String(month);
    }
    if (day < 10) {
      dayStr = '0' + String(day);
    } else {
      dayStr = String(day);
    }

    const data: FormData = {
      deadline: String(year) + monthStr + dayStr,
      user_id: state.user.id,
      finance_check: false,
    };
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/get_post_purchaseorder_record';
    const postRes = await post(addPurchaseOrderUrl, data);
    const purchaseOrderID = postRes.id;
    setPurchaseOrderId(purchaseOrderID);

    // 購入物品数のpurchaseItemのリストを作成
    const updatePurchaseItemList = [];
    for (let i = 0; i < Number(purchaseItemNum.value); i++) {
      const initialPurchaseItem: PurchaseItem = {
        id: i + 1,
        item: '',
        price: 0,
        quantity: 0,
        detail: '',
        url: '',
        purchase_order_id: purchaseOrderID,
        finance_check: false,
        created_at: '',
        updated_at: '',
      };
      updatePurchaseItemList.push(initialPurchaseItem);
    }
    // 購入報告モーダルではすでにある購入物品を更新する処理なので、先に購入物品を登録しておく
    addPurchaseItem(updatePurchaseItemList);
  };

  // 購入報告の追加モーダルではPutをするので、ここではPostして購入物品を追加
  const addPurchaseItem = async (data: PurchaseItem[]) => {
    data.map(async (item) => {
      const updatePurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
      await purchaseItemAPI.post(updatePurchaseItemUrl, item);
    });
    // 購入報告の追加モーダルを開く
    onOpen();
  };

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 grid w-full justify-items-end')}>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
        購入報告単体で登録
      </div>
      <div className={clsx('mb-5 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-1 grid')} />
        <div className={clsx('col-span-10 grid')}>
          <div className={clsx('mb-5 grid w-full grid-cols-12')}>
            <div className={clsx('col-span-1 grid')} />
            <div className={clsx('col-span-10 mr-2 grid justify-items-center')}>
              <div className={clsx('text-md flex items-center text-black-600')}>
                報告する物品の個数を入力してください
              </div>
            </div>
          </div>
          <div className={clsx('col-span-1 grid')} />
          <div className={clsx('grid w-full grid-cols-12')}>
            <div className={clsx('col-span-3 grid')} />
            <div className={clsx('h-100 col-span-3 mr-2 grid justify-items-center')}>
              <div className={clsx('text-md flex items-center text-black-600')}>購入物品数</div>
            </div>
            <div className={clsx('col-span-2 ml-2 grid w-full')}>
              <PullDown value={purchaseItemNum.value} onChange={purchaseItemNumHandler('value')}>
                {purchaseItemNumArray.map((data) => (
                  <option key={data} value={data}>
                    {data}
                  </option>
                ))}
              </PullDown>
            </div>
            <div className={clsx('col-span-4 grid')} />
          </div>
        </div>
        <div className={clsx('col-span-1 grid ')} />
      </div>
      <div className={clsx('mb-3 grid justify-items-center py-3')}>
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
                addPurchaseOrder();
              }}
            >
              報告へ進む
            </PrimaryButton>
            {isOpen && (
              <PurchaseReportAddModal
                purchaseOrderId={purchaseOrderId}
                purchaseItemNum={purchaseItemNum.value}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isOnlyReported={true}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
