import {
  ChakraProvider,
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
  ModalBody, Grid, GridItem,
} from '@chakra-ui/react';
import React, {FC, useEffect, useState} from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import RegistButton from '../General/RegistButton';
import {useRouter} from 'next/router';
import {get, put} from '@api/purchaseOrder';

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
}

interface PurchaseOrder {
  id: number | string;
  deadline: string;
  user_id: number | string;
  created_at: string;
  updated_at: string;
}

const PurchaseOrderEditModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();
  const query = router.query;

  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder>({
    id: '',
    deadline: '',
    user_id: '',
    created_at: '',
    updated_at: '',
  });

  const [formData, setFormData] = useState({
    deadline: '',
    user_id: '',
  });

  useEffect(() => {
    if (router.isReady) {
      const getFormDataUrl = process.env.CSR_API_URI + '/purchaseorders/' + props.id;
      const getFormData = async (url: string) => {
        setFormData(await get(url));
      };
      getFormData(getFormDataUrl);

      const getPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders/' + props.id;
      const getPurchaseOrder = async (url: string) => {
        setPurchaseOrder(await get(url));
      };
      getPurchaseOrder(getPurchaseOrderUrl);
    }
  }, [query, router]);

  const handler =
    (input: string) => (
      e:
        React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setFormData({...formData, [input]: e.target.value});
    };

  const submitPurchaseOrder = async (data: any, id: number | string) => {
    const submitPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders/' + id;
    await put(submitPurchaseOrderUrl, data);
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
            <Grid
              templateRows='repeat(2, 1fr)'
              templateColumns='repeat(12, 1fr)'
              gap={4}
            >
              <GridItem rowSpan={1} colSpan={12}>
                <Center color='black.600' h="100%" fontSize="xl">
                  購入報告の編集
                </Center>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={3}>
                <Flex color='black.600' h="100%" justify="end" align="center">
                  購入期限日
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={7}>
                <Input w='100' borderRadius='full' borderColor='primary.1' value={formData.deadline} onChange={handler('deadline')} />
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={3}>
                <Flex color='black.600' h="100%" justify="end" align="center">
                  申請者
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={7}>
                <Flex>
                  <Input w='100' borderRadius='full' borderColor='primary.1' value={formData.user_id} onChange={handler('user_id')} />
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
            </Grid>
          </ModalBody>
          <Center>
            <ModalFooter mt='5' mb='10'>
              <RegistButton
                width='220px'
                color='white'
                bgGradient='linear(to-br, primary.1, primary.2)'
                onClick={() => {
                  submitPurchaseOrder(formData, props.id);
                  router.reload();
                }}
              >
                編集する
              </RegistButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default PurchaseOrderEditModal;

