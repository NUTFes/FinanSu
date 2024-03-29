import { clsx } from 'clsx';
import { saveAs } from 'file-saver';
import React, { FC, useEffect, useState } from 'react';

import { FaChevronCircleLeft, FaCheckCircle } from 'react-icons/fa';
import { FiPlusSquare } from 'react-icons/fi';
import { RiCloseCircleLine } from 'react-icons/ri';
import {
  DeleteButton,
  EditButton,
  Input,
  OutlinePrimaryButton,
  PrimaryButton,
  Select,
} from '../common';
import UplaodFileModal from './UploadFileModal';
import { post, del, put } from '@/utils/api/api_methods';
import { DESIGN_PROGRESSES } from '@constants/designProgresses';
import { SponsorActivityView, SponsorActivityInformation } from '@type/common';

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
  const [activityInformationData, setActivityInformationData] = useState<string>('');

  const [sponsorActivityInformations, setSponsorActivityInformations] = useState<
    SponsorActivityInformation[]
  >(props.sponsorActivitiesViewItem.sponsorActivityInformations || []);
  const [isEditInformations, setIsEditInformations] = useState<boolean[]>(
    sponsorActivityInformations.map(() => {
      return false;
    }),
  );

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
      fileInformation: '',
    };
    const res = await post(sponsorActivitiesUrl, nullData);
    const newSponsorActivityInformations = [...sponsorActivityInformations, res];
    setSponsorActivityInformations(newSponsorActivityInformations);
    setIsEditInformations([...isEditInformations, false]);
    props.setIsChange(true);
  };

  const handleUpdateProgress = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    activityInformation: SponsorActivityInformation,
  ) => {
    const sponsorActivitiesUrl =
      process.env.CSR_API_URI + '/activity_informations/' + activityInformation.id;
    const updateActivityInformation = {
      ...activityInformation,
      designProgress: Number(e.target.value),
    };
    const res = await put(sponsorActivitiesUrl, updateActivityInformation);
    const newSponsorActivityInformations = sponsorActivityInformations.map(
      (sponsorActivityInformation) => {
        if (sponsorActivityInformation.id === activityInformation.id) {
          return updateActivityInformation;
        }
        return sponsorActivityInformation;
      },
    );
    setSponsorActivityInformations(newSponsorActivityInformations);
    props.setIsChange(true);
  };

  const handleUpdateInformation = async (activityInformation: SponsorActivityInformation) => {
    const sponsorActivitiesUrl =
      process.env.CSR_API_URI + '/activity_informations/' + activityInformation.id;
    const updateActivityInformation = {
      ...activityInformation,
      fileInformation: activityInformationData,
    };
    const res = await put(sponsorActivitiesUrl, updateActivityInformation);
    const newSponsorActivityInformations = sponsorActivityInformations.map(
      (sponsorActivityInformation) => {
        if (sponsorActivityInformation.id === activityInformation.id) {
          return updateActivityInformation;
        }
        return sponsorActivityInformation;
      },
    );
    setSponsorActivityInformations(newSponsorActivityInformations);
    props.setIsChange(true);
    setIsEditInformations(
      isEditInformations.map(() => {
        return false;
      }),
    );
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
              <div className='m-0 flex flex-row-reverse border-t border-primary-1 p-0'>
                <div className='mt-2 w-1/12'>
                  <button className=''>
                    <DeleteButton
                      onClick={() => handleDelete(activityInformation.id || 0, activityInformation)}
                    />
                  </button>
                </div>
                <div className='w-11/12' />
              </div>
              <div className='flex flex-col flex-wrap justify-center'>
                <div className='my-1 flex justify-center'>
                  <div className='flex w-fit items-center justify-center gap-3'>
                    <p className='w-25 whitespace-nowrap text-black-600'>広告状況</p>
                    <Select
                      value={designProgresses[index].id}
                      className='w-28 py-2'
                      onChange={(e) => {
                        handleUpdateProgress(e, activityInformation);
                      }}
                    >
                      {DESIGN_PROGRESSES.map((designProgress) => {
                        return (
                          <option value={designProgress.id} key={designProgress.id}>
                            {designProgress.state}
                          </option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
                <div className='my-1 ml-4 flex flex-wrap justify-center gap-7 '>
                  <div className='flex items-center justify-center gap-3'>
                    <p className='text-black-600'>情報</p>
                    {isEditInformations[index] ? (
                      <>
                        <Input
                          value={activityInformationData}
                          className='w-40'
                          onChange={(e) => {
                            setActivityInformationData(e.target.value);
                          }}
                        />
                        <RiCloseCircleLine
                          size={'32px'}
                          color={'gray'}
                          className='cursor-pointer'
                          onClick={() => {
                            setIsEditInformations(
                              isEditInformations.map(() => {
                                return false;
                              }),
                            );
                          }}
                        />
                        <FaCheckCircle
                          size={'28px'}
                          className='cursor-pointer'
                          onClick={() => {
                            handleUpdateInformation(activityInformation);
                          }}
                        />
                      </>
                    ) : activityInformation.fileInformation.trim() === '' ? (
                      <p className='w-30 border-b border-primary-1'>____</p>
                    ) : (
                      <p className='border-b border-primary-1'>
                        {activityInformation.fileInformation}
                      </p>
                    )}
                    {!isEditInformations[index] && (
                      <EditButton
                        onClick={() => {
                          const newIsEditInformations = isEditInformations.map(
                            (isEditInformation, editIndex) => {
                              return index === editIndex;
                            },
                          );
                          setActivityInformationData(activityInformation.fileInformation || '');
                          setIsEditInformations(newIsEditInformations);
                        }}
                      />
                    )}
                  </div>
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
              <div className='my-1 flex flex-wrap justify-center gap-7 '>
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
