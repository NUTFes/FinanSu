import React, { FC, useRef, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { PrimaryButton } from '../common';
import { put } from '@/utils/api/api_methods';
import { Modal } from '@components/common';
import { SponsorActivityInformation } from '@type/common';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: number;
  ActivityInformationId: number;
  sponsorActivityInformations?: SponsorActivityInformation[];
  setSponsorActivityInformations: (
    sponsorActivityInformations: SponsorActivityInformation[],
  ) => void;
  setIsChange: (isChange: boolean) => void;
}

const UplaodFileModal: FC<ModalProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState({ uploadImageURL: '', type: '' });
  const [activityInformation, setActivityInformation] = useState<SponsorActivityInformation>(
    (props.sponsorActivityInformations &&
      props.sponsorActivityInformations[props.ActivityInformationId]) || {
      activityID: props.id,
      bucketName: '',
      fileName: '',
      fileType: '',
      designProgress: 1,
      fileInformation: '',
    },
  );

  const sponsorActivityInformations = props.sponsorActivityInformations || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files![0]!;
    if (!targetFile) {
      setPreview({ uploadImageURL: '', type: '' });
      return;
    }
    setImageFile(targetFile);
    setPreview({ uploadImageURL: URL.createObjectURL(targetFile), type: targetFile.type });

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const fileName = targetFile.name;
    const fileType = targetFile.type;

    setActivityInformation({
      ...activityInformation,
      bucketName: bucketName || '',
      fileName: fileName,
      fileType: fileType,
    });
  };

  const handleFileDelete = () => {
    setImageFile(null);
    setPreview({ uploadImageURL: '', type: '' });
    props.setIsOpen(false);
  };

  const submit = async () => {
    if (!imageFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', imageFile);
    const fileName = imageFile?.name || '';
    formData.append('fileName', fileName);

    const response = await fetch('/api/minio', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return true;
        } else {
          alert('登録に失敗しました');
          return false;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (!response) {
      onClose();
      return;
    }

    const sponsorActivitiesUrl =
      process.env.CSR_API_URI + '/activity_informations/' + activityInformation.id;
    const res = await put(sponsorActivitiesUrl, activityInformation);
    const newSponsorActivityInformations = sponsorActivityInformations.map(
      (sponsorActivityInformation) => {
        if (sponsorActivityInformation.id === activityInformation.id) {
          return activityInformation;
        }
        return sponsorActivityInformation;
      },
    );
    props.setSponsorActivityInformations(newSponsorActivityInformations);

    alert('保存しました');
    props.setIsChange(true);

    onClose();
  };

  console.log(process.env.NEXT_PUBLIC_BUCKET_NAME);

  const onClose = () => {
    handleFileDelete();
    props.setIsOpen(false);
  };

  return (
    <Modal className='md:h-6/12 md:mt-5 md:w-4/12'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      <div className='my-2 flex flex-wrap justify-center gap-2'>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm hover:file:bg-grey-300'
        />
      </div>
      <div className='my-2 flex h-60 w-full flex-wrap justify-center overflow-auto'>
        {preview.type === 'application/pdf' ? (
          <embed
            src={preview.uploadImageURL}
            type='application/pdf'
            className='mx-auto object-scale-down '
          />
        ) : (
          preview.type !== '' && (
            <img src={preview.uploadImageURL} className='mx-auto object-scale-down ' />
          )
        )}
      </div>
      <div className='my-2 flex w-full flex-wrap justify-center'>
        <PrimaryButton type='button' onClick={() => submit()} disabled={!imageFile}>
          登録
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default UplaodFileModal;
