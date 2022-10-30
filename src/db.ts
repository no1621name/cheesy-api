import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MODE === 'prod' ? process.env.DB_URI : process.env.DEV_DB_URI);
const db = client.db(process.env.DB_NAME);
export const developersDB = client.db(process.env.DEVS_DB_NAME);

export default db;
