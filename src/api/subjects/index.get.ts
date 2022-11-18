import db from '@/db';
import checkResponse from '@/utils/checkResponse';
import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(async () => {
  const subjectsCollection = db.collection('subjects');
  const subjects = await subjectsCollection
    .find<Subject>({})
    .sort({ _id: 1 })
    .toArray();

  checkResponse(subjects, 'subjects not found');

  return new ServerResponse(200, { subjects });
});
