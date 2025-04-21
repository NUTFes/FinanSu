import Head from 'next/head';
import { useState, useMemo, useCallback } from 'react';
import FundInformationTable from '@/components/fund_information/FundInformationTable';
import { Title, Card } from '@components/common';
import OpenAddModalButton from '@components/fund_information/OpenAddModalButton';
import MainLayout from '@components/layout/MainLayout';

export interface FundInformation {
  id: number;
  date: string;
  description: string;
  item: string;
  amount: number;
  user: string;
  balance: number;
  isChecked: boolean;
}

const mockData: FundInformation[] = [
  {
    id: 1,
    date: '11/24',
    description: '情報局',
    item: 'ビール',
    amount: -10000,
    user: '技大太郎',
    balance: 90000,
    isChecked: true,
  },
  {
    id: 2,
    date: '11/25',
    description: '総務局',
    item: '備品購入',
    amount: -5000,
    user: '技大花子',
    balance: 85000,
    isChecked: false,
  },
  {
    id: 3,
    date: '11/26',
    description: '企画局',
    item: 'チケット販売',
    amount: 30000,
    user: '技大次郎',
    balance: 115000,
    isChecked: true,
  },
  {
    id: 4,
    date: '11/27',
    description: '渉外局',
    item: 'ポスター印刷',
    amount: -8000,
    user: '技大三郎',
    balance: 107000,
    isChecked: true,
  },
  {
    id: 5,
    date: '11/28',
    description: '渉外局',
    item: '協賛金',
    amount: 50000,
    user: '技大四郎',
    balance: 157000,
    isChecked: false,
  },
  {
    id: 6,
    date: '11/29',
    description: '財務局',
    item: '事務用品',
    amount: -3000,
    user: '技大五郎',
    balance: 154000,
    isChecked: true,
  },
  {
    id: 7,
    date: '11/30',
    description: '情報局',
    item: 'サーバー費用',
    amount: -15000,
    user: '技大太郎',
    balance: 139000,
    isChecked: false,
  },
  {
    id: 8,
    date: '12/01',
    description: '総務局',
    item: '助成金',
    amount: 25000,
    user: '技大花子',
    balance: 164000,
    isChecked: true,
  },
];

function useFundInformations() {
  const [fundInformations, setFundInformations] = useState<FundInformation[]>(mockData);

  const totalBalance = useMemo(() => {
    return fundInformations.length > 0 ? fundInformations[fundInformations.length - 1].balance : 0;
  }, [fundInformations]);

  const handleEdit = useCallback((id: number) => {
    // あとで編集処理をここに実装
  }, []);

  const handleDelete = useCallback((id: number) => {
    setFundInformations((prev) => prev.filter((item) => item.id !== id));
    // あとで削除処理をここに実装
  }, []);

  const handleCheckBoxClick = useCallback((id: number, checked: boolean) => {
    setFundInformations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked: checked } : item)),
    );
    // あとでチェックボックスの変更処理をここに実装
  }, []);

  return {
    fundInformations,
    totalBalance,
    handleEdit,
    handleDelete,
    handleCheckBoxClick,
  };
}

const FundInformationHeader = ({ totalBalance }: { totalBalance: number }) => (
  <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
    <Title title={'収支管理'} />
    <Title className='gap-0 text-xl'>
      残高<span className='ml-1'>{totalBalance.toLocaleString()}</span>
    </Title>
    <OpenAddModalButton teachers={[]} departments={[]} users={[]} currentYear={''}>
      収入報告
    </OpenAddModalButton>
  </div>
);

export default function FundInformations() {
  const { fundInformations, totalBalance, handleEdit, handleDelete, handleCheckBoxClick } =
    useFundInformations();

  return (
    <MainLayout>
      <Head>
        <title>収支管理</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10 min-h-[calc(100vh-12rem)]'>
          <div className='mx-4 my-4'>
            <FundInformationHeader totalBalance={totalBalance} />
          </div>

          <div className='mb-2 w-full overflow-x-auto p-5'>
            <FundInformationTable
              fundInformations={fundInformations}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCheckChange={handleCheckBoxClick}
            />
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}
