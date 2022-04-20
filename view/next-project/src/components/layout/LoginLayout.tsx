import React from 'react';
import Header from '@components/Header';
import { Box, chakra } from '@chakra-ui/react';

type LayoutProps = {
  children: React.ReactNode;
};

function LoginLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <Box>{children}</Box>
    </>
  );
}

export default LoginLayout;
