import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import * as purchaseItemAPI from '@api/purchaseItem';
import { post } from '@api/purchaseOrder';
import { get } from '@utils/api/api_methods';
import {
  CloseButton,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  PullDown,
  Select
} from '@components/common';
import PurchaseReportAddModal from '@components/purchasereports/PurchaseReportAddModal';
import { useUI } from '@components/ui/context';
import { PurchaseItem, PurchaseOrder, Expense } from '@type/common';

export default function PurchaseReportItemNumModal() {
  const [user] = useRecoilState(userAtom);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseID, setExpenseID] = useState(1);

  useEffect(() => {
    const getExpensesUrl = process.env.CSR_API_URI + '/expenses';
    const getExpenses = async () => {
      const res = await get(getExpensesUrl);
      setExpenses(res);
    };
    getExpenses();
  }, []);

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

    const data: PurchaseOrder = {
      deadline: String(year) + '-' + monthStr + '-' + dayStr,
      userID: user.id,
      financeCheck: false,
      expenseID: expenseID,
    };
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
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
        purchaseOrderID: purchaseOrderID,
        financeCheck: false,
        createdAt: '',
        updatedAt: '',
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
    <>
      <Modal className='w-1/2'>
        <div className='w-fit ml-auto'>
          <CloseButton onClick={closeModal} />
        </div>
        <p className='mb-10 w-fit mx-auto text-xl text-black-600'>
          購入報告単体で登録
        </p>
        <p className='w-fit mx-auto text-black-600'>
          報告する物品の個数を入力してください
        </p>
        <div>
          <div className='flex gap-5 justify-center my-10'>
            <p className='text-black-600'>購入物品数</p>
            <div className='w-1/3'>
              <PullDown value={purchaseItemNum.value} onChange={purchaseItemNumHandler('value')}>
                {purchaseItemNumArray.map((data) => (
                  <option key={data} value={data}>
                    {data}
                  </option>
                ))}
              </PullDown>
            </div>
          </div>
          <div className='flex gap-5 justify-center items-center my-10'>
            <p>購入した局・団体</p>
            <div className='w-1/3'>
              <Select
                value={expenseID}
                onChange={(e) => {
                  setExpenseID(Number(e.target.value));
                }}
              >
                {expenses.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className='flex gap-5 justify-center'>
          <OutlinePrimaryButton
            onClick={() => {
              setModalView('PURCHASE_REPORT_ADD_MODAL');
              openModal();
            }}
          >
            戻る
          </OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              addPurchaseOrder();
            }}
          >
            報告へ進む
          </PrimaryButton>
        </div>
      </Modal>
      {isOpen && (
        <PurchaseReportAddModal
          purchaseOrderId={purchaseOrderId}
          purchaseItemNum={purchaseItemNum.value}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isOnlyReported={true}
        />
      )}
    </>
  );
}
