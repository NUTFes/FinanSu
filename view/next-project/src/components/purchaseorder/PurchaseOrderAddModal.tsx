import {
  ChakraProvider,
  Select,
  Center,
  Flex,
  Box,
  Button,
  Text,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Grid,
  GridItem, Input,
} from '@chakra-ui/react';
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { post } from '@api/budget';
import * as React from 'react';
import { useState } from 'react';
import theme from '@assets/theme';
import { RiCloseCircleLine } from 'react-icons/ri';
import AddButton from '@components/General/Button';
import {FC} from "react";
import {useRouter} from "next/router";

interface ModalProps {
  purchaseOrderId: number;
  purchaseItemNum: PurchaseItemNum;
  setShowModal: Function;
  openModal: Function;
  setFormDataList: Function;
  formDataList: PurchaseItem[];
}

interface PurchaseItemNum {
  value: number;
}

interface PurchaseItem {
  id: number,
  item: string,
  price: number,
  quantity: number,
  detail: string,
  url: string,
  purchaseOrderId: number,
  finance_check: boolean,
}

const PurchaseOrderAddModal : FC<ModalProps> = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })
  const router = useRouter();

  const handler =
    (input: string) =>
    (
      e:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      props.setFormDataList({ ...props.formDataList, [input]: e.target.value });
    };

  const addPurchaseItem = async (data: any) => {
    const addPurchaseItemUrl = process.env.CSR_API_URI + '/purchaseitems';
    await post(addPurchaseItemUrl, data);
    // const newFormDataList = data;
    // setFormDataList([...formDataList, newFormDataList])
  };

  console.log(props.formDataList)

  // 購入物品の情報
  const content = (
    <Grid
      templateRows='repeat(2, 1fr)'
      templateColumns='repeat(12, 1fr)'
      gap={4}
    >
      <GridItem colSpan={12} />
      <GridItem colSpan={2}>
        <Flex color='black.600' h="100%" justify="end" align="center">
          物品名
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input borderRadius='full' borderColor='primary.1' value={props.formDataList.item} onChange={handler('item')} />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h="100%" justify="end" align="center">
          単価
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input borderRadius='full' borderColor='primary.1' value={props.formDataList.price} onChange={handler('price')} />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h="100%" justify="end" align="center">
          個数
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input borderRadius='full' borderColor='primary.1' value={props.formDataList.quantity} onChange={handler('quantity')} />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h="100%" justify="end" align="center">
          詳細
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input borderRadius='full' borderColor='primary.1' value={props.formDataList.detail} onChange={handler('detail')} />
      </GridItem>

      <GridItem colSpan={2}>
        <Flex color='black.600' h="100%" justify="end" align="center">
          URL
        </Flex>
      </GridItem>
      <GridItem colSpan={10}>
        <Input borderRadius='full' borderColor='primary.1' value={props.formDataList.url} onChange={handler('url')} />
      </GridItem>
      <GridItem mt={5} colSpan={12} />
    </Grid>
  );

  // 購入物品数だけステップを用意
  let steps = [];
  for (let i = 0; i < props.purchaseItemNum.value; i++){
    let initialFormData = {
      id: i+1,
      item: '',
      price: '',
      quantity: '',
      detail: '',
      url: '',
      purchaseOrderId: props.purchaseOrderId,
      finance_check: false,
    };
    console.log(initialFormData)
    // setFormDataList(initialFormData);
    steps.push({ content })
  }

  return (
    <ChakraProvider theme={theme}>
      <Modal closeOnOverlayClick={false} isOpen={props.openModal} onClose={closeModal} isCentered size="6xl">
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
              templateColumns='repeat(12, 1fr)'
              gap={4}
            >
              <GridItem rowSpan={1} colSpan={12}>
                <Center color='black.600' h="100%" fontSize="xl">
                  購入物品の登録
                </Center>
              </GridItem>
              <GridItem colSpan={12} />
              <GridItem colSpan={1} />
              <GridItem rowSpan={1} colSpan={10}>
                <Steps activeStep={activeStep}>
                  {steps.map(({ label, content }) => (
                    <Step label={label} key={label}>
                      {content}
                    </Step>
                  ))}
                </Steps>
                {activeStep === steps.length ? (
                  <Flex p={4}>
                    <Button mx="auto" size="sm" onClick={reset}>
                      Reset
                    </Button>
                  </Flex>
                ) : (
                  <Flex justify="flex-end">
                    <Button
                      isDisabled={activeStep === 0}
                      mr={4}
                      onClick={prevStep}
                      size="sm"
                      variant="ghost"
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        nextStep();
                      }}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Flex>
                )}
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} />
            </Grid>
          </ModalBody>
          <Center>
            <ModalFooter mb='2'>
              <AddButton
                width='220px'
                color='white'
                bgGradient='linear(to-br, primary.1, primary.2)'
                onClick={() => {
                  addPurchaseItem(props.formDataList);
                  router.reload();
                }}
                hover={{ background: 'primary.2' }}
              >
                決定
              </AddButton>
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default PurchaseOrderAddModal;
