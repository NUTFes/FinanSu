import clsx from 'clsx';
import Router from 'next/router';
import React from 'react';
import { RiAccountCircleFill } from 'react-icons/ri';

import { del } from '@api/signOut';
import { Dropdown } from '@components/common';
import { useGlobalContext } from '@components/global/context';

// sign out
export const signOut = async () => {
  const signOutUrl: string = process.env.CSR_API_URI + '/mail_auth/signout';
  const req = await del(signOutUrl);
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
      <div
        className={clsx('grid h-16 w-full grid-cols-9 border-b-2 border-primary-1 bg-primary-4')}
      >
        <div className={clsx('col-span-1 grid')}>
          <div
            className={clsx(
              'flex w-full items-center justify-center text-2xl text-white-0 text-shadow-logo',
            )}
          >
            FinanSu
          </div>
        </div>
        <div
          className={clsx('text-md col-span-7 grid w-full justify-items-center text-black-600')}
        />
        <div className={clsx('col-span-1 grid')}>
          <div className={clsx('flex h-16 w-full items-center justify-center text-white-0')}>
            <RiAccountCircleFill size={'21px'} />
            <div className={clsx('ml-2 text-lg font-light text-white-0')}>
              <Dropdown title={state.user.name}>
                <div
                  className={clsx('py-2 text-sm text-black-0')}
                  onClick={() => {
                    signOut();
                  }}
                >
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
