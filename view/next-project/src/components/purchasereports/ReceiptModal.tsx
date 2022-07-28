import React from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Modal, PrimaryButton, CloseButton, Tooltip } from '@components/common';

interface ModalProps {
  purchaseReportId: number;
  isOpen: boolean;
  setIsOpen: Function;
}

export default function ReceiptModal(props: ModalProps) {
  const router = useRouter();

  const onClose = () => { props.setIsOpen(false) }

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 w-full grid justify-items-end')}>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className={clsx('grid justify-items-center w-full mb-10 text-black-600 text-xl')}>
        レシートの処理
      </div>
      <div className={clsx('grid grid-cols-12 gap-4 mb-4')}>
        <div className={clsx('grid col-span-1')} />
        <div className={clsx('grid col-span-10')}>
          <div className={clsx('text-center w-full text-black-300 text-base h-100')}>
            お疲れ様でした。<br />
            レシートの裏面に以下のIDを書いて所定の場所に保管してください。<br />
            購入の仕方によってはIDが二つ書かれることにかりますが問題ありません。
          </div>
          <div className={clsx('text-center my-6 w-full font-bold text-5xl text-black-300 h-100')}>
            ID: {props.purchaseReportId}
          </div>
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
                  onClose();
                  router.reload();
                }}
              >
                終了する
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div className={clsx('grid col-span-1 h-100')} />
      </div>
    </Modal >
  );
}
