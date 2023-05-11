import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';
import { RiArrowDropRightLine } from 'react-icons/ri';

import { del } from '@api/api_methods';
import { post } from '@api/purchaseItem';
import {
  PrimaryButton,
  OutlinePrimaryButton,
  CloseButton,
  Input,
  Modal,
  Stepper,
  Tooltip,
  Select,
} from '@components/common';
import { PurchaseItem, Source } from '@type/common';

interface ModalProps {
  purchaseItemNum: PurchaseItemNum;
  isOpen: boolean;
  numModalOnClose: () => void;
  onClose: () => void;
  setFormDataList: (formDataList: PurchaseItem[]) => void;
  formDataList: PurchaseItem[];
  sources: Source[];
}

interface PurchaseItemNum {
  value: number;
}

export default function AddModal(props: ModalProps) {
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

  const [isDone, setIsDone] = useState<boolean>(false);
  const router = useRouter();

  const deletePurchaseOrder = async () => {
    const deletePurchaseOrderUrl =
      process.env.CSR_API_URI + '/purchaseorders/' + props.formDataList[0].purchaseOrderID;
    await del(deletePurchaseOrderUrl);
  };

  const handler =
    (stepNumber: number, input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      props.setFormDataList(
        props.formDataList.map((formData: PurchaseItem) =>
          formData.id === stepNumber ? { ...formData, [input]: e.target.value } : formData,
        ),
      );
    };

  const addPurchaseItem = async (data: PurchaseItem[]) => {
    const addPurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
    data.map(async (item) => {
      await post(addPurchaseItemUrl, item);
    });
  };

  const submit = async (formDataList: PurchaseItem[]) => {
    addPurchaseItem(formDataList);
    props.onClose();
    props.numModalOnClose();
    router.reload();
  };

  // 購入物品の情報
  const content = (index: number, data: PurchaseItem) => (
    <>
      <div className={clsx('my-6 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-2 mr-2 grid')}>
          <div className={clsx('text-md flex grid items-center justify-items-end text-black-600')}>
            物品名
          </div>
        </div>
        <div className={clsx('col-span-10 grid w-full')}>
          <Input value={data.item} onChange={handler(index, 'item')} />
        </div>
        <div className={clsx('col-span-2 mr-2 grid')}>
          <div className={clsx('text-md flex grid items-center justify-items-end text-black-600')}>
            単価
          </div>
        </div>
        <div className={clsx('col-span-10 grid w-full')}>
          <Input type='number' value={data.price} onChange={handler(index, 'price')} />
        </div>
        <div className={clsx('col-span-2 mr-2 grid')}>
          <div className={clsx('text-md flex grid items-center justify-items-end text-black-600')}>
            個数
          </div>
        </div>
        <div className={clsx('col-span-10 grid w-full')}>
          <Input type='number' value={data.quantity} onChange={handler(index, 'quantity')} />
        </div>
        <div className={clsx('col-span-2 mr-2 grid')}>
          <div className={clsx('text-md flex grid items-center justify-items-end text-black-600')}>
            収入源
          </div>
        </div>
        <div className='col-span-10 w-full'>
          <Select value={data.sourceID} onChange={handler(index, 'sourceID')} className='w-full'>
            {props.sources.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </Select>
        </div>
        <div className={clsx('col-span-2 mr-2 grid')}>
          <div className={clsx('text-md flex grid items-center justify-items-end text-black-600')}>
            詳細
          </div>
        </div>
        <div className={clsx('col-span-10 grid w-full')}>
          <Input value={data.detail} onChange={handler(index, 'detail')} />
        </div>
        <div className={clsx('col-span-2 mr-2 grid')}>
          <div className={clsx('text-md flex grid items-center justify-items-end text-black-600')}>
            URL
          </div>
        </div>
        <div className={clsx('col-span-10 grid w-full')}>
          <Input value={data.url} onChange={handler(index, 'url')} />
        </div>
      </div>
    </>
  );

  // 購入物品テーブルのカラム
  const tableColumns = ['物品名', '単価', '個数', '収入源', '備考', 'URL'];

  // 購入物品の確認用テーブル
  const PurchaseItemTable = (purchaseItems: PurchaseItem[]) => {
    return (
      <table className={clsx('table-fixed border-collapse')}>
        <thead>
          <tr className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0 py-3')}>
            {tableColumns.map((tableColumn: string) => (
              <th key={tableColumn} className={clsx('border-b-primary-1 px-6 pb-2')}>
                <div className={clsx('text-center text-sm text-black-600')}>{tableColumn}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0')}>
          {purchaseItems.map((purchaseItem, index) => (
            <tr key={purchaseItem.id}>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className={clsx('text-center text-sm text-black-300')}>
                  {purchaseItem.item}
                </div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className={clsx('text-center text-sm text-black-300')}>
                  {purchaseItem.price}
                </div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className={clsx('text-center text-sm text-black-300')}>
                  {purchaseItem.quantity}
                </div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className={clsx('text-center text-sm text-black-300')}>
                  {props.sources.find((source) => source.id === purchaseItem.sourceID)?.name}
                </div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className={clsx('text-center text-sm text-black-300')}>
                  {purchaseItem.detail}
                </div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className={clsx('text-center text-sm text-black-300')}>
                  <div className={clsx('flex')}>
                    <a
                      className={clsx('mx-1')}
                      href={purchaseItem.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <RiExternalLinkLine size={'16px'} />
                    </a>
                    <Tooltip text={'copy URL'}>
                      <RiFileCopyLine
                        className={clsx('mx-1')}
                        size={'16px'}
                        onClick={() => {
                          navigator.clipboard.writeText(purchaseItem.url);
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 購入物品数だけステップを用意
  const steps = [];
  for (let i = 0; i < props.purchaseItemNum.value; i++) {
    steps.push({ label: '' });
  }

  return (
    <>
      <Modal className='!w-1/2'>
        <div className={clsx('w-full')}>
          <div className={clsx('mr-5 grid w-full justify-items-end')}>
            <CloseButton
              onClick={() => {
                deletePurchaseOrder();
                props.onClose();
                props.numModalOnClose();
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
            <Stepper stepNum={props.purchaseItemNum.value} activeStep={activeStep} isDone={isDone}>
              {!isDone && <>{content(activeStep, props.formDataList[activeStep - 1])}</>}
            </Stepper>
            {isDone ? (
              <>
                <div
                  className={clsx(
                    'text-md h-100 grid w-full justify-items-center font-bold text-black-300',
                  )}
                >
                  購入物品
                </div>
                <div className={clsx('mb-2 grid w-full justify-items-center p-5')}>
                  {PurchaseItemTable(props.formDataList)}
                </div>
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
                          submit(props.formDataList);
                        }}
                      >
                        登録
                      </PrimaryButton>
                    </div>
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
                        }}
                      >
                        <div className={clsx('flex')}>
                          {activeStep === steps.length ? '申請の確認' : '次へ'}
                          <RiArrowDropRightLine size={23} />
                        </div>
                      </PrimaryButton>
                    </div>
                  </div>
                  <div className={clsx('col-span-1 grid')} />
                </div>
              </>
            )}
          </div>
          <div className={clsx('col-span-1 grid')} />
        </div>
      </Modal>
    </>
  );
}
