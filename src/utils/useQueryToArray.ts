export default (q: QueryValue | number) => (typeof q === 'object')
  ? q.map((str: string) => +str)
  : q ? [Number(q)] : [-1];
