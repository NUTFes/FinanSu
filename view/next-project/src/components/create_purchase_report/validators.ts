// 検証用の定数
export const MAX_FILE_SIZE = 1_073_741_824; // 1GB
export const MAX_AMOUNT = 1_000_000_000; // 10億円
const ALLOWED_TYPES_REGEX = /(image\/.*|application\/pdf)/;

// エラーメッセージ
export const ERROR_MESSAGES = {
  FILE_SIZE_EXCEEDS: 'ファイルサイズが1GBを超えています。別のファイルを選択してください。',
  INVALID_FILE_TYPE: '画像またはPDFファイルのみアップロード可能です。',
  REQUIRED_FIELD: 'このフィールドは必須です。',
  INVALID_AMOUNT: '金額は0より大きい数値を入力してください。',
  FILE_REQUIRED: '領収書（レシート）をアップロードしてください',
};

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * ファイルの検証を行う
 * @param file 検証対象のファイル
 * @param showAlert アラートを表示するかどうか
 * @returns 検証結果
 */
export const validateFile = (file: File | null, showAlert: boolean = true): ValidationResult => {
  if (!file) {
    return {
      isValid: false,
      errorMessage: ERROR_MESSAGES.FILE_REQUIRED,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    if (showAlert) alert(ERROR_MESSAGES.FILE_SIZE_EXCEEDS);
    return {
      isValid: false,
      errorMessage: ERROR_MESSAGES.FILE_SIZE_EXCEEDS,
    };
  }

  if (!file.type.match(ALLOWED_TYPES_REGEX)) {
    if (showAlert) alert(ERROR_MESSAGES.INVALID_FILE_TYPE);
    return {
      isValid: false,
      errorMessage: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  return { isValid: true };
};

/**
 * 金額の検証を行う
 * @param amount 検証対象の金額
 * @param showAlert アラートを表示するかどうか
 * @returns 検証結果
 */
export const validateAmount = (amount: number, showAlert: boolean = true): ValidationResult => {
  if (amount <= 0) {
    if (showAlert) alert(ERROR_MESSAGES.INVALID_AMOUNT);
    return {
      isValid: false,
      errorMessage: ERROR_MESSAGES.INVALID_AMOUNT,
    };
  }

  return {
    isValid: amount <= MAX_AMOUNT,
    errorMessage:
      amount > MAX_AMOUNT
        ? `金額が上限（${MAX_AMOUNT.toLocaleString()}円）を超えています`
        : undefined,
  };
};

/**
 * 必須フィールドの検証を行う
 * @param fields 検証対象のフィールド
 * @param showAlert アラートを表示するかどうか
 * @returns 検証結果
 */
export const validateRequiredFields = (
  fields: Record<string, any>,
  showAlert: boolean = true,
): ValidationResult => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value && value !== 0) {
      const errorMessage = `${key}は${ERROR_MESSAGES.REQUIRED_FIELD}`;
      if (showAlert) alert(errorMessage);
      return {
        isValid: false,
        errorMessage,
      };
    }
  }
  return { isValid: true };
};
