import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { get } from '@api/api_methods';
import { post } from '@api/purchaseReport';
import { put } from '@api/purchaseItem';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { PrimaryButton, OutlinePrimaryButton, UnderlinePrimaryButton, CloseButton, Input, Modal, Stepper } from '@components/common';
import { useGlobalContext } from '@components/global/context';

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
  price: number | string;
  quantity: number | string;
  detail: string;
  url: string;
  purchaseOrderId: number;
  finance_check: boolean;
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

interface ModalProps {
  purchaseOrderId: number;
  purchaseItemNum: number;
  isOpen: boolean;
  setIsOpen: Function;
}

export default function PurchaseReportAddModal(props: ModalProps) {
  const state = useGlobalContext();
  const [activeStep, setActiveStep] = useState<number>(1);
  const nextStep = () => { setActiveStep(activeStep + 1) }
  const prevStep = () => { setActiveStep(activeStep - 1) }
  const reset = () => {
    setActiveStep(1);
    setIsDone(false);
  }

  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen)
  const onClose = () => { setIsOpen(false) }
  const [isDone, setIsDone] = useState<boolean>(false);
  const router = useRouter();

  const [formDataList, setFormDataList] = useState<PurchaseItem[]>(() => {
    let initFormDataList = [];
    for (let i = 0; i < props.purchaseItemNum; i++) {
      let initFormData: PurchaseItem = {
        id: i + 1,
        item: '',
        price: '',
        quantity: '',
        detail: '',
        url: '',
        purchaseOrderId: props.purchaseOrderId,
        finance_check: false,
      };
      initFormDataList.push(initFormData);
    }
    return initFormDataList;
  });

  const [purchaseOrderView, setPurchaseOrderView] = useState<PurchaseOrderView>()

  useEffect(() => {
    if (router.isReady) {
      const getPurchaseOrderViewUrl = process.env.CSR_API_URI + '/get_purchaseorders_for_view/' + props.purchaseOrderId;

      const getPurchaseOrderView = async (url: string) => {
        const purchaseOrderViewRes: PurchaseOrderView = await get(url)
        setPurchaseOrderView(purchaseOrderViewRes);
        let initFormDataList = [];
        for (let i = 0; i < purchaseOrderViewRes.purchase_item.length; i++) {
          let initFormData: PurchaseItem = {
            id: purchaseOrderViewRes.purchase_item[i].id,
            item: purchaseOrderViewRes.purchase_item[i].item,
            price: purchaseOrderViewRes.purchase_item[i].price,
            quantity: purchaseOrderViewRes.purchase_item[i].quantity,
            detail: purchaseOrderViewRes.purchase_item[i].detail,
            url: purchaseOrderViewRes.purchase_item[i].url,
            purchaseOrderId: props.purchaseOrderId,
            finance_check: purchaseOrderViewRes.purchase_item[i].finance_check,
          };
          initFormDataList.push(initFormData);
        }
        setFormDataList(initFormDataList)
      };
      getPurchaseOrderView(getPurchaseOrderViewUrl);
    }
  }, [router]);

  const handler =
    (stepNumber: number, input: string) =>
      (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        setFormDataList(
          formDataList.map((formData: PurchaseItem) =>
            formData.id === stepNumber ? { ...formData, [input]: e.target.value } : formData,
          ),
        );
      };

  const isFinanceCheckHandler =
    (purchaseItemId: number, finance_check: boolean) => {
      setFormDataList(
        formDataList.map((formData: PurchaseItem) =>
          formData.id === purchaseItemId ? { ...formData, ["finance_check"]: finance_check } : formData,
        ),
      );
    };

  const submit = (data: PurchaseItem[]) => {
    addPurchaseReport();
    updatePurchaseItem(data);
    router.reload();
  }

  const addPurchaseReport = async () => {
    const purchaseReport = {
      user_id: state.user.id,
      purchase_order_id: props.purchaseOrderId,
    }
    const addPurchaseReportUrl = process.env.CSR_API_URI + '/purchasereports';
    await post(addPurchaseReportUrl, purchaseReport);
  };
  const updatePurchaseItem = async (data: PurchaseItem[]) => {
    data.map(async (item) => {
      let updatePurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems/' + item.id;
      await put(updatePurchaseItemUrl, item);
    });
  };

  // 購入物品の情報
  const content: Function = (index: number, data: PurchaseItem) => (
    <>
      <div className={clsx('grid grid-cols-12 gap-4 my-6')}>
        <div className={clsx('grid col-span-2 justify-items-end mr-2')}>
          <div
            className={clsx(
              'flex items-center text-black-600 text-md',
            )}
          >
            物品名
          </div>
        </div>
        <div className={clsx('grid col-span-10 w-full')}>
          <Input
            value={data.item}
            onChange={handler(index, 'item')}
          />
        </div>
        <div className={clsx('grid col-span-2 justify-items-end mr-2')}>
          <div
            className={clsx(
              'flex items-center text-black-600 text-md',
            )}
          >
            単価
          </div>
        </div>
        <div className={clsx('grid col-span-10 w-full')}>
          <Input
            value={data.price}
            onChange={handler(index, 'price')}
          />
        </div>
        <div className={clsx('grid col-span-2 justify-items-end mr-2')}>
          <div
            className={clsx(
              'flex items-center text-black-600 text-md',
            )}
          >
            個数
          </div>
        </div>
        <div className={clsx('grid col-span-10 w-full')}>
          <Input
            value={data.quantity}
            onChange={handler(index, 'quantity')}
          />
        </div>
        <div className={clsx('grid col-span-2 justify-items-end mr-2')}>
          <div
            className={clsx(
              'flex items-center text-black-600 text-md',
            )}
          >
            詳細
          </div>
        </div>
        <div className={clsx('grid col-span-10 w-full')}>
          <Input
            value={data.detail}
            onChange={handler(index, 'detail')}
          />
        </div>
        <div className={clsx('grid col-span-2 justify-items-end mr-2')}>
          <div
            className={clsx(
              'flex items-center text-black-600 text-md',
            )}
          >
            URL
          </div>
        </div>
        <div className={clsx('grid col-span-10 w-full')}>
          <Input
            value={data.url}
            onChange={handler(index, 'url')}
          />
        </div>
      </div>
    </>
  );

  // 購入物品数だけステップを用意
  let steps = [];
  for (let i = 0; i < props.purchaseItemNum; i++) {
    steps.push({ label: '' });
  }

  return (
    <>
      {isOpen ? (
        <Modal className='!w-1/2'>
          <div className={clsx('w-full')}>
            <div className={clsx('mr-5 w-full grid justify-items-end')}>
              <CloseButton onClick={() => {
                onClose();
              }} />
            </div>
          </div>
          <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
            購入物品の登録
          </div>
          <div className={clsx('grid grid-cols-12 gap-4 my-6')}>
            <div className={clsx('grid col-span-1')} />
            <div className={clsx('grid col-span-10 w-full')}>
              <Stepper stepNum={props.purchaseItemNum} activeStep={activeStep} isDone={isDone}>
                {!isDone &&
                  <>
                    {content(activeStep, formDataList[activeStep - 1])}
                  </>
                }
              </Stepper>
              {isDone ? (
                <div className={clsx('grid grid-cols-12 gap-4 my-10')}>
                  <div className={clsx('grid col-span-1')} />
                  <div className={clsx('grid col-span-10 justify-items-center w-full')}>
                    <div className={clsx('flex')}>
                      <OutlinePrimaryButton onClick={reset} className={'mx-2'}>
                        戻る
                      </OutlinePrimaryButton>
                      <PrimaryButton
                        className={'mx-2'}
                        onClick={() => {
                          submit(formDataList)
                        }}
                      >
                        登録して終了
                      </PrimaryButton>
                    </div>
                  </div>
                  <div className={clsx('grid col-span-1')} />
                </div>
              ) : (
                <>
                  <div className={clsx('grid grid-cols-12 gap-4 mt-6')}>
                    <div className={clsx('grid col-span-1')} />
                    <div className={clsx('grid col-span-10 justify-items-center')}>
                      <div className={clsx('flex')}>
                        <OutlinePrimaryButton onClick={prevStep} className={'mx-2'}>
                          戻る
                        </OutlinePrimaryButton>
                        <PrimaryButton
                          className={'mx-2 pl-4 pr-2'}
                          onClick={() => {
                            { activeStep === steps.length ? setIsDone(true) : nextStep(); }
                            isFinanceCheckHandler(formDataList[activeStep - 1].id, true)
                          }}
                        >
                          <div className={clsx('flex')}>
                            {activeStep === steps.length ? '登録して確認' : '登録して次へ'}
                            <RiArrowDropRightLine size={23} />
                          </div>
                        </PrimaryButton>
                      </div>
                    </div>
                    <div className={clsx('grid col-span-1')} />
                  </div>
                  <div className={clsx('grid grid-cols-12 gap-4 mt-3')}>
                    <div className={clsx('grid col-span-1')} />
                    <div className={clsx('grid col-span-10 justify-items-center')}>
                      <UnderlinePrimaryButton
                        className={'pl-4 pr-2'}
                        onClick={() => {
                          { activeStep === steps.length ? setIsDone(true) : nextStep(); }
                          isFinanceCheckHandler(formDataList[activeStep - 1].id, false)
                        }}
                      >
                        <div className={clsx('flex')}>
                          {activeStep === steps.length ? '登録せずに確認' : '登録せずに次へ'}
                          <RiArrowDropRightLine size={23} />
                        </div>
                      </UnderlinePrimaryButton>
                    </div>
                    <div className={clsx('grid col-span-1')} />
                  </div>
                </>
              )}
            </div>
            <div className={clsx('grid col-span-1')} />
          </div>
        </Modal>
      ) : null
      }
    </>
  );
}
