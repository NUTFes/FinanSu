import { clsx } from 'clsx';
import React, { FC, useRef, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { DESIGN_PROGRESSES } from '@constants/designProgresses';
import { Modal } from '@components/common';
import { SponsorActivityInformation, SponsorActivityView } from '@type/common';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { OutlinePrimaryButton, PrimaryButton, RedButton } from '../common';
import { saveAs } from 'file-saver';

interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  id: React.ReactNode;
  sponsorActivityInformation?: SponsorActivityInformation | null;
}

const UplaodFileModal: FC<ModalProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadImageURL, setUploadImageURL] = useState<string>('');
  const [preview, setPreview] = useState({ uploadImageURL: '', type: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0]!;
    setImageFile(targetFile);
    setPreview({ uploadImageURL: URL.createObjectURL(targetFile), type: targetFile.type });
    setUploadImageURL(URL.createObjectURL(targetFile));
  };

  const handleFileDelete = () => {
    setImageFile(null);
    setPreview({ uploadImageURL: '', type: '' });
    setUploadImageURL('');
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

    await fetch('/api/minio', {
      method: 'POST',

      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };

  const onClose = () => {
    props.setIsOpen(false);
  };

  console.log(props.sponsorActivityInformation);
  return (
    <Modal className='md:h-6/12 md:mt-5 md:w-4/12'>
      <div className='w-full'>
        <div className='ml-auto mr-5 w-fit'>
          <RiCloseCircleLine size={'23px'} color={'gray'} onClick={onClose} />
        </div>
      </div>
      <div className='my-2 flex flex-wrap justify-center gap-2'>
        <input type='file' ref={fileInputRef} onChange={handleFileChange} />
      </div>
      <button onClick={handleFileDelete}>キャンセル</button>
      <div className='my-2 flex h-60 w-full flex-wrap justify-center overflow-auto'>
        {preview.type === 'application/pdf' ? (
          <embed
            src={preview.uploadImageURL}
            type='application/pdf'
            className='mx-auto object-scale-down '
          />
        ) : (
          preview.type !== '' && <img src={uploadImageURL} className='mx-auto object-scale-down ' />
        )}
      </div>
    </Modal>
  );
};

export default UplaodFileModal;
