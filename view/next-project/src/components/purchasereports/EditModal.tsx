import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { put as putPurchaseItem } from '@api/purchaseItem';
import { put as putPurchaseReport } from '@api/purchaseReport';
import {
  CloseButton,
  Input,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Stepper,
  Textarea,
  Title,
} from '@components/common';
import { PurchaseItem, PurchaseReport, PurchaseReportView } from '@type/common';

interface ModalProps {
  purchaseReportId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditModal(props: ModalProps) {
  const [user] = useRecoilState(userAtom);

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

  // 購入報告
  const [formData, setFormData] = useState<PurchaseReport>({
    id: 0,
    userID: user.id,
    discount: 0,
    addition: 0,
    financeCheck: false,
    remark: '',
    buyer: '',
    purchaseOrderID: 1,
    createdAt: '',
    updatedAt: '',
  });
  // 購入物品のリスト
  const [formDataList, setFormDataList] = useState<PurchaseItem[]>([
    {
      id: 1,
      item: '',
      price: 0,
      quantity: 0,
      detail: '',
      url: '',
      purchaseOrderID: 1,
      financeCheck: false,
      createdAt: '',
      updatedAt: '',
    },
  ]);

  // purchase_reportに紐づくpurchase_itemsを取得
  const getPurchaseItems = useCallback(async () => {
    const getPurchaseOrderViewURL =
      process.env.CSR_API_URI + '/purchasereports/' + props.purchaseReportId + '/details';

    const purchaseOrderViewRes: PurchaseReportView = await get(getPurchaseOrderViewURL);
    const initFormDataList = [];
    for (let i = 0; i < purchaseOrderViewRes.purchaseItems.length; i++) {
      if (purchaseOrderViewRes.purchaseItems[i].financeCheck) {
        const initFormData: PurchaseItem = {
          id: purchaseOrderViewRes.purchaseItems[i].id,
          item: purchaseOrderViewRes.purchaseItems[i].item,
          price: purchaseOrderViewRes.purchaseItems[i].price,
          quantity: purchaseOrderViewRes.purchaseItems[i].quantity,
          detail: purchaseOrderViewRes.purchaseItems[i].detail,
          url: purchaseOrderViewRes.purchaseItems[i].url,
          purchaseOrderID: purchaseOrderViewRes.purchaseOrder.id
            ? purchaseOrderViewRes.purchaseOrder.id
            : 0,
          financeCheck: purchaseOrderViewRes.purchaseItems[i].financeCheck,
          createdAt: purchaseOrderViewRes.purchaseItems[i].createdAt,
          updatedAt: purchaseOrderViewRes.purchaseItems[i].updatedAt,
        };
        initFormDataList.push(initFormData);
      }
    }
    setFormData(purchaseOrderViewRes.purchaseReport);
    setFormDataList(initFormDataList);
  }, [props.purchaseReportId, setFormData, setFormDataList]);

  useEffect(() => {
    if (router.isReady) {
      getPurchaseItems();
    }
  }, [router, getPurchaseItems]);

  // 購入報告用のhandler
  const formDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 購入物品用のhandler
  const formDataListHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormDataList(
        formDataList.map((formData: PurchaseItem) =>
          formData.id === Number(e.target.id) ? { ...formData, [input]: e.target.value } : formData,
        ),
      );
    };

  // finance_checkのtrue,falseを切り替え
  const isFinanceCheckHandler = (purchaseItemId: number | undefined, financeCheck: boolean) => {
    setFormDataList(
      formDataList.map((formData: PurchaseItem) =>
        formData.id === purchaseItemId ? { ...formData, ['financeCheck']: financeCheck } : formData,
      ),
    );
  };

  // 購入報告の登録と購入物品の更新を行い、ページをリロード
  const submit = (
    formDataList: PurchaseItem[],
    formData: PurchaseReport,
    purchaseReportId: number,
  ) => {
    updatePurchaseReport(formData, purchaseReportId);
    updatePurchaseItem(formDataList);
    router.reload();
  };

  // 購入物品を更新
  const updatePurchaseReport = async (data: PurchaseReport, id: number) => {
    const updatePurchaseReportUrl = process.env.CSR_API_URI + '/purchasereports/' + id;
    const { userID, discount, addition, purchaseOrderID, ...rest } = data;
    const submitData: PurchaseReport = {
      userID: Number(userID),
      discount: Number(discount),
      addition: Number(addition),
      purchaseOrderID: Number(purchaseOrderID),
      ...rest,
    };
    await putPurchaseReport(updatePurchaseReportUrl, submitData);
  };

  // 購入物品を更新
  const updatePurchaseItem = async (data: PurchaseItem[]) => {
    data.map(async (item) => {
      const updatePurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems/' + item.id;
      await putPurchaseItem(updatePurchaseItemUrl, item);
    });
  };

  // 購入物品の情報
  const content = (data: PurchaseItem) => (
    <div className='mx-auto my-6 grid w-9/10 grid-cols-4 items-center justify-items-center gap-4'>
      <p className='text-lg text-black-600'>物品名</p>
      <div className='col-span-3 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.item}
          onChange={formDataListHandler('item')}
        />
      </div>
      <p className='text-lg text-black-600'>単価</p>
      <div className='col-span-3 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.price}
          onChange={formDataListHandler('price')}
        />
      </div>
      <p className='text-lg text-black-600'>個数</p>
      <div className='col-span-3 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.quantity}
          onChange={formDataListHandler('quantity')}
        />
      </div>
      <p className='text-lg text-black-600'>詳細</p>
      <div className='col-span-3 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.detail}
          onChange={formDataListHandler('detail')}
        />
      </div>
      <p className='text-lg text-black-600'>URL</p>
      <div className='col-span-3 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          value={data.url}
          onChange={formDataListHandler('url')}
        />
      </div>
    </div>
  );

  return (
    <>
      {props.isOpen && (
        <Modal className='md:w-1/2'>
          <div className='w-full'>
            <div className='ml-auto w-fit'>
              <CloseButton
                onClick={() => {
                  props.setIsOpen(false);
                }}
              />
            </div>
          </div>
          <div className='mx-auto mb-10 w-fit text-xl text-black-600'>
            <p>購入物品の修正</p>
          </div>
          <div>
            <div>
              {/* 購入物品があればステッパで表示、なければないと表示  */}
              {formDataList.length > 0 ? (
                <Stepper stepNum={formDataList.length} activeStep={activeStep} isDone={isDone}>
                  {!isDone && <>{content(formDataList[activeStep - 1])}</>}
                </Stepper>
              ) : (
                <div className='ml-5 grid justify-items-center'>
                  <Title>報告した物品はありません</Title>
                </div>
              )}
              {isDone ? (
                // 編集完了した時に完了と戻るボタンを表示
                <>
                  <div className='mx-auto my-5 mb-6 grid w-9/10 grid-cols-4 items-center justify-items-center gap-4'>
                    <p className='text-lg text-black-600'>割引</p>
                    <div className='col-span-3 w-full'>
                      <Input
                        className='w-full'
                        value={formData.discount}
                        onChange={formDataHandler('discount')}
                      />
                    </div>
                    <p className='text-lg text-black-600'>加算</p>
                    <div className='col-span-3 w-full'>
                      <Input
                        className='w-full'
                        value={formData.addition}
                        onChange={formDataHandler('addition')}
                      />
                    </div>
                    <p className='text-lg text-black-600'>購入者(任意)</p>
                    <div className='col-span-3 w-full'>
                      <Input
                        className='w-full'
                        value={formData.buyer}
                        onChange={formDataHandler('buyer')}
                      />
                    </div>
                    <p className='text-lg text-black-600'>備考</p>
                    <div className='col-span-3 w-full'>
                      <Textarea
                        className='w-full'
                        value={formData.remark}
                        onChange={formDataHandler('remark')}
                      />
                    </div>
                  </div>
                  <div className='flex flex-row justify-center gap-4'>
                    <OutlinePrimaryButton onClick={reset}>戻る</OutlinePrimaryButton>
                    <PrimaryButton
                      onClick={() => {
                        submit(formDataList, formData, props.purchaseReportId);
                      }}
                    >
                      編集完了
                    </PrimaryButton>
                  </div>
                </>
              ) : (
                <>
                  <div className='mt-6 grid grid-cols-12 gap-4'>
                    <div className='col-span-1 grid' />
                    <div className='col-span-10 grid justify-items-center'>
                      {formDataList.length > 0 ? (
                        <div className='flex'>
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
                            <div className='flex'>
                              {activeStep === formDataList.length ? '詳細の編集へ' : '登録して次へ'}
                              <RiArrowDropRightLine size={23} />
                            </div>
                          </PrimaryButton>
                        </div>
                      ) : (
                        <div className='flex'>
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
                    <div className='col-span-1 grid' />
                  </div>
                </>
              )}
            </div>
            <div className='col-span-1 grid' />
          </div>
        </Modal>
      )}
    </>
  );
}
