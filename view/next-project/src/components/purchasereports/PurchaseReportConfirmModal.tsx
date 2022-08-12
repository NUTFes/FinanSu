import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri'
import { Modal, PrimaryButton, CloseButton, Tooltip } from '@components/common';
import { PurchaseItem } from '@pages/purchasereports';
import ReceiptModal from '@components/purchasereports/ReceiptModal'

interface ModalProps {
  purchaseReportId: number;
  formDataList: PurchaseItem[];
  isOpen: boolean;
  setIsOpen: Function;
}

export default function PurchaseItemNumModal(props: ModalProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = () => { setIsOpen(true) }
  const onClose = () => { props.setIsOpen(false) }

  // 購入報告した物品
  const [reportedPurchaseItems, setReportedPurchaseItems] = useState<PurchaseItem[]>([])
  // 購入報告しない物品
  const [notReportedPurchaseItems, setNotReportedPurchaseItems] = useState<PurchaseItem[]>([])

  const tableColumns = ['物品名', '単価', '個数', '備考', 'URL']

  useEffect(() => {
    if (router.isReady) {
      // 購入報告する物品と報告しない物品を仕分け
      props.formDataList.map((formData: PurchaseItem) => {
        if (formData.finance_check) {
          setReportedPurchaseItems((reportedPurchaseItem) => [...reportedPurchaseItem, formData]);
        } else {
          setNotReportedPurchaseItems((notReportedPurchaseItem) => [...notReportedPurchaseItem, formData]);
        }
      })
    }
  }, [router]);

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

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 w-full grid justify-items-end')}>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
        購入申請
      </div>
      <div className={clsx('grid grid-cols-12 gap-4 mb-4')}>
        <div className={clsx('grid col-span-1')} />
        <div className={clsx('grid col-span-10')}>
          <div className={clsx('grid justify-items-center w-full font-bold text-black-300 text-md h-100')}>
            購入物品
          </div>
          <div className={clsx('mb-2 p-5 w-100')}>
            {PurchaseItemTable(reportedPurchaseItems)}
          </div >
          <div className={clsx('grid justify-items-center w-full font-bold text-black-300 text-md h-100')}>
            登録しなかった物品
          </div>
          {notReportedPurchaseItems.length === 0 ? (
            <div className={clsx('grid justify-items-center w-full text-black-300 text-md h-100')}>
              登録しなかった物品はありません
            </div>
          ) : (
            <>
              <div className={clsx('grid justify-items-center w-full text-black-300 text-md h-100')}>
                購入しなかったものとして処理します
              </div>
              <div className={clsx('mb-2 p-5 w-100')}>
                {PurchaseItemTable(notReportedPurchaseItems)}
              </div >
            </>
          )}
        </div >
        <div className={clsx('grid col-span-1 ')} />
      </div >
      <div className={clsx('grid grid-cols-12 w-full pb-5')}>
        <div className={clsx('grid col-span-1 h-100')} />
        <div className={clsx('grid col-span-10 justify-items-center w-full text-black-600 text-md pr-3 h-100')}>
          <div className={clsx('flex')}>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  onOpen();
                }}
              >
                確認を終了
              </PrimaryButton>
              {isOpen && <ReceiptModal purchaseReportId={props.purchaseReportId} isOpen={isOpen} setIsOpen={setIsOpen} />}
            </div>
          </div>
        </div>
        <div className={clsx('grid col-span-1 h-100')} />
      </div>
      <div className={clsx('grid justify-items-center px-1')}>
      </div>
    </Modal >
  );
}
