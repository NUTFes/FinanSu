import { useRouter } from 'next/router';
import React, { useState, useEffect, useMemo } from 'react';

import { put, post, del } from '@/utils/api/api_methods';

import {
  PrimaryButton,
  OutlinePrimaryButton,
  CloseButton,
  Modal,
  Select,
  Input,
  Textarea,
} from '@components/common';
import { MultiSelect } from '@components/common';
import { SponsorActivity, Sponsor, SponsorStyle, User, ActivityStyle } from '@type/common';

interface ModalProps {
  sponsorActivityId: number | string;
  sponsorActivity: SponsorActivity;
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  sponsorStyleDetails: ActivityStyle[];
  activityStyles: ActivityStyle[];
  setIsOpen: (isOpen: boolean) => void;
}

const REMARK_COUPON = `<クーポン> [詳細 :  ○○]\n`;
const REMARK_PAMPHLET = `<パンフレット掲載内容> [企業名 : x],[住所 : x],[HP : x],[ロゴ : x],[営業時間 : x],[電話番号 : x],[キャッチコピー : x],[地図 : x],[その他 :  ]\n`;
const REMARK_PAMPHLET_SPONSOR = `<パンフレット掲載内容> 企業が作成\n`;
const REMARK_PAMPHLET_OTHER = `<パンフレット掲載内容> 去年のものを使用\n`;
const REMARK_POSTER = `<ポスター掲載内容> パンフレット広告拡大\n`;
const REMARK_DESIGN_STUDENT = `<デザイン作成> 学生が作成\n`;
const REMARK_DESIGN_SPONSOR = `<デザイン作成> 企業が作成\n`;
const REMARK_DESIGN_OTHER = `<デザイン作成> 去年のものを使用\n`;

export default function EditModal(props: ModalProps) {
  const { users, sponsors, sponsorStyles, sponsorStyleDetails, activityStyles } = props;
  const router = useRouter();

  // 協賛企業のリスト
  const [formData, setFormData] = useState<SponsorActivity>({
    ...props.sponsorActivity,
    expense: Number((props.sponsorActivity.expense / 11).toFixed(1)),
  });
  const initStyleIds = sponsorStyleDetails.map(
    (sponsorStyleDetail) => sponsorStyleDetail.sponsorStyleID,
  );
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[]>(initStyleIds);

  const [isStyleError, setIsStyleError] = useState(false);
  useEffect(() => {
    if (selectedStyleIds.length === 0) {
      setIsStyleError(true);
    } else {
      setIsStyleError(false);
    }
  }, [selectedStyleIds]);

  const styleOotions = useMemo(() => {
    const options = sponsorStyles.map((style) => {
      return {
        value: String(style.id || 0),
        label: `${style.style} / ${style.feature} / ${style.price} 円`,
      };
    });
    return options;
  }, [sponsorStyles]);

  const isSelectSponsorBooth = useMemo(() => {
    const isBooth = selectedStyleIds.some((id) => {
      return sponsorStyles[id - 1]?.style === '企業ブース';
    });
    return isBooth;
  }, [selectedStyleIds, sponsorStyles]);

  useEffect(() => {
    if (isSelectSponsorBooth) {
      const newRemark =
        design === '学生が作成'
          ? REMARK_DESIGN_STUDENT + REMARK_PAMPHLET
          : design === '企業が作成'
          ? REMARK_DESIGN_SPONSOR + REMARK_PAMPHLET_SPONSOR
          : REMARK_DESIGN_OTHER + REMARK_PAMPHLET_OTHER;
      setFormData({
        ...formData,
        feature: 'なし',
        remark: newRemark,
      });
    }
  }, [isSelectSponsorBooth]);

  const [design, setDesign] = useState<string>('学生が作成');
  const changeDesign = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesign(e.target.value);
    const newRemark =
      e.target.value === '学生が作成'
        ? REMARK_DESIGN_STUDENT + REMARK_PAMPHLET
        : e.target.value === '企業が作成'
        ? REMARK_DESIGN_SPONSOR + REMARK_PAMPHLET_SPONSOR
        : REMARK_DESIGN_OTHER + REMARK_PAMPHLET_OTHER;
    const newRemarkFeature =
      formData.feature === 'ポスター'
        ? REMARK_POSTER
        : formData.feature === 'クーポン'
        ? REMARK_COUPON
        : '';
    setFormData({
      ...formData,
      remark: newRemark + newRemarkFeature,
    });
  };

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

    const deleteActivityStyles = activityStyles.filter((activityStyle) => {
      return activityStyle.activityID === data.id;
    });
    const ActivityStylesUrl = process.env.CSR_API_URI + '/activity_styles';
    deleteActivityStyles.forEach(async (activityStyle) => {
      const submitUrl = ActivityStylesUrl + '/' + activityStyle.id;
      await del(submitUrl);
    });

    const activityStylesData = selectedStyleIds.map((id) => {
      return { activityID: data.id, sponsorStyleID: id };
    });
    activityStylesData.forEach(async (activityStyleData) => {
      await post(ActivityStylesUrl, activityStyleData);
    });
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
        <MultiSelect
          options={styleOotions}
          values={styleOotions.filter((option) => selectedStyleIds.includes(Number(option.value)))}
          onChange={(value) => {
            setSelectedStyleIds(value.map((v) => Number(v.value)));
          }}
        />
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
            const newRemark =
              design === '学生が作成'
                ? REMARK_DESIGN_STUDENT + REMARK_PAMPHLET
                : design === '企業が作成'
                ? REMARK_DESIGN_SPONSOR + REMARK_PAMPHLET_SPONSOR
                : REMARK_DESIGN_OTHER + REMARK_PAMPHLET_OTHER;
            const newRemarkFeature =
              e.target.value === 'ポスター'
                ? REMARK_POSTER
                : e.target.value === 'クーポン'
                ? REMARK_COUPON
                : '';
            setFormData({
              ...formData,
              remark: newRemark + newRemarkFeature,
              feature: e.target.value,
            });
          }}
        >
          <option value={'なし'} selected>
            なし
          </option>
          <option value={'ポスター'} disabled={isSelectSponsorBooth}>
            ポスター
          </option>
          <option value={'クーポン'} disabled={isSelectSponsorBooth}>
            クーポン
          </option>
        </Select>
      </div>
      <p className='text-black-600'>デザイン作成</p>
      <div className='col-span-4 flex w-full justify-around'>
        <div className='flex gap-3'>
          <input
            type='radio'
            id='student'
            name='design'
            value='学生が作成'
            checked={design === '学生が作成'}
            onChange={changeDesign}
          />
          <label htmlFor='student'>学生が作成</label>
        </div>
        <div className='flex gap-3'>
          <input
            type='radio'
            id='company'
            name='design'
            value='企業が作成'
            checked={design === '企業が作成'}
            onChange={changeDesign}
          />
          <label htmlFor='company'>企業が作成</label>
        </div>
        <div className='flex gap-3'>
          <input
            type='radio'
            id='lastYear'
            name='design'
            value='去年のものを使用'
            checked={design === '去年のものを使用'}
            onChange={changeDesign}
          />
          <label htmlFor='lastYear'>去年のものを使用</label>
        </div>
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
        {isStyleError && (
          <div className='text-center text-red-600'>
            <p>協賛スタイルを選択してください</p>
          </div>
        )}
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
            disabled={isStyleError}
          >
            編集完了
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
