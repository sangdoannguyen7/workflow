export const moneyFormat = (value: number): string => {
  const data = value.toString().replace(/,/g, '');
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};