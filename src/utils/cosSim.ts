import ServerResponse from '@/utils/serverResponse';

export default (a: number[], b: number[]) => {
  if(a.length !== b.length) {
    ServerResponse.throwServerError(500);
  }

  const vectorsSum = a.reduce((prev: number, curr: number, ind: number) => {
    return prev += (curr * b[ind]);
  }, 0);

  const dotProducts =
    Math.sqrt(a.reduce((prev: number, curr: number) => prev += curr**2, 0)) *
    Math.sqrt(b.reduce((prev: number, curr: number) => prev += curr**2, 0));

  if(!dotProducts) {
    return 0;
  }

  const sim = +(vectorsSum/dotProducts).toFixed(2);

  if(sim < 0 || sim > 1) {
    ServerResponse.throwServerError(500);
  }

  return sim;
};
