import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

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
import { PurchaseItem, PurchaseOrder, PurchaseReport, User } from '@type/common';
import { userAtom } from 'src/store/atoms';

interface PurchaseRecordView {
  purchasereport: PurchaseReport;
  purchaseorder: PurchaseOrder;
  order_user: User;
  report_user: User;
  purchaseitems: PurchaseItem[];
}

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
      process.env.CSR_API_URI + '/get_purchasereports_for_view/' + props.purchaseReportId;

    const purchaseOrderViewRes: PurchaseRecordView = await get(getPurchaseOrderViewURL);
    const initFormDataList = [];
    for (let i = 0; i < purchaseOrderViewRes.purchaseitems.length; i++) {
      if (purchaseOrderViewRes.purchaseitems[i].financeCheck) {
        const initFormData: PurchaseItem = {
          id: purchaseOrderViewRes.purchaseitems[i].id,
          item: purchaseOrderViewRes.purchaseitems[i].item,
          price: purchaseOrderViewRes.purchaseitems[i].price,
          quantity: purchaseOrderViewRes.purchaseitems[i].quantity,
          detail: purchaseOrderViewRes.purchaseitems[i].detail,
          url: purchaseOrderViewRes.purchaseitems[i].url,
          purchaseOrderID: purchaseOrderViewRes.purchaseorder.id
            ? purchaseOrderViewRes.purchaseorder.id
            : 0,
          financeCheck: purchaseOrderViewRes.purchaseitems[i].financeCheck,
          createdAt: purchaseOrderViewRes.purchaseitems[i].createdAt,
          updatedAt: purchaseOrderViewRes.purchaseitems[i].updatedAt,
        };
        initFormDataList.push(initFormData);
      }
    }
    setFormData(purchaseOrderViewRes.purchasereport);
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
    await putPurchaseReport(updatePurchaseReportUrl, data);
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
    <div className={clsx('my-6 grid grid-cols-12 gap-4')}>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>物品名</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.item} onChange={formDataListHandler('item')} />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>単価</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.price} onChange={formDataListHandler('price')} />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>個数</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input
          id={String(data.id)}
          value={data.quantity}
          onChange={formDataListHandler('quantity')}
        />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>詳細</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.detail} onChange={formDataListHandler('detail')} />
      </div>
      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
        <div className={clsx('text-md flex items-center text-black-600')}>URL</div>
      </div>
      <div className={clsx('col-span-10 grid w-full')}>
        <Input id={String(data.id)} value={data.url} onChange={formDataListHandler('url')} />
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
                    <div className={clsx('mb-6 grid w-full grid-cols-12 gap-4')}>
                      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
                        <div className={clsx('text-md flex items-center text-black-600')}>割引</div>
                      </div>
                      <div className={clsx('col-span-10 grid w-full')}>
                        <Input value={formData.discount} onChange={formDataHandler('discount')} />
                      </div>
                      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
                        <div className={clsx('text-md flex items-center text-black-600')}>加算</div>
                      </div>
                      <div className={clsx('col-span-10 grid w-full')}>
                        <Input value={formData.addition} onChange={formDataHandler('addition')} />
                      </div>
                      <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
                        <div className={clsx('text-md flex items-center text-black-600')}>備考</div>
                      </div>
                      <div className={clsx('col-span-10 grid w-full')}>
                        <Textarea value={formData.remark} onChange={formDataHandler('remark')} />
                      </div>
                    </div>
                    <div className={clsx('flex')}>
                      <OutlinePrimaryButton onClick={reset} className={'mx-2'}>
                        戻る
                      </OutlinePrimaryButton>
                      <PrimaryButton
                        className={'mx-2'}
                        onClick={() => {
                          submit(formDataList, formData, props.purchaseReportId);
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
