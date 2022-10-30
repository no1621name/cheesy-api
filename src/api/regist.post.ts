import { CompatibilityEvent } from 'h3';
import { SignJWT } from 'jose';
import secretKey from '@/secretKey';
import ServerResponse from '@/utils/serverResponse';
import { developersDB } from '@/db';
import getISODateNow from '@/utils/getISODateNow';
import transporter from '@/utils/nodemailerTransporter';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { email } = await useBody<{ email: string }>(e);

  if (!email) { ServerResponse.throwServerError(400); }

  const developers = developersDB.collection('developers');

  const developerExists = await developers.findOne({ email });

  if (developerExists) { ServerResponse.throwServerError(400, 'Developer has already registed'); }

  const lastId = (await developers.find().project({ _id: 1 }).sort({ _id: -1 }).toArray())[0]._id;
  const _id = lastId + 1;

  const apiKey = await new SignJWT({ _id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(secretKey);

  const response = await developers.insertOne({
    _id,
    email,
    apiKey,
    usage: [
      {
        date: getISODateNow(),
        count: 0,
      }
    ]
  });

  if (response.acknowledged) {
    try {
      await transporter.sendMail({
        from: process.env.NODEMAILER_AUTH_USER,
        to: email,
        subject: 'You\'ve been registed in CheeseShop API!',
        html: `<p>Hello, dear developer! Thanks for using my API. Your api key is "${apiKey}". Keep it secure! You need to send it with <b>every</b> request in headers as 'x-api-key'. If you have some issues or question, you can text me on email (georges1621@gmail.com) or in <a href="https://t.me/george1621">telegram</a>.</p>`,
      });

      return new ServerResponse(201, { message: 'Successfully registed! Check the email.' });
    } catch {
      ServerResponse.throwServerError(500, 'Problems with email...');
    }
  } else {
    ServerResponse.throwServerError(500, 'Server error');
  }
});
