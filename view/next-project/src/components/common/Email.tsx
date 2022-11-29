import { Input, FormControl, FormErrorMessage } from '@chakra-ui/react';
import React from 'react';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { SignUp, SignIn } from '@type/common';

interface Props {
  errors: Partial<FieldErrorsImpl<SignUp>>;
  signInRegister?: UseFormRegister<SignIn>;
  signUpRegister?: UseFormRegister<SignUp>;
}

export default function Password(props: Props) {
  return (
    <FormControl isInvalid={props.errors.email ? true : false} isRequired>
      {props.signInRegister && (
        <Input
          minW='100'
          borderRadius='full'
          borderColor='primary.1'
          type='text'
          {...props.signInRegister('email', {
            required: 'メールアドレスは必須です。',
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'メールアドレス形式で入力してください。',
            },
          })}
        />
      )}
      {props.signUpRegister && (
        <Input
          minW='100'
          borderRadius='full'
          borderColor='primary.1'
          type='text'
          {...props.signUpRegister('email', {
            required: 'メールアドレスは必須です。',
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'メールアドレス形式で入力してください。',
            },
          })}
        />
      )}
      <FormErrorMessage>{props.errors.email && props.errors.email.message}</FormErrorMessage>
    </FormControl>
  );
}
