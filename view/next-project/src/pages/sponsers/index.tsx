import clsx from 'clsx';
import Head from 'next/head';
import { RiAddCircleLine } from 'react-icons/ri';
import MainLayout from '@components/layout/MainLayout';
import EditButton from '@components/common/EditButton';
import { Card, Title } from '@components/common';
import RegistButton from '@components/common/RegistButton';
import type { NextPage } from 'next';

const sponsorship: NextPage = () => {
  const sponsorshipList = [
    {
      id: 1,
      name: '海龍',
      tel: '000-0000-0000',
      email: 'kairyu@gmail.com',
      address: '新潟県長岡市上富岡町2丁目280-1',
      representative: '長岡太郎',
      created_at: '2022/3/1',
      updated_at: '2022/3/2',
    },
  ];
  return (
    <MainLayout>
      <Head>
        <title>企業一覧</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Card>
        <div className={clsx('mx-5 mt-10')}>
          <div className={clsx('flex')}>
            <Title title={'企業一覧'} />
            <select className={clsx('w-100')}>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
            </select>
          </div>
          <div className={clsx('flex justify-end')}>
            <RegistButton>
              <RiAddCircleLine size={20} style={{ marginRight: 5 }} />
              企業登録
            </RegistButton>
          </div>
        </div>
        <div className={clsx('mb-2 p-5')}>
          <table className={clsx('mb-5 w-full table-fixed border-collapse')}>
            <thead>
              <tr
                className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0 py-3')}
              >
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>ID</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('mr-1 text-center text-sm text-black-600')}>企業名</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-sm text-black-600')}>電話番号</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-right text-sm text-black-600')}>メール</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center')}>住所</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-black-600')}>代表者</div>
                </th>

                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-black-600')}>作成日時</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-black-600')}>更新日時</div>
                </th>
                <th className={clsx('w-1/12 border-b-primary-1 pb-2')}>
                  <div className={clsx('text-center text-black-600')}></div>
                </th>
              </tr>
            </thead>
            <tbody className={clsx('border border-x-white-0 border-b-primary-1 border-t-white-0')}>
              {sponsorshipList.map((sponsorshipItem) => (
                <tr key={sponsorshipItem.id}>
                  <td>
                    <div className={clsx('text-center text-black-300')}>{sponsorshipItem.id}</div>
                  </td>
                  <td>
                    <div className={clsx('text-center text-black-300')}>{sponsorshipItem.name}</div>
                  </td>
                  <td>
                    <div className={clsx('text-center text-black-300')}>{sponsorshipItem.tel}</div>
                  </td>
                  <td>
                    <div className={clsx('text-right text-black-300')}>{sponsorshipItem.email}</div>
                  </td>
                  <td>
                    <div className={clsx('text-center text-black-300')}>
                      {sponsorshipItem.address}
                    </div>
                  </td>{' '}
                  <td>
                    <div className={clsx('text-center text-black-300')}>
                      {sponsorshipItem.representative}
                    </div>
                  </td>
                  <td>
                    <div className={clsx('text-center text-black-300')}>
                      {sponsorshipItem.updated_at}
                    </div>
                  </td>
                  <td>
                    <div className={clsx('text-center text-black-300')}>
                      {sponsorshipItem.created_at}
                    </div>
                  </td>
                  <td>
                    <div className={clsx('text-center')}>
                      <EditButton />
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
};

export default sponsorship;
