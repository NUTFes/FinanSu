import React, { ReactNode } from 'react';

import SponsorStyleNumModal from '@/components/sponsorstyles/SponsorStyleNumModal';
import PurchaseItemNumModal from '@components/purchaseorders/PurchaseItemNumModal';
import PurchaseReportAddModal from '@components/purchasereports/AddModal';
import PurchaseOrderListModal from '@components/purchasereports/PurchaseOrderListModal';
import PurchaseReportItemNumModal from '@components/purchasereports/PurchaseReportItemNumModal';
import { useUI } from '@components/ui/context';

import s from './Layout.module.css';


const ModalView: React.FC<{ modalView: string }> = ({ modalView }) => {
  return (
    <>
      {modalView === 'PURCHASE_ITEM_NUM_MODAL' && <PurchaseItemNumModal />}
      {modalView === 'PURCHASE_REPORT_ADD_MODAL' && <PurchaseReportAddModal />}
      {modalView === 'PURCHASE_ORDER_LIST_MODAL' && <PurchaseOrderListModal />}
      {modalView === 'PURCHASE_REPORT_ITEM_NUM_MODAL' && <PurchaseReportItemNumModal />}
      {modalView === 'SPONSOR_STYLE_NUM_MODAL' && <SponsorStyleNumModal />}
    </>
  );
};

const ModalUI: React.FC = () => {
  const { displayModal, modalView } = useUI();
  return displayModal ? <ModalView modalView={modalView} /> : null;
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={s.root}>
      <main>{children}</main>
      <ModalUI />
    </div>
  );
};

export default Layout;
