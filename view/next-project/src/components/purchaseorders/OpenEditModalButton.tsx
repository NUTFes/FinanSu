import React, { useState } from 'react';

import { CloseButton, EditButton, Modal, PrimaryButton } from '@components/common';
import EditModal from '@components/purchaseorders/EditModal';
import { Expense, PurchaseOrderView } from '@type/common';

import { DetailEditModal } from './DetailEditModal';

interface Props {
  children?: React.ReactNode;
  purchaseOrderViewItem: PurchaseOrderView;
  expenses: Expense[];
  id: number;
  isDisabled: boolean;
}

const InitialModal: React.FC<{ setStep: (step: string) => void; closeModal: () => void }> = ({
  setStep,
  closeModal,
}) => (
  <Modal className='md:w-1/2'>
    <div className='ml-auto w-fit'>
      <CloseButton onClick={closeModal} />
    </div>
    <div className='mx-auto mb-6 w-fit text-xl text-black-600'>
      <p>購入申請の修正</p>
    </div>
    <div className='flex justify-center gap-2 pb-4'>
      <PrimaryButton onClick={() => setStep('editDetails')}>局と期限日を編集</PrimaryButton>
      <PrimaryButton onClick={() => setStep('editPurchases')}>購入物品を編集</PrimaryButton>
    </div>
  </Modal>
);

const OpenEditModalButton: React.FC<Props> = (props) => {
  const [step, setStep] = useState<string | null>(null);

  const onOpenInitial = () => {
    setStep('initial');
  };

  const closeModal = () => {
    setStep(null);
  };

  return (
    <>
      <EditButton onClick={onOpenInitial} isDisabled={props.isDisabled} />
      {step === 'initial' && <InitialModal setStep={setStep} closeModal={closeModal} />}
      {step === 'editDetails' && (
        <DetailEditModal
          purchaseOrderId={props.id}
          purchaseOrderViewItem={props.purchaseOrderViewItem}
          expenses={props.expenses}
          isOpen={true}
          setIsOpen={closeModal}
          onOpenInitial={onOpenInitial}
        />
      )}
      {step === 'editPurchases' && (
        <EditModal
          purchaseOrderId={props.id}
          isOpen={true}
          setIsOpen={closeModal}
          purchaseItems={props.purchaseOrderViewItem.purchaseItem}
          onOpenInitial={onOpenInitial}
        />
      )}
    </>
  );
};

export default OpenEditModalButton;
