import {
  ChakraProvider,
  Center,
  Input,
  Flex,
  Box,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody, Grid, GridItem,
} from '@chakra-ui/react';
import React, {FC, useEffect, useState} from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import Button from '@components/General/Button';
import {useRouter} from 'next/router';
import {get, put} from '@api/purchaseOrder';

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
}

const PurchaseOrderEditModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();

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
    }
  }, [router]);

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
      <Modal closeOnOverlayClick={false} isOpen={props.openModal} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent pb='5' borderRadius='3xl'>
          <ModalBody p='3'>
            <Flex mt='5'>
              <Spacer />
              <Box mr='5' _hover={{ background: '#E2E8F0', cursor: 'pointer' }}>
                <RiCloseCircleLine size={'30px'} color={'gray'} onClick={closeModal} />
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
              <Button
                width='220px'
                onClick={() => {
                  submitPurchaseOrder(formData, props.id);
                  router.reload();
                }}
                hover={{ background: 'primary.2' }}
              >
                編集する
              </Button>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default PurchaseOrderEditModal;

