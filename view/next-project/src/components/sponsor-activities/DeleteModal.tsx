import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useState } from 'react';

import { deleteSponsorshipActivitiesId } from '@/generated/hooks';
import { useToast } from '@/hooks/useToast';
import { Modal, OutlinePrimaryButton, PrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  id: number | string;
  onDeleted?: () => Promise<void> | void;
}

const SponsorActivitiesDeleteModal: FC<ModalProps> = (props) => {
  const router = useRouter();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const onClose = () => {
    props.setShowModal(false);
  };

  const deleteSponsorActivity = async () => {
    await deleteSponsorshipActivitiesId(Number(props.id));
  };

  return (
    <Modal className='w-fit px-15 py-12.5' onClick={onClose}>
      <div className='text-black-600 mx-auto mb-5 w-fit text-xl'>本当に削除しますか？</div>
      <div className='flex flex-row justify-center gap-4'>
        <OutlinePrimaryButton onClick={onClose}>キャンセル</OutlinePrimaryButton>
        <PrimaryButton
          disabled={isDeleting}
          onClick={async () => {
            setIsDeleting(true);

            try {
              await deleteSponsorActivity();
              onClose();
              if (props.onDeleted) {
                await props.onDeleted();
              } else {
                router.reload();
              }
            } catch (error) {
              console.error('Failed to delete sponsor activity:', error);
              toast({
                title: '削除失敗',
                description: '削除に失敗しました。時間をおいて再度お試しください。',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            } finally {
              setIsDeleting(false);
            }
          }}
        >
          削除する
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default SponsorActivitiesDeleteModal;
