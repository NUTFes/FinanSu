import React, { useState, useCallback } from 'react';
import { VscTriangleRight, VscTriangleDown } from 'react-icons/vsc';

import Status from './Status';

import type {
  BuyReportInformation,
  FestivalItemsForMyPage,
  FestivalItemWithReport,
} from '@/generated/model';

interface TableSectionProps {
  festivalItemDetails: FestivalItemsForMyPage;
}

// 文字列の切り詰め
const useTruncateText = () => {
  const truncate = useCallback((value: string, maxLen = 10) => {
    if (!value) return '';
    return value.length > maxLen ? value.slice(0, maxLen) + '…' : value;
  }, []);
  return truncate;
};

// 日付の変換
const convertDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

// テーブルヘッダー
const TableHeader: React.FC = () => (
  <thead className='bg-gray-100'>
    <tr className='border-primary-1 border-b py-3 text-sm'>
      <th className='text-black-600 w-1/3 py-2 pl-14 pr-4 text-left font-normal'>物品名</th>
      <th className='w-1/8 text-black-600 p-2 text-left font-normal'>予算</th>
      <th className='w-1/8 text-black-600 p-2 text-left font-normal'>使用額</th>
      <th className='w-1/8 text-black-600 p-2 text-left font-normal'>残高</th>
      <th className='text-black-600 p-2 text-left font-normal'></th>
    </tr>
  </thead>
);

// テーブルの項目
interface TableItemProps {
  item: FestivalItemWithReport;
  isExpanded: boolean;
  toggleItem: (itemName: string) => void;
  truncateItemName: (value: string, maxLen?: number) => string;
}

const TableItem: React.FC<TableItemProps> = ({
  item,
  isExpanded,
  toggleItem,
  truncateItemName,
}) => {
  const hasSubitems = item.buyReports && item.buyReports.length > 0;

  return (
    <>
      <tr
        className={`
          ${hasSubitems ? 'cursor-pointer' : ''}
        `}
        onClick={() => {
          if (hasSubitems) toggleItem(item.festivalItemName || '');
        }}
      >
        <td className='text-black-300 py-4 pl-8 pr-4 text-left align-top'>
          {hasSubitems && (
            <span className='inline-flex items-center gap-1'>
              <span className='flex items-center text-blue-500'>
                {isExpanded ? (
                  <VscTriangleDown className='text-[#06B6D4]' />
                ) : (
                  <VscTriangleRight className='text-[#06B6D4]' />
                )}
              </span>
              <span className='text-sm font-normal'>
                {truncateItemName(item?.festivalItemName || '')}
              </span>
            </span>
          )}
          {!hasSubitems && (
            <span className='text-black-300 text-sm'>
              {truncateItemName(item?.festivalItemName || '')}
            </span>
          )}
        </td>
        <td className='px-2 py-4 align-top'>{item.festivalItemTotal?.budget?.toLocaleString()}</td>
        <td className='px-2 py-4 align-top'>{item.festivalItemTotal?.expense?.toLocaleString()}</td>
        <td className='px-2 py-4 align-top'>{item.festivalItemTotal?.balance?.toLocaleString()}</td>
        <td className='px-2 py-4 align-top'></td>
      </tr>
      {isExpanded && hasSubitems && item.buyReports && (
        <TableSubItem
          items={item.buyReports}
          itemsName={item?.festivalItemName}
          truncateItemName={truncateItemName}
        />
      )}
    </>
  );
};

// テーブルのサブ項目
interface TableSubItemProps {
  items: BuyReportInformation[];
  itemsName: string | undefined;
  truncateItemName: (value: string, maxLen?: number) => string;
}

const TableSubItem: React.FC<TableSubItemProps> = ({ items, itemsName, truncateItemName }) => {
  return (
    <tr>
      <td colSpan={5}>
        <div
          className='
            md:w-9/10 flex w-full justify-start
            px-2
          '
        >
          <div
            className='
              mx-6 w-full overflow-auto rounded-md bg-[#F3F3F3] px-10 py-3
            '
          >
            <table
              className='
                wrap-break-word text-black-300 w-full table-auto whitespace-normal
                text-sm
              '
              onClick={(e) => e.stopPropagation()}
            >
              <tbody>
                {items.map((item) => (
                  <tr key={item.buyReportName}>
                    <td className='text-nowrap w-[30%] p-2 text-left'>
                      {truncateItemName(itemsName || '')}
                    </td>
                    <td className='text-nowrap w-[15%] p-2 text-center'>
                      {convertDate(item?.reportDate ?? '')}
                    </td>
                    <td className='text-nowrap w-[15%] p-2 text-center'>
                      {item.buyReportName || '-'}
                    </td>
                    <td className='text-nowrap w-[15%] p-2 text-center'>
                      {item.amount ? item.amount.toLocaleString() : '-'}
                    </td>
                    <td className='w-[15%] p-2'>
                      <Status status={item.status || '確認中'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};

// テーブルフッター
interface TableFooterProps {
  totalBudget: number;
  totalUsed: number;
  totalRemaining: number;
}

const TableFooter: React.FC<TableFooterProps> = ({ totalBudget, totalUsed, totalRemaining }) => (
  <tfoot>
    <tr className='border-primary-1 border-t'>
      <td className='px-2 py-4 text-left'>合計</td>
      <td className='px-2 py-4'>{totalBudget.toLocaleString()}</td>
      <td className='px-2 py-4'>{totalUsed.toLocaleString()}</td>
      <td className='px-2 py-4'>{totalRemaining.toLocaleString()}</td>
      <td className='px-2 py-4' />
    </tr>
  </tfoot>
);

// メインコンポーネント
const TableSection: React.FC<TableSectionProps> = ({ festivalItemDetails }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const totalBudget = festivalItemDetails.divisionTotal?.budget ?? 0;
  const totalUsed = festivalItemDetails.divisionTotal?.expense ?? 0;
  const totalRemaining = festivalItemDetails.divisionTotal?.balance ?? 0;
  const truncateItemName = useTruncateText();

  const toggleItem = useCallback((itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  }, []);

  return (
    <div className='mb-8'>
      <h3 className='text-black-300 mb-2 text-base font-light'>
        {festivalItemDetails.divisionName}
      </h3>

      <div className='w-full overflow-x-auto'>
        <table className='text-nowrap min-w-full table-fixed'>
          <TableHeader />
          <tbody className='align-top'>
            {festivalItemDetails.festivalItems &&
              festivalItemDetails.festivalItems.map((item) => (
                <TableItem
                  key={item.festivalItemName}
                  item={item}
                  isExpanded={expandedItems[item.festivalItemName || '']}
                  toggleItem={toggleItem}
                  truncateItemName={truncateItemName}
                />
              ))}
          </tbody>
          <TableFooter
            totalBudget={totalBudget}
            totalUsed={totalUsed}
            totalRemaining={totalRemaining}
          />
        </table>
      </div>
    </div>
  );
};

export default TableSection;
