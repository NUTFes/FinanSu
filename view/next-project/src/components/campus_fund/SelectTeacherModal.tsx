import { useState } from 'react';

import { useGetCampusDonationsYearsYearGroupKeysGroupKeyFloors } from '@/generated/hooks';
import { CampusDonationBuildingGroupKey } from '@/generated/model';

import { Title, Modal, CloseButton, EditButton } from '../common';
import formatNumber from '../common/Formatter';

import type { CampusDonationTeacher } from '@/generated/model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (teacher: CampusDonationTeacher) => void;
  building: string;
  year: number;
  groupKey: CampusDonationBuildingGroupKey;
}

const SelectTeacherModal = ({ isOpen, onClose, onSelect, building, year, groupKey }: Props) => {
  const [selectedFloor, setSelectedFloor] = useState('');

  const {
    data: buildingFloorsData,
    isLoading,
    error,
  } = useGetCampusDonationsYearsYearGroupKeysGroupKeyFloors(year, groupKey, undefined, {
    swr: {
      enabled: isOpen,
    },
  });

  const buildingFloors = buildingFloorsData?.data ?? [];
  const floorOptions = [...new Set(buildingFloors.map((floor) => floor.floorNumber))];
  const filteredBuildingFloors = selectedFloor
    ? buildingFloors.filter((floor) => floor.floorNumber === selectedFloor)
    : buildingFloors;

  const isOtherBuildingGroup = groupKey === CampusDonationBuildingGroupKey.other;

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose} className='w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:max-w-xl'>
      <div className='relative p-3 md:p-5'>
        <div className='absolute top-2 right-2 z-10'>
          <CloseButton onClick={onClose} />
        </div>
        <div className='px-9 md:px-12'>
          <Title className='flex-wrap gap-3 text-center text-xl md:flex-nowrap md:gap-5 md:text-2xl'>
            <span className='leading-snug wrap-break-word'>{building}</span>
            <select
              className='w-auto border-b border-gray-400 bg-transparent text-sm font-normal outline-none'
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value=''>すべて</option>
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
                <th className='px-2 py-2 font-normal text-gray-700'>
                  {isOtherBuildingGroup ? '棟名' : '号棟'}
                </th>
                <th className='px-2 py-2 font-normal text-gray-700'>居室</th>
                <th className='px-2 py-2 font-normal text-gray-700'>教員名</th>
                <th className='px-2 py-2 font-normal text-gray-700'>金額</th>
                <th className='px-2 py-2' />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='px-2 py-6 text-center text-gray-500'>
                    読み込み中...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className='px-2 py-6 text-center text-red-500'>
                    データの取得に失敗しました。
                  </td>
                </tr>
              ) : filteredBuildingFloors.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-2 py-6 text-center text-gray-500'>
                    データがありません。
                  </td>
                </tr>
              ) : (
                filteredBuildingFloors.map((floor) =>
                  floor.donations.map((teacher) => (
                    <tr key={`${floor.buildingId}-${floor.floorNumber}-${teacher.teacherId}`}>
                      <td className='px-2 py-2'>
                        {isOtherBuildingGroup ? floor.buildingName : floor.unitNumber}
                      </td>
                      <td className='px-2 py-2'>{teacher.roomName}</td>
                      <td className='px-2 py-2'>{teacher.teacherName}</td>
                      <td className='px-2 py-2 whitespace-nowrap'>
                        {teacher.price !== null ? `¥${formatNumber(teacher.price)}` : '-'}
                      </td>
                      <td className='px-2 py-2'>
                        <EditButton size='S' onClick={() => onSelect(teacher)} />
                      </td>
                    </tr>
                  )),
                )
              )}
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
