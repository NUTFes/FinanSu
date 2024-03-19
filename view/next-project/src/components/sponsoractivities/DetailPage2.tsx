import { clsx } from 'clsx';
import React, { FC, useState } from 'react';

import { DESIGN_PROGRESSES } from '@constants/designProgresses';
import { SponsorActivityView, SponsorActivityInformation } from '@type/common';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { OutlinePrimaryButton, PrimaryButton, RedButton } from '../common';
import { saveAs } from 'file-saver';
import UplaodFileModal from './UploadFileModal';

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editActivityInformation, setEditActivityInformation] =
    useState<SponsorActivityInformation | null>(null);

  const sponsorActivityInformations = props.sponsorActivitiesViewItem.sponsorActivityInformations;

  const designProgresses =
    sponsorActivityInformations &&
    sponsorActivityInformations.map((activityInformation) => {
      const designProgress = DESIGN_PROGRESSES.filter(
        (design) => design.id === activityInformation.designProgress,
      );
      return designProgress[0];
    });

  const fileURLs =
    sponsorActivityInformations &&
    sponsorActivityInformations.map((activityInformation) => {
      const bucketName = activityInformation.bucketName;
      const fileName = activityInformation.fileName;
      return `http://127.0.0.1:9000/${bucketName}/${fileName}`;
    });

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
      <div className='max-h-60 overflow-auto'>
        {sponsorActivityInformations &&
          sponsorActivityInformations.map((activityInformation, index) => (
            <>
              <div className='my-1 flex flex-wrap justify-center gap-7 border-t border-primary-1 p-2'>
                <div className='flex gap-3'>
                  <p className='text-black-600'>広告の状況</p>
                  <p className='border-b border-primary-1'>
                    {designProgresses && designProgresses[index].state}
                  </p>
                </div>
              </div>
              <div className='flex flex-wrap justify-center'>
                {activityInformation?.fileType === 'application/pdf' &&
                  activityInformation?.fileName && (
                    <embed src={fileURLs && fileURLs[index]} type='application/pdf' width='200' />
                  )}
                {activityInformation.fileType !== 'application/pdf' &&
                  activityInformation.fileName && (
                    <img
                      src={fileURLs && fileURLs[index]}
                      alt='Picture of the author'
                      width='160'
                    />
                  )}
              </div>
              <div className='my-2 flex flex-wrap justify-center gap-2'>
                <OutlinePrimaryButton
                  className='p-1'
                  onClick={() => {
                    setEditActivityInformation(activityInformation);
                    setIsOpen(true);
                  }}
                >
                  変更
                </OutlinePrimaryButton>
                <PrimaryButton
                  onClick={() =>
                    fileURLs && download(fileURLs[index], activityInformation.fileName || '')
                  }
                >
                  ダウンロード
                </PrimaryButton>
              </div>
            </>
          ))}
        {!sponsorActivityInformations && (
          <>
            <div className='my-1 flex flex-wrap justify-center gap-7 border-t border-primary-1 p-2'>
              <div className='flex gap-3'>
                <p className='text-black-600'>広告の状況</p>
                <p className='border-b border-primary-1'>未回収</p>
              </div>
            </div>
            <div className='my-2 flex flex-wrap justify-center gap-2'>
              <OutlinePrimaryButton
                className='mx-auto my-2'
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                広告登録
              </OutlinePrimaryButton>
            </div>
          </>
        )}
      </div>
      <div className='mt-2'>
        <button onClick={() => toPage1()}>
          <FaChevronCircleLeft size={30} />
        </button>
      </div>
      {isOpen && (
        <UplaodFileModal
          setIsOpen={setIsOpen}
          id={props.sponsorActivitiesViewItem.sponsorActivity.id}
          sponsorActivityInformation={editActivityInformation}
        />
      )}
    </>
  );
};

export default DetailPage2;
