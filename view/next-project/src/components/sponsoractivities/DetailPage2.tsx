import { clsx } from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { post, del } from '@/utils/api/api_methods';

import { DESIGN_PROGRESSES } from '@constants/designProgresses';
import { SponsorActivityView, SponsorActivityInformation } from '@type/common';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { FiPlusSquare } from 'react-icons/fi';
import { DeleteButton, OutlinePrimaryButton, PrimaryButton, RedButton } from '../common';
import { saveAs } from 'file-saver';
import UplaodFileModal from './UploadFileModal';

interface ModalProps {
  setPageNum: (isOpen: number) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivitiesViewItem: SponsorActivityView;
  setIsChange: (isChange: boolean) => void;
  setSponsorActivitiesView: (sponsorActivitiesView: SponsorActivityView) => void;
}

const DetailPage2: FC<ModalProps> = (props) => {
  const toPage1 = () => {
    props.setPageNum(1);
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editActivityInformationId, setEditActivityInformationId] = useState<number>(0);

  const [sponsorActivityInformations, setSponsorActivityInformations] = useState<
    SponsorActivityInformation[]
  >(props.sponsorActivitiesViewItem.sponsorActivityInformations || []);

  useEffect(() => {
    const newSponsorActivitiesView = {
      ...props.sponsorActivitiesViewItem,
      sponsorActivityInformations: sponsorActivityInformations,
    };
    props.setSponsorActivitiesView(newSponsorActivitiesView);
  }, [sponsorActivityInformations]);

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

  const handleDelete = async (id: number, activityInformation: SponsorActivityInformation) => {
    const deleteSponsorActivityInformationUrl =
      process.env.CSR_API_URI + '/activity_informations/' + String(id);
    const newSponsorActivityInformations = sponsorActivityInformations.filter(
      (sponsorActivityInformation) => sponsorActivityInformation.id !== id,
    );
    console.log(newSponsorActivityInformations);
    if (activityInformation.fileName === '') {
      const res = await del(deleteSponsorActivityInformationUrl);
    } else {
      const confirm = window.confirm('本当に削除してよろしいですか？');
      if (confirm) {
        const res = await del(deleteSponsorActivityInformationUrl);
      } else {
        window.alert('キャンセルしました');
        return;
      }
    }
    setSponsorActivityInformations(newSponsorActivityInformations);
    props.setIsChange(true);
  };

  const createInfomation = async () => {
    const sponsorActivitiesUrl = process.env.CSR_API_URI + '/activity_informations';
    const nullData = {
      activityID: props.sponsorActivitiesViewItem.sponsorActivity.id || 0,
      bucketName: '',
      fileName: '',
      fileType: '',
      designProgress: 1,
    };
    const res = await post(sponsorActivitiesUrl, nullData);
    const newSponsorActivityInformations = [...sponsorActivityInformations, res];
    setSponsorActivityInformations(newSponsorActivityInformations);
    props.setIsChange(true);
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
              <div className='flex flex-row-reverse  border-t border-primary-1 p-2'>
                <div className='mt-2 w-1/12'>
                  <button className=''>
                    <DeleteButton
                      onClick={() => handleDelete(activityInformation.id || 0, activityInformation)}
                    />
                  </button>
                </div>
                <div className='w-11/12'>
                  <div className='my-1 flex flex-wrap justify-center gap-7 '>
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
                        <embed
                          src={fileURLs && fileURLs[index]}
                          type='application/pdf'
                          width='200'
                        />
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
                  {activityInformation.fileName !== '' && (
                    <div className='my-2 flex flex-wrap justify-center gap-2'>
                      <OutlinePrimaryButton
                        className='p-1'
                        onClick={() => {
                          setEditActivityInformationId(index);
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
                  )}
                  {activityInformation.fileName === '' && (
                    <div className='my-2 flex flex-wrap justify-center gap-2'>
                      <OutlinePrimaryButton
                        className='mx-auto my-2'
                        onClick={() => {
                          setEditActivityInformationId(index);
                          setIsOpen(true);
                        }}
                      >
                        広告登録
                      </OutlinePrimaryButton>
                    </div>
                  )}
                </div>
              </div>
            </>
          ))}
        <div className='my-1 flex flex-wrap justify-center gap-7 border-t border-primary-1 p-2'>
          <button className='rounded hover:bg-grey-300'>
            <FiPlusSquare size={30} onClick={() => createInfomation()} />
          </button>
        </div>
      </div>
      <div className='mt-2'>
        <button onClick={() => toPage1()} className='rounded-full hover:bg-grey-300'>
          <FaChevronCircleLeft size={30} />
        </button>
      </div>
      {isOpen && (
        <UplaodFileModal
          setIsOpen={setIsOpen}
          id={props.sponsorActivitiesViewItem.sponsorActivity.id || 0}
          ActivityInformationId={editActivityInformationId}
          sponsorActivityInformations={sponsorActivityInformations}
          setSponsorActivityInformations={setSponsorActivityInformations}
          setIsChange={props.setIsChange}
        />
      )}
    </>
  );
};

export default DetailPage2;
