import React, { FC } from 'react';
import { RiCloseCircleLine, RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { del } from '@api/api_methods';
import { Modal, Checkbox, Tooltip, RedButton } from '@components/common';
import clsx from 'clsx';
import { useGlobalContext } from '@components/global/context';
import { PurchaseReport, PurchaseItem, PurchaseReportView } from '@pages/purchasereports';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  children?: React.ReactNode;
  id: number | string;
  purchaseReportViewItem: PurchaseReportView;
  isDelete: boolean;
}

const DetailModal: FC<ModalProps> = (props) => {
  const state = useGlobalContext();
  const onClose = () => {
    props.setIsOpen(false);
  };

  const router = useRouter();

  const formatDate = (date: string) => {
    let datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };

  const deletePurchaseOrders = async (id: number | string) => {
    const deletePurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders/' + id;
    await del(deletePurchaseOrderUrl);
    router.reload();
  };

  // 購入報告の合計金額を計算
  const TotalFee = (purchaseReport: PurchaseReport, purchaseItems: PurchaseItem[]) => {
    let totalFee = 0;
    purchaseItems.map((purchaseItem: PurchaseItem) => {
      totalFee += purchaseItem.price * purchaseItem.quantity;
    });
    totalFee += purchaseReport.addition - purchaseReport.discount;
    return totalFee;
  };

  return (
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 grid w-full justify-items-end')}>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      <div
        className={clsx(
          'mb-8 grid w-full justify-items-center text-2xl font-thin leading-8 tracking-widest text-black-600',
        )}
      >
        報告の詳細
      </div>
      <div className={clsx('mb-8 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-1 grid')} />
        <div className={clsx('col-span-10 grid')}>
          <div className={clsx('my-2 grid w-full grid-cols-12')}>
            <div className={clsx('col-span-3 mr-2 grid justify-items-end')}>
              <div className={clsx('text-md flex items-center text-black-600')}>ID</div>
            </div>
            <div
              className={clsx(
                'col-span-3 grid w-full border border-x-white-0 border-b-primary-1 border-t-white-0 pl-1',
              )}
            >
              {props.purchaseReportViewItem && props.purchaseReportViewItem.purchasereport.id}
            </div>
            <div className={clsx('col-span-3 mr-2 grid justify-items-end')}>
              <div className={clsx('text-md flex items-center text-black-600')}>合計金額</div>
            </div>
            <div
              className={clsx(
                'col-span-3 grid w-full border border-x-white-0 border-b-primary-1 border-t-white-0 pl-1',
              )}
            >
              {props.purchaseReportViewItem &&
                TotalFee(
                  props.purchaseReportViewItem.purchasereport,
                  props.purchaseReportViewItem.purchaseitems,
                )}
            </div>
          </div>
          <div className={clsx('col-span-1 grid ')} />
          <div className={clsx('my-2 grid w-full grid-cols-12')}>
            <div className={clsx('col-span-3 mr-2 grid justify-items-end')}>
              <div className={clsx('text-md flex items-center text-black-600')}>報告した局</div>
            </div>
            <div
              className={clsx(
                'col-span-3 grid w-full border border-x-white-0 border-b-primary-1 border-t-white-0 pl-1',
              )}
            >
              {props.purchaseReportViewItem &&
                props.purchaseReportViewItem.report_user.bureau_id === 1 &&
                '総務局'}
              {props.purchaseReportViewItem &&
                props.purchaseReportViewItem.report_user.bureau_id === 2 &&
                '渉外局'}
              {props.purchaseReportViewItem &&
                props.purchaseReportViewItem.report_user.bureau_id === 3 &&
                '財務局'}
              {props.purchaseReportViewItem &&
                props.purchaseReportViewItem.report_user.bureau_id === 4 &&
                '企画局'}
              {props.purchaseReportViewItem &&
                props.purchaseReportViewItem.report_user.bureau_id === 5 &&
                '政策局'}
              {props.purchaseReportViewItem &&
                props.purchaseReportViewItem.report_user.bureau_id === 6 &&
                '情報局'}
            </div>
            <div className={clsx('col-span-3 mr-2 grid justify-items-end')}>
              <div className={clsx('text-md flex items-center text-black-600')}>報告日</div>
            </div>
            <div
              className={clsx(
                'col-span-3 grid w-full border border-x-white-0 border-b-primary-1 border-t-white-0 pl-1',
              )}
            >
              {props.purchaseReportViewItem &&
                formatDate(props.purchaseReportViewItem.purchasereport.created_at)}
            </div>
          </div>
          <div className={clsx('my-2 grid w-full grid-cols-12')}>
            <div className={clsx('col-span-3 mr-2 grid justify-items-end')}>
              <div className={clsx('text-md flex items-center text-black-600')}>割引</div>
            </div>
            <div
              className={clsx(
                'col-span-3 grid w-full border border-x-white-0 border-b-primary-1 border-t-white-0 pl-1',
              )}
            >
              {props.purchaseReportViewItem && props.purchaseReportViewItem.purchasereport.discount}
            </div>
            <div className={clsx('col-span-3 mr-2 grid justify-items-end')}>
              <div className={clsx('text-md flex items-center text-black-600')}>加算</div>
            </div>
            <div
              className={clsx(
                'col-span-3 grid w-full border border-x-white-0 border-b-primary-1 border-t-white-0 pl-1',
              )}
            >
              {props.purchaseReportViewItem && props.purchaseReportViewItem.purchasereport.addition}
            </div>
          </div>
          <div className={clsx('my-2 grid w-full grid-cols-12')}></div>
          <div className={clsx('col-span-1 grid ')} />
        </div>
      </div>

      <div className={clsx('mt-2 mb-5 grid w-full justify-items-center text-base text-black-600')}>
        購入物品
      </div>
      <div className={clsx('grid h-[20rem] w-full justify-items-center')}>
        <div
          className={clsx('w-6/7 overflow-auto border border-x-0 border-t-0 border-b-primary-1')}
        >
          <table className={clsx('border-collapse: collapse w-full table-fixed')}>
            <thead>
              <tr
                className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0 py-3')}
              >
                {state.user.role_id === 1 ? (
                  <th className={clsx('w-3/12 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>品名</div>
                  </th>
                ) : (
                  <th className={clsx('w-4/12 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>品名</div>
                  </th>
                )}
                <th className={clsx('w-2/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>単価</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>個数</div>
                </th>
                <th className={clsx('w-3/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>詳細</div>
                </th>
                <th className={clsx('w-2/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>URL</div>
                </th>
                {state.user.role_id === 3 ? (
                  <th className={clsx('w-2/12 border-b-primary-1 pb-2')}>
                    <div className={clsx('text-center text-sm text-black-600')}>局長確認</div>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody
              className={clsx('w-full border border-x-white-0 border-b-primary-1 border-t-white-0')}
            >
              {/* <div className={clsx('flex items-start')}> */}
              {props.purchaseReportViewItem?.purchaseitems.map((purchaseItem, index) => (
                <tr key={purchaseItem.id} className={clsx('w-full')}>
                  <td className={clsx('border-b py-3')}>
                    <div className={clsx('text-center text-sm text-black-300')}>
                      {purchaseItem.item}
                    </div>
                  </td>
                  <td className={clsx('border-b py-3')}>
                    <div className={clsx('text-center text-sm text-black-300')}>
                      {purchaseItem.price}
                    </div>
                  </td>
                  <td className={clsx('border-b py-3')}>
                    <div className={clsx('text-center text-sm text-black-300')}>
                      {purchaseItem.quantity}
                    </div>
                  </td>
                  <td className={clsx('border-b py-3')}>
                    <div className={clsx('text-center text-sm text-black-300')}>
                      {purchaseItem.detail}
                    </div>
                  </td>
                  <td className={clsx('border-b py-3')}>
                    <div className={clsx('text-center text-sm text-black-300')}>
                      <div className={clsx('flex justify-center')}>
                        <a
                          className={clsx('mx-1')}
                          href={purchaseItem.url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <RiExternalLinkLine size={'16px'} />
                        </a>
                        <Tooltip text={'copy URL'}>
                          <RiFileCopyLine
                            className={clsx('mx-1')}
                            size={'16px'}
                            onClick={() => {
                              navigator.clipboard.writeText(purchaseItem.url);
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </td>
                  {state.user.role_id === 3 ? (
                    <td className={clsx('border-b py-3')}>
                      <div className={clsx('text-center text-sm text-black-300')}>
                        <Checkbox checked={purchaseItem.finance_check} disabled={true} />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={clsx('mt-3 grid w-full justify-items-center')}>
        {props.isDelete && (
          <RedButton
            onClick={() => {
              deletePurchaseOrders(props.id);
            }}
          >
            申請を削除する
          </RedButton>
        )}
      </div>
    </Modal>
  );
};

export default DetailModal;
