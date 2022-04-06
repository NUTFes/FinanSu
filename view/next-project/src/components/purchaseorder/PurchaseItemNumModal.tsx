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
  Input,
} from '@chakra-ui/react';
import { get, post } from '@api/purchaseOrder';
import * as React from 'react';
import { useState } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import Button from '@components/General/Button';
import {FC} from "react";
import PurchaseOrderAddModal from "@components/purchaseorder/PurchaseOrderAddModal";

interface ModalProps {
  setShowModal: any;
  openModal: any;
}

interface FormData {
  deadline: string;
  user_id: number;
}

interface PurchaseItem {
  id: number | string,
  item: string,
  price: number | string,
  quantity: number | string,
  detail: string,
  url: string,
  purchaseOrderId: number,
  finance_check: boolean,
}

const PurchaseItemNumModal : FC<ModalProps> = (props) => {
  // 購入物品数用の配列
  const purchaseItemNumArray = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    deadline: '',
    user_id: 1,
  });
  const [purchaseItemNum, setPurchaseItemNum] = useState({
    value: 1,
  });
  const [purchaseOrderId, setPurchaseOrderId] = useState(1);

  const [formDataList, setFormDataList] = useState<PurchaseItem[]>([{
    id: '',
    item: '',
    price: '',
    quantity: '',
    detail: '',
    url: '',
    purchaseOrderId: purchaseOrderId,
    finance_check: false,
  }]);

  const ShowModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    props.setShowModal(false);
  };

  // 購入申請用のhandler
  const formDataHandler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 購入物品数用のhandler
  const purchaseItemNumHandler =
    (input: string) =>
      (
        e:
          | React.ChangeEvent<HTMLSelectElement>
      ) => {
        setPurchaseItemNum({ ...purchaseItemNum, [input]: e.target.value });
      };

  const addPurchaseOrder = async (data: FormData) => {
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    await post(addPurchaseOrderUrl, data);
    const getPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    const getRes = await get(getPurchaseOrderUrl);
    setPurchaseOrderId(getRes[getRes.length-1].id);
  };

  const initialPurchaseItemList = () => {
    for (let i = 0; i < purchaseItemNum.value; i++){
      let initialPurchaseItem = {
        id: i+1,
        item: '',
        price: '',
        quantity: '',
        detail: '',
        url: '',
        purchaseOrderId: purchaseOrderId,
        finance_check: false,
      };
      setFormDataList([...formDataList, initialPurchaseItem]);
      console.log(formDataList)
    }
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
                  購入期限
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={7}>
                <Input placeholder='yyyymmddで入力' borderRadius='full' borderColor='primary.1' value={formData.deadline} onChange={formDataHandler('deadline')} />
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={3}>
                <Flex color='black.600' h="100%" justify="end" align="center">
                  購入物品数
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={7}>
                <Select
                  value={purchaseItemNum.value}
                  onChange={purchaseItemNumHandler('value')}
                  borderRadius='full'
                  borderColor='primary.1'
                >
                  {purchaseItemNumArray.map((data) => (
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
                  ShowModal();
                  addPurchaseOrder(formData)
                  initialPurchaseItemList();
                }}
                hover={{ background: 'primary.2' }}
              >
                決定
              </Button>
              <PurchaseOrderAddModal purchaseOrderId={purchaseOrderId} purchaseItemNum={purchaseItemNum} openModal={showModal} setShowModal={setShowModal} setFormDataList={setFormDataList} formDataList={formDataList} />
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default PurchaseItemNumModal;
