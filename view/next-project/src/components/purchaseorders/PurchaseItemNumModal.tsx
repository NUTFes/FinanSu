import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { post } from '@api/purchaseOrder';
import { CloseButton, Input, Modal, PrimaryButton, Select } from '@components/common';
import AddModal from '@components/purchaseorders/PurchaseOrderAddModal';
import { PurchaseItem, PurchaseOrder, Expense } from '@type/common';

export interface PurchaseItemNumModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  expenses: Expense[];
}

export default function PurchaseItemNumModal(props: PurchaseItemNumModalProps) {
  const [user] = useRecoilState(userAtom);

  // 購入物品数用の配列
  const purchaseItemNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const [formData, setFormData] = useState<PurchaseOrder>({
    deadline: '',
    userID: user.id,
    financeCheck: false,
    expenseID: 0,
  });
  const [purchaseItemNum, setPurchaseItemNum] = useState({
    value: 1,
  });
  // const [purchaseOrderId, setPurchaseOrderId] = useState(1);
  const purchaseOrderId = 1;

  const [formDataList, setFormDataList] = useState<PurchaseItem[]>(() => {
    const initFormDataList = [];
    for (let i = 0; i < purchaseItemNumArray.length; i++) {
      const initFormData: PurchaseItem = {
        id: i + 1,
        item: '',
        price: 0,
        quantity: 0,
        detail: '',
        url: '',
        purchaseOrderID: purchaseOrderId,
        financeCheck: false,
        createdAt: '',
        updatedAt: '',
      };
      initFormDataList.push(initFormData);
    }
    return initFormDataList;
  });

  // 購入申請用のhandler
  const formDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 購入物品数用のhandler
  const purchaseItemNumHandler = (input: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPurchaseItemNum({ ...purchaseItemNum, [input]: e.target.value });
  };

  // 購入申請の登録と登録した購入申請のIDを使って購入物品を更新
  const submit = async (data: PurchaseOrder) => {
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    const postRes: PurchaseOrder = await post(addPurchaseOrderUrl, data);
    const purchaseOrderId = postRes.id;
    const initialPurchaseItemList = [];
    for (let i = 0; i < Number(purchaseItemNum.value); i++) {
      const initialPurchaseItem: PurchaseItem = {
        id: i + 1,
        item: '',
        price: 0,
        quantity: 0,
        detail: '',
        url: '',
        purchaseOrderID: purchaseOrderId ? purchaseOrderId : 0,
        financeCheck: false,
        createdAt: '',
        updatedAt: '',
      };
      initialPurchaseItemList.push(initialPurchaseItem);
    }
    setFormDataList(initialPurchaseItemList);
  };

  return (
    <>
      <Modal>
        <div className='w-full'>
          <div className='w-fit ml-auto'>
            <CloseButton onClick={() => props.setIsOpen(false)} />
          </div>
        </div>
        <div className='mb-10 w-fit mx-auto text-xl text-black-600'>
          購入申請の作成
        </div>
        <div className='mb-10 grid grid-cols-5 items-center justify-items-center gap-4'>
          <p className='grid-cols-1 text-black-600'>
            購入期限
          </p>
          <div className='col-span-4 w-full'>
            <Input
              type='date'
              value={formData.deadline}
              onChange={formDataHandler('deadline')}
              className='w-full'
            />
          </div>
          <p className='grid-cols-1 text-black-600'>
            購入した局・団体
          </p>
          <div className='col-span-4 w-full'>
            <Select
              value={formData.expenseID}
              onChange={formDataHandler('expenseID')}
              className='w-full'
            >
              {props.expenses.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </Select>
          </div>
          <p className='grid-cols-1 text-black-600'>
            購入物品数
          </p>
          <div className='col-span-4 w-full'>
            <Select
              value={purchaseItemNum.value}
              onChange={purchaseItemNumHandler('value')}
              className='w-full'
            >
              {purchaseItemNumArray.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className='w-fit mx-auto my-3'>
          <PrimaryButton
            onClick={() => {
              submit(formData);
              onOpen();
            }}
          >
            購入物品の詳細入力へ
          </PrimaryButton>
        </div>
      </Modal>

      {isOpen && (
        <AddModal
          purchaseItemNum={purchaseItemNum}
          isOpen={isOpen}
          numModalOnClose={() => props.setIsOpen(false)}
          onClose={onClose}
          setFormDataList={setFormDataList}
          formDataList={formDataList}
        />
      )}
    </>
  );
}
