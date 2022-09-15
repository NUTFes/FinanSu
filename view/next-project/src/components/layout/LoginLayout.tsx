import { Box } from '@chakra-ui/react';
import React from 'react';

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
