import Image from 'next/image';
import Router from 'next/router';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiAccountCircleFill } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { authAtom, userAtom } from '@/store/atoms';
import { del } from '@api/signOut';
import { ChakraUIDropdown } from '@components/common';
import { User } from '@type/common';

import { HeaderProps } from './Header.type';

const Header = (props: HeaderProps) => {
  const { onSideNavOpen } = props;
  const [auth, setAuth] = useRecoilState(authAtom);
  const [user, setUser] = useRecoilState(userAtom);

  const signOut = async () => {
    const signOutUrl: string = process.env.CSR_API_URI + '/mail_auth/signout';
    const req = await del(signOutUrl, auth.accessToken);
    const authData = {
      isSignIn: false,
      accessToken: '',
    };
    if (req.status === 200) {
      setAuth(authData);
      setUser({} as User);
      Router.push('/');
    } else {
      console.log('Error' + req.status);
      console.log(req);
    }
  };

  return (
    <>
      <div className='fixed flex gap-5 z-50 h-16 w-full flex-row items-center border-b-2 border-primary-1 bg-primary-4 px-3 md:px-10'>
          <button
            onClick={() => {
              if (onSideNavOpen) onSideNavOpen();
            }}
            className='text-white-0 hidden md:block'
          >
            <AiOutlineMenu size={'20px'} />
          </button>
        <div className='w-24 md:w-40'>
          <Image src='/logo.svg' alt='logo' width={150} height={40} className='h-fit w-fit' />
        </div>
        <div className='ml-auto flex flex-row items-center gap-5 text-lg text-white-0'>
          <ChakraUIDropdown
            title={user.name}
            onClick={async () => {
              signOut();
            }}
          >
            <RiAccountCircleFill size={'20px'} />
          </ChakraUIDropdown>
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
