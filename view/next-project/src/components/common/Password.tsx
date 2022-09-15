import { Input, FormControl, FormErrorMessage } from '@chakra-ui/react';
import React from 'react';

interface Props {
  errors: any;
  register: any;
}

export default function Password(props: Props) {
  return (
    <FormControl isInvalid={props.errors.password ? true : false} isRequired>
      <Input
        minW='100'
        borderRadius='full'
        borderColor='primary.1'
        type='password'
        {...props.register('password', {
          required: 'パスワードは必須です。',
          minLength: {
            value: 6,
            message: 'パスワードは6文字以上で入力してください',
          },
        })}
      />
      <FormErrorMessage>{props.errors.password && props.errors.password.message}</FormErrorMessage>
    </FormControl>
  );
}
