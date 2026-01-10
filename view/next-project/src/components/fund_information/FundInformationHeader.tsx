import { useRouter } from 'next/router';
import React from 'react';
import { Title, AddButton, OutlinePrimaryButton } from '@components/common';

interface FundInformationHeaderProps {
  totalBalance: number;
}

const FundInformationHeader: React.FC<FundInformationHeaderProps> = ({ totalBalance }) => {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push('/fund_informations/create');
  };

  return (
    <div className='flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between'>
      <Title title={'収支管理'} />
      <Title className='gap-0 text-xl'>
        残高<span className='ml-1'>{totalBalance.toLocaleString()}</span>
      </Title>
      <div className='flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center'>
        <OutlinePrimaryButton className='w-full md:w-fit'>
          <a
            href={`${process.env.CSR_API_URI}/income_expenditure_management/csv/download?year=2025`}
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
