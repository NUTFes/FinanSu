import React from 'react';
import { useUI } from '@components/ui/context';
import s from './Layout.module.css';
import PurchaseItemNumModal from '@components/purchaseorders/PurchaseItemNumModal';

const ModalView: React.FC<{ modalView: string; closeModal(): any }> = ({ modalView, closeModal }) => {
  return (
    <>
      {modalView === 'PURCHASE_ITEM_NUM_MODAL' && (
        <PurchaseItemNumModal />
      )}
    </>
  );
};

const ModalUI: React.FC = () => {
  const { displayModal, closeModal, modalView } = useUI();
  return displayModal ? <ModalView modalView={modalView} closeModal={closeModal} /> : null;
};

const Layout: React.FC<{ children: any }> = ({ children }) => {
  return (
    <div className={s.root}>
      <main>{children}</main>
      <ModalUI />
    </div>
  );
};

export default Layout;
