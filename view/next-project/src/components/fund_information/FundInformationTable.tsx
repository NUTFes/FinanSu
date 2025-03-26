import clsx from 'clsx';
import { Checkbox, DeleteButton, EditButton } from '@components/common';
import { FundInformation } from '@pages/fund_informations/index';

interface FundInformationTableProps {
  fundInformations: FundInformation[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onCheckChange?: (id: number, checked: boolean) => void;
}

const TableHeader = () => (
  <thead>
    <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
      <th className='w-1/8 pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>日付</div>
      </th>
      <th className='w-1/8 pb-2'>
        <div className='text-left text-sm font-normal text-black-600'>
          局名 <br /> or 収入内容
        </div>
      </th>
      <th className='w-1/8 pb-2'>
        <div className='text-left text-sm font-normal text-black-600'>
          購入物品 <br /> or 会社名
        </div>
      </th>
      <th className='w-1/8 pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>金額</div>
      </th>
      <th className='w-1/8 pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>立替者</div>
      </th>
      <th className='w-1/8 pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>残高</div>
      </th>
      <th className='w-1/12 pb-2'></th>
      <th className='w-1/12 pb-2'>
        <div className='text-center text-sm font-normal text-black-600'>確認</div>
      </th>
    </tr>
  </thead>
);

const getAmountColor = (amount: number) => (amount < 0 ? '#B91C1C' : '#0891B2');

const FundInformationRow = ({
  fundItem,
  isLastItem,
  onEdit,
  onDelete,
  onCheckChange,
}: {
  fundItem: FundInformation;
  isLastItem: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onCheckChange?: (id: number, checked: boolean) => void;
}) => {
  const handleEdit = () => onEdit?.(fundItem.id);
  const handleDelete = () => onDelete?.(fundItem.id);
  const handleCheckChange = () => onCheckChange?.(fundItem.id, !fundItem.isChecked);

  return (
    <tr className={clsx(!isLastItem && 'border-b')}>
      <td className='py-3'>
        <div className='text-center text-sm text-black-600'>{fundItem.date}</div>
      </td>
      <td>
        <div className='text-left text-sm text-black-600'>{fundItem.description}</div>
      </td>
      <td>
        <div className='text-left text-sm text-black-600'>{fundItem.item}</div>
      </td>
      <td>
        <div className='text-center text-sm' style={{ color: getAmountColor(fundItem.amount) }}>
          {fundItem.amount.toLocaleString()}
        </div>
      </td>
      <td>
        <div className='text-center text-sm text-black-600'>{fundItem.user}</div>
      </td>
      <td>
        <div className='text-center text-sm text-black-600'>
          {fundItem.balance.toLocaleString()}
        </div>
      </td>
      <td>
        <div className='flex justify-center gap-2'>
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </div>
      </td>
      <td>
        <div className='flex justify-center'>
          <Checkbox
            checked={fundItem.isChecked}
            onChange={handleCheckChange}
            className='accent-primary-5'
          />
        </div>
      </td>
    </tr>
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
