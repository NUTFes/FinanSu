import React, { useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { post } from '@api/purchaseItem';
import { PrimaryButton, RedButton, CloseButton, Input, Modal, Stepper } from '@components/common';

interface ModalProps {
  purchaseOrderId: number;
  purchaseItemNum: PurchaseItemNum;
  isOpen: boolean;
  numModalOnClose: () => void;
  onClose: () => void;
  setFormDataList: Function;
  formDataList: PurchaseItem[];
}

interface PurchaseItemNum {
  value: number;
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


export default function AddModal(props: ModalProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const nextStep = () => { setActiveStep(activeStep + 1) }
  const prevStep = () => { setActiveStep(activeStep - 1) }
  const reset = () => {
    setActiveStep(1)
    setIsDone(false);
  }

  const [isDone, setIsDone] = useState<boolean>(false);
  const router = useRouter();

  const handler =
    (stepNumber: number, input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      props.setFormDataList(
        props.formDataList.map((formData: PurchaseItem) =>
          formData.id === stepNumber ? { ...formData, [input]: e.target.value } : formData,
        ),
      );
    };

  const addPurchaseItem = async (data: PurchaseItem[], purchaseOrderID: number) => {
    const addPurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
    data.map(async (item) => {
      await post(addPurchaseItemUrl, item, purchaseOrderID);
    });
  };

  // 購入物品の情報
  const content: Function = (index: number, data: PurchaseItem) => (
    <>
      <div className={clsx('grid grid-cols-12 gap-4 my-6')}>
        <div className={clsx('grid col-span-2 mr-2')}>
          <div
            className={clsx(
              'grid justify-items-end flex items-center text-black-600 text-md',
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
        <div className={clsx('grid col-span-2 mr-2')}>
          <div
            className={clsx(
              'grid justify-items-end flex items-center text-black-600 text-md',
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
        <div className={clsx('grid col-span-2 mr-2')}>
          <div
            className={clsx(
              'grid justify-items-end flex items-center text-black-600 text-md',
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
        <div className={clsx('grid col-span-2 mr-2')}>
          <div
            className={clsx(
              'grid justify-items-end flex items-center text-black-600 text-md',
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
        <div className={clsx('grid col-span-2 mr-2')}>
          <div
            className={clsx(
              'grid justify-items-end flex items-center text-black-600 text-md',
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
  for (let i = 0; i < props.purchaseItemNum.value; i++) {
    steps.push({ label: '' });
  }

  return (
    <>
      <Modal className='!w-1/2'>
        <div className={clsx('w-full')}>
          <div className={clsx('mr-5 w-full grid justify-items-end')}>
            <CloseButton onClick={() => {
              props.onClose();
              props.numModalOnClose();
            }} />
          </div>
        </div>
        <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
          購入物品の登録
        </div>
        <div className={clsx('grid grid-cols-12 gap-4 my-6')}>
          <div className={clsx('grid col-span-1')}/>
          <div className={clsx('grid col-span-10 w-full')}>
            <Stepper stepNum={props.purchaseItemNum.value} activeStep={activeStep} isDone={isDone}>
              {!isDone &&
                <>
                  {content(activeStep, props.formDataList[activeStep-1])}
                </>
              }
            </Stepper>
            {isDone ? (
              <div className={clsx('grid grid-cols-8 gap-4 my-10')}>
                <div className={clsx('grid col-span-3')}/>
                <div className={clsx('grid col-span-1 w-full')}>
                <RedButton onClick={reset}>
                  Reset
                </RedButton>
                </div>
                <div className={clsx('grid col-span-1 w-full')}>
                <PrimaryButton
                  onClick={() => {
                    addPurchaseItem(props.formDataList, props.purchaseOrderId);
                    props.onClose();
                    props.numModalOnClose();
                    router.reload();
                  }}
                >
                  登録
                </PrimaryButton>
                </div>
                <div className={clsx('grid col-span-3')}/>
              </div>
            ): (
              <div className={clsx('grid grid-cols-7 gap-4 mt-6')}>
                <div className={clsx('grid col-span-5')}/>
                <div className={clsx('grid col-span-1 justify-items-center')}>
                <RedButton onClick={prevStep}>
                  Prev
                </RedButton>
                </div>
                <div className={clsx('grid col-span-1 justify-items-center')}>
                <PrimaryButton
                  onClick={() => {
                    { activeStep === steps.length ? setIsDone(true) : nextStep(); }
                  }}
                >
                  {activeStep === steps.length ? 'Finish' : 'Next'}
                </PrimaryButton>
                </div>
              </div>
            )}
          </div>
          <div className={clsx('grid col-span-1')}/>
        </div>
      </Modal>
    </>
  );
}
