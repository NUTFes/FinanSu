import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { put } from '@api/purchaseItem';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { PrimaryButton, OutlinePrimaryButton, CloseButton, Input, Modal, Stepper, Title } from '@components/common';
import { PurchaseItem } from '@pages/purchaseorders';

interface ModalProps {
  purchaseOrderId: number;
  purchaseItems: PurchaseItem[];
  isOpen: boolean;
  setIsOpen: Function;
}

export default function EditModal(props: ModalProps) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState<number>(1);
  const nextStep = () => { setActiveStep(activeStep + 1) }
  const prevStep = () => { setActiveStep(activeStep - 1) }
  const reset = () => {
    setActiveStep(1);
    setIsDone(false);
  }

  // 購入報告を登録するかどうかのフラグ
  const [isDone, setIsDone] = useState<boolean>(false);

  // 購入物品数だけステップを用意
  let steps = [];
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
  const isFinanceCheckHandler =
    (purchaseItemId: number, finance_check: boolean) => {
      setFormDataList(
        formDataList.map((formData: PurchaseItem) =>
          formData.id === purchaseItemId ? { ...formData, ["finance_check"]: finance_check } : formData,
        ),
      );
    };

  // 購入報告の登録と購入物品の更新を行い、ページをリロード
  const submit = (data: PurchaseItem[]) => {
    updatePurchaseItem(data);
    router.reload();
  }

  // 購入物品を更新
  const updatePurchaseItem = async (data: PurchaseItem[]) => {
    data.map(async (item) => {
      let updatePurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems/' + item.id;
      await put(updatePurchaseItemUrl, item);
    });
  };

  // 購入物品の情報
  const content: Function = (data: PurchaseItem) => (
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
          id={String(data.id)}
          value={data.item}
          onChange={handler('item')}
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
          id={String(data.id)}
          value={data.price}
          onChange={handler('price')}
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
          id={String(data.id)}
          value={data.quantity}
          onChange={handler('quantity')}
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
          id={String(data.id)}
          value={data.detail}
          onChange={handler('detail')}
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
          id={String(data.id)}
          value={data.url}
          onChange={handler('url')}
        />
      </div>
    </div>
  );

  return (
    <>
      {props.isOpen ? (
        <Modal className='!w-1/2'>
          <div className={clsx('w-full')}>
            <div className={clsx('mr-5 w-full grid justify-items-end')}>
              <CloseButton onClick={() => {
                props.setIsOpen(false)
              }} />
            </div>
          </div>
          <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
            購入物品の修正
          </div>
          <div className={clsx('grid grid-cols-12 gap-4 my-6')}>
            <div className={clsx('grid col-span-1')} />
            <div className={clsx('grid col-span-10 w-full')}>
              {/* 購入物品があればステッパで表示、なければないと表示  */}
              {formDataList.length > 0 ? (
                <Stepper stepNum={formDataList.length} activeStep={activeStep} isDone={isDone}>
                  {!isDone &&
                    <>
                      {content(formDataList[activeStep - 1])}
                    </>
                  }
                </Stepper>
              ) : (
                <div className={clsx('grid justify-items-center ml-5')}>
                  <Title>報告した物品はありません</Title>
                </div>
              )}
              {isDone ? (
                // 編集完了した時に完了と戻るボタンを表示
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
                        編集完了
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
                              { activeStep === formDataList.length ? setIsDone(true) : nextStep(); }
                              isFinanceCheckHandler(formDataList[activeStep - 1].id, true)
                            }}
                          >
                            <div className={clsx('flex')}>
                              {activeStep === formDataList.length ? '登録して編集を完了' : '登録して次へ'}
                              <RiArrowDropRightLine size={23} />
                            </div>
                          </PrimaryButton>
                        </div>
                      ) : (
                        <div className={clsx('flex')}>
                          <OutlinePrimaryButton onClick={() => {
                            props.setIsOpen(false)
                          }} className={'mx-2'}>
                            閉じる
                          </OutlinePrimaryButton>
                        </div>
                      )}
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
