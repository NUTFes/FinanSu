import { format } from 'date-fns';
import { useState } from 'react';
import DatePicker from 'react-datepicker';

import { CampusFundFormData, CampusFundTeacher } from '@/components/campus_fund/types';
import { useCurrentUser } from '@/store';
import { PrimaryButton, Modal, Title, CloseButton } from '@components/common';

import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  building: string | null;
  teacher: CampusFundTeacher | null;
  yearId: number | null;
  onBack?: () => void;
}

const ReportModal = ({ isOpen, onClose, building, teacher, yearId, onBack }: Props) => {
  const initialFormData: CampusFundFormData = {
    receivedAt: new Date(),
    price: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const user = useCurrentUser();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsDatePickerOpen(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!teacher || !formData.receivedAt || formData.price === null || !user?.id || !yearId) return;

    try {
      setErrorMessage('');
      setIsSubmitting(true);

      setFormData({
        receivedAt: new Date(),
        price: null,
      });
      handleClose();
      alert('募金の登録が完了しました！');
    } catch {
      setErrorMessage('募金の登録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !teacher || !formData.receivedAt || formData.price === null || !user?.id || !yearId;

  return (
    <Modal onClick={handleClose} className='w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:max-w-xl'>
      <div className='relative p-5'>
        <div className='absolute top-2 right-2'>
          <CloseButton onClick={handleClose} />
        </div>
        <Title>{building}</Title>
        <p className='mt-4 text-center text-sm text-gray-600 md:text-lg'>
          {teacher ? `${teacher.roomName} ${teacher.teacherName}` : ''}
        </p>
        {errorMessage && <p className='mt-2 text-center text-sm text-red-500'>{errorMessage}</p>}
        <div className='mx-auto mt-10 w-full max-w-xs space-y-5'>
          <div className='flex items-center gap-3'>
            <label className='w-20 shrink-0 text-right text-xs font-bold text-gray-600 md:text-sm'>
              日付
            </label>
            <button
              type='button'
              className='w-full border-b border-gray-400 bg-transparent px-0 text-left text-sm focus:border-teal-400 focus:outline-none md:text-base'
              onClick={() => setIsDatePickerOpen(true)}
            >
              {formData.receivedAt ? format(formData.receivedAt, 'yyyy/MM/dd') : '日付を選択'}
            </button>
          </div>
          <div className='flex items-center gap-3'>
            <label className='w-20 shrink-0 text-right text-xs font-bold text-gray-600 md:text-sm'>
              記入担当者
            </label>
            <input
              value={user?.name ?? ''}
              readOnly
              className='w-full border-b border-gray-400 bg-gray-100 text-sm focus:outline-none md:text-base'
            />
          </div>
          <div className='flex items-center gap-3'>
            <label className='w-20 shrink-0 text-right text-xs font-bold text-gray-600 md:text-sm'>
              金額
            </label>
            <input
              placeholder='金額を入力'
              value={formData.price !== null ? formData.price.toLocaleString() : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (value === '') {
                  setFormData((prev) => ({ ...prev, price: null }));
                  return;
                }
                if (/^\d+$/.test(value)) {
                  setFormData((prev) => ({ ...prev, price: Number(value) }));
                }
              }}
              className='w-full border-b border-gray-400 bg-transparent px-0 text-sm focus:border-gray-400 focus:outline-none md:text-base'
            />
          </div>
          <div className='flex w-full justify-center gap-4'>
            <button
              type='button'
              onClick={onBack}
              className='min-w-24 rounded-full border border-gray-300 px-4 py-2 text-xs text-gray-700 transition hover:bg-gray-100 md:text-sm'
            >
              戻る
            </button>
            <PrimaryButton onClick={handleSubmit} disabled={isSubmitDisabled || isSubmitting}>
              {isSubmitting ? '登録中...' : '登録する'}
            </PrimaryButton>
          </div>
        </div>
        {isDatePickerOpen && (
          <div
            className='absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-white/80'
            onClick={() => setIsDatePickerOpen(false)}
            role='presentation'
          >
            <div
              className='rounded-lg bg-white p-3 shadow-lg'
              onClick={(event) => event.stopPropagation()}
            >
              <DatePicker
                inline
                selected={formData.receivedAt}
                onChange={(date: Date | null) => {
                  setFormData((prev) => ({ ...prev, receivedAt: date }));
                  setIsDatePickerOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReportModal;
