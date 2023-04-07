import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RiArrowDropRightLine } from 'react-icons/ri';

import { post } from '@api/sponsorStyle';
import {
  CloseButton,
  Input,
  Modal,
  OutlinePrimaryButton,
  PrimaryButton,
  Stepper,
  Select,
} from '@components/common';
import { SCALE } from '@constants/scale';
import { SponsorStyle } from '@type/common';

import { useUI } from '../ui/context';

interface ModalProps {
  purchaseItemNum: number;
  setIsOpen: (isOpen: boolean) => void;
}

const TABLE_COLUMNS = ['広告サイズ', 'カラーorモノクロ', '金額'];

export default function SponsorStyleAddModal(props: ModalProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const router = useRouter();
  const { closeModal } = useUI();
  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };
  const reset = () => {
    setActiveStep(1);
    setIsDone(false);
  };

  // 協賛スタイルを登録するかどうかのフラグ
  const [isDone, setIsDone] = useState<boolean>(false);

  // 協賛スタイル数だけステップを用意
  const steps = [];
  for (let i = 0; i < props.purchaseItemNum; i++) {
    steps.push({ label: '' });
  }

  // 協賛スタイル
  const [formData, setFormData] = useState<SponsorStyle>({
    id: 0,
    scale: SCALE[0],
    isColor: false,
    price: 0,
  });

  // 協賛スタイルのリスト
  const [formDataList, setFormDataList] = useState<SponsorStyle[]>(() => {
    const initFormDataList = [];
    for (let i = 0; i < props.purchaseItemNum; i++) {
      const initFormData: SponsorStyle = {
        id: i + 1,
        scale: SCALE[0],
        isColor: false,
        price: 0,
      };
      initFormDataList.push(initFormData);
    }
    return initFormDataList;
  });

  const formDataListHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormDataList(
        formDataList.map((formData: SponsorStyle) =>
          formData.id === Number(e.target.id) ? { ...formData, [input]: e.target.value } : formData,
        ),
      );
    };

  // 協賛スタイルの登録と購入物品の更新を行い、ページをリロード
  const submit = (data: SponsorStyle[]) => {
    addSponsorStyles(data);
    props.setIsOpen(false);
    closeModal();
    router.reload();
  };

  // 協賛スタイルの追加
  const addSponsorStyles = async (data: SponsorStyle[]) => {
    data.map(async (data: SponsorStyle) => {
      const purchaseReportUrl = process.env.CSR_API_URI + '/sponsorstyles';
      await post(purchaseReportUrl, data);
    });
  };

  // 購入物品の情報
  const content = (data: SponsorStyle) => (
    <>
      <div className='mx-auto grid grid-cols-5 items-center justify-items-center gap-5'>
        <p className='text-black-600'>広告サイズ</p>
        <div className='col-span-4 w-full'>
          <Select
            value={data.isColor ? 'カラー' : 'モノクロ'}
            onChange={(e) => {
              setFormData({ ...formData, ['isColor']: e.target.value === 'カラー' ? true : false });
            }}
          >
            {SCALE.map((scale: string, index: number) => (
              <option value={scale} key={index}>
                {scale}
              </option>
            ))}
          </Select>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-black-600'>カラー</p>
          <p className='text-black-600'>モノクロ</p>
        </div>
        <div className='col-span-4 w-full'>
          <Select
            value={data.isColor ? 'カラー' : 'モノクロ'}
            onChange={(e) => {
              setFormData({ ...formData, ['isColor']: e.target.value === 'カラー' ? true : false });
            }}
          >
            <option value='カラー'>カラー</option>
            <option value='モノクロ'>モノクロ</option>
          </Select>
        </div>
        <p className='text-black-600'>金額</p>
        <Input
          className='col-span-4 w-full'
          type='number'
          id={String(data.id)}
          value={data.price}
          onChange={formDataListHandler('price')}
        />
      </div>
    </>
  );

  const SponsorStyleTable = (sponsorStyles: SponsorStyle[]) => {
    return (
      <table className='mb-10 w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
            {TABLE_COLUMNS.map((tableColumn: string) => (
              <th key={tableColumn} className='border-b-primary-1 px-6 pb-2'>
                <div className='text-center text-sm text-black-600'>{tableColumn}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
          {sponsorStyles.map((sponsorStyle, index) => (
            <tr key={sponsorStyle.id}>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === sponsorStyles.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>{sponsorStyle.scale}</div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === sponsorStyles.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>
                  {sponsorStyle.isColor ? 'カラー' : 'モノクロ'}
                </div>
              </td>
              <td
                className={clsx(
                  'px-4',
                  index === 0 ? 'pt-4 pb-3' : 'py-3',
                  index === sponsorStyles.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                )}
              >
                <div className='text-center text-sm text-black-300'>{sponsorStyle.price}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Modal className='w-1/2'>
        <div className='w-full'>
          <div className='ml-auto w-fit'>
            <CloseButton
              onClick={() => {
                props.setIsOpen(false);
              }}
            />
          </div>
        </div>
        <div className='mx-auto mb-5 w-fit text-xl text-black-600'>協賛スタイルの登録</div>
        <div className='flex flex-col gap-5'>
          <Stepper stepNum={props.purchaseItemNum} activeStep={activeStep} isDone={isDone}>
            {!isDone && <>{content(formDataList[activeStep - 1])}</>}
          </Stepper>
          {isDone ? (
            <>
              <div className='mx-auto w-fit'>{SponsorStyleTable(formDataList)}</div>
              <div className='flex flex-row justify-center gap-5'>
                <OutlinePrimaryButton onClick={reset}>戻る</OutlinePrimaryButton>
                <PrimaryButton
                  onClick={() => {
                    submit(formDataList);
                  }}
                >
                  登録を確定する
                </PrimaryButton>
              </div>
            </>
          ) : (
            <>
              <div className='mx-auto flex w-fit flex-row gap-5'>
                {/* stepが1より大きい時のみ戻るボタンを表示 */}
                {activeStep > 1 && (
                  <OutlinePrimaryButton onClick={prevStep}>戻る</OutlinePrimaryButton>
                )}
                {activeStep === 1 && (
                  <OutlinePrimaryButton
                    onClick={() => {
                      props.setIsOpen(false);
                    }}
                  >
                    戻る
                  </OutlinePrimaryButton>
                )}
                <PrimaryButton
                  onClick={() => {
                    {
                      activeStep === steps.length ? setIsDone(true) : nextStep();
                    }
                  }}
                >
                  {activeStep === steps.length ? '確認へ' : '登録して次へ'}
                  <RiArrowDropRightLine size={23} />
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
