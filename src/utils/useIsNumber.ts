export default (value: any): boolean => {
  if (isNaN(value) || !Number.isSafeInteger(value) || value < 0) {
    return false;
  }
  return true;
};
