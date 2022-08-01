import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { get, get_with_token } from '@api/api_methods';
import { post } from '@api/purchaseOrder';
import AddModal from '@components/purchaseorders/PurchaseOrderAddModal';
import { Modal, Input, Select, PrimaryButton, CloseButton } from '@components/common';
import { useUI } from '@components/ui/context';
import { useGlobalContext } from '@components/global/context';

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

interface FormData {
  deadline: string;
  user_id: number;
  finance_check: boolean;
}

interface PurchaseItem {
  id: number | string;
  item: string;
  price: number | string;
  quantity: number | string;
  detail: string;
  url: string;
  purchaseOrderId: number;
  finance_check: boolean;
}

export default function PurchaseItemNumModal() {
  const state = useGlobalContext();
  // 購入物品数用の配列
  const purchaseItemNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const router = useRouter();
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
    user_id: state.user.id,
    finance_check: false,
  });
  const [purchaseItemNum, setPurchaseItemNum] = useState({
    value: 1,
  });
  const [purchaseOrderId, setPurchaseOrderId] = useState(1);

  const [formDataList, setFormDataList] = useState<PurchaseItem[]>(() => {
    let initFormDataList = [];
    for (let i = 0; i < purchaseItemNumArray.length; i++) {
      let initFormData: PurchaseItem = {
        id: i + 1,
        item: '',
        price: '',
        quantity: '',
        detail: '',
        url: '',
        purchaseOrderId: purchaseOrderId,
        finance_check: false,
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

  const addPurchaseOrder = async (data: FormData) => {
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    await post(addPurchaseOrderUrl, data);
    const getPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    const getRes = await get(getPurchaseOrderUrl);
    setPurchaseOrderId(getRes[getRes.length - 1].id);
  };

  const updateFormDataList = () => {
    let initialPurchaseItemList = [];
    for (let i = 0; i < Number(purchaseItemNum.value); i++) {
      let initialPurchaseItem: PurchaseItem = {
        id: i + 1,
        item: '',
        price: '',
        quantity: '',
        detail: '',
        url: '',
        purchaseOrderId: purchaseOrderId,
        finance_check: false,
      };
      initialPurchaseItemList.push(initialPurchaseItem);
    }
    setFormDataList(initialPurchaseItemList);
  };

  return (
    <>
      <Modal>
        <div className={clsx('w-full')}>
          <div className={clsx('mr-5 w-full grid justify-items-end')}>
            <CloseButton onClick={closeModal} />
          </div>
        </div>
        <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
          購入申請の作成
        </div>
        <div className={clsx('grid grid-cols-12 gap-4 mb-10')}>
          <div className={clsx('grid col-span-1')} />
          <div className={clsx('grid col-span-10')}>
            <div className={clsx('grid grid-cols-12 w-full my-2')}>
              <div className={clsx('grid col-span-4 mr-2')}>
                <div
                  className={clsx(
                    'grid justify-items-end flex items-center text-black-600 text-md',
                  )}
                >
                  購入期限
                </div>
              </div>
              <div className={clsx('grid col-span-8 w-full my-2')}>
                <Input
                  placeholder=' yyyymmddで入力'
                  value={formData.deadline}
                  onChange={formDataHandler('deadline')}
                />
              </div>
            </div>
            <div className={clsx('grid grid-cols-12 w-full')}>
              <div className={clsx('grid col-span-4 mr-2 h-100')}>
                <div
                  className={clsx(
                    'grid justify-items-end flex items-center text-black-600 text-md',
                  )}
                >
                  購入物品数
                </div>
              </div>
              <div className={clsx('grid col-span-8 w-full')}>
                <Select
                  value={purchaseItemNum.value}
                  onChange={purchaseItemNumHandler('value')}
                >
                  {purchaseItemNumArray.map((data) => (
                    <option key={data} value={data}>{data}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className={clsx('grid col-span-1 ')} />
        </div>
        <div className={clsx('grid justify-items-center py-3')}>
          <PrimaryButton
            onClick={() => {
              updateFormDataList();
              onOpen();
              addPurchaseOrder(formData);
            }}
          >
            購入物品の詳細入力へ
          </PrimaryButton>
        </div>
      </Modal>

      {isOpen ? (
        <AddModal
          purchaseOrderId={purchaseOrderId}
          purchaseItemNum={purchaseItemNum}
          isOpen={isOpen}
          numModalOnClose={closeModal}
          onClose={onClose}
          setFormDataList={setFormDataList}
          formDataList={formDataList}
        />
      ) : null}
    </>
  );
}
