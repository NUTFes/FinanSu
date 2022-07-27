import React from 'react';
import Router from 'next/router';
import { del } from '@api/signOut';
import { useGlobalContext } from '@components/global/context';
import clsx from 'clsx'
import { RiAccountCircleFill } from 'react-icons/ri'
import { Dropdown } from '@components/common'

// sign out
export const signOut = async () => {
  const signOutUrl: string = process.env.CSR_API_URI + '/mail_auth/signout';
  const req: any = await del(signOutUrl);
  if (req.status === 200) {
    localStorage.setItem('login', 'false');
    Router.push('/');
  } else {
    console.log('Error' + req.status);
    console.log(req);
  }
};

const Header = () => {
  const state = useGlobalContext();

  return (
    <>
      <div className={clsx('grid grid-cols-9 w-full bg-primary-4 h-16 border-b-2 border-primary-1')}>
        <div className={clsx('grid col-span-1')}>
          <div className={clsx('flex justify-center items-center w-full text-white-0 text-shadow-logo text-2xl')}>
            FinanSu
          </div>
        </div>
        <div className={clsx('grid col-span-7 justify-items-center w-full text-black-600 text-md')} />
        <div className={clsx('grid col-span-1')}>
          <div className={clsx('flex justify-center items-center w-full h-16 text-white-0')}>
            <RiAccountCircleFill size={'21px'} />
            <div className={clsx('ml-2 text-white-0 text-lg font-light')}>
              <Dropdown title={state.user.name}>
                <div className={clsx('text-black-0 text-sm py-2')} onClick={() => {
                  signOut();
                }}>
                  ログアウト
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
