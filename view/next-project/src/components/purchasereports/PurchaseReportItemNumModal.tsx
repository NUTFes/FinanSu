import React, { useState } from 'react';
import clsx from 'clsx';
import { get } from '@api/api_methods';
import { post } from '@api/purchaseOrder';
import * as purchaseItemAPI from '@api/purchaseItem';
import { Modal, OutlinePrimaryButton, PullDown, PrimaryButton, CloseButton } from '@components/common';
import { useUI } from '@components/ui/context';
import { useGlobalContext } from '@components/global/context';
import PurchaseReportAddModal from '@components/purchasereports/PurchaseReportAddModal';

interface FormData {
  deadline: string;
  user_id: number;
}

interface PurchaseItem {
  id: number;
  item: string;
  price: number | string;
  quantity: number | string;
  detail: string;
  url: string;
  purchaseOrderId: number;
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
    const data: FormData = {
      deadline: '',
      user_id: state.user.id
    }
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    await post(addPurchaseOrderUrl, data, state.user.id);
    const getPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    const getRes = await get(getPurchaseOrderUrl);
    const purchaseOrderID = getRes[getRes.length - 1].id;
    setPurchaseOrderId(getRes[getRes.length - 1].id);

    // 購入物品数のpurchaseItemのリストを作成
    const updatePurchaseItemList = [];
    for (let i = 0; i < Number(purchaseItemNum.value); i++) {
      let initialPurchaseItem: PurchaseItem = {
        id: i + 1,
        item: '',
        price: 0,
        quantity: 0,
        detail: '',
        url: '',
        purchaseOrderId: purchaseOrderId,
        finance_check: false,
      };
      updatePurchaseItemList.push(initialPurchaseItem);
    }
    // 購入報告モーダルではすでにある購入物品を更新する処理なので、先に購入物品を登録しておく
    addPurchaseItem(updatePurchaseItemList, purchaseOrderID);
  };

  // 購入報告の追加モーダルではPutをするので、ここではPostして購入物品を追加
  const addPurchaseItem = async (data: PurchaseItem[], purchaseOrderID: number) => {
    data.map(async (item) => {
      let updatePurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
      await purchaseItemAPI.post(updatePurchaseItemUrl, item, purchaseOrderID);
    });
    // 購入報告の追加モーダルを開く
    onOpen();
  };

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 w-full grid justify-items-end')}>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
        購入報告単体で登録
      </div>
      <div className={clsx('grid grid-cols-12 gap-4 mb-5')}>
        <div className={clsx('grid col-span-1')} />
        <div className={clsx('grid col-span-10')}>
          <div className={clsx('grid grid-cols-12 w-full mb-5')}>
            <div className={clsx('grid col-span-1')} />
            <div className={clsx('grid col-span-10 justify-items-center mr-2')}>
              <div
                className={clsx(
                  'flex items-center text-black-600 text-md',
                )}
              >
                報告する物品の個数を入力してください
              </div>
            </div>
          </div>
          <div className={clsx('grid col-span-1')} />
          <div className={clsx('grid grid-cols-12 w-full')}>
            <div className={clsx('grid col-span-3')} />
            <div className={clsx('grid col-span-3 justify-items-center mr-2 h-100')}>
              <div
                className={clsx(
                  'flex items-center text-black-600 text-md',
                )}
              >
                購入物品数
              </div>
            </div>
            <div className={clsx('grid col-span-2 ml-2 w-full')}>
              <PullDown
                value={purchaseItemNum.value}
                onChange={purchaseItemNumHandler('value')}
              >
                {purchaseItemNumArray.map((data) => (
                  <option key={data} value={data}>{data}</option>
                ))}
              </PullDown>
            </div>
            <div className={clsx('grid col-span-4')} />
          </div>
        </div>
        <div className={clsx('grid col-span-1 ')} />
      </div>
      <div className={clsx('grid justify-items-center py-3 mb-3')}>
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
              <PurchaseReportAddModal purchaseOrderId={purchaseOrderId} purchaseItemNum={purchaseItemNum.value} isOpen={isOpen} setIsOpen={setIsOpen} isOnlyReported={true} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
