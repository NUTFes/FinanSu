import { useState } from 'react';
import LoginLayout from '@components/layout/LoginLayout';
import LoginView from '@components/auth/LoginView';
import SignUpView from '@components/auth/SignUpView';
import type { NextPage } from 'next';
import { ChakraProvider, Center, Flex, Box, Heading, Link, Spacer } from '@chakra-ui/react';
import theme from '@assets/theme';

const Home: NextPage = () => {
  let [isMember, setIsMember] = useState(true);
  const cardContent = (isMember: boolean) => {
    if (isMember) {
      return (
        <>
          <Flex justify='center' align='center' mt='1.5rem'>
            <Center>
              <Link onClick={() => setIsMember(!isMember)}>
                <Heading as='h3' size='md'>
                  Log in
                </Heading>
              </Link>
            </Center>
            <Center mx='1rem'>
              <Heading as='h4' size='md'>
                /
              </Heading>
            </Center>
            <Center gap='2rem'>
              <Link onClick={() => setIsMember(!isMember)}>Sign up</Link>
            </Center>
          </Flex>
          {/* <LoginView /> */}
        </>
      );
    } else {
      return (
        <>
          <Flex justify='center' align='center' mt='1.5rem'>
            <Center>
              <Link onClick={() => setIsMember(!isMember)}>
                <Heading as='h3' size='md'>
                  Sign up
                </Heading>
              </Link>
            </Center>
            <Center mx='1rem'>
              <Heading as='h4' size='md'>
                /
              </Heading>
            </Center>
            <Center gap='2rem'>
              <Link onClick={() => setIsMember(!isMember)}>Log in</Link>
            </Center>
          </Flex>
          <SignUpView />
        </>
      );
    }
  };
  return (
    <LoginLayout>
      <ChakraProvider theme={theme}>
        <Center>
          <Box m='2rem' px='10' boxShadow='base' rounded='lg'>
            <Box gap='gap-s'>{cardContent(isMember)}</Box>
          </Box>
        </Center>
      </ChakraProvider>
    </LoginLayout>
  );
};

export default Home;
