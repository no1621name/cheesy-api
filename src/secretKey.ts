import { createSecretKey, KeyObject } from 'crypto';
import * as dotenv from 'dotenv' ;

if(!process.env.SECRET_WORD) {
  dotenv.config();
}

const secretKey: KeyObject = createSecretKey(process.env.SECRET_WORD as string, 'utf-8');

export default secretKey;
