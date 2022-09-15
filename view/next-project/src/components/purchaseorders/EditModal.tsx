import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';

import { put } from '@api/purchaseItem';
import {
  PrimaryButton,
  OutlinePrimaryButton,
  CloseButton,
  Input,
  Modal,
  Stepper,
  Title,
} from '@components/common';
import { PurchaseItem } from '@pages/purchaseorders';

interface ModalProps {
  purchaseOrderId: number;
  purchaseItems: PurchaseItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditModal(props: ModalProps) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState<number>(1);
  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };
  const reset = () => {
    setActiveStep(1);
    setIsDone(false);
  };

  // 購入報告を登録するかどうかのフラグ
  const [isDone, setIsDone] = useState<boolean>(false);

  // 購入物品数だけステップを用意
  const steps = [];
  for (let i = 0; i < 1; i++) {
    steps.push({ label: '' });
  }

  // 購入物品のリスト
  const [formDataList, setFormDataList] = useState<PurchaseItem[]>(props.purchaseItems);

  const handler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormDataList(
        formDataList.map((formData: PurchaseItem) =>
          formData.id === Number(e.target.id) ? { ...formData, [input]: e.target.value } : formData,
        ),
      );
    };

  // finance_checkのtrue,falseを切り替え
  const isFinanceCheckHandler = (purchaseItemId: number, finance_check: boolean) => {
    setFormDataList(
      formDataList.map((formData: PurchaseItem) =>
        formData.id === purchaseItemId
          ? { ...formData, ['finance_check']: finance_check }
          : formData,
      ),
    );
  };

  // 購入報告の登録と購入物品の更新を行い、ページをリロード
  const submit = (data: PurchaseItem[]) => {
    updatePurchaseItem(data);
    router.reload();
  };

  // 購入物品を更新
  const updatePurchaseItem = async (data: PurchaseItem[]) => {
    data.map(async (item) => {
      const updatePurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems/' + item.id;
      await put(updatePurchaseItemUrl, item);
    });
  };

  // 購入物品の情報
  const content = (data: PurchaseItem) => (
    <div className={clsx('my-6 grid grid-cols-12 gap-4')}>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>物品名</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.item} onChange={handler('item')} />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>単価</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.price} onChange={handler('price')} />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>個数</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.quantity} onChange={handler('quantity')} />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>詳細</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.detail} onChange={handler('detail')} />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>URL</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.url} onChange={handler('url')} />
      </div>
    </div>
  );

  return (
    <>
      {props.isOpen ? (
        <Modal className='!w-1/2'>
          <div className={clsx('w-full')}>
            <div className={clsx('mr-5 grid w-full justify-items-end')}>
              <CloseButton
                onClick={() => {
                  props.setIsOpen(false);
                }}
              />
            </div>
          </div>
          <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
            購入物品の修正
          </div>
          <div className={clsx('my-6 grid grid-cols-12 gap-4')}>
            <div className={clsx('col-span-1 grid')} />
            <div className={clsx('col-span-10 grid w-full')}>
              {/* 購入物品があればステッパで表示、なければないと表示  */}
              {formDataList.length > 0 ? (
                <Stepper stepNum={formDataList.length} activeStep={activeStep} isDone={isDone}>
                  {!isDone && <>{content(formDataList[activeStep - 1])}</>}
                </Stepper>
              ) : (
                <div className={clsx('ml-5 grid justify-items-center')}>
                  <Title>報告した物品はありません</Title>
                </div>
              )}
              {isDone ? (
                // 編集完了した時に完了と戻るボタンを表示
                <div className={clsx('my-10 grid grid-cols-12 gap-4')}>
                  <div className={clsx('col-span-1 grid')} />
                  <div className={clsx('col-span-10 grid w-full justify-items-center')}>
                    <div className={clsx('flex')}>
                      <OutlinePrimaryButton onClick={reset} className={'mx-2'}>
                        戻る
                      </OutlinePrimaryButton>
                      <PrimaryButton
                        className={'mx-2'}
                        onClick={() => {
                          submit(formDataList);
                        }}
                      >
                        編集完了
                      </PrimaryButton>
                    </div>
                  </div>
                  <div className={clsx('col-span-1 grid')} />
                </div>
              ) : (
                <>
                  <div className={clsx('mt-6 grid grid-cols-12 gap-4')}>
                    <div className={clsx('col-span-1 grid')} />
                    <div className={clsx('col-span-10 grid justify-items-center')}>
                      {formDataList.length > 0 ? (
                        <div className={clsx('flex')}>
                          {/* stepが1より大きい時のみ戻るボタンを表示 */}
                          {activeStep > 1 && (
                            <OutlinePrimaryButton onClick={prevStep} className={'mx-2'}>
                              戻る
                            </OutlinePrimaryButton>
                          )}
                          <PrimaryButton
                            className={'mx-2 pl-4 pr-2'}
                            onClick={() => {
                              {
                                activeStep === formDataList.length ? setIsDone(true) : nextStep();
                              }
                              isFinanceCheckHandler(formDataList[activeStep - 1].id, true);
                            }}
                          >
                            <div className={clsx('flex')}>
                              {activeStep === formDataList.length
                                ? '登録して編集を完了'
                                : '登録して次へ'}
                              <RiArrowDropRightLine size={23} />
                            </div>
                          </PrimaryButton>
                        </div>
                      ) : (
                        <div className={clsx('flex')}>
                          <OutlinePrimaryButton
                            onClick={() => {
                              props.setIsOpen(false);
                            }}
                            className={'mx-2'}
                          >
                            閉じる
                          </OutlinePrimaryButton>
                        </div>
                      )}
                    </div>
                    <div className={clsx('col-span-1 grid')} />
                  </div>
                </>
              )}
            </div>
            <div className={clsx('col-span-1 grid')} />
          </div>
        </Modal>
      ) : null}
    </>
  );
}
