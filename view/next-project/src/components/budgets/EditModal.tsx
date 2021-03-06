import {
  ChakraProvider,
  Center,
  Select,
  Input,
  Flex,
  Box,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  GridItem,
  Grid,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import RegistButton from '@components/common/RegistButton';
import { useRouter } from 'next/router';
import { get, put } from '@api/budget';

interface BudgetProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
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

const BudgetEditModal: FC<BudgetProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

  const [formData, setFormData] = useState({
    year_id: '',
    source_id: '',
    price: '',
  });

  useEffect(() => {
    if (router.isReady) {
      const getFormDataUrl = process.env.CSR_API_URI + '/budgets/' + props.id;
      const getFormData = async (url: string) => {
        setFormData(await get(url));
      };
      getFormData(getFormDataUrl);
    }
  }, [router, props.id]);

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

  const submitBudget = async (data: any, id: number | string) => {
    const submitBudgetUrl = process.env.CSR_API_URI + '/budgets/' + id;
    await put(submitBudgetUrl, data);
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
                  ???????????????
                </Center>
              </GridItem>
            </Grid>
            <Grid templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={10}>
                <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(12, 1fr)' gap={4}>
                  <GridItem rowSpan={1} colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      ??????
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
                        <option key={data.id} value={data.id}>{data.year}</option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      ??????
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
                        <option key={source.id} value={source.id}>{source.name}</option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={3}>
                    <Flex color='black.600' h='100%' justify='end' align='center'>
                      ??????
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
              <RegistButton
                width='220px'
                onClick={() => {
                  submitBudget(formData, props.id);
                  router.reload();
                }}
              >
                ????????????
              </RegistButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default BudgetEditModal;
