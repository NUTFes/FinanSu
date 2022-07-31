import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { get } from '@api/api_methods';
import { put } from '@api/purchaseItem';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { PrimaryButton, OutlinePrimaryButton, CloseButton, Input, Modal, Stepper, Title } from '@components/common';

interface PurchaseReport {
  id: number;
  user_id: number;
  purchase_order_id: number;
  created_at: string;
  updated_at: string;
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
  const [formDataList, setFormDataList] = useState<PurchaseItem[]>([{
    id: 1,
    item: '',
    price: '',
    quantity: '',
    detail: '',
    url: '',
    purchaseOrderId: 1,
    finance_check: false,
  }]);

  useEffect(() => {
    if (router.isReady) {
      const getPurchaseOrderViewUrl = process.env.CSR_API_URI + '/get_purchasereports_for_view/' + props.purchaseReportId;

      // purchase_orderに紐づくpurchase_itemsを取得
      const getPurchaseItems = async (url: string) => {
        const purchaseOrderViewRes: PurchaseRecordView = await get(url)
        console.log(props.purchaseReportId, purchaseOrderViewRes)
        let initFormDataList = [];
        for (let i = 0; i < purchaseOrderViewRes.purchaseitems.length; i++) {
          if (purchaseOrderViewRes.purchaseitems[i].finance_check) {
            let initFormData: PurchaseItem = {
              id: purchaseOrderViewRes.purchaseitems[i].id,
              item: purchaseOrderViewRes.purchaseitems[i].item,
              price: purchaseOrderViewRes.purchaseitems[i].price,
              quantity: purchaseOrderViewRes.purchaseitems[i].quantity,
              detail: purchaseOrderViewRes.purchaseitems[i].detail,
              url: purchaseOrderViewRes.purchaseitems[i].url,
              purchaseOrderId: purchaseOrderViewRes.purchaseorder.id,
              finance_check: purchaseOrderViewRes.purchaseitems[i].finance_check,
            };
            initFormDataList.push(initFormData);
          }
        }
        setFormDataList(initFormDataList)
      };
      getPurchaseItems(getPurchaseOrderViewUrl);
    }
  }, [router]);

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
                          <OutlinePrimaryButton onClick={prevStep} className={'mx-2'}>
                            戻る
                          </OutlinePrimaryButton>
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
