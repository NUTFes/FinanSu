import { format } from 'date-fns';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaRegCalendarAlt } from 'react-icons/fa';

import {
  CampusFundFormData,
  CreateCampusDonationPayload,
  CampusFundTeacher,
} from '@/components/campus_fund/types';
import { useCurrentUser } from '@/store';
import { PrimaryButton, Modal, Title, CloseButton, Input } from '@components/common';
import formatNumber from '@components/common/Formatter';

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
    price: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const user = useCurrentUser();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!teacher || !formData.receivedAt || !formData.price || !user?.id || !yearId) return;

    try {
      setErrorMessage('');
      setIsSubmitting(true);

      const payload: CreateCampusDonationPayload = {
        userId: user.id,
        teacherId: Number(teacher.teacherId),
        yearId: yearId,
        price: Number(formData.price.replace(/,/g, '')),
        receivedAt: format(formData.receivedAt, 'yyyy-MM-dd'),
      };
      console.log('送信データ:', payload);
      setFormData({
        receivedAt: new Date(),
        price: '',
      });
      onClose();
      alert('募金の登録が完了しました！');
    } catch (error) {
      setErrorMessage('募金の登録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !teacher ||
    !formData.receivedAt ||
    !formData.price ||
    Number(formData.price.replace(/,/g, '')) <= 0 ||
    !user?.id ||
    !yearId;

  return (
    <Modal onClick={onClose} className='w-full max-w-xs sm:max-w-md md:max-w-xl'>
      <div className='relative p-5'>
        <div className='absolute right-2 top-2'>
          <CloseButton onClick={onClose} />
        </div>
        <Title>{building}</Title>
        <p className='mt-4 text-center text-sm text-gray-600 md:text-lg'>
          {teacher ? `${teacher.roomName} ${teacher.teacherName}` : ''}
        </p>
        {errorMessage && <p className='mt-2 text-center text-sm text-red-500'>{errorMessage}</p>}
        <div className='mt-12 space-y-6'>
          <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
            <label className='min-w-20 text-xs font-bold text-gray-600 sm:text-right md:text-sm'>
              日時
            </label>
            <div className='z-2 relative w-full'>
              <DatePicker
                selected={formData.receivedAt}
                onChange={(date: Date | null) =>
                  setFormData((prev) => ({ ...prev, receivedAt: date }))
                }
                dateFormat='yyyy/MM/dd'
                placeholderText='日付を選択'
                className='w-full border-b border-gray-400 pr-10 text-sm focus:border-teal-400 focus:outline-none md:text-base'
                popperPlacement='bottom'
                popperClassName='z-datepicker-gal'
              />
              <FaRegCalendarAlt className='size-5 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400' />
            </div>
          </div>

          <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
            <label className='min-w-20 text-xs font-bold text-gray-600 sm:text-right md:text-sm'>
              記入担当者
            </label>
            <input
              value={user?.name ?? ''}
              readOnly
              className='w-full border-b border-gray-400 bg-gray-100 text-sm focus:outline-none md:text-base'
            />
          </div>

          <div className='mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
            <label className='min-w-20 text-xs font-bold text-gray-600 sm:text-right md:text-sm'>
              金額
            </label>
            <Input
              placeholder='金額を入力'
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (!isNaN(Number(value))) {
                  setFormData((prev) => ({ ...prev, price: formatNumber(Number(value)) }));
                }
              }}
              className='border-b border-gray-400 text-sm focus:border-teal-400 focus:outline-none md:text-base'
            />
          </div>

          <div className='flex w-full justify-center gap-4'>
            <button
              type='button'
              onClick={onBack}
              className='min-w-[100px] rounded-full border border-gray-300 px-4 py-2 text-xs text-gray-700 transition hover:bg-gray-100 md:text-sm'
            >
              戻る
            </button>
            <PrimaryButton onClick={handleSubmit} disabled={isSubmitDisabled || isSubmitting}>
              {isSubmitting ? '登録中...' : '登録する'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
