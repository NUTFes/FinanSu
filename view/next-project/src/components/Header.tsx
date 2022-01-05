import React from "react";
import {
  Box,
  Flex,
  Text,
  ChakraProvider
} from "@chakra-ui/react";
import PulldownButton from '../components/General/PulldownButton';
import { Avatar } from '@chakra-ui/react'
import theme from "@assets/theme";

const Header = () => {
  return (
    <ChakraProvider theme={theme}> 
      <Flex
        as="nav"
        align="center"
        wrap="wrap"
        padding="0"
        color="white"
        flexDirection="row"
        width="100%"
      >
        <Flex 
          justify="center"
          bg="base.1"
          align="center"
          width="200px"
          height="60px" 
          p="4"
        >
          <Text 
            color="white" 
            fontSize="24px" 
            textShadow="4px 2px 0px rgba(0, 0, 0, 0.66)"
            letterSpacing={"tighter"}
          >
            FinanSu
          </Text>
        </Flex>
          <Flex
            align="center"
            justify="end"
            bgGradient="linear(to-br, primary.1, primary.2)"
            height="60px"
            flexGrow="1"
          >
            <Box>
              <Avatar size="xs" />
            </Box>
            <Box>
              <Text mx="3">
              小林諒大
              </Text>
            </Box>
            <Box 
              marginRight="5"
            >
              <PulldownButton />
            </Box>
          </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Header;
