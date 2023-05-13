import clsx from 'clsx';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState as UseState, useMemo as UseMemo } from 'react';

import OpenDeleteModalButton from '@/components/sponsors/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/sponsors/OpenEditModalButton';
import { get } from '@/utils/api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/sponsors/OpenAddModalButton';
import { Sponsor } from '@type/common';

interface Props {
  sponsor: Sponsor[];
}

export const getServerSideProps = async () => {
  const getSponsorUrl = process.env.SSR_API_URI + '/sponsors';
  const sponsorRes = await get(getSponsorUrl);

  return {
    props: {
      sponsor: sponsorRes,
    },
  };
};

const sponsorship: NextPage<Props> = (props: Props) => {
  const sponsorList: Sponsor[] = props.sponsor;

  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = UseState<string>(currentYear);

  const filteredSponsorListViews = UseMemo(() => {
    return sponsorList.filter((sponsor) => {
      return sponsor.createdAt?.includes(selectedYear);
    });
  }, [sponsorList, selectedYear]);

  return (
    <MainLayout>
      <Head>
        <title>協賛企業一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card w='w-1/1'>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title title={'協賛企業一覧'} />
            <select
              className='w-100'
              defaultValue={currentYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
              <option value='2023'>2023</option>
            </select>
          </div>
          <div className='hidden justify-end md:flex'>
            <OpenAddModalButton>協賛企業登録</OpenAddModalButton>
          </div>
        </div>
        <div className='mb-2 p-5 overflow-scroll'>
          <table className='mb-5 w-max md:w-full table-fixed border-collapse'>
            <thead>
              <tr className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='mr-1 text-center text-sm text-black-600'>企業名</div>
                </th>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>電話番号</div>
                </th>
                <th className='w-1/6 border-b-primary-1 pb-2'>
                  <div className='text-center text-sm text-black-600'>メール</div>
                </th>
                <th className='w-1/6 border-b-primary-1 pb-2'>
                  <div className='text-center'>住所</div>
                </th>
                <th className='w-1/8 border-b-primary-1 pb-2'>
                  <div className='text-center text-black-600'>代表者</div>
                </th>
                <th className='w-1/12 border-b-primary-1 pb-2'>
                  <div className='text-center text-black-600'></div>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {filteredSponsorListViews &&
                filteredSponsorListViews.map((sponsor, index) => (
                  <tr
                    className={clsx(index !== sponsorList.length - 1 && 'border-b')}
                    key={sponsor.id}
                  >
                    <td className='py-3'>
                      <div className='text-center text-black-300'>{sponsor.name}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.tel}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.email}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.address}</div>
                    </td>
                    <td>
                      <div className='text-center text-black-300'>{sponsor.representative}</div>
                    </td>
                    <td>
                      <div className='flex gap-3'>
                        <OpenEditModalButton sponsor={sponsor} />
                        <OpenDeleteModalButton id={sponsor.id || 0} />
                      </div>
                    </td>
                  </tr>
                ))}
              {!filteredSponsorListViews.length && (
                <tr>
                  <td colSpan={6} className='py-3'>
                    <div className='text-center text-black-300'>データがありません</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <div className='fixed bottom-4 right-4 md:hidden'>
        <OpenAddModalButton />
      </div>
    </MainLayout>
  );
};

export default sponsorship;
