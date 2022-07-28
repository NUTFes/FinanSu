import React from 'react';
import { useUI } from '@components/ui/context';
import s from './Layout.module.css';
import PurchaseItemNumModal from '@components/purchaseorders/PurchaseItemNumModal';
import PurchaseReportAddModal from '@components/purchasereports/AddModal';
import PurchaseOrderListModal from '@components/purchasereports/PurchaseOrderListModal';
import PurchaseReportItemNumModal from '@components/purchasereports/PurchaseReportItemNumModal';

const ModalView: React.FC<{ modalView: string; closeModal(): any }> = ({ modalView, closeModal }) => {
  return (
    <>
      {modalView === 'PURCHASE_ITEM_NUM_MODAL' && (
        <PurchaseItemNumModal />
      )}
      {modalView === 'PURCHASE_REPORT_ADD_MODAL' && (
        <PurchaseReportAddModal />
      )}
      {modalView === 'PURCHASE_ORDER_LIST_MODAL' && (
        <PurchaseOrderListModal />
      )}
      {modalView === 'PURCHASE_REPORT_ITEM_NUM_MODAL' && (
        <PurchaseReportItemNumModal />
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
