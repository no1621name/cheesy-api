import useGetPriceWithDiscount from '@/utils/useGetPriceWithDiscount';

export default (arr: WithAmount<ShortProduct>[], couponValue = 0) => {
  return arr.reduce((prev: number, curr: WithAmount<ShortProduct>): number => {
    return prev + (useGetPriceWithDiscount(curr.price, curr.discount) * curr.amount || 1);
  }, 0) - couponValue;
};
