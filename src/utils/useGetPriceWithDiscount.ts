export default (price: number, discount: number): number => Math.floor(price - ((price / 100) * discount));
