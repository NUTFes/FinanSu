import React, { useState, useCallback, useMemo } from 'react';
import { Invoice } from '@/type/common';
import { PreviewPDF, createSponsorActivitiesPDF } from '@/utils/createSponsorActivitiesInvoicesPDF';
import { getToday } from '@/utils/dateConverter';
import {
  Modal,
  Input,
  PrimaryButton,
  CloseButton,
  Textarea,
  DeleteButton,
  AddButton,
  Select,
} from '@components/common';
import { SponsorStyle } from '@type/common';

interface Item {
  id: string;
  styleName: string;
  quantity: number;
  price: number;
}

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  sponsorStyles: SponsorStyle[];
}

const defaultAddress = '〒940-2188 新潟県長岡市上富岡町1360-1長岡技術科学大学内';
const defaultSubject = '技大祭企業協賛';
const defaultDeadline = '2025-08-29';

export default function AddBlankInvoiceModal({ setIsOpen, sponsorStyles }: ModalProps) {
  const [form, setForm] = useState({
    sponsorName: '',
    managerName: '',
    subject: defaultSubject,
    issuedDate: getToday(),
    deadline: defaultDeadline,
    fesStuffName: '',
    remark: '',
  });
  const [items, setItems] = useState<Item[]>([
    {
      id: crypto.randomUUID(),
      styleName: '',
      quantity: 1,
      price: 0,
    },
  ]);

  const onChange = useCallback(
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    },
    [],
  );

  const parseNumericInput = useCallback((value: string): number => {
    const numericValue = parseInt(value.replace(/^0+/, ''), 10);
    return isNaN(numericValue) ? 0 : Math.max(0, numericValue);
  }, []);

  const onItemChange = useCallback(
    (id: string, key: keyof Omit<Item, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id !== id) return item;

          let value: string | number = e.target.value;
          if (key === 'quantity' || key === 'price') {
            value = parseNumericInput(value.toString());
          }

          return { ...item, [key]: value };
        }),
      );
    },
    [parseNumericInput],
  );

  const addItem = useCallback(() => {
    setItems((prevItems) => [
      ...prevItems,
      { id: crypto.randomUUID(), styleName: '', quantity: 1, price: 0 },
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const getDisplayStyleName = useCallback(
    (styleName: string): string => {
      const styleObj = sponsorStyles.find((s) => s.style === styleName);
      if (!styleObj) return styleName;
      return styleObj.feature ? `${styleObj.style}(${styleObj.feature})` : styleObj.style;
    },
    [sponsorStyles],
  );

  const createInvoiceData = useCallback((): Invoice => {
    return {
      sponsorName: form.sponsorName,
      managerName: form.managerName,
      totalPrice,
      fesStuffName: form.fesStuffName,
      invoiceSponsorStyle: items.map((item) => ({
        styleName: getDisplayStyleName(item.styleName),
        price: item.price * item.quantity,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      issuedDate: form.issuedDate,
      deadline: form.deadline,
      remark: form.remark,
      subject: form.subject,
      address: defaultAddress,
    } as Invoice;
  }, [form, items, totalPrice, getDisplayStyleName]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = useCallback(async () => {
    try {
      setIsProcessing(true);
      const invoiceData = createInvoiceData();
      await createSponsorActivitiesPDF(invoiceData, form.deadline, form.issuedDate);
    } catch (error) {
      console.error('PDF作成中にエラーが発生しました:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [createInvoiceData, form.deadline, form.issuedDate]);

  const styleOptions = useMemo(
    () =>
      sponsorStyles?.map((style) => ({
        value: style.style,
        label: style.feature ? `${style.style}(${style.feature})` : style.style,
        price: style.price,
      })) || [],
    [sponsorStyles],
  );

  const onItemStyleChange = useCallback(
    (id: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = styleOptions.find((opt) => opt.value === e.target.value);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? {
                ...item,
                styleName: selected?.value || '',
                price: selected?.price ?? 0,
              }
            : item,
        ),
      );
    },
    [styleOptions],
  );

  const isFormValid = useMemo(() => {
    return form.sponsorName.trim() !== '' && totalPrice > 0;
  }, [form.sponsorName, totalPrice]);

  return (
    <Modal className='h-[90vh] w-[95%] max-w-7xl' onClick={onClose}>
      <div className='flex h-full flex-col'>
        <div className='ml-auto w-fit'>
          <CloseButton onClick={onClose} />
        </div>
        <p className='mx-auto mb-4 w-fit text-2xl font-thin leading-8 tracking-widest text-black-600'>
          請求書の発行（手入力）
        </p>

        <div className='flex h-[calc(100%-4rem)] flex-1 gap-4 overflow-hidden p-4'>
          <div className='w-1/2 overflow-y-auto pr-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div>
                <p className='text-gray-600 mb-2 ml-1 text-sm'>企業名</p>
                <Input
                  type='text'
                  value={form.sponsorName}
                  onChange={onChange('sponsorName')}
                  className='mb-3 w-full'
                />
                <p className='text-gray-600 mb-2 ml-1 text-sm'>担当者名(企業)</p>
                <Input
                  type='text'
                  value={form.managerName}
                  onChange={onChange('managerName')}
                  className='mb-3 w-full'
                />
                <p className='text-gray-600 mb-2 ml-1 text-sm'>件名</p>
                <Input
                  type='text'
                  value={form.subject}
                  onChange={onChange('subject')}
                  className='mb-3 w-full'
                  placeholder='例: 技大祭企業協賛'
                />
                <p className='text-gray-600 mb-2 ml-1 text-sm'>請求日</p>
                <Input
                  type='date'
                  value={form.issuedDate}
                  onChange={onChange('issuedDate')}
                  className='mb-3 w-full'
                />
                <p className='text-gray-600 mb-2 ml-1 text-sm'>振込締切日</p>
                <Input
                  type='date'
                  value={form.deadline}
                  onChange={onChange('deadline')}
                  className='mb-3 w-full'
                />
                <p className='text-gray-600 mb-2 ml-1 text-sm'>担当者名(実行委員)</p>
                <Input
                  type='text'
                  value={form.fesStuffName}
                  onChange={onChange('fesStuffName')}
                  className='mb-3 w-full'
                />
              </div>

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <p className='text-gray-600 ml-1 text-sm'>協賛内容リスト</p>
                </div>

                <div className='text-gray-600 mb-2 grid grid-cols-12 gap-2 px-2 text-xs'>
                  <div className='col-span-5 text-center'>概要</div>
                  <div className='col-span-2 text-center'>数量</div>
                  <div className='col-span-2 text-center'>単価</div>
                  <div className='col-span-2 text-center'>小計</div>
                  <div className='col-span-1'></div>
                </div>

                <div className='mb-4 max-h-[300px] space-y-2 overflow-y-auto'>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='bg-gray-50 grid grid-cols-12 items-center gap-2 rounded p-2'
                    >
                      <div className='col-span-5'>
                        <Select value={item.styleName} onChange={onItemStyleChange(item.id)}>
                          <option value=''>協賛内容を選択</option>
                          {styleOptions.map((opt) => (
                            <option key={opt.value + opt.label} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className='col-span-2'>
                        <Input
                          type='number'
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={onItemChange(item.id, 'quantity')}
                          className='w-full text-center'
                        />
                      </div>
                      <div className='col-span-2'>
                        <Input
                          type='number'
                          value={item.price === 0 ? '' : item.price}
                          onChange={onItemChange(item.id, 'price')}
                          className='w-full text-center'
                        />
                      </div>
                      <div className='col-span-2 text-center'>
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className='col-span-1 flex justify-center'>
                        <button
                          type='button'
                          className='hover:text-red-700 text-red-500'
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          title='削除'
                        >
                          {items.length > 1 ? <DeleteButton /> : ''}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className='flex justify-center'>
                    <AddButton
                      className='text-blue-500 flex items-center text-sm hover:underline'
                      onClick={addItem}
                    >
                      項目追加
                    </AddButton>
                  </div>
                </div>

                <div className='mb-4 flex justify-end border-t pt-2'>
                  <div className='text-right'>
                    <span className='mr-4'>合計金額:</span>
                    <span className='text-xl'>¥{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <p className='text-gray-600 mb-2 ml-1 text-sm'>備考</p>
                <Textarea
                  value={form.remark}
                  onChange={onChange('remark')}
                  className='mb-3 w-full'
                />
              </div>

              <div className='mt-2 flex justify-center'>
                <PrimaryButton onClick={handleDownload} disabled={isProcessing || !isFormValid}>
                  {isProcessing ? '処理中...' : 'ダウンロード'}
                </PrimaryButton>
              </div>
            </div>
          </div>

          <div className='border-gray-200 flex w-1/2 flex-col overflow-hidden border-l pl-4'>
            <div className='flex-1 overflow-hidden'>
              <PreviewPDF
                invoiceItem={createInvoiceData()}
                deadline={form.deadline}
                issuedDate={form.issuedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
