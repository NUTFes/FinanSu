import router from 'next/router';
import { useState } from 'react';

import { Expense, PurchaseOrder, PurchaseOrderView } from '@/type/common';
import { put } from '@/utils/api/purchaseOrder';
import {
  CloseButton,
  Input,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Select,
} from '@components/common';

export const DetailEditModal: React.FC<{
  purchaseOrderId: number;
  purchaseOrderViewItem: PurchaseOrderView;
  expenses: Expense[];
  isOpen: boolean;
  setIsOpen: () => void;
  onOpenInitial: () => void;
}> = ({ purchaseOrderViewItem, expenses, setIsOpen, onOpenInitial }) => {
  const [formData, setFormData] = useState<PurchaseOrder>(purchaseOrderViewItem.purchaseOrder);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (1 + d.getMonth()).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const submit = async () => {
    try {
      const updatePurchaseOrderUrl = `${process.env.CSR_API_URI}/purchaseorders/${formData.id}`;
      await put(updatePurchaseOrderUrl, formData);
    } finally {
      router.reload();
    }
  };

  const handleInputChange = (key: keyof PurchaseOrder, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal className='md:w-1/2'>
      <div className='ml-auto w-fit'>
        <CloseButton onClick={setIsOpen} />
      </div>
      <div className='mx-auto mb-10 w-fit text-xl text-black-600'>
        <p>購入した局と期限日を修正</p>
      </div>
      <div className='mx-auto my-6 grid w-9/10 grid-cols-4 place-items-center gap-4'>
        <p className='text-lg text-black-600'>購入した局</p>
        <div className='col-span-3 w-full'>
          <Select
            value={formData.expenseID}
            onChange={(e) => handleInputChange('expenseID', Number(e.target.value))}
          >
            {expenses.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
            {!expenses.length && <option>局・団体が登録されていません</option>}
          </Select>
        </div>
        <p className='text-lg text-black-600'>期限日</p>
        <div className='col-span-3 w-full'>
          <Input
            type='date'
            value={formData.deadline ? formatDate(formData.deadline) : ''}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            className='w-full'
          />
        </div>
      </div>
      <div className='flex justify-center'>
        <OutlinePrimaryButton onClick={onOpenInitial} className='mx-2'>
          戻る
        </OutlinePrimaryButton>
        <PrimaryButton onClick={submit} className='mx-2 px-4'>
          編集完了
        </PrimaryButton>
      </div>
    </Modal>
  );
};
