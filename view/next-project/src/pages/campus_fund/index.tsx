import { useMemo, useState } from 'react';

import ReportModal from '@/components/campus_fund/ReportModal';
import SelectTeacherModal from '@/components/campus_fund/SelectTeacherModal';
import formatNumber from '@/components/common/Formatter';
import MainLayout from '@/components/layout/MainLayout';
import { useGetYears } from '@/generated/hooks';

import type { CampusFundBuildingSummary, CampusFundTeacher } from '@/components/campus_fund/types';

const CampusFund = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusFundBuildingSummary | null>(null);
  const [isSelectTeacherOpen, setIsSelectTeacherOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<CampusFundTeacher | null>(null);
  const { data: yearData } = useGetYears();

  const latestYear = useMemo(() => {
    if (!yearData?.data?.length) return new Date().getFullYear();
    return Math.max(...yearData.data.map((year) => year.year));
  }, [yearData]);

  const selectedYearId = useMemo(() => {
    if (!yearData?.data?.length) return null;
    // TODO APIのレスポンスを修正してyearIdをちゃんと取得できるようにする
    type YearData = { id: number; year: number; createdAt: string; updatedAt: string };

    const years = yearData.data as unknown as YearData[];
    const matchedYear = years.find((year) => year.year === latestYear);

    return matchedYear?.id ?? null;
  }, [latestYear, yearData]);

  const buildings: CampusFundBuildingSummary[] = [
    { buildingName: '機械・建設棟', totalPrice: 24000 },
    { buildingName: '電気棟', totalPrice: 5000 },
    { buildingName: '生物棟', totalPrice: 6500 },
    { buildingName: '環境・システム棟', totalPrice: 21000 },
    { buildingName: '物質・材料経営情報棟', totalPrice: 34000 },
    { buildingName: '総合研究棟', totalPrice: 41000 },
    { buildingName: '原子力・システム安全棟', totalPrice: 8500 },
    { buildingName: '事務局棟', totalPrice: 64000 },
    { buildingName: 'センター', totalPrice: 121000 },
  ];

  // 総募金額を計算
  const totalAmount = buildings.reduce((sum, building) => sum + building.totalPrice, 0);

  const handleBuildingClick = (building: CampusFundBuildingSummary) => {
    setSelectedBuilding(building);
    setIsSelectTeacherOpen(true);
  };

  const handleTeacherSelect = (teacher: CampusFundTeacher) => {
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
              key={building.buildingName}
              className='min-w-0 rounded-md border border-gray-200 bg-white p-4 text-center transition hover:bg-[#f0f9fa] hover:shadow-md'
              onClick={() => handleBuildingClick(building)}
            >
              <p className='text-lg font-bold'>{building.buildingName}</p>
              <p className='text-xl text-[#26C1CE]'>¥{formatNumber(building.totalPrice)}</p>
            </button>
          ))}
        </div>

        <SelectTeacherModal
          key={selectedBuilding?.buildingName}
          isOpen={isSelectTeacherOpen}
          onClose={() => setIsSelectTeacherOpen(false)}
          onSelect={handleTeacherSelect}
          building={selectedBuilding?.buildingName ?? null}
        />

        <ReportModal
          key={selectedTeacher?.teacherId}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          building={selectedBuilding?.buildingName ?? null}
          teacher={selectedTeacher}
          yearId={selectedYearId}
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
