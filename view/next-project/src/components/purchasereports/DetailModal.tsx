import React, { FC, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { Modal } from '@components/common';
import { PurchaseReportView, Expense } from '@type/common';
import DetailPage1 from './DetailPage1';
import DetailPage2 from './DetailPage2';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: number | string;
  purchaseReportViewItem: PurchaseReportView;
  expenses: Expense[];
  isDelete: boolean;
  year: string;
}

const DetailModal: FC<ModalProps> = (props) => {
  const { id, purchaseReportViewItem, expenses, isDelete, year } = props;
  const [pageNum, setPageNum] = useState<number>(1);

  const onClose = () => {
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
      </div>
      <div className='mx-auto mb-10 w-fit'>
        <p className='text-2xl text-black-600'>報告の詳細</p>
      </div>
      {pageNum === 1 && (
        <DetailPage1
          id={id}
          purchaseReportViewItem={purchaseReportViewItem}
          expenses={expenses}
          isDelete={isDelete}
          setPageNum={setPageNum}
        />
      )}
      {pageNum === 2 && (
        <DetailPage2
          id={purchaseReportViewItem.purchaseReport.id || 0}
          setPageNum={setPageNum}
          year={year}
        />
      )}
    </Modal>
  );
};

export default DetailModal;
