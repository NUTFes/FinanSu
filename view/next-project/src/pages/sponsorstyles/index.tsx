import clsx from 'clsx';
import Head from 'next/head';

import OpenDeleteModalButton from '@/components/sponsorstyles/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/sponsorstyles/OpenEditModalButton';
import { get } from '@api/api_methods';
import { Card, Title } from '@components/common';
import MainLayout from '@components/layout/MainLayout';
import OpenAddModalButton from '@components/sponsorstyles/OpenAddModalButton';
import { SponsorStyle } from '@type/common';

interface Props {
  sponsorstyles: SponsorStyle[];
}

export const getServerSideProps = async () => {
  const getSponsorstylesUrl = process.env.SSR_API_URI + '/sponsorstyles';
  const sponsorstylesRes = await get(getSponsorstylesUrl);

  return {
    props: {
      sponsorstyles: sponsorstylesRes,
    },
  };
};
export default function SponsorStyleList(props: Props) {
  const sponsorStyleList: SponsorStyle[] = props.sponsorstyles;

  return (
    <MainLayout>
      <Head>
        <title>協賛スタイル一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className='mx-5 mt-10'>
          <div className='flex'>
            <Title>協賛スタイル一覧</Title>
            <select className='w-fit'>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className='flex justify-end'>
            <div>
              <OpenAddModalButton>協賛スタイル登録</OpenAddModalButton>
            </div>
          </div>
        </div>
        <div className='mb-2 p-5'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>広告サイズ</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='mr-1 text-center text-sm text-black-600'>カラー，モノクロ</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>金額</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'></p>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {sponsorStyleList.map((sponsorStyleItem, index) => (
                <tr
                  className={clsx(index !== sponsorStyleList.length - 1 && 'border-b')}
                  key={sponsorStyleItem.id}
                >
                  <td className='py-3'>
                    <p className='text-center text-sm text-black-600'>{sponsorStyleItem.scale}</p>
                  </td>
                  <td>
                    {sponsorStyleItem.isColor && (
                      <p className='text-center text-sm text-black-600'>カラー</p>
                    )}
                    {!sponsorStyleItem.isColor && (
                      <p className='text-center text-sm text-black-600'>モノクロ</p>
                    )}
                  </td>
                  <td>{sponsorStyleItem.price}</td>
                  <td>
                    <div className='flex flex-row gap-3'>
                      <OpenEditModalButton
                        id={sponsorStyleItem.id || 0}
                        sponsorStyle={sponsorStyleItem}
                      />
                      <OpenDeleteModalButton id={sponsorStyleItem.id || 0} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
