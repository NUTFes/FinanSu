import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { PrimaryButton, Modal, Title, CloseButton, Input } from '@components/common';
import { useCurrentUser } from '@/store';
import 'react-datepicker/dist/react-datepicker.css';
import formatNumber from '@components/common/Formatter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  building: string | null;
  teacher: { name: string; room: string } | null;
  onBack?: () => void;
}

const ReportModal = ({ isOpen, onClose, building, teacher, onBack }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState<string>('');
  const user = useCurrentUser();

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose} className='w-full max-w-xs sm:max-w-md md:max-w-xl'>
      <div className='relative p-5'>
        <div className='absolute right-2 top-2'>
          <CloseButton onClick={onClose} />
        </div>
        <Title>{building}</Title>
        <p className='mt-4 text-center text-sm text-gray-600 md:text-lg'>
          {teacher ? `${teacher.room} ${teacher.name}` : ''}
        </p>
        <div className='mt-12 space-y-6'>
          <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
            <label className='min-w-20 text-xs font-bold text-gray-600 sm:text-right md:text-sm'>
              日時
            </label>
            <div className='relative z-2 w-full'>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat='yyyy/MM/dd'
                placeholderText='日付を選択'
                className='w-full border-b border-gray-400 pr-10 text-sm focus:border-teal-400 focus:outline-none md:text-base'
                popperPlacement='bottom'
                popperClassName='z-datepicker-gal'
              />
              <FaRegCalendarAlt className='pointer-events-none absolute right-2 top-1/2 size-5 -translate-y-1/2 text-gray-400' />
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
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (!isNaN(Number(value))) {
                  setAmount(formatNumber(Number(value)));
                }
              }}
              className='border-gray-400 border-b text-sm focus:border-teal-400 focus:outline-none md:text-base'
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
            <PrimaryButton onClick={onClose}>追加する</PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
