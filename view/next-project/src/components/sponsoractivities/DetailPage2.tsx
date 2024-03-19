import { clsx } from 'clsx';
import React, { FC } from 'react';

import { DESIGN_PROGRESSES } from '@constants/designProgresses';
import { SponsorActivityView } from '@type/common';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { PrimaryButton } from '../common';
import { saveAs } from 'file-saver';

interface ModalProps {
  setPageNum: (isOpen: number) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
}

const DetailPage2: FC<ModalProps> = (props) => {
  const toPage1 = () => {
    props.setPageNum(1);
  };

  const formatDate = (date: string) => {
    const datetime = date.replace('T', ' ');
    const datetime2 = datetime.substring(0, datetime.length - 10);
    return datetime2;
  };

  const designProgress = DESIGN_PROGRESSES.filter(
    (design) =>
      design.id === props.sponsorActivitiesViewItem.sponsorActivityInformation?.designProgress,
  );
  const bucketName = props.sponsorActivitiesViewItem.sponsorActivityInformation?.bucketName;
  const fileName = props.sponsorActivitiesViewItem.sponsorActivityInformation?.fileName;
  const fileURL = `http://127.0.0.1:9000/${bucketName}/${fileName}`;

  const download = async (url: string, fileName: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    saveAs(blob, fileName);
  };

  return (
    <>
      <p className='mx-auto mb-2 mt-7 w-fit text-xl text-black-600'>協賛スタイル</p>
      <table className='mb-4 w-full table-fixed border-collapse'>
        <thead>
          <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>協賛内容</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>オプション</div>
            </th>
            <th className='w-1/4 px-6 pb-2'>
              <div className='text-center text-sm text-black-600'>値段</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.sponsorActivitiesViewItem.styleDetail ? (
            props.sponsorActivitiesViewItem.styleDetail.map((styleDetail, index) => (
              <tr
                key={index}
                className={clsx('border border-x-white-0 border-t-white-0', {
                  'border-b-primary-1':
                    index === props.sponsorActivitiesViewItem.styleDetail.length - 1,
                })}
              >
                <td className='py-3'>
                  <div className='text-center text-sm'>{styleDetail.sponsorStyle.style}</div>
                </td>
                <td className='py-3'>
                  <div className='text-center text-sm'>{styleDetail.sponsorStyle.feature}</div>
                </td>
                <td className='py-3'>
                  <div className='text-center text-sm'>{styleDetail.sponsorStyle.price} 円</div>
                </td>
              </tr>
            ))
          ) : (
            <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              <td colSpan={3} className='py-3'>
                <div className='text-center text-sm text-red-500'>
                  協賛スタイルを登録してください
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className='mx-auto mb-2 mt-7 w-fit text-xl text-black-600'>広告デザイン</p>
      <div className='my-7 flex flex-wrap justify-center gap-7'>
        <div className='flex gap-3'>
          <p className='text-black-600'>広告の状況</p>
          <p className='border-b border-primary-1'>{designProgress[0]?.state}</p>
        </div>
      </div>
      <div className='my-7 flex flex-wrap justify-center'>
        {props.sponsorActivitiesViewItem.sponsorActivityInformation?.fileType ===
          'application/pdf' &&
          props.sponsorActivitiesViewItem.sponsorActivityInformation?.fileName && (
            <embed src={fileURL} type='application/pdf' width='400' height='200' />
          )}
        {props.sponsorActivitiesViewItem.sponsorActivityInformation?.fileType !==
          'application/pdf' &&
          props.sponsorActivitiesViewItem.sponsorActivityInformation?.fileName && (
            <img src={fileURL} alt='Picture of the author' width='200' height='200' />
          )}
      </div>
      <PrimaryButton className='mx-auto' onClick={() => download(fileURL, fileName || '')}>
        ダウンロード
      </PrimaryButton>
      <div className='mt-2'>
        <button onClick={() => toPage1()}>
          <FaChevronCircleLeft size={30} />
        </button>
      </div>
    </>
  );
};

export default DetailPage2;
