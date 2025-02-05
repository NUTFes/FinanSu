import { Noto_Sans_JP } from 'next/font/google';
import { RiAddCircleLine } from 'react-icons/ri';
import mockData from './mockData';
import { Card, PrimaryButton } from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';
import TableSection from '@/components/mypage/TableSection';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

const MyPage = () => {
  return (
    <MainLayout>
      <Card>
        <div
          className={`mx-5 mt-10 aspect-square min-h-full md:aspect-auto md:min-h-[80vh] ${notoSansJP.className}`}
        >
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-thin text-[#333]'>マイページ</h2>
            <PrimaryButton>
              <div className='flex items-center gap-2'>
                購入報告
                <RiAddCircleLine size={20} />
              </div>
            </PrimaryButton>
          </div>
          <div className='h-[calc(100%-5rem)] overflow-y-auto'>
            {mockData.map((data, index) => (
              <TableSection key={index} department={data.department} items={data.items} />
            ))}
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

export default MyPage;
