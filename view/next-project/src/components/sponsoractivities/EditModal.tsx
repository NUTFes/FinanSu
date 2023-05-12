import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { put } from '@/utils/api/sponsorActivities';
import {
  PrimaryButton,
  OutlinePrimaryButton,
  CloseButton,
  Modal,
  Select,
  Input,
  Textarea,
} from '@components/common';
import { SponsorActivity, Sponsor, SponsorStyle, User } from '@type/common';

interface ModalProps {
  sponsorActivityId: number | string;
  sponsorActivity: SponsorActivity;
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  setIsOpen: (isOpen: boolean) => void;
}

const REMARK_COUPON = `<クーポン> [詳細 :  ○○],
<広告掲載内容> [企業名 : x],[住所 : x],[HP : x],[ロゴ : x],[営業時間 : x],[電話番号 : x],[キャッチコピー : x],[地図 : x],[その他 :  ]`;
const REMARK_POSTER = `<広告掲載内容> [企業名 : x],[住所 : x],[HP : x],[ロゴ : x],[営業時間 : x],[電話番号 : x],[キャッチコピー : x],[地図 : x],[その他 :  ]`;

export default function EditModal(props: ModalProps) {
  const router = useRouter();

  // 協賛企業のリスト
  const [formData, setFormData] = useState<SponsorActivity>({
    ...props.sponsorActivity,
    expense: Number((props.sponsorActivity.expense / 11).toFixed(1)),
  });

  const { users, sponsors, sponsorStyles } = props;
  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 協賛企業の登録の更新を行い、ページをリロード
  const submit = (data: SponsorActivity) => {
    const { expense, userID, sponsorID, ...rest } = data;
    const submitData: SponsorActivity = {
      expense: Math.round(expense * 11),
      userID: Number(userID),
      sponsorID: Number(sponsorID),
      ...rest,
    };
    updateSponsorStyle(submitData);
    router.reload();
  };

  // 協賛企業を更新
  const updateSponsorStyle = async (data: SponsorActivity) => {
    const updateSponsorStyleUrl = process.env.CSR_API_URI + '/activities/' + data.id;
    await put(updateSponsorStyleUrl, data);
  };

  // 協賛企業の情報
  const content = (data: SponsorActivity) => (
    <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-4'>
      <p className='text-black-600'>企業名</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' onChange={handler('sponsorID')}>
          {sponsors.map((sponsor) => (
            <option key={sponsor.id} value={sponsor.id} selected={sponsor.id === data.sponsorID}>
              {sponsor.name}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>協賛スタイル</p>
      <div className='col-span-4 w-full'>
        <Select
          className='w-full'
          onChange={(e) => {
            setFormData({ ...formData, sponsorStyleID: Number(e.target.value) });
            if (sponsorStyles[Number(e.target.value) - 1]?.style === '企業ブース') {
              setFormData({
                ...formData,
                feature: 'なし',
                sponsorStyleID: Number(e.target.value),
                remark: '',
              });
            }
          }}
        >
          {sponsorStyles.map((sponsorStyle) => (
            <option
              key={sponsorStyle.id}
              value={sponsorStyle.id}
              selected={sponsorStyle.id === data.sponsorStyleID}
            >
              {`${sponsorStyle.style} / ${sponsorStyle.feature} / ${sponsorStyle.price} 円`}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>担当者名</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' onChange={handler('userID')}>
          {users.map((user) => (
            <option key={user.id} value={user.id} selected={user.id === data.userID}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>
      <div className='text-black-600'>回収状況</div>
      <div className='col-span-4 w-full'>
        <Select
          className='w-full'
          onChange={(e) => {
            setFormData({ ...formData, isDone: e.target.value === '回収完了' ? true : false });
          }}
        >
          <option value='未回収' selected={data.isDone === false}>
            未回収
          </option>
          <option value='回収完了' selected={data.isDone === true}>
            回収完了
          </option>
        </Select>
      </div>
      <p className='text-black-600'>オプション</p>
      <div className='col-span-4 w-full'>
        <Select
          value={data.feature}
          onChange={(e) => {
            if (e.target.value === 'クーポン') {
              setFormData({ ...formData, feature: e.target.value, remark: REMARK_COUPON });
            } else if (e.target.value === 'ポスター') {
              setFormData({ ...formData, feature: e.target.value, remark: REMARK_POSTER });
            } else {
              setFormData({ ...formData, feature: e.target.value, remark: '' });
            }
          }}
        >
          <option value={'なし'} selected>
            なし
          </option>
          <option
            value={'ポスター'}
            disabled={sponsorStyles[data.sponsorStyleID - 1]?.style === '企業ブース'}
          >
            ポスター
          </option>
          <option
            value={'クーポン'}
            disabled={sponsorStyles[data.sponsorStyleID - 1]?.style === '企業ブース'}
          >
            クーポン
          </option>
        </Select>
      </div>
      <p className='text-black-600'>移動距離(km)</p>
      <div className='col-span-4 w-full'>
        <Input
          className='w-full'
          id={String(data.id)}
          type='number'
          value={data.expense}
          onChange={handler('expense')}
        />
      </div>
      <p className='text-black-600'>交通費</p>
      <div className='col-span-4 w-full'>
        <p className='w-full'>{Math.round(data.expense * 11)}円</p>
      </div>
      <p className='text-black-600'>備考</p>
      <div className='col-span-4 w-full'>
        <Textarea
          className='w-full'
          id={String(data.id)}
          value={data.remark}
          onChange={handler('remark')}
        />
      </div>
    </div>
  );

  return (
    <Modal className='mt-64 md:mt-0 md:w-1/2'>
      <div className='w-full'>
        <div className='ml-auto w-fit'>
          <CloseButton
            onClick={() => {
              props.setIsOpen(false);
            }}
          />
        </div>
      </div>
      <div className='mx-auto mb-10 w-fit text-xl text-black-600'>協賛企業の修正</div>
      <div className=''>
        {content(formData)}
        <div className='flex flex-row justify-center gap-5'>
          <OutlinePrimaryButton
            onClick={() => {
              props.setIsOpen(false);
            }}
          >
            戻る
          </OutlinePrimaryButton>
          <PrimaryButton
            onClick={() => {
              submit(formData);
            }}
          >
            編集完了
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
