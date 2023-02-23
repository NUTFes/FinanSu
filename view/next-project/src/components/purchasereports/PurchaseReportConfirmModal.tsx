import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback } from 'react';
import { RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';

import { Modal, PrimaryButton, CloseButton, Tooltip } from '@components/common';
import ReceiptModal from '@components/purchasereports/ReceiptModal';
import { PurchaseItem } from '@type/common';

interface ModalProps {
  purchaseReportId: number;
  formDataList: PurchaseItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function PurchaseItemNumModal(props: ModalProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    props.setIsOpen(false);
  };

  // 購入報告した物品
  const [reportedPurchaseItems, setReportedPurchaseItems] = useState<PurchaseItem[]>([]);
  // 購入報告しない物品
  const [notReportedPurchaseItems, setNotReportedPurchaseItems] = useState<PurchaseItem[]>([]);

  const tableColumns = ['物品名', '単価', '個数', '備考', 'URL'];

  // 購入報告する物品と報告しない物品を仕分け
  const judgeItems = useCallback(() => {
    props.formDataList.map((formData: PurchaseItem) => {
      if (formData.financeCheck) {
        setReportedPurchaseItems((reportedPurchaseItem) => [...reportedPurchaseItem, formData]);
      } else {
        setNotReportedPurchaseItems((notReportedPurchaseItem) => [
          ...notReportedPurchaseItem,
          formData,
        ]);
      }
    });
  }, [
    props.formDataList,
    setReportedPurchaseItems,
    setNotReportedPurchaseItems,
  ]);

  useEffect(() => {
    console.log(reportedPurchaseItems)
    console.log(notReportedPurchaseItems)
  }, [reportedPurchaseItems, notReportedPurchaseItems])

  useEffect(() => {
    if (router.isReady) {
      judgeItems();
    }
  }, [router, judgeItems]);

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

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 grid w-full justify-items-end')}>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
        購入申請
      </div>
      <div className={clsx('mb-4 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-1 grid')} />
        <div className={clsx('col-span-10 grid')}>
          <div
            className={clsx(
              'text-md h-100 grid w-full justify-items-center font-bold text-black-300',
            )}
          >
            購入物品
          </div>
          <div className={clsx('w-100 mb-2 p-5')}>{PurchaseItemTable(reportedPurchaseItems)}</div>
          <div
            className={clsx(
              'text-md h-100 grid w-full justify-items-center font-bold text-black-300',
            )}
          >
            登録しなかった物品
          </div>
          {notReportedPurchaseItems.length === 0 ? (
            <div className={clsx('text-md h-100 grid w-full justify-items-center text-black-300')}>
              登録しなかった物品はありません
            </div>
          ) : (
            <>
              <div
                className={clsx('text-md h-100 grid w-full justify-items-center text-black-300')}
              >
                購入しなかったものとして処理します
              </div>
              <div className={clsx('w-100 mb-2 p-5')}>
                {PurchaseItemTable(notReportedPurchaseItems)}
              </div>
            </>
          )}
        </div>
        <div className={clsx('col-span-1 grid ')} />
      </div>
      <div className={clsx('grid w-full grid-cols-12 pb-5')}>
        <div className={clsx('h-100 col-span-1 grid')} />
        <div
          className={clsx(
            'text-md h-100 col-span-10 grid w-full justify-items-center pr-3 text-black-600',
          )}
        >
          <div className={clsx('flex')}>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  onOpen();
                }}
              >
                確認を終了
              </PrimaryButton>
              {isOpen && (
                <ReceiptModal
                  purchaseReportId={props.purchaseReportId}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              )}
            </div>
          </div>
        </div>
        <div className={clsx('h-100 col-span-1 grid')} />
      </div>
      <div className={clsx('grid justify-items-center px-1')}></div>
    </Modal>
  );
}
