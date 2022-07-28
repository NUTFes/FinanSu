import React, { FC, useEffect, useState } from 'react';
import { RiCloseCircleLine, RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { get } from '@api/api_methods';
import { Modal, Radio, Input, Select, PrimaryButton } from '@components/common';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  children?: React.ReactNode;
  id: number | string;
}

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

const PurchaseOrderEditModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setIsOpen(false);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const router = useRouter();

  const [formData, setFormData] = useState({
    deadline: '',
    user_id: '',
    created_at: '',
  });

  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };

  const calcTotalFee = (purchaseItems: PurchaseItem[]) => {
    let totalFee = 0;
    for (let i: number = 0; i < purchaseItems.length; i++) {
      totalFee += purchaseItems[i].price * purchaseItems[i].quantity;
    }
    return totalFee;
  }

  const [purchaseOrderView, setPurchaseOrderView] = useState<PurchaseOrderView>()

  useEffect(() => {
    if (router.isReady) {
      const getPurchaseOrderViewUrl = process.env.CSR_API_URI + '/get_purchaseorders_for_view/' + props.id;
      const getPurchaseOrderView = async (url: string) => {
        setPurchaseOrderView(await get(url));
        console.log(await get(getPurchaseOrderViewUrl))
      };
      getPurchaseOrderView(getPurchaseOrderViewUrl);
    }
  }, [router]);

  if(purchaseOrderView)
  console.log(purchaseOrderView.user)

  return (
    <>
      {props.isOpen ? (
        <Modal>
          <div className={clsx('w-full')}>
            <div className={clsx('mr-5 w-full grid justify-items-end')}>
              <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal}/>
            </div>
          </div>
          <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
            申請の詳細
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
                    ID
                  </div>
                </div>
              <div className={clsx('grid col-span-8 w-full my-2')}>
                <div className={clsx('grid grid-cols-12 w-full border-b-primary-1 border border-t-white-0 border-x-white-0')}>
                  {purchaseOrderView && purchaseOrderView.purchase_order.id}
                </div>
              </div>
            </div>
            <div className={clsx('grid col-span-1 ')} />
            <div className={clsx('grid grid-cols-12 w-full')}>
              <div className={clsx('grid col-span-4 mr-2')}>
                <div
                  className={clsx(
                    'grid justify-items-end flex items-center text-black-600 text-md',
                  )}
                >
                  局
                </div>
              </div>
              <div className={clsx('grid col-span-8 w-full border-b-primary-1 border border-t-white-0 border-x-white-0')}>
              {purchaseOrderView && purchaseOrderView.user.bureau_id === 1 && '総務局'}
              {purchaseOrderView && purchaseOrderView.user.bureau_id === 2 && '渉外局'}
              {purchaseOrderView && purchaseOrderView.user.bureau_id === 3 && '財務局'}
              {purchaseOrderView && purchaseOrderView.user.bureau_id === 4 && '企画局'}
              {purchaseOrderView && purchaseOrderView.user.bureau_id === 5 && '政策局'}
              {purchaseOrderView && purchaseOrderView.user.bureau_id === 6 && '情報局'}   
              </div>
            </div>
            <div className={clsx('grid grid-cols-12 w-full')}>
              <div className={clsx('grid col-span-4 mr-2')}>
                <div
                  className={clsx(
                    'grid justify-items-end flex items-center text-black-600 text-md',
                  )}
                >
                  申請日
                </div>
              </div>
              <div className={clsx('grid col-span-8 w-full border-b-primary-1 border border-t-white-0 border-x-white-0')}>
              {purchaseOrderView && formatDate(purchaseOrderView.purchase_order.created_at)} 
              </div>
            </div>
            <div className={clsx('grid grid-cols-12 w-full')}>
              <div className={clsx('grid col-span-4 mr-2')}>
                <div
                  className={clsx(
                    'grid justify-items-end flex items-center text-black-600 text-md',
                  )}
                >
                  購入期限
                </div>
              </div>
              <div className={clsx('grid col-span-8 w-full border-b-primary-1 border border-t-white-0 border-x-white-0')}>
              {purchaseOrderView && purchaseOrderView.purchase_order.deadline} 
              </div>
            </div>
            <div className={clsx('grid col-span-1 ')} />
            </div>
          </div>
          
          <div className={clsx('grid justify-items-center w-full mt-20 mb-5 text-black-600 text-base')}>
            購入物品
          </div>
                <table className={clsx('w-full')}>
                  <thead>
                    <tr
                      className={clsx('py-3 border-b-primary-1 border border-t-white-0 border-x-white-0')}
                    >
                      <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                        <div className={clsx('text-center text-sm text-black-600')}>品名</div>
                      </th>
                      <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                        <div className={clsx('text-center text-sm text-black-600')}>単価</div>
                      </th>
                      <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                        <div className={clsx('text-center text-sm text-black-600')}>個数</div>
                      </th>
                      <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                        <div className={clsx('text-center text-sm text-black-600')}>詳細</div>
                      </th>
                      <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                        <div className={clsx('text-center text-sm text-black-600')}>URL</div>
                      </th>
                    </tr>
                  </thead>
                  {/* <tbody className={clsx('border-b-primary-1 border border-t-white-0 border-x-white-0')}>
                    {purchaseOrderView && purchaseOrderView.purchase_item.map((purchaseOrderItem:any, index:any) => (
                      <tr key={purchaseOrderItem.purchase_order.id}>
                        <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'))}>
                          <div className={clsx('text-center text-sm text-black-600')}>
                          {purchaseOrderItem.purchase_item && purchaseOrderItem.purchase_item.length}
                          </div>
                        </td>
                        <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'))}>
                          <div className={clsx('text-center text-sm text-black-600')}>
                            {purchaseOrderItem.purchase_item && calcTotalFee(purchaseOrderItem.purchase_item)}
                          </div>
                        </td>
                        <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'))}>
                          <div className={clsx('text-center text-sm text-black-600')}>
                            {purchaseOrderItem.purchase_item.length === 1 ? (
                              <>
                                {purchaseOrderItem.purchase_item && purchaseOrderItem.purchase_item[0].item}
                              </>
                            ) : (
                              <>
                                {purchaseOrderItem.purchase_item && purchaseOrderItem.purchase_item[0].item}, ...
                              </>
                            )}
                          </div>
                        </td>
                        < td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'))}>
                          <div className={clsx('text-center text-sm text-black-600')}>
                            {purchaseOrderItem.purchase_item && purchaseOrderItem.purchase_item.length}
                          </div>
                        </td>
                        <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'))}>
                          <div className={clsx('text-center text-sm text-black-600')}>
                            <RiExternalLinkLine />
                            <RiFileCopyLine />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody > */}
                </table>       
        </Modal>
      ) : null}  
    </>       
  );
};

export default PurchaseOrderEditModal;
