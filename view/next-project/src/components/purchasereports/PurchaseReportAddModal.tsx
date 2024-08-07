import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { get, post } from '@api/api_methods';
import { post as postItem, put } from '@api/purchaseItem';
import { post as postOrder } from '@api/purchaseOrder';
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
  purchaseOrderId?: number;
  purchaseItemNum: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isOnlyReported: boolean;
  purchaseOrder?: PurchaseOrder;
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
    buyer: '',
    purchaseOrderID: props.purchaseOrderId || 0,
  });

  // 購入物品のリスト
  const [formDataList, setFormDataList] = useState<PurchaseItem[]>([]);
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
          purchaseOrderID: props.purchaseOrderId || 0,
          financeCheck: purchaseOrderViewRes.purchaseItem[i].financeCheck,
          createdAt: purchaseOrderViewRes.purchaseItem[i].createdAt,
          updatedAt: purchaseOrderViewRes.purchaseItem[i].updatedAt,
        };
        initFormDataList.push(initFormData);
      }
      setFormDataList(initFormDataList);
    }
  }, [props.purchaseOrderId, setFormDataList]);

  // 購入申請から登録の際に実行
  const createNonePurchaseItems = () => {
    const initFormDataList = [];
    for (let i = 0; i < props.purchaseItemNum; i++) {
      const initFormData: PurchaseItem = {
        id: i + 1,
        item: '',
        price: 0,
        quantity: 0,
        detail: '',
        url: '',
        purchaseOrderID: 0,
        financeCheck: false,
        createdAt: '',
        updatedAt: '',
      };
      initFormDataList.push(initFormData);
    }
    setFormDataList(initFormDataList);
  };
  useEffect(() => {
    if (router.isReady) {
      // 購入申請を新しく作成したかどうかで判断
      props.purchaseOrder ? createNonePurchaseItems() : getPurchaseItems();
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
    const { id, userID, discount, addition, purchaseOrderID, ...rest } = formData;
    const submitData: PurchaseReport = {
      id: Number(id),
      userID: Number(userID),
      discount: Number(discount),
      addition: Number(addition),
      purchaseOrderID: Number(purchaseOrderID),
      ...rest,
    };
    if (props.purchaseOrder) {
      //購入申請と物品を登録してから報告の登録
      const purchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
      const postRes = await postOrder(purchaseOrderUrl, props.purchaseOrder);
      formDataList.map(async (item) => {
        const itemData = { ...item, purchaseOrderID: postRes.id || 0 };
        const updatePurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
        await postItem(updatePurchaseItemUrl, itemData);
      });
      const submitFormData: PurchaseReport = {
        ...submitData,
        purchaseOrderID: postRes.id || Number(purchaseOrderID),
      };
      const postReportRes = await post(purchaseReportUrl, submitFormData);
      setPurchaseReportId(postReportRes.id);
    } else {
      //報告の登録
      const postReportRes = await post(purchaseReportUrl, submitData);
      setPurchaseReportId(postReportRes.id);
    }
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
      <div className='mx-auto my-6 grid w-9/10 grid-cols-5 gap-4'>
        <p className='text-black-600'>物品名</p>
        <div className='col-span-4 w-full'>
          <Input
            className='w-full'
            id={String(data?.id)}
            value={data?.item}
            onChange={formDataListHandler('item')}
          />
        </div>
        <p className='text-black-600'>単価</p>
        <div className='col-span-4 w-full'>
          <Input
            type='number'
            className='w-full'
            id={String(data?.id)}
            value={data?.price}
            onChange={formDataListHandler('price')}
          />
        </div>
        <p className='text-black-600'>個数</p>
        <div className='col-span-4 w-full'>
          <Input
            type='number'
            className='w-full'
            id={String(data?.id)}
            value={data?.quantity}
            onChange={formDataListHandler('quantity')}
          />
        </div>
        <p className='text-black-600'>詳細</p>
        <div className='col-span-4 w-full'>
          <Input
            className='w-full'
            id={String(data?.id)}
            value={data?.detail}
            onChange={formDataListHandler('detail')}
          />
        </div>
        <p className='text-black-600'>URL</p>
        <div className='col-span-4 w-full'>
          <Input
            className='w-full'
            id={String(data?.id)}
            value={data?.url}
            onChange={formDataListHandler('url')}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      {props.isOpen && (
        <Modal className='md:w-1/2'>
          <div className='ml-auto w-fit'>
            <CloseButton
              onClick={() => {
                props.setIsOpen(false);
              }}
            />
          </div>
          <div className='mx-auto mb-10 w-fit text-xl text-black-600'>購入物品の登録</div>
          <Stepper stepNum={props.purchaseItemNum} activeStep={activeStep} isDone={isDone}>
            {!isDone && <>{content(formDataList[activeStep - 1])}</>}
          </Stepper>
          {isDone ? (
            <>
              <div className='mx-auto mb-10 mt-3 grid w-9/10 grid-cols-5 items-center justify-items-center gap-4'>
                <p className='text-black-600'>割引</p>
                <div className='col-span-4 w-full'>
                  <Input
                    className='w-full'
                    value={formData.discount}
                    onChange={formDataHandler('discount')}
                  />
                </div>
                <p className='text-black-600'>加算</p>
                <div className='col-span-4 w-full'>
                  <Input
                    className='w-full'
                    value={formData.addition}
                    onChange={formDataHandler('addition')}
                  />
                </div>
                <p className='text-black-600'>購入者</p>
                <div className='col-span-4 w-full'>
                  <Input
                    className='w-full'
                    value={formData.buyer}
                    onChange={formDataHandler('buyer')}
                  />
                </div>
                <p className='text-black-600'>備考</p>
                <div className='col-span-4 w-full'>
                  <Textarea
                    className='w-full'
                    value={formData.remark}
                    onChange={formDataHandler('remark')}
                  />
                </div>
              </div>
              <div className='grid justify-items-center'>
                <div className='flex flex-row gap-4'>
                  <OutlinePrimaryButton onClick={reset}>戻る</OutlinePrimaryButton>
                  <PrimaryButton
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
              <div className='flex flex-col items-center gap-5'>
                <div className='flex flex-row gap-4'>
                  {/* stepが1より大きい時のみ戻るボタンを表示 */}
                  {activeStep > 1 && (
                    <OutlinePrimaryButton onClick={prevStep}>戻る</OutlinePrimaryButton>
                  )}
                  <PrimaryButton
                    onClick={() => {
                      {
                        activeStep === steps.length ? setIsDone(true) : nextStep();
                      }
                      isFinanceCheckHandler(formDataList[activeStep - 1].id, true);
                    }}
                    disabled={formDataList[activeStep - 1]?.item.trim() === ''}
                  >
                    <div className='flex'>
                      {activeStep === steps.length
                        ? '購入物品として登録して確認へ'
                        : '購入物品として登録して次へ'}
                      <RiArrowDropRightLine size={23} />
                    </div>
                  </PrimaryButton>
                </div>
                {!props.isOnlyReported && (
                  <div className='col-span-12 grid w-full justify-items-center'>
                    <UnderlinePrimaryButton
                      className={'pr-1'}
                      onClick={() => {
                        {
                          activeStep === steps.length ? setIsDone(true) : nextStep();
                        }
                        isFinanceCheckHandler(formDataList[activeStep - 1].id, false);
                      }}
                    >
                      {activeStep === steps.length
                        ? '購入しなかった物品として登録して確認へ'
                        : '購入しなかった物品として登録して次へ'}
                      <RiArrowDropRightLine size={23} />
                    </UnderlinePrimaryButton>
                  </div>
                )}
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
