import request from 'supertest';

export const baseUrl = process.env.TEST_BASE_URL;
export const baseApiUrl = process.env.TEST_BASE_API_URL;
export const apiKey = process.env.TEST_API_KEY;
export const req = request(baseApiUrl);
