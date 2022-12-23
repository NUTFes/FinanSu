import clsx from 'clsx';
import Router from 'next/router';
import { RiAccountCircleFill } from 'react-icons/ri';
import { useRecoilState } from 'recoil';

import { authAtom, userAtom } from '@/store/atoms';
import { del } from '@api/signOut';
import { ChakraUIDropdown } from '@components/common';
import { User } from '@type/common';

const Header = () => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [user, setUser] = useRecoilState(userAtom);

  const signOut = async () => {
    const signOutUrl: string = process.env.CSR_API_URI + '/mail_auth/signout';
    const req = await del(signOutUrl, auth.accessToken);
    const authData = {
      isSignIn: false,
      accessToken: '',
    };
    console.log('sign out');
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
              <ChakraUIDropdown
                title={user.name}
                onClick={async () => {
                  signOut();
                }}
              >
                {/* <div
                  className={clsx('py-2 text-sm text-black-0')}
                  onClick={() => {
                    signOut();
                  }}
                >
                  ログアウト
                </div> */}
              </ChakraUIDropdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
