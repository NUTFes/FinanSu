/**
 * ファイルの検証を行う
 * @param file 検証対象のファイル
 * @returns 検証結果 (true: 有効なファイル, false: 無効なファイル)
 */
export const validateFile = (file: File): boolean => {
  const MAX_FILE_SIZE = 1_073_741_824; // 1GB
  if (file.size > MAX_FILE_SIZE) {
    alert('ファイルサイズが1GBを超えています。別のファイルを選択してください。');
    return false;
  }
  if (!file.type.match(/(image\/.*|application\/pdf)/)) {
    alert('画像またはPDFファイルのみアップロード可能です。');
    return false;
  }
  return true;
};
