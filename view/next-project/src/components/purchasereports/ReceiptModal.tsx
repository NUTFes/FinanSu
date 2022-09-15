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

  const onClose = () => {
    props.setIsOpen(false);
  };

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 grid w-full justify-items-end')}>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
        レシートの処理
      </div>
      <div className={clsx('mb-4 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-1 grid')} />
        <div className={clsx('col-span-10 grid')}>
          <div className={clsx('h-100 w-full text-center text-base text-black-300')}>
            お疲れ様でした。
            <br />
            レシートの裏面に以下のIDを書いて所定の場所に保管してください。
            <br />
            購入の仕方によってはIDが二つ書かれることにかりますが問題ありません。
          </div>
          <div className={clsx('h-100 my-6 w-full text-center text-5xl font-bold text-black-300')}>
            ID: {props.purchaseReportId}
          </div>
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
                  onClose();
                  router.reload();
                }}
              >
                終了する
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div className={clsx('h-100 col-span-1 grid')} />
      </div>
    </Modal>
  );
}
