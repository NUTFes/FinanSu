import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';

import { RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';
import { put } from '@api/purchaseItem';
import {
  PrimaryButton,
  OutlinePrimaryButton,
  CloseButton,
  Input,
  Modal,
  Stepper,
  Tooltip,
} from '@components/common';
import { PurchaseItem } from '@type/common';

interface ModalProps {
  purchaseOrderId: number;
  purchaseItems: PurchaseItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenInitial: () => void;
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
    if (activeStep === 1) {
      props.onOpenInitial();
    } else {
      setActiveStep(1);
      setIsDone(false);
    }
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
  const isFinanceCheckHandler = (purchaseItemId: number | undefined, finance_check: boolean) => {
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
    <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
      <p className='text-black-600'>物品名</p>
      <div className='col-span-4 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.item}
          onChange={handler('item')}
        />
      </div>
      <p className='text-black-600'>単価</p>
      <div className='col-span-4 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.price}
          onChange={handler('price')}
        />
      </div>
      <p className='text-black-600'>個数</p>
      <div className='col-span-4 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.quantity}
          onChange={handler('quantity')}
        />
      </div>
      <p className='text-black-600'>詳細</p>
      <div className='col-span-4 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.detail}
          onChange={handler('detail')}
        />
      </div>
      <p className='text-black-600'>URL</p>
      <div className='col-span-4 w-full'>
        <Input className='w-full' id={String(data.id)} value={data.url} onChange={handler('url')} />
      </div>
    </div>
  );

  return (
    <>
      {props.isOpen && (
        <Modal className='w-full md:w-1/2'>
          <div className='ml-auto w-fit'>
            <CloseButton
              onClick={() => {
                props.setIsOpen(false);
              }}
            />
          </div>
          <p className='mx-auto mb-10 w-fit text-xl text-black-600'>購入物品の修正</p>
          {/* 購入物品があればステッパで表示、なければないと表示  */}
          {formDataList && formDataList.length > 0 ? (
            <Stepper stepNum={formDataList.length} activeStep={activeStep} isDone={isDone}>
              {!isDone && <>{content(formDataList[activeStep - 1])}</>}
            </Stepper>
          ) : (
            <p className='text-center text-sm text-black-600'>
              購入物品が存在しません。項目を削除した上で、再登録してください。
            </p>
          )}
          {isDone ? (
            <div>
              <table className='w-full'>
                <thead>
                  <tr className='border-gray-300 border-b border-primary-1'>
                    <th className='py-2'>物品名</th>
                    <th className='py-2'>単価</th>
                    <th className='py-2'>個数</th>
                    <th className='py-2'>詳細</th>
                    <th className='py-2'>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {formDataList.map((data) => (
                    <tr key={data.id} className='border-gray-300 border-b'>
                      <td className='py-2'>{data.item}</td>
                      <td className='py-2'>{data.price}</td>
                      <td className='py-2'>{data.quantity}</td>
                      <td className='py-2'>{data.detail}</td>
                      <td className='py-2'>
                        <div className={'flex justify-center'}>
                          <a href={data.url} target='_blank' rel='noopener noreferrer'>
                            <RiExternalLinkLine size={'16px'} />
                          </a>
                          <Tooltip text={'copy URL'}>
                            <RiFileCopyLine
                              size={'16px'}
                              className='cursor-pointer'
                              onClick={() => {
                                navigator.clipboard.writeText(data.url);
                              }}
                            />
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='mb-5 mt-10 flex justify-center gap-5'>
                <OutlinePrimaryButton onClick={reset}>戻る</OutlinePrimaryButton>
                <PrimaryButton
                  onClick={() => {
                    submit(formDataList);
                  }}
                >
                  編集完了
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className='mb-5 mt-10 flex justify-center gap-5'>
              {formDataList && formDataList.length > 0 && (
                <>
                  <OutlinePrimaryButton onClick={activeStep === 1 ? reset : prevStep}>
                    戻る
                  </OutlinePrimaryButton>
                  <PrimaryButton
                    onClick={() => {
                      {
                        activeStep === formDataList.length ? setIsDone(true) : nextStep();
                      }
                      isFinanceCheckHandler(formDataList[activeStep - 1].id, true);
                    }}
                  >
                    {activeStep === formDataList.length ? '確認へ' : '登録して次へ'}
                    <RiArrowDropRightLine size={23} />
                  </PrimaryButton>
                </>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
