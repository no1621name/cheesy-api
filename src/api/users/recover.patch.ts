import { CompatibilityEvent } from 'h3';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import transporter from '@/utils/nodemailerTransporter';
import generateRandomString from '@/utils/generateRandomString';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { email }: { email: string } = await useBody(e);

  if (!email) { ServerResponse.throwServerError(400); }

  const newPassword = generateRandomString();

  const users = db.collection('users');

  const response = await users.findOneAndUpdate({ email }, { $set: { password: newPassword } })
    .catch(() => { throw ServerResponse.throwServerError(500); });

  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_AUTH_USER,
      to: email,
      subject: 'New password to shop',
      text: `Hello, Dear ${response.value!.fullname || 'User'}, your password successfully changed on "${newPassword}".`,
    });
    return new ServerResponse(201, { message: 'Password successfully changed' });
  } catch (err) {
    ServerResponse.throwServerError(500);
  }
});
