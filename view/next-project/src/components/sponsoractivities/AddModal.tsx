import clsx from 'clsx';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { userAtom } from '@/store/atoms';
import { post } from '@/utils/api/sponsorActivitiesItem';
import { CloseButton, Modal, PrimaryButton, PullDown } from '@components/common';
import { useUI } from '@components/ui/context';
import AddModal from '@components/sponsoractivities/SponsorActivtiesAddModal';
import { SponsorActivities, SponsorActivitiesItem } from '@/type/common'; 

export default function PurchaseItemNumModal() {
  const [user] = useRecoilState(userAtom);

  const SponsorActivitiesItemNumArray = [1];

  const { setModalView, openModal, closeModal } = useUI();
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const [formData, setFormData] = useState({
    sponsorID: 0,
    sponsorStyleID: 0,
    userID: user.id,
    isDone: false,
    createdAt: '',
    updatedAt: '',
  });
  const [sponsorActivitiesItemNum, setSponsorActivitiesItemNum] = useState({
    value: 1,
  });

  const [formDataList, setFormDataList] = useState<SponsorActivitiesItem[]>(() => {
    const initFormDataList = [];
    for (let i = 0; i < SponsorActivitiesItemNumArray.length; i++) {
      const initFormData: SponsorActivitiesItem = {
        id: i + 1,
        sponsorID: 0,
        sponsorStyleID: 0,
        userID: 0,
        isDone: false,
        createdAt: '',
        updatedAt: '',
      };
      initFormDataList.push(initFormData);
    }
    return initFormDataList;
  });

  // 局（Bureau）をフロントで定義
  const bureaus = [
    {
      id: 1,
      name: '総務局',
    },
    {
      id: 2,
      name: '渉外局',
    },
    {
      id: 3,
      name: '財務局',
    },
    {
      id: 4,
      name: '企画局',
    },
    {
      id: 5,
      name: '制作局',
    },
    {
      id: 6,
      name: '情報局',
    },
  ];

  const [bureauID, setBureauID] = useState<number>(user.bureauID);

  // 申請する局用のhandler
  const bureauHandler = () => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBureauID(Number(e.target.value));
  };

  const submit = async (data: SponsorActivities) => {
    const addSponsorActivitiesUrl = process.env.CSR_API_URI + '/activites';
    const postRes: SponsorActivities = await post(addSponsorActivitiesUrl, data);
    const purchaseOrderId = postRes.id;
    console.log(postRes)
    const initialPurchaseItemList = [];
    for (let i = 0; i < Number(sponsorActivitiesItemNum.value); i++) {
      const initialPurchaseItem: SponsorActivitiesItem = {
        id: i + 1,
        sponsorID: 0,
        sponsorStyleID: 0,
        userID: 0,
        isDone: false,
        createdAt: '',
        updatedAt: '',
      };
      initialPurchaseItemList.push(initialPurchaseItem);
    }
    setFormDataList(initialPurchaseItemList);
  };

  return (
    <>
    <Modal>
      <div className={clsx('w-full')}>
        <div className={clsx('mr-5 grid w-full justify-items-end')}>
          <CloseButton onClick={closeModal} />
        </div>
      </div>
      <div className={clsx('mb-10 grid w-full justify-items-center text-xl text-black-600')}>
        協賛活動報告の登録
      </div>
      <div className={clsx('mb-10 grid grid-cols-12 gap-4')}>
        <div className={clsx('col-span-1 grid')} />
        <div className={clsx('col-span-10 grid my-2 w-full')}>
          <div className={clsx('text-md grid justify-items-end text-center text-black-600')}>
            申請した物品としていない物品を同時に購入した場合は
            <br />
            2回に分けて登録をお願いします。
          </div>
        </div>
        <div className={clsx('col-span-1 grid ')} />
      </div>
      <div className={clsx('grid w-full grid-cols-12 pb-5')}>
        <div className={clsx('h-100 col-span-1 grid')} />
        <div
          className={clsx(
            'text-md h-100 col-span-10 grid w-full justify-items-center pr-3 text-black-600',
          )}
        >
          <div className={clsx('flex')}>
            <div className={clsx('mx-2')}>
              <PrimaryButton
                onClick={() => {
                  onOpen();
                }}
              >
                協賛企業を登録
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div className={clsx('h-100 col-span-1 grid')} />
      </div>
      <div className={clsx('grid justify-items-center px-1')}></div>
    </Modal>

    {isOpen && (
        <AddModal
          sponsorActivitesItemNum={sponsorActivitiesItemNum}
          isOpen={isOpen}
          numModalOnClose={closeModal}
          onClose={onClose}
          setFormDataList={setFormDataList}
          formDataList={formDataList}
        />
      )}
    </>
  );
}
