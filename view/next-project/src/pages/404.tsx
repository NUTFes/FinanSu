import Image from 'next/image';
import { PrimaryButton } from '@/components/common';

export default function Custom404() {
  return (
    <div className='flex h-screen flex-col'>
      <header className='flex h-16 w-full items-center justify-center bg-primary-4'>
        <div className='w-24 md:w-40'>
          <Image src='/logo.svg' alt='FinanSu' width={150} height={40} className='h-fit w-fit' />
        </div>
      </header>
      <main className='flex flex-grow items-center justify-center bg-gray-100 text-center'>
        <div className='flex flex-col items-center m-4 w-fit rounded-lg bg-white p-5 shadow-md md:m-8 md:w-1/2 md:p-10'>
          <h1 className='text-8xl font-bold'>404</h1>
          <h2 className='text-3xl'>Not Found</h2>
          <p className='mt-4 text-1xl text-gray-600'>お探しのページが見つかりませんでした。</p>
          <PrimaryButton className='mt-4' onClick={() => window.history.back()}>
            前のページに戻る
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
