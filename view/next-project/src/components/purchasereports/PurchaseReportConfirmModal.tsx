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

  const tableColumns = ['物品名', '単価', '個数', '備考', 'URL'];

  // 購入報告した物品
  const reportedPurchaseItems = props.formDataList.filter((formData) => {
    return formData.financeCheck;
  });

  // 購入報告しない物品
  const notReportedPurchaseItems = props.formDataList.filter((formData) => {
    return !formData.financeCheck;
  });

  const PurchaseItemTable = (purchaseItems: PurchaseItem[]) => {
    return (
      <table className='table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
            {tableColumns.map((tableColumn: string) => (
              <th key={tableColumn} className='border-b-primary-1 px-6 pb-2'>
                <div className='text-center text-sm text-black-600'>{tableColumn}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
          {purchaseItems.map((purchaseItem, index) => (
            <tr key={purchaseItem.id}>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pb-3 pt-4' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>{purchaseItem.item}</div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pb-3 pt-4' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>{purchaseItem.price}</div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pb-3 pt-4' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>{purchaseItem.quantity}</div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pb-3 pt-4' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>{purchaseItem.detail}</div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pb-3 pt-4' : 'py-3',
                  index === purchaseItems.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>
                  <div className='flex'>
                    <a
                      className='mx-1'
                      href={purchaseItem.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <RiExternalLinkLine size={'16px'} />
                    </a>
                    <Tooltip text={'copy URL'}>
                      <RiFileCopyLine
                        className='mx-1'
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
      <div className='w-full'>
        <div className='mr-5 grid w-full justify-items-end'>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className='mb-10 grid w-full justify-items-center text-xl text-black-600'>購入申請</div>
      <div className='flex flex-col items-center gap-5'>
        <div className='mx-auto w-fit font-bold text-black-300'>購入物品</div>
        <div className='max-h-60 w-full overflow-scroll'>
          {PurchaseItemTable(reportedPurchaseItems)}
        </div>
        <div className='mx-auto w-fit font-bold text-black-300'>登録しなかった物品</div>
        {notReportedPurchaseItems.length === 0 ? (
          <div className='mx-auto w-fit text-black-300'>登録しなかった物品はありません</div>
        ) : (
          <>
            <div className='mx-auto w-fit font-bold text-black-300'>
              購入しなかったものとして処理します
            </div>
            <div className='w-full'>{PurchaseItemTable(notReportedPurchaseItems)}</div>
          </>
        )}
        <div className='flex justify-center'>
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
    </Modal>
  );
}
