import clsx from 'clsx';
import React, { useState } from 'react';

import { post } from '@api/purchaseOrder';
import { CloseButton, Input, Modal, PrimaryButton, Select } from '@components/common';
import { useGlobalContext } from '@components/global/context';
import AddModal from '@components/purchaseorders/PurchaseOrderAddModal';
import { useUI } from '@components/ui/context';
import { PurchaseItem, PurchaseOrder } from '@type/common';

interface FormData {
  deadline?: string;
  userID?: number;
  financeCheck?: boolean;
}

export default function PurchaseItemNumModal() {
  const state = useGlobalContext();
  // 購入物品数用の配列
  const purchaseItemNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const { closeModal } = useUI();

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const [formData, setFormData] = useState({
    deadline: '',
    userID: state.user.id,
    financeCheck: false,
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
  const submit = async (data: FormData) => {
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/get_post_purchaseorder_record';
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
        <div className={clsx('w-full')}>
          <div className={clsx('mr-5 grid w-full justify-items-end')}>
            <CloseButton onClick={closeModal} />
          </div>
        </div>
        <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
          購入申請の作成
        </div>
        <div className={clsx('mb-10 grid grid-cols-12 gap-4')}>
          <div className={clsx('col-span-1 grid')} />
          <div className={clsx('col-span-10 grid')}>
            <div className={clsx('my-2 grid w-full grid-cols-12')}>
              <div className={clsx('col-span-4 mr-2 grid')}>
                <div
                  className={clsx(
                    'text-md flex grid items-center justify-items-end text-black-600',
                  )}
                >
                  購入期限
                </div>
              </div>
              <div className={clsx('col-span-8 my-2 grid w-full')}>
                <Input
                  placeholder=' yyyymmddで入力'
                  value={formData.deadline}
                  onChange={formDataHandler('deadline')}
                />
              </div>
            </div>
            <div className={clsx('grid w-full grid-cols-12')}>
              <div className={clsx('h-100 col-span-4 mr-2 grid')}>
                <div
                  className={clsx(
                    'text-md flex grid items-center justify-items-end text-black-600',
                  )}
                >
                  購入物品数
                </div>
              </div>
              <div className={clsx('col-span-8 grid w-full')}>
                <Select value={purchaseItemNum.value} onChange={purchaseItemNumHandler('value')}>
                  {purchaseItemNumArray.map((data) => (
                    <option key={data} value={data}>
                      {data}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className={clsx('col-span-1 grid ')} />
        </div>
        <div className={clsx('grid justify-items-center py-3')}>
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
          numModalOnClose={closeModal}
          onClose={onClose}
          setFormDataList={setFormDataList}
          formDataList={formDataList}
        />
      )}
    </>
  );
}
