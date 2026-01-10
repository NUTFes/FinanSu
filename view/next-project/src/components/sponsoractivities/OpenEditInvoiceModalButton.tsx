import * as React from 'react';
import { useState } from 'react';

import { Invoice } from '@/type/common';

import { EditButton } from '../common';
import EditInvoiceModal from './EditInvoiceModal';

interface Props {
  children?: React.ReactNode;
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
}

const OpenEditInvoiceModalButton: React.FC<Props> = (props) => {
  const { invoice, setInvoice } = props;
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditButton onClick={onOpen} size='M' />
      {isOpen && (
        <EditInvoiceModal setInvoice={setInvoice} invoice={invoice} setIsOpen={setIsOpen} />
      )}
    </>
  );
};

export default OpenEditInvoiceModalButton;
