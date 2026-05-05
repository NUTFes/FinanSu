import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import OpenDeleteModalButton from '@/components/sponsorstyles/OpenDeleteModalButton';
import OpenEditModalButton from '@/components/sponsorstyles/OpenEditModalButton';
import { useCurrentUser, useUserStore } from '@/store';
import { get } from '@api/api_methods';
import { Card, Loading, Title } from '@components/common';
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

  const router = useRouter();
  const user = useCurrentUser();
  const _hasHydrated = useUserStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user?.roleID) return;
    if (user.roleID !== 2 && user.roleID !== 3) {
      router.push('/my_page');
    }
  }, [_hasHydrated, user?.roleID, router]);

  if (!_hasHydrated) return <Loading />;
  if (!user?.roleID || (user.roleID !== 2 && user.roleID !== 3)) return <Loading />;

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
          </div>
          <div className='hidden justify-end md:flex'>
            <OpenAddModalButton>協賛スタイル登録</OpenAddModalButton>
          </div>
        </div>
        <div className='mb-2 p-5'>
          <table className='mb-5 w-full table-fixed border-collapse'>
            <thead>
              <tr>
                <th className='border-b-primary-1 border-b py-3'>
                  <p className='text-black-600 text-center text-sm'>協賛内容</p>
                </th>
                <th className='border-b-primary-1 border-b py-3'>
                  <p className='text-black-600 mr-1 text-center text-sm'>オプション</p>
                </th>
                <th className='border-b-primary-1 border-b py-3'>
                  <p className='text-black-600 text-center text-sm'>金額</p>
                </th>
                <th className='border-b-primary-1 border-b py-3'>
                  <p className='text-black-600 text-center text-sm'></p>
                </th>
              </tr>
            </thead>
            <tbody>
              {sponsorStyleList.map((sponsorStyleItem, index) => (
                <tr
                  className={clsx(index !== sponsorStyleList.length - 1 && `border-b`)}
                  key={sponsorStyleItem.id}
                >
                  <td className='py-3'>
                    <p className='text-black-600 text-center text-sm'>{sponsorStyleItem.style}</p>
                  </td>
                  <td>
                    <p className='text-black-600 text-center text-sm'>{sponsorStyleItem.feature}</p>
                  </td>
                  <td className='py-3'>
                    <p className='text-black-600 text-center text-sm'>{sponsorStyleItem.price}</p>
                  </td>
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
      <div className='fixed right-4 bottom-4 md:hidden'>
        <OpenAddModalButton />
      </div>
    </MainLayout>
  );
}
