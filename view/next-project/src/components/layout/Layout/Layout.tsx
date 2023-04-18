import React, { ReactNode } from 'react';

import s from './Layout.module.css';
import SponsorActivitiesAddModal from '@/components/sponsoractivities/SponsorActivitiesAddModal';
import SponsorAddModal from '@/components/sponsors/SponsorAddModal';
import PurchaseReportAddModal from '@components/purchasereports/AddModal';
import PurchaseOrderListModal from '@components/purchasereports/PurchaseOrderListModal';
import PurchaseReportItemNumModal from '@components/purchasereports/PurchaseReportItemNumModal';
import { useUI } from '@components/ui/context';

const ModalView: React.FC<{ modalView: string }> = ({ modalView }) => {
  return (
    <>
      {modalView === 'SPONSOR_ADD_MODAL' && <SponsorAddModal />}
      {modalView === 'PURCHASE_REPORT_ADD_MODAL' && <PurchaseReportAddModal />}
      {modalView === 'PURCHASE_ORDER_LIST_MODAL' && <PurchaseOrderListModal />}
      {modalView === 'PURCHASE_REPORT_ITEM_NUM_MODAL' && <PurchaseReportItemNumModal />}
      {modalView === 'SPONSOR_ACTIVITIES_ADD_MODAL' && <SponsorActivitiesAddModal />}
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
