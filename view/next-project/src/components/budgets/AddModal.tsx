import {
  ChakraProvider,
  Select,
  Center,
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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { post } from '@api/budget';
import * as React from 'react';
import { useState } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { PrimaryButton } from '@components/common';

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  sources: Source[];
  years: Year[];
}

interface Source {
  id: number;
  name: string;
}

interface Year {
  id: number;
  year: number;
}

const BudgetAddModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [formData, setFormData] = useState({
    price: '',
    year_id: 1,
    source_id: 1,
  });

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

  const registBudget = async (data: any) => {
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
            <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem rowSpan={1} colSpan={12}>
                <Center color='black.600' h='100%' fontSize='xl'>
                  予算の登録
                </Center>
              </GridItem>
            </Grid>
            <Grid templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={10}>
                <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(12, 1fr)' gap={4}>
                  <GridItem rowSpan={1} colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      年度
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={9}>
                    <Select
                      value={formData.year_id}
                      onChange={handler('year_id')}
                      borderRadius='full'
                      borderColor='primary.1'
                    >
                      {props.years.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.year}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      項目
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={9}>
                    <Select
                      borderRadius='full'
                      borderColor='primary.1'
                      value={formData.source_id}
                      onChange={handler('source_id')}
                    >
                      {props.sources.map((source) => (
                        <option key={source.id} value={source.id}>
                          {source.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      金額
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={9}>
                    <Flex>
                      <Input
                        borderRadius='full'
                        borderColor='primary.1'
                        value={formData.price}
                        onChange={handler('price')}
                      />
                    </Flex>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
            </Grid>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <PrimaryButton
                onClick={() => {
                  registBudget(formData);
                  router.reload();
                }}
              >
                登録する
              </PrimaryButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default BudgetAddModal;
