// 3桁ごとにカンマを付けるフォーマッタ
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US'); // ロケールに合わせて変更可能
};

export default formatNumber;
