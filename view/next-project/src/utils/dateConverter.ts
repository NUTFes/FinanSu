/**
 * 日付を「令和X年MM月DD日」形式に変換
 */
export const formatDateToJapanese = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const reiwaYear = year - 2018;
  const reiwaStr = reiwaYear === 1 ? '元' : reiwaYear;
  return `令和${reiwaStr}年${month}月${day}日`;
};

/**
 * 現在の日付をYYYY-MM-DD形式で取得
 */
export const getToday = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;
};

/**
 * 日付から令和年度と技大祭回数を計算
 */
export const calculateYearInfo = (date: string) => {
  const [year] = date.split('-').map(Number);
  const reiwaYear = year - 2018;

  // 2025年の第44回を基準に計算
  const festivalNumber = 44 + (year - 2025);

  return { reiwa: reiwaYear, festivalNumber };
};
