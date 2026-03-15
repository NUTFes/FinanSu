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
    { building: '1号棟', room: '102号室', name: '○○教授', amount: 5000 },
    { building: '1号棟', room: '103号室', name: '△△教授', amount: null },
    { building: '1号棟', room: '104号室', name: '□□教授', amount: 12000 },
    { building: '1号棟', room: '105号室', name: '▲▲教授', amount: null },
    { building: '1号棟', room: '106号室', name: '■■教授', amount: 8000 },
    { building: '1号棟', room: '107号室', name: '☆☆教授', amount: null },
  ];

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose} className='w-full max-w-xs sm:max-w-md md:max-w-xl'>
      <div className='relative p-5'>
        <div className='absolute right-2 top-2'>
          <CloseButton onClick={onClose} />
        </div>
        <Title>
          {building || '建物名未設定'}
          <select
            className='ml-4 inline-block w-auto border-b border-gray-300 bg-transparent text-xs outline-none md:text-sm'
          >
            <option value='1F'>1F</option>
            <option value='2F'>2F</option>
            <option value='3F'>3F</option>
          </select>
        </Title>
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full table-auto text-left text-xs md:text-sm'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='px-2 py-2 font-semibold'>何号棟</th>
                <th className='px-2 py-2 font-semibold'>居室</th>
                <th className='px-2 py-2 font-semibold'>教員名</th>
                <th className='px-2 py-2 font-semibold'>金額</th>
                <th className='px-2 py-2' />
              </tr>
            </thead>
            <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.room} className='border-b last:border-0'>
                <td className='px-2 py-2'>{teacher.building}</td>
                <td className='px-2 py-2'>{teacher.room}</td>
                <td className='px-2 py-2'>{teacher.name}</td>
                <td className='px-2 py-2'>
                  {teacher.amount ? `¥${formatNumber(teacher.amount)}` : '-'}
                </td>
                <td className='px-2 py-2'>
                  <EditButton size='S' onClick={() => onSelect(teacher.name)} />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default SelectTeacherModal;
