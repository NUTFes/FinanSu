import React, { useState } from 'react';
import Router from 'next/router';
import {
  Box,
  Flex,
  Text,
  ChakraProvider,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import PulldownButton from '@components/common/PulldownButton';
import { Avatar } from '@chakra-ui/react';
import theme from '@assets/theme';
import { del } from '@api/signOut';
import { useGlobalContext } from '@components/global/context';

interface User {
  id: number | string;
  name: string;
  department_id: number | string;
  role_id: number | string;
}

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

const Header = (props: any) => {
  const state = useGlobalContext();

  return (
    <ChakraProvider theme={theme}>
      <Flex
        as='nav'
        align='center'
        wrap='wrap'
        padding='0'
        color='white'
        flexDirection='row'
        width='100%'
        position='fixed'
        zIndex='2'
      >
        <Flex justify='center' bg='base.1' align='center' width='200px' height='60px' p='4'>
          <Text
            color='white'
            fontSize='24px'
            textShadow='4px 2px 0px rgba(0, 0, 0, 0.66)'
            letterSpacing={'tighter'}
          >
            FinanSu
          </Text>
        </Flex>
        <Flex
          align='center'
          justify='end'
          bgGradient='linear(to-br, primary.1, primary.2)'
          height='60px'
          flexGrow={1}
        >
          <Box>
            <Avatar size='xs' />
          </Box>
          <Box>
            <Text mx='3'>{state.user.name}</Text>
          </Box>
          <Box marginRight='5'>
            <Menu>
              <MenuButton as={Button} rightIcon={<PulldownButton />} colorScheme='primary.1'>
                Menu
              </MenuButton>
              <MenuList>
                <MenuItem color='black' onClick={() => signOut()}>
                  ログアウト
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Header;
