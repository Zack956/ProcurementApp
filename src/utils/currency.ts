export const formatMYR = (amount: number): string => {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseMYR = (value: string): number => {
  // Remove currency symbol and formatting, then parse
  const cleanValue = value.replace(/[RM\s,]/g, '');
  return parseFloat(cleanValue) || 0;
};