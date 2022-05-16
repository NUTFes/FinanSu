import React from 'react';
import { Input, FormControl, FormErrorMessage } from '@chakra-ui/react';

interface Props {
  errors: any;
  register: any;
  password: string;
}

export default function Password(props: Props) {
  return (
    <FormControl isInvalid={props.errors.passwordConfirmation ? true : false} isRequired>
      <Input
        minW='100'
        borderRadius='full'
        borderColor='primary.1'
        type='password'
        {...props.register('passwordConfirmation', {
          validate: {
            positive: (input: string) => input === props.password,
          },
        })}
      />
      <FormErrorMessage>
        {props.errors.passwordConfirmation &&
          props.errors.passwordConfirmation.type === 'positive' && <p>パスワードが一致しません</p>}
      </FormErrorMessage>
    </FormControl>
  );
}
