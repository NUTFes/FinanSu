import React, { useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri'
import { post } from '@api/purchaseItem';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { PrimaryButton, OutlinePrimaryButton, CloseButton, Input, Modal, Stepper, Tooltip } from '@components/common';
import { PurchaseItem } from '@pages/purchaseorders';

interface ModalProps {
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
  }

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

  // 購入物品テーブルのカラム
  const tableColumns = ['物品名', '単価', '個数', '備考', 'URL']

  // 購入物品の確認用テーブル
  const PurchaseItemTable = (purchaseItems: PurchaseItem[]) => {
    return (
      <table className={clsx('table-fixed border-collapse: collapse')}>
        <thead>
          <tr
            className={clsx('py-3 border-b-primary-1 border border-t-white-0 border-x-white-0')}
          >
            {tableColumns.map((tableColumn: string) => (
              <th className={clsx('px-6 pb-2 border-b-primary-1')}>
                <div className={clsx('text-center text-sm text-black-600')}>{tableColumn}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={clsx('border-b-primary-1 border border-t-white-0 border-x-white-0')}>
          {purchaseItems.map((purchaseItem, index) => (
            <tr key={purchaseItem.id}>
              <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                <div className={clsx('text-center text-sm text-black-300')} >
                  {purchaseItem.item}
                </div>
              </td>
              < td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                <div className={clsx('text-center text-sm text-black-300')}>
                  {purchaseItem.price}
                </div>
              </td>
              <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                <div className={clsx('text-center text-sm text-black-300')}>
                  {purchaseItem.quantity}
                </div>
              </td>
              <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                <div className={clsx('text-center text-sm text-black-300')}>
                  {purchaseItem.detail}
                </div>
              </td>
              <td className={clsx('px-4', (index === 0 ? 'pt-4 pb-3' : 'py-3'), (index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'py-3 border-b'))}>
                <div className={clsx('text-center text-sm text-black-300')}>
                  <div className={clsx('flex')}>
                    <a className={clsx('mx-1')} href={purchaseItem.url} target="_blank" rel="noopener noreferrer">
                      <RiExternalLinkLine size={'16px'} />
                    </a>
                    <Tooltip text={'copy URL'}>
                      <RiFileCopyLine className={clsx('mx-1')} size={'16px'}
                        onClick={() => {
                          navigator.clipboard.writeText(purchaseItem.url)
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </td>
            </tr>
          ))
          }
        </tbody >
      </table >
    )
  }


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
              <>
                <div className={clsx('grid justify-items-center w-full font-bold text-black-300 text-md h-100')}>
                  購入物品
                </div>
                <div className={clsx('grid justify-items-center mb-2 p-5 w-full')}>
                  {PurchaseItemTable(props.formDataList)}
                </div >
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
                          submit(props.formDataList)

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
                  <div className={clsx('grid grid-cols-12 gap-4 mt-6')}>
                    <div className={clsx('grid col-span-1')} />
                    <div className={clsx('grid col-span-10 justify-items-center')}>
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
                            { activeStep === steps.length ? setIsDone(true) : nextStep(); }
                          }}
                        >
                          <div className={clsx('flex')}>
                            {activeStep === steps.length ? '申請の確認' : '次へ'}
                            <RiArrowDropRightLine size={23} />
                          </div>
                        </PrimaryButton>
                      </div>
                    </div>
                    <div className={clsx('grid col-span-1')} />
                  </div>
                </>
            )}
          </div>
          <div className={clsx('grid col-span-1')}/>
        </div>
      </Modal>
    </>
  );
}
