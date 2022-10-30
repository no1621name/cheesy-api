import { CompatibilityEvent } from 'h3';
import { jwtVerify } from 'jose';
import { developersDB } from '@/db';
import secretKey from '@/secretKey';
import getISODateNow from '@/utils/getISODateNow';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const url = e.req.url!.split('/').filter((str: string) =>  str);

  if (url.length > 1 && e.req.url !== '/api/regist') {
    const apiKey = e.req.headers['x-api-key'];

    if (!apiKey || Array.isArray(apiKey)) {
      throw ServerResponse.throwServerError(401, '\'x-api-key\' is required! For more information check index page');
    }

    const { payload: developerData } = await jwtVerify(apiKey as string, secretKey)
      .catch(() => {
        throw ServerResponse.throwServerError(400, 'Bad api key');
      });

    if (!developerData.isAdmin) {
      const _id = developerData._id;

      const developers = developersDB.collection('developers');
      const developer = await developers.findOne({ _id });

      if (!developer || developer.apiKey !== apiKey) {
        throw ServerResponse.throwServerError(400, 'How did you do it? Please, text me about it.');
      }
      const todayUsage = developer.usage.find((value: { date: string, count: number }) => value.date === getISODateNow());

      if (!todayUsage) {
        await developers.updateOne(
          { _id },
          { $push: { usage: { date: getISODateNow(), count: 0 } } }
        );
      }

      if (todayUsage.count > (process.env.MAXIMAL_REQUESTS_COUNT || 200)) {
        ServerResponse.throwServerError(429);
      }

      developers.updateOne(
        { _id, 'usage.date': getISODateNow() },
        { $inc: { 'usage.$.count': 1 } }
      );
    }
  }
});
