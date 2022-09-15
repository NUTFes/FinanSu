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
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState, useCallback } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

import { get } from '@api/api_methods';
import theme from '@assets/theme';

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

  // モーダルを開いているfund_informationを取得
  const getFundInformation = useCallback(async () => {
    const getFundInformationURL = process.env.CSR_API_URI + '/fund_informations/' + props.id;
    setFormData(await get(getFundInformationURL));
  }, [props.id]);

  useEffect(() => {
    if (router.isReady) {
      getFundInformation();
    }
  }, [router, getFundInformation]);

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
            <Grid templateColumns='repeat(12, 1fr)' gap={4} mb={10}>
              <GridItem colSpan={12}>
                <Center color='black.600' h='100%' fontSize='2xl'>
                  詳細
                </Center>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={3}>
                <Flex color='black.600' h='100%' justify='end' align='center'>
                  購入期限日
                </Flex>
              </GridItem>
              <GridItem colSpan={7} borderBottom='1px' borderBottomColor='primary.1'>
                <Flex color='black.600' h='100%' justify='start' align='center'>
                  <Text fontSize='lg' pl={2}>
                    {formData.deadline}
                  </Text>
                </Flex>
              </GridItem>
              <GridItem colSpan={1} />
              <GridItem colSpan={1} />
              <GridItem colSpan={3}>
                <Flex color='black.600' h='100%' justify='end' align='center'>
                  申請者
                </Flex>
              </GridItem>
              <GridItem colSpan={7} borderBottom='1px' borderBottomColor='primary.1'>
                <Flex color='black.600' h='100%' justify='start' align='center'>
                  <Text fontSize='lg' pl={2}>
                    {formData.user_id}
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
