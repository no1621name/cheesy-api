import cors from 'cors';

export default defineEventHandler(({ req, res }) => {
  return new Promise((resolve) => cors({
    credentials: true,
    origin: /\S/i
  })(req, res, resolve));
});
