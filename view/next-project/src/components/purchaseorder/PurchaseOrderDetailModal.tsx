import {
  ChakraProvider,
  Center,
  Text,
  Flex,
  Box,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import React, {FC, useEffect, useState} from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import {useRouter} from 'next/router';
import {get} from '@api/purchaseOrder';

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

  return (
    <ChakraProvider theme={theme}>
      <Modal isOpen={props.openModal} onClose={closeModal} isCentered>
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
              templateColumns='repeat(12, 1fr)'
              gap={4}
              mb={10}
            >
              <GridItem colSpan={12}>
                <Center color='black.600' h="100%" fontSize="2xl">
                  詳細
                </Center>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={3}>
                <Flex color='black.600' h="100%" justify="end" align="center">
                  購入期限日
                </Flex>
              </GridItem>
              <GridItem colSpan={7} borderBottom="1px" borderBottomColor='primary.1'>
                <Flex color='black.600' h="100%" justify="start" align="center">
                <Text fontSize='lg' pl={2}>{formData.deadline}
                </Text>
                </Flex>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={1} />
              <GridItem colSpan={3}>
                <Flex color='black.600' h="100%" justify="end" align="center">
                  申請者
                </Flex>
              </GridItem>
              <GridItem colSpan={7} borderBottom="1px" borderBottomColor='primary.1'>
                <Flex color='black.600' h="100%" justify="start" align="center">
                  <Text fontSize='lg' pl={2}>{formData.user_id}
                  </Text>
                </Flex>
              </GridItem>
              <GridItem colSpan={1} />
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default PurchaseOrderEditModal;

