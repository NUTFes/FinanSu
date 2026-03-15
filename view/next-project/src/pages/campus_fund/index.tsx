import { useState } from 'react';
import ReportModal from '@/components/campus_fund/ReportModal';
import SelectTeacherModal from '@/components/campus_fund/SelectTeacherModal';
import formatNumber from '@/components/common/Formatter';
import MainLayout from '@/components/layout/MainLayout';

const CampusFund = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isSelectTeacherOpen, setIsSelectTeacherOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const buildings = [
    { name: '機械・建設棟', amount: 24000 },
    { name: '電気棟', amount: 5000 },
    { name: '生物棟', amount: 6500 },
    { name: '環境・システム棟', amount: 21000 },
    { name: '物質・材料経営情報棟', amount: 34000 },
    { name: '総合研究棟', amount: 41000 },
    { name: '原子力・システム安全棟', amount: 8500 },
    { name: '事務局棟', amount: 64000 },
    { name: 'センター', amount: 121000 },
  ];

  // 総募金額を計算
  const totalAmount = buildings.reduce((sum, building) => sum + building.amount, 0);

  const handleBuildingClick = (building: string) => {
    setSelectedBuilding(building);
    setIsSelectTeacherOpen(true);
  };

  const handleTeacherSelect = (teacher: string) => {
    setSelectedTeacher(teacher);
    setIsSelectTeacherOpen(false);
    setIsReportModalOpen(true);
  };

  return (
    <MainLayout>
      <div className='mx-auto max-w-[1200px] p-2 md:p-8'>
        <p className='mt-8 text-center text-2xl font-bold text-[#26C1CE]'>総募金額</p>
        <p className='mb-8 text-center text-5xl font-bold text-[#04668C] md:text-6xl'>
          ¥{formatNumber(totalAmount)}
        </p>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {buildings.map((building) => (
            <button
              type='button'
              key={building.name}
              className='min-w-0 rounded-md border border-gray-200 bg-white p-4 text-center transition hover:bg-[#f0f9fa] hover:shadow-md'
              onClick={() => handleBuildingClick(building.name)}
            >
              <p className='text-lg font-bold'>{building.name}</p>
              <p className='text-xl text-[#26C1CE]'>¥{formatNumber(building.amount)}</p>
            </button>
          ))}
        </div>

        <SelectTeacherModal
          isOpen={isSelectTeacherOpen}
          onClose={() => setIsSelectTeacherOpen(false)}
          onSelect={handleTeacherSelect}
          building={selectedBuilding}
        />

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          building={selectedBuilding}
          teacher={
            selectedTeacher
              ? {
                  name: selectedTeacher,
                  room: buildings.find((b) => b.name === selectedBuilding)?.name || '',
                }
              : null
          }
          onBack={() => {
            setIsReportModalOpen(false);
            setIsSelectTeacherOpen(true);
          }}
        />
      </div>
    </MainLayout>
  );
};

export default CampusFund;
