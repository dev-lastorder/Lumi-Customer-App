export const toNumber = (value: string | number): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};
