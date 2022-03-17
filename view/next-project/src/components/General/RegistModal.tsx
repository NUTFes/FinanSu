import {
  ChakraProvider,
  Select,
  Center,
  Text,
  Input,
  Flex,
  Box,
  Spacer,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { get, post, put, del } from '@api/budget';
import * as React from 'react';
import { useState } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import RegistButton from './RegistButton';

const RegistModal = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [price, setText] = useState('');

  const priceChange = (e) => setText(e.target.value);

  const [yearID, setYear] = React.useState(1);

  const yearChange = (e) => setYear(e.target.value);

  const [sourceID, setSource] = React.useState(1);

  const sourceChange = (e) => setSource(e.target.value);

  const sourceList = [
    {
      id: 1,
      name: '教育振興会費',
    },
    {
      id: 2,
      name: '同窓会費',
    },
    {
      id: 3,
      name: '企業協賛金',
    },
    {
      id: 4,
      name: '学内募金',
    },
  ];

  const yearList = [
    {
      id: 1,
      year: 2020,
    },
    {
      id: 2,
      year: 2021,
    },
    {
      id: 3,
      year: 2022,
    },
    {
      id: 4,
      year: 2023,
    },
  ];

  async function postBudget() {
    const postUrl = 'http://localhost:1323/budgets';
    const postData = { price: price, year_id: yearID, source_id: sourceID };
    const getRes = await get(postUrl);
    console.log(getRes.slice(-1)[0].id);
    const postReq = await post(postUrl, postData);
  }

  return (
    <ChakraProvider theme={theme}>
      <Modal isOpen={props.openModal} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent pb='5' borderRadius='3xl'>
          <ModalBody p='3'>
            <Flex mt='5'>
              <Spacer />
              <Box mr='5' _hover={{ background: '#E2E8F0', cursor: 'pointer' }}>
                <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
              </Box>
            </Flex>
            <VStack spacing='30px'>
              <Text fontSize='xl' color='black.600'>
                予算の登録
              </Text>
              <VStack spacing='15px'>
                <Flex>
                  <Center color='black.600' mr='3'>
                    年度
                  </Center>
                  <Select
                    value={yearID}
                    onChange={yearChange}
                    borderRadius='full'
                    borderColor='primary.1'
                    w='224px'
                  >
                    {yearList.map((data) => (
                      <option value={data.id}>{data.year}</option>
                    ))}
                  </Select>
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    項目
                  </Center>
                  <Select
                    value={sourceID}
                    onChange={sourceChange}
                    borderRadius='full'
                    borderColor='primary.1'
                    w='224px'
                  >
                    {sourceList.map((source) => (
                      <option value={source.id}>{source.name}</option>
                    ))}
                  </Select>
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    金額
                  </Center>
                  <Input
                    w='100'
                    borderRadius='full'
                    borderColor='primary.1'
                    value={price}
                    onChange={priceChange}
                  />
                </Flex>
              </VStack>
            </VStack>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <RegistButton
                width='220px'
                color='white'
                bgGradient='linear(to-br, primary.1, primary.2)'
                onClick={postBudget}
              >
                登録する
              </RegistButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default RegistModal;
