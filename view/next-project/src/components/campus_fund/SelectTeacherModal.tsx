import { useState } from 'react';

import { Title, Modal, CloseButton, EditButton } from '../common';
import formatNumber from '../common/Formatter';

import type { CampusFundTeacher } from '@/components/campus_fund/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (teacher: CampusFundTeacher) => void;
  building: string | null;
}

const SelectTeacherModal = ({ isOpen, onClose, onSelect, building }: Props) => {
  const teachers = [
    {
      teacherId: '1',
      buildingId: '1',
      teacherName: '○○教授',
      roomName: '102号室',
      floorNumber: '1F',
      unitNumber: 1,
      price: 5000,
      isBlack: false,
    },
    {
      teacherId: '2',
      buildingId: '1',
      teacherName: '△△教授',
      roomName: '103号室',
      floorNumber: '1F',
      unitNumber: 1,
      price: 0,
      isBlack: false,
    },
    {
      teacherId: '3',
      buildingId: '1',
      teacherName: '□□教授',
      roomName: '104号室',
      floorNumber: '2F',
      unitNumber: 1,
      price: 12000,
      isBlack: false,
    },
    {
      teacherId: '4',
      buildingId: '1',
      teacherName: '▲▲教授',
      roomName: '105号室',
      floorNumber: '2F',
      unitNumber: 1,
      price: null,
      isBlack: false,
    },
    {
      teacherId: '5',
      buildingId: '3',
      teacherName: '■■教授',
      roomName: '106号室',
      floorNumber: '1F',
      unitNumber: 1,
      price: 8000,
      isBlack: false,
    },
    {
      teacherId: '6',
      buildingId: '1',
      teacherName: '☆☆教授',
      roomName: '107号室',
      floorNumber: '1F',
      unitNumber: 1,
      price: null,
      isBlack: false,
    },
  ];

  const floorOptions = [...new Set(teachers.map((teacher) => teacher.floorNumber))];
  const [selectedFloor, setSelectedFloor] = useState(floorOptions[0] || '');
  const filteredTeachers = teachers.filter((teacher) => teacher.floorNumber === selectedFloor);

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose} className='w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:max-w-xl'>
      <div className='relative p-3 md:p-5'>
        <div className='absolute top-2 right-2 z-10'>
          <CloseButton onClick={onClose} />
        </div>
        <div className='px-9 md:px-12'>
          <Title className='flex-wrap gap-3 text-center text-xl md:flex-nowrap md:gap-5 md:text-2xl'>
            <span className='leading-snug wrap-break-word'>{building || '建物名未設定'}</span>
            <select
              className='w-auto border-b border-gray-400 bg-transparent text-sm font-normal outline-none'
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              {floorOptions.map((floor) => (
                <option key={floor} value={floor}>
                  {floor}
                </option>
              ))}
            </select>
          </Title>
        </div>

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full table-auto text-center text-xs text-gray-700 md:text-sm'>
            <thead>
              <tr className='border-primary-1 border-b'>
                <th className='px-2 py-2 font-normal text-gray-700'>号棟</th>
                <th className='px-2 py-2 font-normal text-gray-700'>居室</th>
                <th className='px-2 py-2 font-normal text-gray-700'>教員名</th>
                <th className='px-2 py-2 font-normal text-gray-700'>金額</th>
                <th className='px-2 py-2' />
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.roomName}>
                  <td className='px-2 py-2'>{teacher.unitNumber}</td>
                  <td className='px-2 py-2'>{teacher.roomName}</td>
                  <td className='px-2 py-2'>{teacher.teacherName}</td>
                  <td className='px-2 py-2 whitespace-nowrap'>
                    {teacher.price !== null ? `¥${formatNumber(teacher.price)}` : '-'}
                  </td>
                  <td className='px-2 py-2'>
                    <EditButton size='S' onClick={() => onSelect(teacher)} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className='border-primary-1 border-t'>
                <td colSpan={5} className='py-1' />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default SelectTeacherModal;
