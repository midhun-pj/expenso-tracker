export const formatCurrency = (currency: string, amount: number) => {
  return `${currency}${Number(amount).toFixed(2)}`;
};
