import clsx from 'clsx';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';

import { Card, Title } from '@/components/common';

import MainLayout from '@/components/layout/MainLayout';
import { get } from '@api/sponsorship';
import EditButton from '@components/common/EditButton';
import RegistButton from '@components/common/RegistButton';

interface SponsorStyle {
  id: number;
  scale: string;
  is_color: boolean;
  price: number;
  created_at: string;
  updated_at: string;
}
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
export default function SponsorList(props: Props) {
  const sponsorList: SponsorStyle[] = props.sponsorstyles;
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
              <RegistButton>
                <RiAddCircleLine
                  size={20}
                  style={{
                    marginRight: 5,
                  }}
                />
                協賛スタイル登録
              </RegistButton>
            </div>
          </div>
        </div>
        <div className='mb-2 p-5'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>ID</p>
                </th>
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
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>作成日時</p>
                </th>
                <th className='border border-x-white-0 border-b-primary-1 border-t-white-0 py-3'>
                  <p className='text-center text-sm text-black-600'>更新日時</p>
                </th>
              </tr>
            </thead>
            <tbody className='border border-x-white-0 border-b-primary-1 border-t-white-0'>
              {sponsorList.map((sponsorStyleItem, index) => (
                <tr key={sponsorStyleItem.id}>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponsorList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{sponsorStyleItem.id}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponsorList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>{sponsorStyleItem.scale}</p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponsorList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    {sponsorStyleItem.is_color && (
                      <p className='text-center text-sm text-black-600'>カラー</p>
                    )}
                    {!sponsorStyleItem.is_color && (
                      <p className='text-center text-sm text-black-600'>モノクロ</p>
                    )}
                  </td>
                  <td
                    className={clsx(
                      'px-1 text-black-300 text-center',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponsorList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    {sponsorStyleItem.price}
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponsorList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <div className='text-center'>
                      <EditButton />
                    </div>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponsorList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>
                      {sponsorStyleItem.created_at}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      'px-1',
                      index === 0 ? 'pt-4 pb-3' : 'py-3',
                      index === sponsorList.length - 1 ? 'pb-4 pt-3' : 'border-b py-3',
                    )}
                  >
                    <p className='text-center text-sm text-black-600'>
                      {sponsorStyleItem.updated_at}
                    </p>
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
