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
import { useRouter } from 'next/router';
import { FC, useState, Dispatch, SetStateAction } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { post } from '@api/budget';
import theme from '@assets/theme';
import RegistButton from '@components/common/RegistButton';

import { Budget, Source, Year } from '@type/common';

interface ModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  openModal: boolean;
}

const RegistModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [formData, setFormData] = useState<Budget>({
    price: 0,
    yearID: 1,
    sourceID: 1,
  });

  const sourceList: Source[] = [
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

  const yearList: Year[] = [
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

  const router = useRouter();

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const registBudget = async (data: Budget) => {
    const registBudgetUrl = process.env.CSR_API_URI + '/budgets';
    await post(registBudgetUrl, data);
  };

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
                    value={formData.yearID}
                    onChange={handler('yearID')}
                    borderRadius='full'
                    borderColor='primary.1'
                    w='224px'
                  >
                    {yearList.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.year}
                      </option>
                    ))}
                  </Select>
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    項目
                  </Center>
                  <Select
                    value={formData.sourceID}
                    onChange={handler('sourceID')}
                    borderRadius='full'
                    borderColor='primary.1'
                    w='224px'
                  >
                    {sourceList.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
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
                    value={formData.price}
                    onChange={handler('price')}
                  />
                </Flex>
              </VStack>
            </VStack>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <RegistButton
                width='220px'
                onClick={() => {
                  registBudget(formData);
                  router.reload();
                }}
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
