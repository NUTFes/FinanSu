import { Input, FormControl, FormErrorMessage } from '@chakra-ui/react';
import React from 'react';

interface Props {
  errors: any;
  register: any;
}

export default function Password(props: Props) {
  return (
    <FormControl isInvalid={props.errors.email ? true : false} isRequired>
      <Input
        minW='100'
        borderRadius='full'
        borderColor='primary.1'
        type='text'
        {...props.register('email', {
          required: 'メールアドレスは必須です。',
          pattern: {
            value:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'メールアドレス形式で入力してください。',
          },
        })}
      />
      <FormErrorMessage>{props.errors.email && props.errors.email.message}</FormErrorMessage>
    </FormControl>
  );
}
