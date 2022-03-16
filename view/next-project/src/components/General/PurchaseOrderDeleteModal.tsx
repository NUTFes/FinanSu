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
import RegistButton from './RegistButton';
import {useRouter} from 'next/router';
import {get, del} from '@api/purchaseOrder';

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

const PurchaseOrderDeleteModal: FC<ModalProps> = (props) => {
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

  const deletePurchaseOrder = async (id: number | string) => {
    const deletePurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders/' + id;
    await del(deletePurchaseOrderUrl);
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
                購入申請の削除
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
                  deletePurchaseOrder(props.id);
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

export default PurchaseOrderDeleteModal;

