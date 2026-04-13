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
      <div className='mb-10 mt-8 flex flex-col items-center px-6'>
        <div className='mb-10 flex flex-col items-center'>
          <p className='text-primary-5 mb-2 text-sm font-medium'>総募金額</p>
          <p className='text-primary-5 text-center text-5xl font-normal md:text-6xl'>
            ¥{formatNumber(totalAmount)}
          </p>
        </div>
        <div className='mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-7'>
          {buildings.map((building) => (
            <button
              type='button'
              key={building.buildingName}
              className='flex h-36 w-44 flex-col items-center justify-center rounded-2xl bg-white px-4 text-center shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl'
              onClick={() => handleBuildingClick(building)}
            >
              <p className='text-primary-4 min-h-10 text-center text-lg font-light leading-tight'>
                {building.buildingName}
              </p>
              <p className='text-primary-2 mt-5 text-3xl font-normal'>
                ¥{formatNumber(building.totalPrice)}
              </p>
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
