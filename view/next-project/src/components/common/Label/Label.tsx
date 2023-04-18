import { Box, ChakraProvider } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { LabelProps } from './Label.type';
import theme from '@/assets/theme';

const Label: React.FC<LabelProps> = (props) => {
  const {
    children,
    color = 'primary-1',
    padding = 'default',
    corner = 'round',
    isOutline = false,
    ...rest
  } = props;

  const bgColor = useMemo(() => {
    if (isOutline) {
      return 'transparent';
    }
    return color;
  }, [color, isOutline]);

  const borderColor = useMemo(() => {
    if (isOutline) {
      return color;
    }
    return 'transparent';
  }, [color, isOutline]);

  const textColor = useMemo(() => {
    if (isOutline) {
      return color;
    }
    return 'white';
  }, [color, isOutline]);

  const paddingValue = useMemo(() => {
    if (padding === 'default') {
      return '1';
    }
    if (padding === 'small') {
      return '0';
    }
    if (padding === 'large') {
      return '2';
    }
    return padding;
  }, [padding]);

  const borderRadius = useMemo(() => {
    if (corner === 'round') {
      return 'full';
    }
    if (corner === 'square') {
      return 'none';
    }
    return corner;
  }, [corner]);

  return (
    <ChakraProvider theme={theme}>
      <Box
        as='span'
        {...rest}
        fontSize='small'
        bgColor={bgColor}
        border='1px'
        borderColor={borderColor}
        color={textColor}
        py={paddingValue}
        px={Number(paddingValue) * 2}
        borderRadius={borderRadius}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        {children}
      </Box>
    </ChakraProvider>
  );
};

export default Label;
