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
      price: null,
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
    <Modal onClick={onClose} className='w-full max-w-xs sm:max-w-md md:max-w-xl'>
      <div className='relative p-5'>
        <div className='absolute right-2 top-2'>
          <CloseButton onClick={onClose} />
        </div>
        <Title>
          {building || '建物名未設定'}
          <select
            className='ml-4 inline-block w-auto border-b border-gray-300 bg-transparent text-xs outline-none md:text-sm'
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
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.roomName} className='border-b last:border-0'>
                  <td className='px-2 py-2'>{teacher.unitNumber}</td>
                  <td className='px-2 py-2'>{teacher.roomName}</td>
                  <td className='px-2 py-2'>{teacher.teacherName}</td>
                  <td className='px-2 py-2'>
                    {teacher.price ? `¥${formatNumber(teacher.price)}` : '-'}
                  </td>
                  <td className='px-2 py-2'>
                    <EditButton size='S' onClick={() => onSelect(teacher)} />
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
