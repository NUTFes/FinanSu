import {
  ChakraProvider,
  Center,
  Box,
  Heading,
  Flex,
  Grid,
  GridItem,
  Button,
} from '@chakra-ui/react';
import Router from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signIn } from '@api/signIn';
import theme from '@assets/theme';
import Email from '@components/common/Email';
import LoadingButton from '@components/common/LoadingButton';
import Password from '@components/common/Password';

interface PostData {
  email: string;
  password: string;
}

export default function SignInView() {
  // ログイン中フラグ
  const [isSignInNow, setIsSignInNow] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PostData>({
    mode: 'all',
  });

  const SignIn = async (data: PostData) => {
    setIsSignInNow(true);
    const loginUrl: string = process.env.CSR_API_URI + '/mail_auth/signin';

    const req: any = await signIn(loginUrl, data);
    const res: any = await req.json();
    if (req.status === 200) {
      localStorage.setItem('access-token', res.access_token);
      localStorage.setItem('login', 'true');
      Router.push('/purchaseorders');
    } else {
      console.log('Error' + res.status);
      console.log(res);
      alert(
        'ログインに失敗しました。メールアドレスもしくはパスワードが間違っている可能性があります',
      );
      setIsSignInNow(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <form onSubmit={handleSubmit(SignIn)} noValidate>
        <Flex mt='10' />
        <Grid templateColumns='repeat(12, 1fr)' gap={4}>
          <GridItem colSpan={1} />
          <GridItem colSpan={10}>
            <Grid templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem rowSpan={1} colSpan={4}>
                <Flex color='black.600' h='100%' justify='end' align='top'>
                  <Heading as='h4' size='md' my='2'>
                    メールアドレス
                  </Heading>
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={8}>
                <Flex>
                  <Email errors={errors} register={register} />
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={4}>
                <Flex color='black.600' h='100%' justify='end' align='top'>
                  <Heading as='h4' size='md' my='2'>
                    パスワード
                  </Heading>
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={8}>
                <Flex>
                  <Password errors={errors} register={register} />
                </Flex>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={1} />
        </Grid>
        <Flex mt='7' />
        <Center>
          <Box p='5' mb='2'>
            {isSignInNow ? (
              <LoadingButton loadingText='ログイン中' />
            ) : (
              <Button color='white' bgGradient='linear(to-br, primary.1, primary.2)' type='submit'>
                ログイン
              </Button>
            )}
          </Box>
        </Center>
      </form>
    </ChakraProvider>
  );
}
