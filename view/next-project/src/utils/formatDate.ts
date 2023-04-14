export const formatDate = (date: string) => {
  const datetime = date.replace('T', ' ');
  const datetime2 = datetime.substring(0, datetime.length - 10);
  return datetime2;
};
