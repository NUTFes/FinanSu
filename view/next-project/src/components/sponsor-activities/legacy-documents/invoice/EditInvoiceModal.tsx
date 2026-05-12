import clsx from 'clsx';
import React, { useState } from 'react';

import { CloseButton, Input, Modal, OutlinePrimaryButton, PrimaryButton } from '@components/common';
import { Invoice, InvoiceSponsorStyle } from '@type/common';

interface ModalProps {
  invoice: Invoice;
  setInvoice: (invoce: Invoice) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditInvoiceModal(props: ModalProps) {
  const { invoice, setInvoice, setIsOpen } = props;
  const [editInvoice, setEditInvoice] = useState<Invoice>(invoice);

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setEditInvoice({ ...editInvoice, [input]: e.target.value });
    };

  const onChangeSponsorStyle = (inputInvoiceSponsorStyle: InvoiceSponsorStyle, index: number) => {
    const newInvoiceSponsorStyles = editInvoice.invoiceSponsorStyle.map(
      (invoiceSponsorStyle, i) => {
        if (i === index) {
          return inputInvoiceSponsorStyle;
        } else {
          return invoiceSponsorStyle;
        }
      },
    );
    const totalPrice = newInvoiceSponsorStyles.reduce(
      (price: number, invoiceSponsorStyle: InvoiceSponsorStyle): number => {
        return price + invoiceSponsorStyle.price;
      },
      0,
    );
    setEditInvoice({
      ...editInvoice,
      invoiceSponsorStyle: newInvoiceSponsorStyles,
      totalPrice: totalPrice,
    });
  };

  const handleRegister = () => {
    setInvoice(editInvoice);
    setIsOpen(false);
  };

  const onClose = () => {
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:w-1/2' onClick={onClose}>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className='text-black-600 mx-auto mb-10 w-fit text-xl'>請求書の修正</div>
      <div className=''>
        <div className='my-4 grid grid-cols-5 place-items-center gap-2'>
          <p className='text-black-600'>企業名</p>
          <div className='col-span-4 w-full'>
            <Input value={editInvoice.sponsorName} onChange={handler('sponsorName')}></Input>
          </div>
          <p className='text-black-600'>企業担当者名</p>
          <div className='col-span-4 w-full'>
            <Input value={editInvoice.managerName} onChange={handler('managerName')}></Input>
          </div>
          <p className='text-black-600'>実行委員担当者名</p>
          <div className='col-span-4 w-full'>
            <Input value={editInvoice.fesStuffName} onChange={handler('fesStuffName')}></Input>
          </div>
        </div>
        <div className='max-h-48 overflow-y-auto'>
          <table className='mb-4 w-full table-fixed border-collapse'>
            <thead>
              <tr className='border-b-primary-1 border-b py-3'>
                <th className='w-3/4 px-6 pb-2'>
                  <div className='text-black-600 text-center text-sm'>協賛内容(オプション）</div>
                </th>
                <th className='w-1/4 px-6 pb-2'>
                  <div className='text-black-600 text-center text-sm'>値段</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {editInvoice.invoiceSponsorStyle &&
                editInvoice.invoiceSponsorStyle.map((invoiceSponsorStyle, index) => (
                  <tr
                    key={index}
                    className={clsx({
                      'border-b-primary-1 border-b':
                        index === editInvoice.invoiceSponsorStyle.length - 1,
                    })}
                  >
                    <td className='py-3'>
                      <Input
                        value={invoiceSponsorStyle.styleName}
                        className=''
                        onChange={(e) => {
                          onChangeSponsorStyle(
                            { ...invoiceSponsorStyle, styleName: e.target.value },
                            index,
                          );
                        }}
                      ></Input>
                    </td>
                    <td className='py-3'>
                      <Input
                        value={invoiceSponsorStyle.price}
                        onChange={(e) => {
                          onChangeSponsorStyle(
                            {
                              ...invoiceSponsorStyle,
                              price: isNaN(Number(e.target.value))
                                ? invoiceSponsorStyle.price
                                : Number(e.target.value),
                            },
                            index,
                          );
                        }}
                      ></Input>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton onClick={onClose}>戻る</OutlinePrimaryButton>
          <PrimaryButton onClick={handleRegister}>編集完了</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
