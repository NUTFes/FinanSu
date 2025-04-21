import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Spinner,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IncomeReceiveOption } from '@/generated/model/incomeReceiveOption';
import { PrimaryButton } from '@components/common';

export interface FundInformationFormData {
  amount: number;
  sponsorName?: string;
  incomeType: string;
  receiveOption?: keyof typeof IncomeReceiveOption;
}

interface FundInformationFormProps {
  initialData?: FundInformationFormData;
  onSubmit: (data: FundInformationFormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
  isLoading?: boolean;
  incomeTypes: string[];
  isIncomeTypesLoading?: boolean;
}

interface FormFieldProps {
  id: string;
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const FormField = ({
  id,
  label,
  isRequired = false,
  isDisabled = false,
  children,
}: FormFieldProps) => (
  <FormControl id={id} isRequired={isRequired} isDisabled={isDisabled}>
    <FormLabel>{label}</FormLabel>
    {children}
  </FormControl>
);

const DEFAULT_FORM_DATA: FundInformationFormData = {
  incomeType: '',
  sponsorName: '',
  amount: 0,
  receiveOption: 'transfer',
};

const FundInformationForm: React.FC<FundInformationFormProps> = ({
  initialData = DEFAULT_FORM_DATA,
  onSubmit,
  onCancel,
  submitButtonText,
  isLoading = false,
  incomeTypes = [],
  isIncomeTypesLoading = false,
}) => {
  const [formData, setFormData] = useState<FundInformationFormData>(initialData);
  const [formErrors, setFormErrors] = useState({ amountError: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // 企業協賛金かどうか
  const isCompanySponsor = formData.incomeType === '企業協賛金';

  // 初期データが変更された場合に更新
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // 金額変更のハンドラー
  const handleAmountChange = (e: { target: { value: string } }) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '') {
      setFormData((prev) => ({ ...prev, amount: 0 }));
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    const amount = parseInt(value, 10);
    setFormData((prev) => ({ ...prev, amount }));
  };

  // 収入タイプ変更のハンドラー
  const handleIncomeTypeChange = (e: { target: { value: string } }) => {
    const selectedType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      incomeType: selectedType,
      // 企業協賛金以外を選択した場合、企業名をリセット
      sponsorName: selectedType !== '企業協賛金' ? '' : prev.sponsorName,
    }));
  };

  // フォーム送信処理
  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // フォームの検証
  useEffect(() => {
    if (formData.amount <= 0) {
      setFormErrors((prev) => ({ ...prev, amountError: '金額は0より大きい数値を入力してください' }));
    } else {
      setFormErrors((prev) => ({ ...prev, amountError: '' }));
    }
  }, [formData.amount]);

  // フォームが有効かどうか
  const isFormValid =
    !!formData.incomeType &&
    formData.amount > 0 &&
    !!formData.receiveOption &&
    (!isCompanySponsor || !!formData.sponsorName) &&
    !formErrors.amountError &&
    !isProcessing &&
    !isLoading &&
    !isIncomeTypesLoading;

  if (isLoading) {
    return (
      <Box className='flex h-40 items-center justify-center'>
        <Spinner size='xl' />
        <p className='ml-3'>データを読み込み中...</p>
      </Box>
    );
  }

  return (
    <Box>
      <form className='space-y-6'>
        <VStack spacing={4} align='stretch'>
          {/* 収入タイプ選択フォーム */}
          <FormField id='incomeType' label='収入の種類' isRequired>
            {isIncomeTypesLoading ? (
              <div className='flex items-center'>
                <Spinner size='sm' mr={2} />
                <Text>収入の種類を読み込み中...</Text>
              </div>
            ) : (
              <Select
                placeholder='選択してください'
                value={formData.incomeType}
                onChange={handleIncomeTypeChange}
                isDisabled={isIncomeTypesLoading || incomeTypes.length === 0}
              >
                {incomeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          {/* 企業名入力フォーム 企業協賛金の場合のみ表示する */}
          {isCompanySponsor && (
            <FormField id='sponsorName' label='企業名' isRequired>
              <Input
                type='text'
                value={formData.sponsorName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, sponsorName: e.target.value }))}
                placeholder='企業名を入力してください'
              />
            </FormField>
          )}

          {/* 金額入力フォーム */}
          <FormControl id='amount' isRequired isInvalid={!!formErrors.amountError}>
            <FormLabel>金額</FormLabel>
            <Input
              type='text'
              value={formData.amount.toLocaleString()}
              onChange={handleAmountChange}
              placeholder='金額を入力してください'
              required
            />
            {formErrors.amountError && (
              <FormErrorMessage>{formErrors.amountError}</FormErrorMessage>
            )}
          </FormControl>

          {/* 受け取り方法選択フォーム */}
          <FormField id='receiveOption' label='受け取り方法' isRequired>
            <RadioGroup
              value={formData.receiveOption}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  receiveOption: value as keyof typeof IncomeReceiveOption,
                }))
              }
            >
              <Stack direction='row'>
                <Radio value='transfer'>振込</Radio>
                <Radio value='hand'>手渡し</Radio>
              </Stack>
            </RadioGroup>
          </FormField>
        </VStack>
      </form>

      {/* フォームアクション */}
      <Box className='mt-6 flex justify-center space-x-4'>
        <div className='flex flex-col gap-2'>
          <PrimaryButton disabled={!isFormValid} className='mx-auto' onClick={handleSubmit}>
            {isProcessing ? <Spinner size='sm' color='white' mr={2} /> : null}
            {submitButtonText}
          </PrimaryButton>
          <Button
            className='underline underline-offset-[5px]'
            colorScheme='red'
            variant='ghost'
            onClick={onCancel}
            isDisabled={isProcessing}
          >
            キャンセル
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default FundInformationForm;
