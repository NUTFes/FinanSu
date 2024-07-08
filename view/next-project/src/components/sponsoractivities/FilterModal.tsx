import React, { FC, useState } from 'react';
import { Modal, Select, CloseButton, Input, PrimaryButton } from '@components/common';
import { SponsorStyle, SponsorFilterType } from '@type/common';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sponsorStyles: SponsorStyle[];
  filterData: SponsorFilterType;
  setFilterData: (filterData: SponsorFilterType) => void;
}

const SELECT = '選択中';
const NOT_SELECT = '未選択';

const FilterModal: FC<ModalProps> = (props) => {
  const { sponsorStyles, filterData, setFilterData } = props;

  const [isAllStyleCheck, setIsAllStyleCheck] = useState<boolean>(
    filterData.styleIds.length === sponsorStyles.length,
  );
  type SelectOption = 'all' | 'false' | 'true';

  // モーダル用の変数
  const [draftFilterData, setDraftFilterData] = useState<SponsorFilterType>(filterData);

  function includeStyleIds(id: number) {
    return draftFilterData.styleIds.includes(id);
  }

  function filterHandler(event: any) {
    event.preventDefault();
    setFilterData(draftFilterData);
    setIsAllStyleCheck(isAllStyleCheck);
    props.setIsOpen(false);
  }

  function addAndRemoveStyleIds(id: number) {
    includeStyleIds(id)
      ? (setDraftFilterData({
          ...draftFilterData,
          styleIds: draftFilterData.styleIds.filter((styleId) => styleId !== id),
        }),
        setIsAllStyleCheck(false))
      : (setDraftFilterData({
          ...draftFilterData,
          styleIds: [...draftFilterData.styleIds, id],
        }),
        sponsorStyles.length === [...draftFilterData.styleIds, id].length &&
          setIsAllStyleCheck(true));
  }

  const topCheckboxEvent = (event: any) => {
    isAllStyleCheck ? deleteAllStyleIds() : addAllStyleIds();
  };

  const preventCloseModalEvent = (event: any) => {
    event.stopPropagation();
  };

  function addAllStyleIds() {
    const allStyleIDs = sponsorStyles.map((style) => style?.id || 0);
    setDraftFilterData({ ...draftFilterData, styleIds: allStyleIDs });
    setIsAllStyleCheck(true);
  }

  function deleteAllStyleIds() {
    setDraftFilterData({ ...draftFilterData, styleIds: [] });
    setIsAllStyleCheck(false);
  }

  const onClose = () => {
    props.setIsOpen(false);
  };

  return (
    <Modal
      className='md:w-1/2'
      onClick={() => {
        onClose();
      }}
    >
      <form onSubmit={filterHandler}>
        <div onClick={preventCloseModalEvent}>
          <div className='w-full'>
            <div className='ml-auto w-fit'>
              <CloseButton onClick={onClose} />
            </div>
          </div>
          <div className='mx-auto mb-10 w-fit text-xl text-black-600'>協賛フィルター</div>
          <div className='m-2 grid  grid-cols-4 items-center justify-items-center gap-x-2 gap-y-5'>
            <p className='col-span-2 text-black-600'>協賛スタイル</p>
            <div className='col-span-2 w-full'>
              <div className=''>
                <div className='flex rounded-md p-2 hover:bg-white-100'>
                  <input
                    type='checkbox'
                    onChange={topCheckboxEvent}
                    checked={isAllStyleCheck}
                    id='all'
                  ></input>
                  <label htmlFor='all' className='mx-2 w-full text-black-300'>
                    すべて （
                    {draftFilterData.styleIds.length > 0
                      ? SELECT + draftFilterData.styleIds.length
                      : NOT_SELECT}
                    ）
                  </label>
                </div>
                <div className='max-h-28 overflow-y-auto rounded-md border-2 bg-white-0'>
                  {props.sponsorStyles.map((style) => (
                    <div className='flex p-2 hover:bg-white-100' key={style.id}>
                      <input
                        type='checkbox'
                        checked={includeStyleIds(style?.id || 0)}
                        onChange={() => {
                          addAndRemoveStyleIds(style?.id || 0);
                        }}
                        id={String(style.id)}
                      ></input>
                      <label htmlFor={String(style.id)} className='mx-2 w-full text-black-300'>
                        {style.style}/{style.feature}/{style.price}円
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className='col-span-2 text-black-600'>協賛金回収状況</p>
            <div className='col-span-2 w-full'>
              <Select
                defaultValue={draftFilterData.isDone}
                onChange={(e) => {
                  setDraftFilterData({
                    ...draftFilterData,
                    isDone: e.target.value as SelectOption,
                  });
                }}
                className=''
              >
                <option value='all'>すべて</option>
                <option value='false'>未回収</option>
                <option value='true'>回収済</option>
              </Select>
            </div>
            <p className='col-span-2 text-black-600'>企業名検索</p>
            <div className='col-span-2 w-full'>
              <Input
                value={draftFilterData.keyword}
                className='w-full'
                onChange={(e) => {
                  setDraftFilterData({ ...draftFilterData, keyword: e.target.value });
                }}
              />
            </div>
            <p className='col-span-2 text-black-600'>並び替え</p>
            <div className='col-span-2 w-full'>
              <Select
                className={'w-100'}
                defaultValue={draftFilterData.selectedSort}
                onChange={(e) =>
                  setDraftFilterData({ ...draftFilterData, selectedSort: e.target.value })
                }
              >
                <option value='default'>更新日時降順</option>
                <option value='updateSort'>更新日時昇順</option>
                <option value='createDesSort'>作成日時降順</option>
                <option value='createSort'>作成日時昇順</option>
                <option value='priceDesSort'>協賛金降順</option>
                <option value='priceSort'>協賛金昇順</option>
              </Select>
            </div>
          </div>
          <div className='mx-auto my-8 w-fit text-xl text-black-600'>
            <PrimaryButton type='submit'>設定</PrimaryButton>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default FilterModal;
