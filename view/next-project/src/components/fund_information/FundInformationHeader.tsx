import { useRouter } from 'next/router';
import React from 'react';
import { Title, AddButton } from '@components/common';

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
      <AddButton onClick={handleCreateClick}>収入報告</AddButton>
    </div>
  );
};

export default FundInformationHeader;
