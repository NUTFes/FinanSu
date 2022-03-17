import {
  ChakraProvider,
  Center,
  Text,
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
import {get, del} from '@api/purchaseReport';

interface ModalProps {
  setShowModal: any;
  openModal: any;
  children?: React.ReactNode;
  id: number | string;
}

interface PurchaseReport{
  id: number | string;
  user_id: number | string;
  purchase_order_id: number | string;
  created_at: string;
  updated_at: string;
}

const PurchaseReportDeleteModal: FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const router = useRouter();
  const query = router.query;

  const [purchaseReport, setPurchaseReport] = useState<PurchaseReport>({
    id: '',
    user_id: '',
    purchase_order_id: '',
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

      const getPurchaseReportUrl = process.env.CSR_API_URI + '/purchasereports/' + props.id;
      const getPurchaseReport = async (url: string) => {
        setPurchaseReport(await get(url));
      };
      getPurchaseReport(getPurchaseReportUrl);
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

  const deletePurchaseReport = async (id: number | string) => {
    const deletePurchaseReportUrl = process.env.CSR_API_URI + '/purchasereports/' + id;
    await del(deletePurchaseReportUrl);
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
                購入報告の削除
              </Text>
              <VStack spacing='15px'>
                <Flex>
                  <Center color='black.600' mr='3'>
                    削除してもよいですか？
                  </Center>
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
                  deletePurchaseReport(props.id);
                  router.reload();
                }}
              >
                削除する
              </RegistButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default PurchaseReportDeleteModal;

