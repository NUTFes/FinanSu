import { useRouter } from 'next/router';
import React from 'react';

import { YearPeriods } from '@/generated/model/yearPeriods';
import { AddButton, OutlinePrimaryButton, Title } from '@components/common';

interface FundInformationHeaderProps {
  totalBalance: number;
  selectedYear: number;
  yearPeriods?: YearPeriods[];
  onYearChange: (year: number) => void;
}

const FundInformationHeader: React.FC<FundInformationHeaderProps> = ({
  totalBalance,
  selectedYear,
  yearPeriods,
  onYearChange,
}) => {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push({
      pathname: '/fund_informations/create',
      query: { year: selectedYear },
    });
  };

  return (
    <div
      className='
        flex flex-col items-center gap-4
        md:flex-row md:items-center md:justify-between
      '
    >
      <div className='flex items-center gap-4'>
        <Title title={'収支管理'} />
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className='border-b border-black-300'
        >
          {yearPeriods?.map((yp) => (
            <option key={yp.year} value={yp.year}>
              {yp.year}年度
            </option>
          ))}
        </select>
      </div>
      <Title className='gap-0 text-xl'>
        残高<span className='ml-1'>{totalBalance.toLocaleString()}</span>
      </Title>
      <div
        className='
          flex w-full flex-col gap-2
          md:w-auto md:flex-row md:items-center
        '
      >
        <OutlinePrimaryButton
          className='
            w-full
            md:w-fit
          '
        >
          <a
            href={`${process.env.CSR_API_URI}/income_expenditure_management/csv/download?year=${selectedYear}`}
            download
          >
            CSVダウンロード
          </a>
        </OutlinePrimaryButton>
        <AddButton onClick={handleCreateClick}>収入報告</AddButton>
      </div>
    </div>
  );
};

export default FundInformationHeader;
