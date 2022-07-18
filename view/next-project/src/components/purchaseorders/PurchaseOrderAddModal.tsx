import {
  ChakraProvider,
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
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { post } from '@api/purchaseItem';
import React from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import DeleteButton from '@components/common/DeleteButton';
import { useRouter } from 'next/router';
import { PrimaryButton, RedButton } from '@components/common';

interface ModalProps {
  purchaseOrderId: number;
  purchaseItemNum: PurchaseItemNum;
  isOpen: boolean;
  numModalOnClose: () => void;
  onClose: () => void;
  setFormDataList: Function;
  formDataList: PurchaseItem[];
}

interface PurchaseItemNum {
  value: number;
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

export default function AddModal(props: ModalProps) {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const router = useRouter();

  const handler =
    (stepNumber: number, input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      props.setFormDataList(
        props.formDataList.map((formData: PurchaseItem) =>
          formData.id === stepNumber + 1 ? { ...formData, [input]: e.target.value } : formData,
        ),
      );
    };

  const addPurchaseItem = async (data: PurchaseItem[], purchaseOrderID: number) => {
    const addPurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
    data.map(async (item) => {
      await post(addPurchaseItemUrl, item, purchaseOrderID);
    });
  };

  // 購入物品の情報
  const content: Function = (index: number, data: PurchaseItem) => (
    <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(12, 1fr)' gap={4}>
      <GridItem colSpan={12} />
      <GridItem colSpan={2}>
        <Flex color='black.600' h='100%' justify='end' align='center'>
          物品名
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input
          borderRadius='full'
          borderColor='primary.1'
          value={data.item}
          onChange={handler(index, 'item')}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h='100%' justify='end' align='center'>
          単価
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input
          borderRadius='full'
          borderColor='primary.1'
          value={data.price}
          onChange={handler(index, 'price')}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h='100%' justify='end' align='center'>
          個数
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input
          borderRadius='full'
          borderColor='primary.1'
          value={data.quantity}
          onChange={handler(index, 'quantity')}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h='100%' justify='end' align='center'>
          詳細
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input
          borderRadius='full'
          borderColor='primary.1'
          value={data.detail}
          onChange={handler(index, 'detail')}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h='100%' justify='end' align='center'>
          URL
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input
          borderRadius='full'
          borderColor='primary.1'
          value={data.url}
          onChange={handler(index, 'url')}
        />
      </GridItem>
      <GridItem mt={5} colSpan={12} />
    </Grid>
  );

  // 購入物品数だけステップを用意
  let steps = [];
  for (let i = 0; i < props.purchaseItemNum.value; i++) {
    let initialFormData = {
      id: i + 1,
      item: '',
      price: '',
      quantity: '',
      detail: '',
      url: '',
      purchaseOrderId: props.purchaseOrderId,
      finance_check: false,
    };
    steps.push({ label: '' });
  }

  return (
    <ChakraProvider theme={theme}>
      <Modal
        closeOnOverlayClick={false}
        isOpen={props.isOpen}
        onClose={props.onClose}
        isCentered
        size='6xl'
      >
        <ModalOverlay />
        <ModalContent pb='5' borderRadius='3xl'>
          <ModalBody p='3'>
            <Flex mt='5'>
              <Spacer />
              <Box mr='5' _hover={{ background: '#E2E8F0', cursor: 'pointer' }}>
                <RiCloseCircleLine
                  size={'23px'}
                  color={'gray'}
                  onClick={() => {
                    props.onClose();
                    props.numModalOnClose();
                  }}
                />
              </Box>
            </Flex>
            <Grid templateColumns='repeat(12, 1fr)' gap={4}>
              <GridItem rowSpan={1} colSpan={12}>
                <Center color='black.600' h='100%' fontSize='xl'>
                  購入物品の登録
                </Center>
              </GridItem>
              <GridItem colSpan={12} />
              <GridItem colSpan={1} />
              <GridItem rowSpan={1} colSpan={10}>
                <Steps activeStep={activeStep}>
                  {steps.map(({ label }, index: number) => (
                    <Step label={label} key={index}>
                      {content(index, props.formDataList[index])}
                    </Step>
                  ))}
                </Steps>
                {activeStep === steps.length ? (
                  <Flex p={4}>
                    <Spacer />
                    <RedButton onClick={reset}>
                      Reset
                    </RedButton>
                    <PrimaryButton
                      onClick={() => {
                        addPurchaseItem(props.formDataList, props.purchaseOrderId);
                        props.onClose();
                        props.numModalOnClose();
                        router.reload();
                      }}
                    >
                      登録
                    </PrimaryButton>
                  </Flex>
                ) : (
                  <Flex justify='flex-end'>
                    <RedButton onClick={prevStep}>
                      Prev
                    </RedButton>
                    <PrimaryButton
                      onClick={() => {
                        nextStep();
                      }}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </PrimaryButton>
                  </Flex>
                )}
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
