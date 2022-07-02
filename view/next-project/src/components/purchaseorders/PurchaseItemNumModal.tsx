import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  useDisclosure,
} from '@chakra-ui/react';
import { get, get_with_token } from '@api/api_methods';
import { post } from '@api/purchaseOrder';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import Button from '@components/common/Button';
import AddModal from '@components/purchaseorders/PurchaseOrderAddModal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

interface FormData {
  deadline: string;
  user_id: number;
}

interface PurchaseItem {
  id: number | string;
  item: string;
  price: number | string;
  quantity: number | string;
  detail: string;
  url: string;
  purchaseOrderId: number;
  finance_check: boolean;
}

export default function PurchaseItemNumModal(props: ModalProps) {
  // 購入物品数用の配列
  const purchaseItemNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    deadline: '',
    user_id: 1,
  });
  const [purchaseItemNum, setPurchaseItemNum] = useState({
    value: 1,
  });
  const [purchaseOrderId, setPurchaseOrderId] = useState(1);

  const [formDataList, setFormDataList] = useState<PurchaseItem[]>(() => {
    let initFormDataList = [];
    for (let i = 0; i < purchaseItemNumArray.length; i++) {
      let initFormData: PurchaseItem = {
        id: i + 1,
        item: '',
        price: '',
        quantity: '',
        detail: '',
        url: '',
        purchaseOrderId: purchaseOrderId,
        finance_check: false,
      };
      initFormDataList.push(initFormData);
    }
    return initFormDataList;
  });

  // ログイン中のユーザ
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: '',
    bureau_id: 1,
    role_id: 1,
  });

  // ページ読み込み時にcurrent_userを取得
  useEffect(() => {
    if (router.isReady) {
      // current_userの取得とセット
      const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
      const getCurrentUser = async (url: string) => {
        const currentUserRes = await get_with_token(url);
        setCurrentUser(currentUserRes);
      };
      getCurrentUser(getCurrentUserURL);
    }
  }, [router]);

  // 購入申請用のhandler
  const formDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };

  // 購入物品数用のhandler
  const purchaseItemNumHandler = (input: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPurchaseItemNum({ ...purchaseItemNum, [input]: e.target.value });
  };

  const addPurchaseOrder = async (data: FormData, user_id: number) => {
    const addPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    await post(addPurchaseOrderUrl, data, user_id);
    const getPurchaseOrderUrl = process.env.CSR_API_URI + '/purchaseorders';
    const getRes = await get(getPurchaseOrderUrl);
    setPurchaseOrderId(getRes[getRes.length - 1].id);
  };

  const updateFormDataList = () => {
    let initialPurchaseItemList = [];
    for (let i = 0; i < Number(purchaseItemNum.value); i++) {
      let initialPurchaseItem: PurchaseItem = {
        id: i + 1,
        item: '',
        price: '',
        quantity: '',
        detail: '',
        url: '',
        purchaseOrderId: purchaseOrderId,
        finance_check: false,
      };
      initialPurchaseItemList.push(initialPurchaseItem);
    }
    setFormDataList(initialPurchaseItemList);
  };

  return (
    <ChakraProvider theme={theme}>
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose} isCentered>
        <ModalOverlay />
        <ModalContent pb='5' borderRadius='3xl'>
          <ModalBody p='3'>
            <Flex mt='5'>
              <Spacer />
              <Box mr='5' _hover={{ background: '#E2E8F0', cursor: 'pointer' }}>
                <RiCloseCircleLine size={'23px'} color={'gray'} onClick={props.onClose} />
              </Box>
            </Flex>
            <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem rowSpan={1} colSpan={12}>
                <Center color='black.600' h='100%' fontSize='xl'>
                  購入申請の作成
                </Center>
              </GridItem>
            </Grid>
            <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={3}>
                <Flex color='black.600' h='100%' justify='end' align='center'>
                  購入期限
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={7}>
                <Input
                  placeholder='yyyymmddで入力'
                  borderRadius='full'
                  borderColor='primary.1'
                  value={formData.deadline}
                  onChange={formDataHandler('deadline')}
                />
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={1} />
              <GridItem rowSpan={1} colSpan={3}>
                <Flex color='black.600' h='100%' justify='end' align='center'>
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
                onClick={() => {
                  updateFormDataList();
                  onOpen();
                  addPurchaseOrder(formData, currentUser.id);
                }}
                hover={{ background: 'primary.2' }}
              >
                決定
              </Button>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
      <AddModal
        purchaseOrderId={purchaseOrderId}
        purchaseItemNum={purchaseItemNum}
        isOpen={isOpen}
        numModalOnClose={props.onClose}
        onClose={onClose}
        setFormDataList={setFormDataList}
        formDataList={formDataList}
      />
    </ChakraProvider>
  );
}
