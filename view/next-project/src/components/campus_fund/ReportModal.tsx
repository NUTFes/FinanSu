import {
  VStack,
  FormLabel,
  HStack,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/atoms';
import { PrimaryButton, Modal, Title, CloseButton, Input } from '@components/common';
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
  const user = useRecoilValue(userAtom);

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose} className='w-full max-w-xs sm:max-w-md md:max-w-xl'>
      <div className='relative p-5'>
        <div className='absolute right-2 top-2'>
          <CloseButton onClick={onClose} />
        </div>
        <Title>{building}</Title>
        <Text fontSize={{ base: 'sm', md: 'lg' }} color='gray.600' mt={4} align='center'>
          {teacher ? `${teacher.room} ${teacher.name}` : ''}
        </Text>
        <VStack spacing={6} align='center' mt={12}>
          {/* 日時 */}
          <HStack spacing={4} align='center'>
            <FormLabel
              fontWeight='bold'
              fontSize={{ base: 'xs', md: 'sm' }}
              color='gray.600'
              minWidth='80px'
              textAlign='right'
            >
              日時
            </FormLabel>
            <InputGroup w='full' zIndex={2}>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat='yyyy/MM/dd'
                placeholderText='日付を選択'
                className='border-gray-400 focus:border-teal-400 w-full border-b pr-10 text-sm focus:outline-none md:text-base'
                popperPlacement='bottom'
                popperClassName='z-datepicker-gal'
              />
              <InputRightElement
                pointerEvents='none'
                right='10px'
                top='50%'
                transform='translateY(-50%)'
              >
                <Icon as={FaRegCalendarAlt} color='gray.400' boxSize={5} />
              </InputRightElement>
            </InputGroup>
          </HStack>

          {/* 記入担当者 */}
          <HStack spacing={4} align='center'>
            <FormLabel
              fontWeight='bold'
              fontSize={{ base: 'xs', md: 'sm' }}
              color='gray.600'
              minWidth='80px'
              textAlign='right'
            >
              記入担当者
            </FormLabel>
            <input
              value={user ? `${user.name}` : ''}
              readOnly={true}
              className='border-gray-400 bg-gray-100 w-full border-b text-sm focus:outline-none md:text-base'
            />
          </HStack>

          {/* 金額 */}
          <HStack spacing={4} align='center' mb={8}>
            <FormLabel
              fontWeight='bold'
              fontSize={{ base: 'xs', md: 'sm' }}
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
                const value = e.target.value.replace(/,/g, '');
                if (!isNaN(Number(value))) {
                  setAmount(formatNumber(Number(value)));
                }
              }}
              className='border-gray-400 focus:border-teal-400 border-b text-sm focus:outline-none md:text-base'
            />
          </HStack>

          {/* 戻る＆追加ボタン */}
          <HStack spacing={4} w='100%' justify='center'>
            <Button
              zIndex={1}
              colorScheme='gray'
              variant='outline'
              onClick={onBack}
              minW='100px'
              fontSize={{ base: 'xs', md: 'sm' }}
            >
              戻る
            </Button>
            <PrimaryButton onClick={onClose}>追加する</PrimaryButton>
          </HStack>
        </VStack>
      </div>
    </Modal>
  );
};

export default ReportModal;
