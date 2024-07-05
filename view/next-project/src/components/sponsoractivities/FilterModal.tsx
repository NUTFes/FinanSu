import React, { FC, useState, useMemo } from 'react';
import { Modal, Select, CloseButton, Input, MultiSelect } from '@components/common';
import { SponsorStyle } from '@type/common';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sponsorStyles: SponsorStyle[];
}

const FilterModal: FC<ModalProps> = (props) => {
  const { sponsorStyles } = props;
  const onClose = () => {
    props.setIsOpen(false);
  };

  const [isStyleSelectOpen, setIsStyleSelectOpen] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<{
    styleIds: number[];
    isDone: 'all' | 'false' | 'true';
    keyword: string;
  }>({ styleIds: sponsorStyles.map((style) => style?.id!), isDone: 'all', keyword: '' });
  const [isAllCheck, setIsAllCheck] = useState<boolean>(true);
  type SelectOption = 'all' | 'false' | 'true';

  function includeStyleIds(id: number) {
    return filterData.styleIds.includes(id);
  }

  function addAndRemoveStyleIds(id: number) {
    includeStyleIds(id)
      ? setFilterData({
          ...filterData,
          styleIds: filterData.styleIds.filter((styleId) => styleId !== id),
        })
      : setFilterData({
          ...filterData,
          styleIds: [...filterData.styleIds, id],
        });
  }

  const topCheckboxEvent = (event: any) => {
    event.stopPropagation();
    isAllCheck ? deleteAllStyleIds() : addAllStyleIds();
  };

  const preventStyleOpenEvent = (event: any) => {
    event.stopPropagation();
  };

  function addAllStyleIds() {
    const allStyleIDs = sponsorStyles.map((style) => style?.id!);
    setFilterData({ ...filterData, styleIds: allStyleIDs });
    setIsAllCheck(true);
  }

  function deleteAllStyleIds() {
    setFilterData({ ...filterData, styleIds: [] });
    setIsAllCheck(false);
  }

  return (
    <Modal
      className='md:w-1/3'
      onClick={() => {
        isStyleSelectOpen ? setIsStyleSelectOpen(false) : onClose();
      }}
    >
      <div
        onClick={(e) => {
          !isStyleSelectOpen && preventStyleOpenEvent(e);
        }}
      >
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
              <div
                className='flex rounded-md p-2 hover:bg-white-100'
                onClick={() => {
                  setIsStyleSelectOpen(!isStyleSelectOpen);
                }}
              >
                <input
                  type='checkbox'
                  onChange={topCheckboxEvent}
                  onClick={preventStyleOpenEvent}
                  checked={isAllCheck}
                ></input>
                <div className='flex w-full items-center justify-center'>
                  <p>全て</p>
                </div>
              </div>
              {isStyleSelectOpen && (
                <div className='fixed z-50  h-1/2 overflow-y-auto rounded-md border bg-white-0'>
                  <hr></hr>
                  {props.sponsorStyles.map((style) => (
                    <div className='flex p-2' key={style.id} onClick={preventStyleOpenEvent}>
                      <input
                        type='checkbox'
                        checked={includeStyleIds(style?.id!)}
                        onChange={() => {
                          addAndRemoveStyleIds(style?.id!);
                        }}
                        id={String(style.id)}
                      ></input>
                      <label htmlFor={String(style.id)} className='mx-2 text-black-300'>
                        {style.style}/{style.feature}/{style.price}円
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className='col-span-2 text-black-600'>回収有無</p>
          <div className='col-span-2 w-full'>
            <Select
              defaultValue={'all'}
              onChange={(e) => {
                setFilterData({ ...filterData, isDone: e.target.value as SelectOption });
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
              value={filterData.keyword}
              onChange={(e) => {
                setFilterData({ ...filterData, keyword: e.target.value });
              }}
            />
          </div>
        </div>
        <div className='mx-auto my-8 w-fit text-xl text-black-600'>
          <button>設定</button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
