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
import { BUREAUS } from '@constants/bureaus';
import { DESIGNER_VALUES } from '@constants/designers';
import { SponsorActivity, Sponsor, SponsorStyle, User, ActivityStyle } from '@type/common';

interface ModalProps {
  sponsorActivityId: number | string;
  sponsorActivity: SponsorActivity;
  sponsorStyles: SponsorStyle[];
  sponsors: Sponsor[];
  users: User[];
  sponsorStyleDetails: ActivityStyle[] | null;
  activityStyles: ActivityStyle[];
  setIsOpen: (isOpen: boolean) => void;
}

const REMARK_COUPON = `<クーポン> [詳細 :  ○○]\n`;
const REMARK_PAMPHLET = `<パンフレット掲載内容> [企業名 : x],[住所 : x],[HP : x],[ロゴ : x],[営業時間 : x],[電話番号 : x],[キャッチコピー : x],[地図 : x],[その他 :  ]\n`;
const REMARK_POSTER = `<ポスター掲載内容> パンフレット広告拡大\n`;

export default function EditModal(props: ModalProps) {
  const { users, sponsors, sponsorStyles, sponsorStyleDetails, activityStyles } = props;
  const router = useRouter();

  // 協賛企業のリスト
  const [formData, setFormData] = useState<SponsorActivity>({
    ...props.sponsorActivity,
    expense: Number((props.sponsorActivity.expense / 11).toFixed(1)),
  });

  const default_user = users.find((user) => user.id === formData.userID);

  const initStyleIds = sponsorStyleDetails
    ? sponsorStyleDetails.map((sponsorStyleDetail) => sponsorStyleDetail.sponsorStyleID)
    : [];
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[]>(initStyleIds);

  const [isStyleError, setIsStyleError] = useState(!sponsorStyleDetails);
  useEffect(() => {
    if (selectedStyleIds && selectedStyleIds.length === 0) {
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

  const setDesign = (e: React.ChangeEvent<HTMLInputElement>) => {
    const remarkOption =
      formData.feature === 'ポスター'
        ? REMARK_POSTER
        : formData.feature === 'クーポン'
        ? REMARK_COUPON
        : '';
    const newRemarkDesign = e.target.value === '1' ? REMARK_PAMPHLET : '';
    setFormData({
      ...formData,
      design: Number(e.target.value),
      remark: remarkOption + newRemarkDesign,
    });
  };

  const setFeature = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRemarkFeature =
      e.target.value === 'ポスター'
        ? REMARK_POSTER
        : e.target.value === 'クーポン'
        ? REMARK_COUPON
        : '';
    const remarkDesign = formData.design === 1 ? REMARK_PAMPHLET : '';
    setFormData({ ...formData, feature: e.target.value, remark: newRemarkFeature + remarkDesign });
  };

  const isSelectSponsorBooth = useMemo(() => {
    if (!selectedStyleIds) return false;
    const isBoothOnly = selectedStyleIds.length === 1;
    const isBooth = selectedStyleIds.some((id) => {
      return sponsorStyles[id - 1]?.style === '企業ブース';
    });
    return isBooth && isBoothOnly;
  }, [selectedStyleIds, sponsorStyles]);

  useEffect(() => {
    if (isSelectSponsorBooth) {
      setFormData({
        ...formData,
        feature: 'なし',
        remark: '',
      });
    }
  }, [isSelectSponsorBooth]);

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
    if (!selectedStyleIds) {
      setIsStyleError(true);
      return;
    }

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
    if (!selectedStyleIds) return;

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

  // 担当者を局でフィルタを適用
  const [bureauId, setBureauId] = useState<number>(
    users.find((user) => {
      return user.id === props.sponsorActivity.userID;
    })?.bureauID || 1,
  );
  const filteredUsers = useMemo(() => {
    const res = users
      .filter((user) => {
        return user.bureauID === bureauId;
      })
      .filter((user, index, self) => {
        return self.findIndex((u) => u.name === user.name) === index;
      });

    if (res.length !== 0 && default_user?.bureauID !== bureauId) {
      setFormData({ ...formData, userID: res[0].id });
    }
    return res;
  }, [bureauId]);

  // 協賛企業の情報
  const content = (data: SponsorActivity) => (
    <div className='my-6 grid grid-cols-5 items-center justify-items-center gap-3'>
      <p className='text-black-600'>企業名</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' onChange={handler('sponsorID')} value={data.sponsorID}>
          {sponsors.map((sponsor) => (
            <option key={sponsor.id} value={sponsor.id}>
              {sponsor.name}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>協賛スタイル</p>
      <div className='col-span-4 w-full'>
        <MultiSelect
          options={styleOotions}
          values={
            selectedStyleIds
              ? styleOotions.filter((option) => selectedStyleIds.includes(Number(option.value)))
              : []
          }
          onChange={(value) => {
            setSelectedStyleIds(value.map((v) => Number(v.value)));
          }}
        />
      </div>
      <p className='text-black-600'>所属している局</p>
      <div className='col-span-4 w-full'>
        <Select value={bureauId} onChange={(e) => setBureauId(Number(e.target.value))}>
          {BUREAUS.map((bureaus) => (
            <option key={bureaus.id} value={bureaus.id}>
              {bureaus.name}
            </option>
          ))}
        </Select>
      </div>
      <p className='text-black-600'>担当者名</p>
      <div className='col-span-4 w-full'>
        <Select className='w-full' onChange={handler('userID')} value={data.userID}>
          {filteredUsers.map((user) => (
            <option key={user.id} value={user.id}>
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
        <Select value={data.feature} onChange={setFeature}>
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
      <p className='text-center text-black-600'>広告データurl</p>
      <div className='col-span-4 grid w-full'>
        <Input value={data.url} onChange={handler('url')} />
      </div>
      <p className='text-black-600'>デザイン作成</p>
      <div className='col-span-4 flex w-full justify-around'>
        {DESIGNER_VALUES.map((designer) => (
          <div className='flex gap-3' key={designer.value}>
            <input
              type='radio'
              id={designer.id}
              name='design'
              value={designer.value}
              checked={data.design === designer.value}
              onChange={setDesign}
            />
            <label htmlFor={designer.id}>{designer.label}</label>
          </div>
        ))}
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
    <Modal className='mt-64 md:mt-32 md:w-1/2'>
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
