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
    { buildingName: '極限エネルギ密度工学研究センター', totalPrice: 1000 },
    { buildingName: '工作センター', totalPrice: 10000 },
    { buildingName: '大型実験棟', totalPrice: 12000 },
    { buildingName: '分析計測センター', totalPrice: 21000 },
    { buildingName: 'その他', totalPrice: 0 },
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
        <div className='mx-auto grid w-full max-w-3xl grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-7'>
          {buildings.map((building) => (
            <button
              type='button'
              key={building.buildingName}
              className='flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white px-3 text-center shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl md:h-36 md:w-44 md:rounded-2xl md:px-4'
              onClick={() => handleBuildingClick(building)}
            >
              <p className='text-primary-4 min-h-8 text-center text-sm font-light leading-tight md:text-lg'>
                {building.buildingName}
              </p>
              <p className='text-primary-2 mt-1 text-2xl font-normal md:mt-5 md:text-3xl'>
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
