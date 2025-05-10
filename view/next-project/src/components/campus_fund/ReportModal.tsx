import { VStack, FormLabel, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker'; // カレンダー用ライブラリをインポート
import { PrimaryButton, Modal, Title, CloseButton, Input } from '@components/common';
import 'react-datepicker/dist/react-datepicker.css'; // カレンダーのスタイルをインポート
import formatNumber from '@components/common/Formatter'; // 金額フォーマッタをインポート

interface Props {
  isOpen: boolean;
  onClose: () => void;
  building: string | null;
  teacher: string | null;
}

const ReportModal = ({ isOpen, onClose, building, teacher }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 日時の状態を管理
  const [amount, setAmount] = useState<string>(''); // 金額の状態を管理

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose} className='w-1/3'>
      <div className='relative p-5'>
        <div className='absolute right-2 top-2'>
          <CloseButton onClick={onClose} />
        </div>
        <Title>{building}</Title>
        <Text fontSize='lg' color='gray.600' mt={4} align='center'>
          {teacher}
        </Text>
        <VStack spacing={6} align='center' mt={12}>
          {/* 日時 */}
          <HStack spacing={4} align='center'>
            <FormLabel
              fontWeight='bold'
              fontSize='sm'
              color='gray.600'
              minWidth='80px'
              textAlign='right'
            >
              日時
            </FormLabel>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat='yyyy/MM/dd'
              placeholderText='日付を選択'
              className='border-gray-400 focus:border-teal-400 w-full border-b focus:outline-none'
            />
          </HStack>

          {/* 記入担当者 */}
          <HStack spacing={4} align='center'>
            <FormLabel
              fontWeight='bold'
              fontSize='sm'
              color='gray.600'
              minWidth='80px'
              textAlign='right'
            >
              記入担当者
            </FormLabel>
            <Input placeholder='テキストボックス一行' />
          </HStack>

          {/* 金額 */}
          <HStack spacing={4} align='center' mb={8}>
            <FormLabel
              fontWeight='bold'
              fontSize='sm'
              color='gray.600'
              minWidth='80px'
              textAlign='right'
            >
              金額
            </FormLabel>
            <Input
              placeholder='金額を入力'
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, ''); // カンマを削除
                if (!isNaN(Number(value))) {
                  setAmount(formatNumber(Number(value))); // フォーマットして表示
                }
              }}
              className='border-gray-400 focus:border-teal-400 border-b focus:outline-none'
            />
          </HStack>

          {/* 追加ボタン */}
          <PrimaryButton onClick={onClose}>追加する</PrimaryButton>
        </VStack>
      </div>
    </Modal>
  );
};

export default ReportModal;
