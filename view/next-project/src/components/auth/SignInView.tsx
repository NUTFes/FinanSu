import React, { FC, useState } from 'react';
import Router from 'next/router';
import { signIn } from '@api/signIn';
import SubmitButton from '@components/General/RegistButton';
import {
  ChakraProvider,
  Center,
  Box,
  Heading,
  Input,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import theme from '@assets/theme';

interface PostData {
  email: string;
  password: string;
}

export const SignIn = async (data: PostData) => {
  const loginUrl: string = process.env.CSR_API_URI + '/mail_auth/signin';

  const req: any = await signIn(loginUrl, data);
  const res: any = await req.json();
  if (req.status === 200) {
    localStorage.setItem('access-token', res.access_token);
    localStorage.setItem('login', 'true');
    Router.push('/fund_informations');
  } else {
    console.log('Error' + res.status);
    console.log(res);
  }
};

const LoginView: FC = () => {
  const [formData, setFormData] = useState<PostData>({ email: '', password: '' });
  const formDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };
  return (
    <ChakraProvider theme={theme}>
      <Flex mt='10' />
      <Grid templateColumns='repeat(12, 1fr)' gap={4}>
        <GridItem colSpan={1} />
        <GridItem colSpan={10}>
          <Grid templateColumns='repeat(12, 1fr)' gap={4}>
            <GridItem rowSpan={1} colSpan={4}>
              <Flex color='black.600' h='100%' justify='end' align='center'>
                <Heading as='h4' size='md' my='2'>
                  メールアドレス
                </Heading>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={8}>
              <Input
                minW='100'
                borderRadius='full'
                borderColor='primary.1'
                type='text'
                value={formData.email}
                onChange={formDataHandler('email')}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Flex color='black.600' h='100%' justify='end' align='center'>
                <Heading as='h4' size='md'>
                  パスワード
                </Heading>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={8}>
              <Flex>
                <Input
                  minW='100'
                  borderRadius='full'
                  borderColor='primary.1'
                  type='password'
                  value={formData.password}
                  onChange={formDataHandler('password')}
                />
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem colSpan={1} />
      </Grid>
      <Flex mt='7' />
      <Center>
        <Box p='5' mb='2'>
          <SubmitButton onClick={() => SignIn(formData)}>ログイン</SubmitButton>
        </Box>
      </Center>
    </ChakraProvider>
  );
};

export default LoginView;
