import { useMemo, useState } from 'react';

import ReportModal from '@/components/campus_fund/ReportModal';
import SelectTeacherModal from '@/components/campus_fund/SelectTeacherModal';
import formatNumber from '@/components/common/Formatter';
import MainLayout from '@/components/layout/MainLayout';
import { useGetCampusDonationsBuildingsYear, useGetYears } from '@/generated/hooks';

import type { BuildingTotal, CampusDonationTeacher } from '@/generated/model';
import type { Year } from '@/type/common';

const CampusFund = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingTotal | null>(null);
  const [isSelectTeacherOpen, setIsSelectTeacherOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<CampusDonationTeacher | null>(null);

  const { data: yearData } = useGetYears();

  const latestYear = useMemo(() => {
    if (!yearData?.data?.length) return new Date().getFullYear();

    return Math.max(...yearData.data.map((year) => year.year));
  }, [yearData]);

  const { data: buildingData, mutate: mutateBuildingData } =
    useGetCampusDonationsBuildingsYear(latestYear);

  const selectedYearId = useMemo(() => {
    if (!yearData?.data?.length) return null;

    const years = yearData.data as unknown as Year[];
    const matchedYear = years.find((year) => year.year === latestYear);

    return matchedYear?.id ?? null;
  }, [latestYear, yearData]);

  const buildings = buildingData?.data ?? [];
  const totalAmount = buildings.reduce((sum, building) => sum + building.totalPrice, 0);

  const refreshBuildingData = async () => {
    await mutateBuildingData();
  };

  const handleBuildingClick = (building: BuildingTotal) => {
    setSelectedBuilding(building);
    setIsSelectTeacherOpen(true);
  };

  const handleTeacherSelect = (teacher: CampusDonationTeacher) => {
    setSelectedTeacher(teacher);
    setIsSelectTeacherOpen(false);
    setIsReportModalOpen(true);
  };

  return (
    <MainLayout>
      <div className='mt-8 mb-10 flex flex-col items-center px-6'>
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
              key={building.id}
              className='flex h-24 w-full flex-col items-center justify-center rounded-xl bg-white px-3 text-center shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl md:h-36 md:w-44 md:rounded-2xl md:px-4'
              onClick={() => handleBuildingClick(building)}
            >
              <p className='text-primary-4 min-h-8 text-center text-sm leading-tight font-light md:text-lg'>
                {building.name}
              </p>
              <p className='text-primary-2 mt-1 text-2xl font-normal md:mt-5 md:text-3xl'>
                ¥{formatNumber(building.totalPrice)}
              </p>
            </button>
          ))}
        </div>

        {selectedBuilding && (
          <SelectTeacherModal
            key={selectedBuilding.name}
            isOpen={isSelectTeacherOpen}
            onClose={() => setIsSelectTeacherOpen(false)}
            onSelect={handleTeacherSelect}
            building={selectedBuilding.name}
            year={latestYear}
            groupKey={selectedBuilding.groupKey}
          />
        )}

        <ReportModal
          key={selectedTeacher?.teacherId}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          building={selectedBuilding?.name ?? null}
          teacher={selectedTeacher}
          yearId={selectedYearId}
          onSubmitted={refreshBuildingData}
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
