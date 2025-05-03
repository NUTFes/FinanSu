import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import {
  CloseButton,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  PullDown,
  Select,
} from '@components/common';
import PurchaseReportAddModal from '@components/purchasereports/PurchaseReportAddModal';
import { useUI } from '@components/ui/context';
import { PurchaseOrder, Expense, YearPeriod } from '@type/common';
import { get } from '@utils/api/api_methods';

export default function PurchaseReportItemNumModal() {
  const date = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(date.getFullYear());
  const [yearPeriods, setYearPeriods] = useState<YearPeriod[]>([]);
  useEffect(() => {
    const getPurchaseReportsUrl = process.env.CSR_API_URI + '/years/periods';
    const getPeriods = async () => {
      const res = await get(getPurchaseReportsUrl);
      const year = res ? res[res.length - 1].year : date.getFullYear();
      setSelectedYear(year);
      setYearPeriods(res);
    };
    getPeriods();
  }, []);

  const [user] = useRecoilState(userAtom);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseID, setExpenseID] = useState(0);

  useEffect(() => {
    const getExpenseByPeriodsUrl =
      process.env.CSR_API_URI + '/expenses/fiscalyear/' + String(selectedYear);
    const getExpenses = async () => {
      const res = await get(getExpenseByPeriodsUrl);
      setExpenses(res);
      setExpenseID(res ? res[0].id : null);
    };
    getExpenses();
  }, [selectedYear]);

  const { setModalView, openModal, closeModal } = useUI();

  // 購入物品数用の配列
  const purchaseItemNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // 購入申請の追加モーダル開閉用変数
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };

  // 購入物品数
  const [purchaseItemNum, setPurchaseItemNum] = useState({
    value: 1,
  });
  // 購入申請ID

  // 購入物品数用のhandler
  const purchaseItemNumHandler = (input: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPurchaseItemNum({ ...purchaseItemNum, [input]: e.target.value });
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  let monthStr = '';
  let dayStr = '';
  if (month < 10) {
    monthStr = '0' + String(month);
  } else {
    monthStr = String(month);
  }
  if (day < 10) {
    dayStr = '0' + String(day);
  } else {
    dayStr = String(day);
  }

  const purchaseOrder: PurchaseOrder = {
    deadline: String(year) + '-' + monthStr + '-' + dayStr,
    userID: user.id,
    financeCheck: false,
    expenseID: expenseID || 0,
  };

  return (
    <>
      <Modal className='md:w-1/2'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={closeModal} />
        </div>
        <p className='mx-auto mb-10 w-fit text-xl text-black-600'>購入報告単体で登録</p>
        <p className='mx-auto w-fit text-black-600'>報告する物品の個数を入力してください</p>
        <div>
          <div className='my-10 flex justify-center gap-5'>
            <p className='text-black-600'>購入物品数</p>
            <div className='w-1/3'>
              <PullDown value={purchaseItemNum.value} onChange={purchaseItemNumHandler('value')}>
                {purchaseItemNumArray.map((data) => (
                  <option key={data} value={data}>
                    {data}
                  </option>
                ))}
              </PullDown>
            </div>
          </div>
          <div className='my-10 grid grid-cols-5 gap-5'>
            <div className='col-span-2 flex w-full items-center justify-center'>
              <p className=' text-black-600'>年度</p>
            </div>
            <div className='col-span-3 w-3/4'>
              <Select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                }}
              >
                {yearPeriods.map((yearPeriod) => (
                  <option key={yearPeriod.id} value={yearPeriod.year}>
                    {yearPeriod.year}年度
                  </option>
                ))}
              </Select>
            </div>
            <div className='col-span-2 flex w-full items-center justify-center'>
              <p className=' text-black-600'>購入した局・団体</p>
            </div>
            <div className='col-span-3 w-3/4'>
              <Select
                value={expenseID}
                onChange={(e) => {
                  setExpenseID(Number(e.target.value));
                }}
              >
                {expenses &&
                  expenses.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                {!expenses && <option>局・団体が登録されていません</option>}
              </Select>
            </div>
          </div>
        </div>
        <div className='flex justify-center gap-5'>
          <OutlinePrimaryButton
            onClick={() => {
              setModalView('PURCHASE_REPORT_ADD_MODAL');
              openModal();
            }}
          >
            戻る
          </OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              onOpen();
            }}
            disabled={!expenses}
          >
            報告へ進む
          </PrimaryButton>
        </div>
      </Modal>
      {isOpen && (
        <PurchaseReportAddModal
          purchaseItemNum={purchaseItemNum.value}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isOnlyReported={true}
          purchaseOrder={purchaseOrder}
        />
      )}
    </>
  );
}
