import React, { useState, useMemo, useCallback } from 'react';
import { VscTriangleRight, VscTriangleDown } from 'react-icons/vsc';
import Status from './Status';
import { Item } from '@/pages/mypage/mockData';

interface TableSectionProps {
  department: string;
  items: Item[];
}

// 文字列の切り詰め
const useTruncateText = () => {
  const truncate = useCallback((value: string, maxLen = 10) => {
    if (!value) return '';
    return value.length > maxLen ? value.slice(0, maxLen) + '…' : value;
  }, []);
  return truncate;
};

// 予算、使用額、残高の合計の計算（あとで削除）
const useItemTotals = (items: Item[]) => {
  const calculateItemTotals = useCallback(
    (item: Item): { budget: number; used: number; remaining: number } => {
      const budget = item.budget ?? 0;
      const used = item.used;
      const remaining = item.remaining ?? 0;

      if (item.subitems && item.subitems.length > 0) {
        return item.subitems.reduce(
          (acc, subitem) => {
            const subTotal = calculateItemTotals(subitem);
            return {
              budget: acc.budget + subTotal.budget,
              used: acc.used + subTotal.used,
              remaining: acc.remaining + subTotal.remaining,
            };
          },
          { budget, used, remaining },
        );
      }

      return { budget, used, remaining };
    },
    [],
  );

  const { totalBudget, totalUsed, totalRemaining } = useMemo(() => {
    const totals = items.reduce(
      (acc, item) => {
        const itemTotal = calculateItemTotals(item);
        return {
          budget: acc.budget + itemTotal.budget,
          used: acc.used + itemTotal.used,
          remaining: acc.remaining + itemTotal.remaining,
        };
      },
      { budget: 0, used: 0, remaining: 0 },
    );

    return {
      totalBudget: totals.budget,
      totalUsed: totals.used,
      totalRemaining: totals.remaining,
    };
  }, [items, calculateItemTotals]);

  return { totalBudget, totalUsed, totalRemaining };
};

// テーブルヘッダー
const TableHeader: React.FC = () => (
  <thead className='bg-gray-100'>
    <tr className='border-b border-primary-1 py-3 text-sm'>
      <th className='w-1/3 py-2 pb-2 pl-14 pr-4 text-left font-normal text-black-600'>物品名</th>
      <th className='w-1/8 px-2 py-2 pb-2 text-left font-normal text-black-600'>予算</th>
      <th className='w-1/8 px-2 py-2 pb-2 text-left font-normal text-black-600'>使用額</th>
      <th className='w-1/8 px-2 py-2 pb-2 text-left font-normal text-black-600'>残高</th>
      <th className='px-2 py-2 pb-2 text-left font-normal text-black-600'></th>
    </tr>
  </thead>
);

// テーブルの項目
interface TableItemProps {
  item: Item;
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
  const hasSubitems = (item.subitems && item.subitems.length > 0) || false;

  return (
    <>
      <tr
        className={`${hasSubitems ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (hasSubitems) toggleItem(item.name);
        }}
      >
        <td className='py-4 pl-8 pr-4 text-left align-top text-[#333]'>
          {hasSubitems && (
            <span className='inline-flex items-center gap-1'>
              <span className='text-blue-500 flex items-center'>
                {isExpanded ? (
                  <VscTriangleDown className='text-[#06B6D4]' />
                ) : (
                  <VscTriangleRight className='text-[#06B6D4]' />
                )}
              </span>
              <span className='text-sm font-normal'>{truncateItemName(item.name)}</span>
            </span>
          )}
          {!hasSubitems && (
            <span className='text-sm text-[#333]'>{truncateItemName(item.name)}</span>
          )}
          {(item.reporter || item.purchase_date) && (
            <span className='ml-4 text-sm text-[#333]'>
              {item.purchase_date && <span className='mr-4'>{item.purchase_date}</span>}
              {item.reporter && <span>{item.reporter}</span>}
            </span>
          )}
        </td>
        <td className='px-2 py-4 align-top'>{item.budget ? item.budget.toLocaleString() : '-'}</td>
        <td className='px-2 py-4 align-top'>{item.used.toLocaleString()}</td>
        <td className='px-2 py-4 align-top'>
          {item.remaining ? item.remaining.toLocaleString() : '-'}
        </td>
        <td className='px-2 py-4 align-top'></td>
      </tr>
      {isExpanded && hasSubitems && (
        <TableSubItem item={item} truncateItemName={truncateItemName} />
      )}
    </>
  );
};

// テーブルのサブ項目
interface TableSubItemProps {
  item: Item;
  truncateItemName: (value: string, maxLen?: number) => string;
}

const TableSubItem: React.FC<TableSubItemProps> = ({ item, truncateItemName }) => {
  return (
    <tr>
      <td colSpan={5}>
        <div className='flex w-full justify-start px-2 md:w-[90%]'>
          <div className='mx-6 w-full overflow-auto rounded-md bg-[#F3F3F3] px-10 py-3'>
            <table
              className='w-full table-auto whitespace-normal break-words text-sm text-[#333]'
              onClick={(e) => e.stopPropagation()}
            >
              <tbody>
                {(item.subitems || []).map((subitem) => (
                  <tr key={subitem.name}>
                    <td className='w-[30%] text-nowrap px-2 py-2 text-left'>
                      {truncateItemName(subitem.name)}
                    </td>
                    <td className='w-[15%] text-nowrap px-2 py-2 text-center'>
                      {subitem.purchase_date || '-'}
                    </td>
                    <td className='w-[15%] text-nowrap px-2 py-2 text-center'>
                      {subitem.reporter || '-'}
                    </td>
                    <td className='w-[15%] text-nowrap px-2 py-2 text-center'>
                      {subitem.used.toLocaleString()}
                    </td>
                    <td className='w-[15%] px-2 py-2'>
                      <Status status={subitem.status} />
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
    <tr className='border-t border-primary-1'>
      <td className='px-2 py-4 text-left'>合計</td>
      <td className='px-2 py-4'>{totalBudget.toLocaleString()}</td>
      <td className='px-2 py-4'>{totalUsed.toLocaleString()}</td>
      <td className='px-2 py-4'>{totalRemaining.toLocaleString()}</td>
      <td className='px-2 py-4' />
    </tr>
  </tfoot>
);

// メインコンポーネント
const TableSection: React.FC<TableSectionProps> = ({ department, items }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const { totalBudget, totalUsed, totalRemaining } = useItemTotals(items);
  const truncateItemName = useTruncateText();

  const toggleItem = useCallback((itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  }, []);

  return (
    <div className='mb-8'>
      <h3 className='mb-2 text-base font-light text-[#333]'>{department}</h3>

      <div className='w-full overflow-x-auto'>
        <table className='min-w-full table-fixed text-nowrap'>
          <TableHeader />
          <tbody className='align-top'>
            {items.map((item) => (
              <TableItem
                key={item.name}
                item={item}
                isExpanded={expandedItems[item.name]}
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
