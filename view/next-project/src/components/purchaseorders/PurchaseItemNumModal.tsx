import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { get, get_with_token } from '@api/api_methods';
import { post } from '@api/purchaseOrder';
import { RiCloseCircleLine } from 'react-icons/ri';
import AddModal from '@components/purchaseorders/PurchaseOrderAddModal';
import { Modal, Input, Select, PrimaryButton } from '@components/common';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

interface FormData {
  deadline: string;
  user_id: number;
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

export default function PurchaseItemNumModal(props: ModalProps) {
  // 購入物品数用の配列
  const purchaseItemNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const [formData, setFormData] = useState({
    deadline: '',
    user_id: 1,
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

  // ログイン中のユーザ
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    bureau_id: 1,
    role_id: 1,
  });

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      // current_userの取得とセット
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const currentUserRes = await get_with_token(url);
        setCurrentUser(currentUserRes);
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);

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

  const addPurchaseOrder = async (data: FormData, user_id: number) => {
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    await post(addPurchaseOrderUrl, data, user_id);
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
      {props.isOpen ? (
        <>
          <Modal>
            <div className={clsx('w-full')}>
              <div className={clsx('mr-5 w-full grid justify-items-end')}>
                <RiCloseCircleLine size={'23px'} color={'gray'} onClick={props.onClose} />
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
                  addPurchaseOrder(formData, currentUser.id);
                }}
              >
                購入物品の詳細入力へ
              </PrimaryButton>
            </div>
          </Modal>
          <AddModal
            purchaseOrderId={purchaseOrderId}
            purchaseItemNum={purchaseItemNum}
            isOpen={isOpen}
            numModalOnClose={props.onClose}
            onClose={onClose}
            setFormDataList={setFormDataList}
            formDataList={formDataList}
          />
        </>
      ) : null}
    </>
  );
}
