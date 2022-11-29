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
    <FormControl isInvalid={props.errors.password ? true : false} isRequired>
      {props.signInRegister && (
        <Input
          minW='100'
          borderRadius='full'
          borderColor='primary.1'
          type='password'
          {...props.signInRegister('password', {
            required: 'パスワードは必須です。',
            minLength: {
              value: 6,
              message: 'パスワードは6文字以上で入力してください',
            },
          })}
        />
      )}
      {props.signUpRegister && (
        <Input
          minW='100'
          borderRadius='full'
          borderColor='primary.1'
          type='password'
          {...props.signUpRegister('password', {
            required: 'パスワードは必須です。',
            minLength: {
              value: 6,
              message: 'パスワードは6文字以上で入力してください',
            },
          })}
        />
      )}
      <FormErrorMessage>{props.errors.password && props.errors.password.message}</FormErrorMessage>
    </FormControl>
  );
}
