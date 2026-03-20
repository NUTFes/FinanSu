import Image from 'next/image';
import Router from 'next/router';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiAccountCircleFill } from 'react-icons/ri';

import { useAuthStore, useUserStore } from '@/store';
import { del } from '@api/signOut';
import { UserDropdown } from '@components/common';

import { HeaderProps } from './Header.type';

const Header = (props: HeaderProps) => {
  const { onSideNavOpen } = props;
  const { accessToken, setAuth } = useAuthStore();
  const { user, resetUser } = useUserStore();

  const signOut = async () => {
    const signOutUrl: string = process.env.CSR_API_URI + '/mail_auth/signout';
    const req = await del(signOutUrl, accessToken);
    const authData = {
      isSignIn: false,
      accessToken: '',
    };
    if (req.status === 200) {
      setAuth(authData);
      resetUser();
      Router.push('/');
    }
  };

  return (
    <>
      <div
        className='
          fixed top-0 left-0 z-10 flex h-16 w-full flex-row items-center gap-5
          border-b-2 border-primary-1 bg-primary-4 px-3
          md:px-10
        '
      >
        <button
          onClick={() => {
            if (onSideNavOpen) onSideNavOpen();
          }}
          className='
            hidden text-white-0
            md:block
          '
        >
          <AiOutlineMenu size={'20px'} />
        </button>
        <div
          className='
            w-24
            md:w-40
          '
        >
          <Image src='/logo.svg' alt='logo' width={150} height={40} className='size-fit' />
        </div>
        <div
          className='
            ml-auto flex flex-row items-center gap-5 text-lg text-white-0
          '
        >
          <UserDropdown
            title={user.name}
            onClick={async () => {
              signOut();
            }}
          >
            <RiAccountCircleFill size={'20px'} />
          </UserDropdown>
          <button
            onClick={() => {
              if (onSideNavOpen) onSideNavOpen();
            }}
            className='md:hidden'
          >
            <AiOutlineMenu size={'20px'} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
