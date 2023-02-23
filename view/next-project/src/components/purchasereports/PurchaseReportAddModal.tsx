import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { put } from '@api/purchaseItem';
import { post } from '@api/purchaseReport';
import {
  CloseButton,
  Input,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Stepper,
  Textarea,
  UnderlinePrimaryButton,
} from '@components/common';
import PurchaseReportConfirmModal from '@components/purchasereports/PurchaseReportConfirmModal';
import { PurchaseItem, PurchaseOrder, PurchaseReport, User } from '@type/common';

interface PurchaseOrderView {
  purchaseOrder: PurchaseOrder;
  user: User;
  purchaseItem: PurchaseItem[];
}

interface ModalProps {
  purchaseOrderId: number;
  purchaseItemNum: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isOnlyReported: boolean;
}

export default function PurchaseReportAddModal(props: ModalProps) {
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

  // 購入報告追加モーダルの開閉状態を管理
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = () => {
    setIsOpen(true);
  };

  // 購入物品数だけステップを用意
  const steps = [];
  for (let i = 0; i < props.purchaseItemNum; i++) {
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
    purchaseOrderID: props.purchaseOrderId,
    createdAt: '',
    updatedAt: '',
  });
  // 購入物品のリスト
  const [formDataList, setFormDataList] = useState<PurchaseItem[]>(() => {
    const initFormDataList = [];
    for (let i = 0; i < props.purchaseItemNum; i++) {
      const initFormData: PurchaseItem = {
        id: i + 1,
        item: '',
        price: 0,
        quantity: 0,
        detail: '',
        url: '',
        purchaseOrderID: props.purchaseOrderId,
        financeCheck: false,
        createdAt: '',
        updatedAt: '',
      };
      initFormDataList.push(initFormData);
    }
    return initFormDataList;
  });
  const [purchaseReportId, setPurchaseReportId] = useState<number>(1);

  // purchase_orderに紐づくpurchase_itemsを取得
  const getPurchaseItems = useCallback(async () => {
    const getPurchaseOrderViewURL =
      process.env.CSR_API_URI + '/purchaseorders/' + props.purchaseOrderId + '/details';

    const purchaseOrderViewRes: PurchaseOrderView = await get(getPurchaseOrderViewURL);
    const initFormDataList = [];
    if (purchaseOrderViewRes.purchaseItem !== null) {
      for (let i = 0; i < purchaseOrderViewRes.purchaseItem.length; i++) {
        const initFormData: PurchaseItem = {
          id: purchaseOrderViewRes.purchaseItem[i].id,
          item: purchaseOrderViewRes.purchaseItem[i].item,
          price: purchaseOrderViewRes.purchaseItem[i].price,
          quantity: purchaseOrderViewRes.purchaseItem[i].quantity,
          detail: purchaseOrderViewRes.purchaseItem[i].detail,
          url: purchaseOrderViewRes.purchaseItem[i].url,
          purchaseOrderID: props.purchaseOrderId,
          financeCheck: purchaseOrderViewRes.purchaseItem[i].financeCheck,
          createdAt: purchaseOrderViewRes.purchaseItem[i].createdAt,
          updatedAt: purchaseOrderViewRes.purchaseItem[i].updatedAt,
        };
        initFormDataList.push(initFormData);
      }
      setFormDataList(initFormDataList);
    }
  }, [props.purchaseOrderId, setFormDataList]);

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
  const submit = (data: PurchaseItem[]) => {
    addPurchaseReport();
    updatePurchaseItem(data);
    onOpen();
  };

  // 購入報告の追加
  const addPurchaseReport = async () => {
    const purchaseReportUrl = process.env.CSR_API_URI + '/purchasereports';
    const postRes = await post(purchaseReportUrl, formData);
    setPurchaseReportId(postRes.id);
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
    <>
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
          <Input
            id={String(data.id)}
            value={data.detail}
            onChange={formDataListHandler('detail')}
          />
        </div>
        <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
          <div className={clsx('text-md flex items-center text-black-600')}>URL</div>
        </div>
        <div className={clsx('col-span-10 grid w-full')}>
          <Input id={String(data.id)} value={data.url} onChange={formDataListHandler('url')} />
        </div>
      </div>
    </>
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
            購入物品の登録
          </div>
          <div className={clsx('my-6 grid grid-cols-12 gap-4')}>
            <div className={clsx('col-span-1 grid')} />
            <div className={clsx('col-span-10 grid w-full')}>
              <Stepper stepNum={props.purchaseItemNum} activeStep={activeStep} isDone={isDone}>
                {!isDone && <>{content(formDataList[activeStep - 1])}</>}
              </Stepper>
              {isDone ? (
                <>
                  <div className={clsx('my-10 grid grid-cols-12 gap-4')}>
                    <div className={clsx('col-span-1 grid')} />
                    <div className={clsx('col-span-10 grid w-full justify-items-center')}>
                      <div className={clsx('my-6 grid w-full grid-cols-12 gap-4')}>
                        <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
                          <div className={clsx('text-md flex items-center text-black-600')}>
                            割引
                          </div>
                        </div>
                        <div className={clsx('col-span-10 grid w-full')}>
                          <Input value={formData.discount} onChange={formDataHandler('discount')} />
                        </div>
                        <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
                          <div className={clsx('text-md flex items-center text-black-600')}>
                            加算
                          </div>
                        </div>
                        <div className={clsx('col-span-10 grid w-full')}>
                          <Input value={formData.addition} onChange={formDataHandler('addition')} />
                        </div>
                        <div className={clsx('col-span-2 mr-2 grid justify-items-end')}>
                          <div className={clsx('text-md flex items-center text-black-600')}>
                            備考
                          </div>
                        </div>
                        <div className={clsx('col-span-10 grid w-full')}>
                          <Textarea value={formData.remark} onChange={formDataHandler('remark')} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={clsx('col-span-1 grid')} />
                  <div className={clsx('grid justify-items-center')}>
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
                        登録して確認
                      </PrimaryButton>
                      {isOpen && (
                        <PurchaseReportConfirmModal
                          purchaseReportId={purchaseReportId}
                          formDataList={formDataList}
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={clsx('mt-6 grid grid-cols-12 gap-4')}>
                    <div className={clsx('col-span-1 grid')} />
                    <div className={clsx('col-span-10 grid justify-items-center')}>
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
                              activeStep === steps.length ? setIsDone(true) : nextStep();
                            }
                            isFinanceCheckHandler(formDataList[activeStep - 1].id, true);
                          }}
                        >
                          <div className={clsx('flex')}>
                            {activeStep === steps.length ? '登録して確認' : '登録して次へ'}
                            <RiArrowDropRightLine size={23} />
                          </div>
                        </PrimaryButton>
                      </div>
                    </div>
                    <div className={clsx('col-span-1 grid')} />
                    {!props.isOnlyReported && (
                      <div className={clsx('col-span-12 grid w-full justify-items-center')}>
                        <UnderlinePrimaryButton
                          className={'pr-1'}
                          onClick={() => {
                            {
                              activeStep === steps.length ? setIsDone(true) : nextStep();
                            }
                            isFinanceCheckHandler(formDataList[activeStep - 1].id, false);
                          }}
                        >
                          {activeStep === steps.length ? '登録せずに確認' : '登録せずに次へ'}
                          <RiArrowDropRightLine size={23} />
                        </UnderlinePrimaryButton>
                      </div>
                    )}
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
