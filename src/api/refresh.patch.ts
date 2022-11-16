import { SignJWT } from 'jose';
import secretKey from '@/secretKey';
import ServerResponse from '@/utils/serverResponse';
import { developersDB } from '@/db';
import transporter from '@/utils/nodemailerTransporter';

export default eventHandler(async (e) => {
  const { email } = await readBody<{ email: string }>(e);

  if (!email) { ServerResponse.throwServerError(400); }

  const developers = developersDB.collection('developers');
  const developer = await developers.findOne({ email });

  if (!developer) { ServerResponse.throwServerError(400, 'Developer has not registed'); }

  const newApiKey = await new SignJWT({ _id: developer?._id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(secretKey);


  const response = await developers.findOneAndUpdate({
    _id: developer?._id,
  }, { $set: { apiKey: newApiKey } });

  if (response.ok) {
    try {
      await transporter.sendMail({
        from: process.env.NODEMAILER_AUTH_USER,
        to: email,
        subject: 'You\'ve been registed in CheeseShop API!',
        html: `<p>Hello, dear developer! Your new api key is "${newApiKey}". Keep it secure!</p>`,
      });

      return new ServerResponse(201, { message: 'Successfully refreshed! Check the email.' });
    } catch {
      ServerResponse.throwServerError(500, 'Problems with email...');
    }
  } else {
    ServerResponse.throwServerError(500, 'Server error');
  }
});
