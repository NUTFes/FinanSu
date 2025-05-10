import { Table, Thead, Tbody, Tr, Th, Td, Select } from '@chakra-ui/react';
import { Title, Modal, CloseButton, EditButton } from '../common';
import formatNumber from '../common/Formatter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (teacher: string) => void;
  building: string | null;
}

const SelectTeacherModal = ({ isOpen, onClose, onSelect, building }: Props) => {
  const teachers = [
    { room: '102号室', name: '○○教授', amount: 5000 },
    { room: '103号室', name: '△△教授', amount: null },
    { room: '104号室', name: '□□教授', amount: 12000 },
    { room: '105号室', name: '▲▲教授', amount: null },
    { room: '106号室', name: '■■教授', amount: 8000 },
    { room: '107号室', name: '☆☆教授', amount: null },
  ];

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose} className='w-1/3'>
      <div className='relative p-5'>
        <div className='absolute right-2 top-2'>
          <CloseButton onClick={onClose} />
        </div>
        <Title>
          {building || '建物名未設定'} {/* 建物名を表示 */}
          <Select
            ml={4}
            width='auto'
            display='inline-block'
            variant='unstyled'
            borderBottom='1px solid #ccc'
          >
            <option value='1F'>1F</option>
            <option value='2F'>2F</option>
            <option value='3F'>3F</option>
          </Select>
        </Title>
        <Table variant='simple' size='md' mt={4}>
          <Thead>
            <Tr>
              <Th>居室</Th>
              <Th>教員名</Th>
              <Th>金額</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {teachers.map((teacher) => (
              <Tr key={teacher.room}>
                <Td>{teacher.room}</Td>
                <Td>{teacher.name}</Td>
                <Td>{teacher.amount ? `¥${formatNumber(teacher.amount)}` : '-'}</Td>
                <Td>
                  <EditButton size='S' onClick={() => onSelect(teacher.name)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Modal>
  );
};

export default SelectTeacherModal;
