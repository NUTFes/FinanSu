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
  ModalBody,
} from '@chakra-ui/react';
import React, {FC, useEffect, useState} from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import RegistButton from '../General/RegistButton';
import {useRouter} from 'next/router';
import {get, put} from '@api/purchaseReport';

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
}

interface PurchaseReport {
  id: number | string;
  deadline: string;
  user_id: number | string;
  created_at: string;
  updated_at: string;
}

const PurchaseReportEditModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();
  const query = router.query;

  const [purchaseReport, setPurchaseOrder] = useState<PurchaseReport>({
    id: '',
    deadline: '',
    user_id: '',
    created_at: '',
    updated_at: '',
  });

  const [formData, setFormData] = useState({
    user_id: '',
    purchase_order_id: '',
  });

  useEffect(() => {
    if (router.isReady) {
      const getFormDataUrl = process.env.CSR_API_URI + '/purchasereports/' + props.id;
      const getFormData = async (url: string) => {
        setFormData(await get(url));
      };
      getFormData(getFormDataUrl);

      const getPurchaseOrderUrl = process.env.CSR_API_URI + '/purchasereports/' + props.id;
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

  const submitPurchaseReport= async (data: any, id: number | string) => {
    const submitPurchaseReportUrl = process.env.CSR_API_URI + '/purchasereports/' + id;
    await put(submitPurchaseReportUrl, data);
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
                購入報告の編集
              </Text>
              <VStack spacing='15px'>
                <Flex>
                  <Center color='black.600' mr='3'>
                    購入期限日
                  </Center>
                  <Input w='100' borderRadius='full' borderColor='primary.1' value={formData.user_id} onChange={handler('user_id')} />
                </Flex>
                <Flex>
                  <Center color='black.600' mr='3'>
                    申請者
                  </Center>
                  <Input w='100' borderRadius='full' borderColor='primary.1' value={formData.purchase_order_id} onChange={handler('purchase_order_id')} />
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
                onClick={() => {
                  submitPurchaseReport(formData, props.id);
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

export default PurchaseReportEditModal;

