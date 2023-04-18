import React, { FC, useMemo } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { Modal } from '@components/common';
import { ExpenseView } from '@type/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  expenseView: ExpenseView;
}

const DetailModal: FC<ModalProps> = (props) => {
  const onClose = () => {
    props.setIsOpen(false);
  };

  const discountTotal = useMemo(() => {
    return props.expenseView.purchaseDetails
      ? props.expenseView.purchaseDetails.reduce((acc, cur) => {
          return acc + cur.purchaseReport.discount;
        }, 0)
      : 0;
  }, [props.expenseView.purchaseDetails]);

  const additionTotal = useMemo(() => {
    return props.expenseView.purchaseDetails
      ? props.expenseView.purchaseDetails.reduce((acc, cur) => {
          return acc + cur.purchaseReport.addition;
        }, 0)
      : 0;
  }, [props.expenseView.purchaseDetails]);

  return (
    <Modal className='w-1/2'>
      <div className='w-full'>
        <div className='mr-5 ml-auto w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      <p className='mx-auto mb-8 w-fit text-2xl font-thin leading-8 tracking-widest text-black-600'>
        支出の詳細
      </p>
      <div className='my-10 flex flex-wrap justify-center gap-8'>
        <div className='flex gap-3'>
          <p className='text-black-600'>支出元</p>
          <p className='border-b border-primary-1'>{props.expenseView.expense.name}</p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>合計金額</p>
          <p className='border-b border-primary-1'>{props.expenseView.expense.totalPrice}</p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>割引合計</p>
          <p className='border-b border-primary-1'>{discountTotal}</p>
        </div>
        <div className='flex gap-3'>
          <p className='text-black-600'>加算合計</p>
          <p className='border-b border-primary-1'>{additionTotal}</p>
        </div>
      </div>
      <p className='my-5 mx-auto w-fit text-xl text-black-600'>購入物品</p>
      <table className='w-full table-auto border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
            <th className='px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>名前</div>
            </th>
            <th className='px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>数量</div>
            </th>
            <th className='px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>金額</div>
            </th>
          </tr>
        </thead>
        <tbody className='border border-x-white-0 border-b-primary-1'>
          {props.expenseView.purchaseDetails ? (
            props.expenseView.purchaseDetails.map((purchaseDetail) =>
              purchaseDetail.purchaseItems.map((purchaseItem) => (
                <tr key={purchaseItem.id}>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>{purchaseItem.item}</div>
                  </td>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>
                      {purchaseItem.quantity}
                    </div>
                  </td>
                  <td className='py-3'>
                    <div className='text-center text-sm text-black-600'>{purchaseItem.price}</div>
                  </td>
                </tr>
              )),
            )
          ) : (
            <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              <td className='py-3' colSpan={3}>
                <div className='text-center text-sm text-black-600'>購入物品がありません</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Modal>
  );
};

export default DetailModal;
