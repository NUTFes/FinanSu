import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { IncomeExpenditureManagement } from '@/generated/model/incomeExpenditureManagement';
import { Checkbox, DeleteButton, EditButton } from '@components/common';

import DeleteConfirmModal from './modals/DeleteModal';
import UncheckConfirmModal from './modals/UncheckConfirmModal';

interface FundInformationTableProps {
  fundInformations: IncomeExpenditureManagement[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onCheckChange?: (id: number, checked: boolean) => Promise<void> | void;
}

const TableHeader = () => (
  <thead>
    <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
      <th className='w-[15%] pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>日付</div>
      </th>
      <th className='w-[15%] pb-2'>
        <div className='text-left text-sm font-normal text-black-600'>
          局名 <br /> or 収入内容
        </div>
      </th>
      <th className='w-[15%] pb-2'>
        <div className='text-left text-sm font-normal text-black-600'>
          購入物品 <br /> or 会社名
        </div>
      </th>
      <th className='w-[15%] pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>金額</div>
      </th>
      <th className='w-[15%] pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>残高</div>
      </th>
      <th className='w-[10%] pb-2'></th>
      <th className='w-[5%] pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>確認</div>
      </th>
    </tr>
  </thead>
);

const getAmountColor = (amount: number) => (amount < 0 ? '#B91C1C' : '#0891B2');

// 日付フォーマットを変換する関数
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length >= 3) {
      return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
};

const FundInformationRow = ({
  fundItem,
  isLastItem,
  onEdit,
  onDelete,
  onCheckChange,
}: {
  fundItem: IncomeExpenditureManagement;
  isLastItem: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onCheckChange?: (id: number, checked: boolean) => Promise<void> | void;
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUncheckModal, setShowUncheckModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [localIsChecked, setLocalIsChecked] = useState(fundItem.isChecked);

  useEffect(() => {
    if (!isChecking) {
      setLocalIsChecked(fundItem.isChecked);
    }
  }, [fundItem.isChecked, isChecking]);

  const handleEdit = () => onEdit?.(fundItem.id);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (id: number) => {
    onDelete?.(id);
  };

  const handleCheckBoxClick = () => {
    if (localIsChecked) {
      setShowUncheckModal(true);
    } else {
      setIsChecking(true);
      setLocalIsChecked(true);
      const result = onCheckChange?.(fundItem.id, true);
      if (result && typeof result.then === 'function') {
        result
          .then(() => {
            setIsChecking(false);
          })
          .catch(() => {
            setIsChecking(false);
          });
      } else {
        setIsChecking(false);
      }
    }
  };

  const handleUncheckConfirm = (id: number) => {
    setIsChecking(true);
    setLocalIsChecked(false);
    const result = onCheckChange?.(id, false);
    if (result && typeof result.then === 'function') {
      result
        .then(() => {
          setIsChecking(false);
          setShowUncheckModal(false);
        })
        .catch(() => {
          setIsChecking(false);
          setShowUncheckModal(false);
        });
    } else {
      setIsChecking(false);
      setShowUncheckModal(false);
    }
  };

  return (
    <>
      <tr className={clsx(!isLastItem && 'border-b')}>
        <td className='py-3'>
          <div className='text-center text-sm text-black-600'>{formatDate(fundItem.date)}</div>
        </td>
        <td>
          <div className='text-left text-sm text-black-600'>{fundItem.content.split(' ')[0]}</div>
        </td>
        <td>
          <div className='text-left text-sm text-black-600'>
            {fundItem.content.split(' ').slice(1).join(' ') || fundItem.detail || ''}
          </div>
        </td>
        <td>
          <div className='text-center text-sm' style={{ color: getAmountColor(fundItem.amount) }}>
            {fundItem.amount.toLocaleString()}
          </div>
        </td>
        <td>
          <div className='text-center text-sm text-black-600'>
            {fundItem.currentBalance.toLocaleString()}
          </div>
        </td>
        <td>
          <div className='flex justify-center gap-2'>
            <EditButton onClick={handleEdit} isDisabled={localIsChecked || fundItem.amount < 0} />
            <DeleteButton
              onClick={handleDeleteClick}
              isDisabled={localIsChecked || fundItem.amount < 0}
            />
          </div>
        </td>
        <td>
          <div className='flex justify-center'>
            <Checkbox
              checked={localIsChecked}
              onChange={handleCheckBoxClick}
              className='accent-primary-5'
              disabled={isChecking}
            />
          </div>
        </td>
      </tr>

      {showDeleteModal && (
        <DeleteConfirmModal
          setShowModal={setShowDeleteModal}
          id={fundItem.id}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showUncheckModal && (
        <UncheckConfirmModal
          setShowModal={setShowUncheckModal}
          id={fundItem.id}
          onConfirm={handleUncheckConfirm}
        />
      )}
    </>
  );
};

const EmptyRow = () => (
  <tr className='border-b border-primary-1'>
    <td className='px-1 py-3' colSpan={8}>
      <div className='flex justify-center'>
        <div className='text-sm text-black-600'>データがありません</div>
      </div>
    </td>
  </tr>
);

const FundInformationTable = ({
  fundInformations,
  onEdit,
  onDelete,
  onCheckChange,
}: FundInformationTableProps) => {
  return (
    <div className='min-w-[768px]'>
      <table className='w-full table-fixed border-collapse'>
        <TableHeader />
        <tbody className='text-nowrap'>
          {fundInformations.length > 0 ? (
            fundInformations.map((fundItem, index) => (
              <FundInformationRow
                key={fundItem.id}
                fundItem={fundItem}
                isLastItem={index === fundInformations.length - 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onCheckChange={onCheckChange}
              />
            ))
          ) : (
            <EmptyRow />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FundInformationTable;
