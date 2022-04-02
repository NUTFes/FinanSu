import {
  ChakraProvider,
  Select,
  Center,
  Flex,
  Box,
  Spacer,
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
import Button from '@components/General/Button';
import {FC} from "react";
import {useRouter} from "next/router";

interface ModalProps {
  setShowModal: any;
  openModal: any;
}

const PurchaseItemNumModal : FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const [formData, setFormData] = useState({
    price: '',
    year_id: 1,
    source_id: 1,
  });

  const yearList = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

  const router = useRouter();

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  const addPurchaseOrder = async (data: any) => {
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    await post(addPurchaseOrderUrl, data);
  };

  return (
    <ChakraProvider theme={theme}>
      <Modal closeOnOverlayClick={false} isOpen={props.openModal} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent pb='5' borderRadius='3xl'>
          <ModalBody p='3'>
            <Flex mt='5'>
              <Spacer />
              <Box mr='5' _hover={{ background: '#E2E8F0', cursor: 'pointer' }}>
                <RiCloseCircleLine size={'23px'} color={'gray'} onClick={closeModal} />
              </Box>
            </Flex>
            <Grid
              templateRows='repeat(2, 1fr)'
              templateColumns='repeat(12, 1fr)'
              gap={4}
            >
              <GridItem rowSpan={1} colSpan={12}>
                <Center color='black.600' h="100%" fontSize="xl">
                  購入申請の作成
                </Center>
              </GridItem>
            </Grid>
            <Grid
              templateRows='repeat(2, 1fr)'
              templateColumns='repeat(12, 1fr)'
              gap={4}
            >
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={3}>
                <Flex color='black.600' h="100%" justify="end" align="center">
                  購入物品数
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={7}>
                <Select
                  value={formData.year_id}
                  onChange={handler('year_id')}
                  borderRadius='full'
                  borderColor='primary.1'
                >
                  {yearList.map((data) => (
                    <option value={data}>{data}</option>
                  ))}
                </Select>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
            </Grid>
          </ModalBody>
          <Center>
            <ModalFooter mb='2'>
              <Button
                width='220px'
                color='white'
                bgGradient='linear(to-br, primary.1, primary.2)'
                onClick={() => {
                  addPurchaseOrder(formData);
                  router.reload();
                }}
                hover={{ background: 'primary.2' }}
              >
                決定
              </Button>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default PurchaseItemNumModal;
