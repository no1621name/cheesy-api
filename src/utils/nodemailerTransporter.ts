import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.yandex.com',
  port: 465,
  service: 'Yandex',
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  }
});

export default transporter;
