import { useState } from 'react';
import LoginLayout from '@components/layout/LoginLayout';
import SignInView from '@components/auth/SignInView';
import SignUpView from '@components/auth/SignUpView';
import { ChakraProvider, Center, Flex, Box, Heading, Link, Spacer } from '@chakra-ui/react';
import theme from '@assets/theme';
import { get } from '@api/api_methods';

interface Department {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  departments: Department[];
}

export async function getServerSideProps() {
  const getDepartmentsUrl: string = process.env.SSR_API_URI + '/bureaus';
  const departmentsRes: Department = await get(getDepartmentsUrl);
  return {
    props: {
      departments: departmentsRes,
    },
  };
}

export default function Home(props: Props) {
  let [isMember, setIsMember] = useState(true);
  const cardContent = (isMember: boolean) => {
    if (isMember) {
      return (
        <>
          <Flex justify='center' align='center' mt='1.5rem'>
            <Center>
              <Link onClick={() => setIsMember(!isMember)}>
                <Heading as='h3' size='md'>
                  ログイン
                </Heading>
              </Link>
            </Center>
            <Center mx='1rem'>
              <Heading as='h4' size='md'>
                /
              </Heading>
            </Center>
            <Center gap='2rem'>
              <Link onClick={() => setIsMember(!isMember)}>新規登録はこちら</Link>
            </Center>
          </Flex>
          <SignInView />
        </>
      );
    } else {
      return (
        <>
          <Flex justify='center' align='center' mt='1.5rem'>
            <Center>
              <Link onClick={() => setIsMember(!isMember)}>
                <Heading as='h3' size='md'>
                  新規登録
                </Heading>
              </Link>
            </Center>
            <Center mx='1rem'>
              <Heading as='h4' size='md'>
                /
              </Heading>
            </Center>
            <Center gap='2rem'>
              <Link onClick={() => setIsMember(!isMember)}>ログインはこちら</Link>
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
}
